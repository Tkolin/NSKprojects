import React, {useEffect, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {Col, Descriptions, Divider, Form, notification, Row, Space, Table} from 'antd';
import {DELETE_ORGANIZATION_MUTATION} from '../../../graphql/mutationsOrganization';
import Search from "antd/es/input/Search";
import {DeleteAndEditStyledLinkManagingDataTable} from "../../../components/style/TableStyles";
import {StyledButtonGreen} from "../../../components/style/ButtonStyles";
import { ORGANIZATIONS_QUERY_AND_EMPLOYEE} from "../../../graphql/queries";
import Title from "antd/es/typography/Title";
import OrganizationModalForm from "../../../components/modal/OrganizationModalForm";

import OrganizationContactsCompactTable from "./components/OrganizationContactsCompactTable";

const OrganizationTable = () => {
    // Состояния

    const [organizationModalStatus, setOrganizationModalStatus] = useState(false);
    const [formSearch] = Form.useForm();
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    // Данные
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    const [search, setSearch] = useState('');

    const {loading: loading, error: error, data: data, refetch: refetch} = useQuery(ORGANIZATIONS_QUERY_AND_EMPLOYEE, {
        variables: {
            queryOptions: {page, limit, search, sortField, sortOrder}
        }, fetchPolicy: 'network-only',
    });

    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message, placement,
        });
    };

    // Мутация для удаления
    const [deleteOrganization] = useMutation(DELETE_ORGANIZATION_MUTATION, {
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно удалены!');
            refetch();
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при удалении данных: ' + error.message);
            refetch();
        }
    });

    // Обработчик событий
    useEffect(() => {
        refetch();
    }, [organizationModalStatus]);
    const handleDelete = (organizationId) => {
        deleteOrganization({variables: {id: organizationId}});
    };
    const onSearch = (value) => {
        setSearch(value);
    }

    // Обработка загрузки и ошибок
    if (error) return `Ошибка! ${error.message}`;

    // Формат таблицы
    const columns = [

        {
            title: 'Тип',
            dataIndex: 'legal_form',
            key: 'legal_form', width: 60, ellipsis: true,

            render: (legal_form) => legal_form ? legal_form.name : '',
        }, {
            title: 'Название организации', dataIndex: 'name', key: 'name',
            sorter: true, ellipsis: true,
        }, {
            title: 'Директор',
            dataIndex: 'director',
            key: 'director', ellipsis: true,

            render: (director) => {
                if (director) {
                    return `${director.last_name ?? ""} ${director.first_name ?? ""} ${director.patronymic ?? ""}`;
                } else {
                    return '';
                }
            },
        }, {
            title: 'email', dataIndex: 'email', key: 'email', width: 200,
            sorter: true, ellipsis: true,
        }, {
            title: 'номер телефона', dataIndex: 'phone_number', key: 'phone_number', width: 200,
            sorter: true, ellipsis: true,
        },
        {
            title: 'Управление', key: 'edit', width: 100, render: (text, record) => (
                <DeleteAndEditStyledLinkManagingDataTable
                    title={"Удаление организации"}
                    description={"Вы уверены, что нужно удалить эту организацию?"}
                    handleEdit={() =>
                        setOrganizationModalStatus({organization: record, mode: "edit"})
                    }
                    handleDelete={() => handleDelete(record.id)}
                />
            )
        },
    ];

    const onChange = (sorter) => {
        setSortField(sorter?.field ?? "");
        setSortOrder(sorter?.order === 'descend' ? 'desc' : sorter?.order === 'ascend' ? 'asc' : '');
    };

    return <>
        <Form form={formSearch} layout="horizontal">
            <Divider style={{marginTop: 0}}>
                <Title style={{marginTop: 0}} level={2}>Справочник Организаций</Title>
            </Divider>
            <Form.Item label="Поиск:" name="search">
                <Space>
                    <Search
                        placeholder="Найти..."
                        allowClear
                        enterButton="Найти"
                        onSearch={onSearch}
                    />
                    <StyledButtonGreen style={{marginBottom: 0}}
                                       onClick={() => setOrganizationModalStatus({organization: null, mode: "add"})}>Создать
                        новую
                        запись</StyledButtonGreen>
                </Space>
            </Form.Item>
        </Form>
        <Table
            size={'small'}
            sticky={{
                offsetHeader: '64px',
            }}
            loading={loading}
            dataSource={data?.organizationsAndEmployee?.items?.map((org, index) => ({...org, key: index}))}
            columns={columns}
            onChange={(pagination, filters, sorter, extra) => onChange(sorter)}
            pagination={{
                total: data?.organizationsAndEmployee?.count,
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
                pageSizeOptions: ['10', '50', '100', '200'],
            }}

            expandable={{
                expandedRowKeys,
                onExpand: (expanded, record) => {
                    const keys = expanded ? [record.key] : [];
                    setExpandedRowKeys(keys);
                },
                expandedRowRender: (record) => (
                    <Row>
                        <Col span={12}>
                            <Descriptions size={"small"} column={1}>
                                <Descriptions.Item label="Полное наименование">{record.full_name}</Descriptions.Item>
                                <Descriptions.Item
                                    label="Юридический адрес">{record.address_legal} {record.office_number_legal}</Descriptions.Item>
                                <Descriptions.Item
                                    label="Почтовый адрес">{record.address_mail} {record.office_number_mail}</Descriptions.Item>
                                <Descriptions.Item label="Электронный адресс">{record.email}</Descriptions.Item>
                                <Descriptions.Item label="Факс">{record.fax_number}</Descriptions.Item>
                                <Descriptions.Item label="ИНН">{record.INN}</Descriptions.Item>
                                <Descriptions.Item label="ОГРН">{record.OGRN}</Descriptions.Item>
                                <Descriptions.Item label="ОКПО">{record.OKPO}</Descriptions.Item>
                                <Descriptions.Item label="КПП">{record.KPP}</Descriptions.Item>
                                <Descriptions.Item
                                    label="БИК">{record?.bik?.BIK} - {record?.bik?.name}</Descriptions.Item>
                                <Descriptions.Item label="Расчетный счет">{record.payment_account}</Descriptions.Item>
                            </Descriptions>
                        </Col>
                        <Col span={12}>
                          <OrganizationContactsCompactTable data={record?.employees} refetch={()=>refetch()}/>
                        </Col>

                    </Row>

                ),
            }}
        />

        <OrganizationModalForm
            key={organizationModalStatus?.organization?.id ?? null}
            onClose={() => setOrganizationModalStatus(null)}
            object={organizationModalStatus?.organization ?? null}
            mode={organizationModalStatus?.mode ?? null}
        />
    </>;
};

export default OrganizationTable;
