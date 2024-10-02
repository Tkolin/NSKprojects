import { useMutation, useQuery } from '@apollo/client';
import { Col, Descriptions, Form, Input, Modal, notification, Row, Space, Table } from 'antd';
import { format } from "date-fns";
import React, { useState } from 'react';
import { DELETE_PERSON_MUTATION } from '../../graphql/mutationsPerson';
import { PERSONS_QUERY } from '../../graphql/queries';
import ExecutorOrderFileGenerated from "../components/script/fileGenerated/ExecutorOrderFileGenerated";
import { StyledButtonGreen } from "../components/style/ButtonStyles";
import { DeleteAndEditStyledLinkManagingDataTable } from "../components/style/TableStyles";
import PersonForm from "../simplesForms/PersonForm";
const {Search} = Input;
const PersonTable = () => {

    // Состояния
    const [formSearch] = Form.useForm();
    const [personModalStatus, setPersonModalStatus] = useState(null);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);

    // Данные
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [currentSort, setCurrentSort] = useState({});

    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    const [search, setSearch] = useState('');

    const {loading: loading, error: error, data: data, refetch: refetch} = useQuery(PERSONS_QUERY, {
        variables: {
            queryOptions: {page, limit, search, sortField, sortOrder}
        }
    });

    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message, placement,
        });
    };

    // Мутация для удаления
    const [deletePerson] = useMutation(DELETE_PERSON_MUTATION, {
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно удалены!');
            refetch();
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при удалении данных: ' + error.message);
            refetch();
        },

    });

    // Обработчик событий

    const handleDelete = (personId) => {
        deletePerson({variables: {id: personId}});
    };

    const onSearch = (value) => {
        setSearch(value);
    }

    // Обработка загрузки и ошибок
    if (error) return `Ошибка! ${error.message}`;
    const formatDate = (date) => {
        return format(new Date(date), 'dd.MM.yyyy');
    };
    // Формат таблицы
    const columns = [{
            title: 'ФИО',
            dataIndex: 'passport',
            key: 'fio_name',
        render: (passport) => passport ? `${passport?.last_name ?? ""}
              ${passport?.first_name ?? ""} ${passport?.patronymic ?? ""}  ` : "",
        }, {
            title: 'Личный тел.', dataIndex: 'phone_number', key: 'phone_number',
            sorter: true, ellipsis: true,
        }, {
            title: 'Личный e-mail', dataIndex: 'email', key: 'email',

            sorter: true, ellipsis: true,
        }, {
            title: 'e-mail СибНИПИ', dataIndex: 'email_sibnipi', key: 'email_sibnipi',

            sorter: true, ellipsis: true,
        }, {
            title: 'Дата рождения',
            dataIndex: 'passport',
            key: 'birth_day',
            render: (passport) => passport?.birth_date ? formatDate(passport?.birth_date) : null,

        }, {
            title: 'Договор', key: 'btnContract', width: 80, align: 'center',
            render: (text, record) => (
                <ExecutorOrderFileGenerated personId={record.id}/>
            ),
        }, {
            title: 'Управление', key: 'edit', width: 100, render: (text, record) => (
                <DeleteAndEditStyledLinkManagingDataTable
                    deletePermission={"delete-person"}
                    updatePermission={"update-person"}
                    title={"Удаление контакта"}
                    description={"Вы уверены, что нужно удалить этого подрядчика?"}
                    handleEdit={() => {
                        setPersonModalStatus({person_id: record.id, mode: "edit"})
                    }}
                    handleDelete={() => handleDelete(record.id)}
                />
            ),
        },]
    ;
    const onChange = (sorter) => {
        setSortField(sorter?.field ?? "");
        setSortOrder(sorter?.order === 'descend' ? 'desc' : sorter?.order === 'ascend' ? 'asc' : '');
    };
    return (<div>
        <Form form={formSearch} layout="horizontal">
            <Form.Item label="Поиск:" name="search">
                <Space>
                    <Search
                        placeholder="Найти..."
                        allowClear
                        
                        onSearch={onSearch}
                    />
                    <StyledButtonGreen
                        loading={loading}
                        style={{marginBottom: 0}}
                        onClick={() => setPersonModalStatus({person_id: null, mode: "add"})}
                        data-permission={"create-person"}>
                        Создать новую запись</StyledButtonGreen>
                </Space>
            </Form.Item>
        </Form>
        <Table
            data-permission={"read-person"}
            size={'small'}
            sticky={{
                offsetHeader: '64px',
            }}
            loading={loading}
            dataSource={data?.persons?.items?.map((person, index) => ({...person, key: index}))}
            columns={columns}
            onChange={(pagination, filters, sorter, extra) => onChange(sorter)}
            pagination={{
                total: data?.persons?.count,
                current: page,
                pageSize: limit,
                onChange: (page, limit) => {
                    setPage(page);
                    setLimit(limit)
                },
                onShowSizeChange: (current, size) => {
                    setPage(1);
                    setLimit(size);
                },
                showSizeChanger: true,
                pageSizeOptions: ['10', '50', '100'],
            }}
            expandable={{
                expandedRowKeys,
                onExpand: (expanded, record) => {
                    const keys = expanded ? [record.key] : [];
                    setExpandedRowKeys(keys);
                },
                expandedRowRender: (record) => (<>
                        <Row style={{width: "100%"}}>
                            <Col span={7}>
                                <Descriptions bordered size={"small"} column={1} title="Паспортные данные:">
                                    <Descriptions.Item
                                        label="Серия и номер">{record?.passport?.serial} №{record?.passport?.number}</Descriptions.Item>
                                    <Descriptions.Item
                                        label="Адрес проживания">{record?.passport?.address_residential}</Descriptions.Item>
                                    <Descriptions.Item
                                        label="Адрес регистрации">{record?.passport?.address_registration}</Descriptions.Item>
                                    <Descriptions.Item
                                        label="Дата и место выдачи">{record?.passport?.date ? formatDate(record?.passport?.date) : ""} - {record?.passport?.passport_place_issue?.name}</Descriptions.Item>
                                </Descriptions>
                            </Col>
                            <Col span={17}>
                                <Descriptions bordered size={"small"} column={2} title="Реквизиты:">
                                    <Descriptions.Item
                                        label="Расчётный счёт">{record?.payment_account}</Descriptions.Item>
                                    <Descriptions.Item label="Банк>">{record?.bank?.name}</Descriptions.Item>
                                    <Descriptions.Item
                                        label="Бик">{record?.bik?.BIK} - {record?.bik?.name}</Descriptions.Item>
                                    <Descriptions.Item label="Инн">{record?.INN}</Descriptions.Item>
                                    <Descriptions.Item label="Снилс">{record?.SHILS}</Descriptions.Item>
                                </Descriptions>
                            </Col>
                        </Row>
                    </>
                ),
            }}
        />
        <Modal
            key={personModalStatus?.mode || personModalStatus?.person_id || null}
            open={personModalStatus}
            onCancel={() => setPersonModalStatus(null)}
            footer={null}
            width={"max-content"}
            title={"Исполнитель"}
            children={
                <PersonForm
                    onCompleted={() => {
                        setPersonModalStatus(null);
                        refetch();
                    }}

                    initialObject={personModalStatus?.person_id ? {id: personModalStatus?.person_id} : null}
                />
            }
        />
    </div>);
};
export default PersonTable;
