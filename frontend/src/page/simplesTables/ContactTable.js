import { useMutation, useQuery } from '@apollo/client';
import { Form, Input, Modal, Space, Table } from 'antd';

import { format } from "date-fns";
import { nanoid } from "nanoid";
import React, { useContext, useState } from 'react';
import { DELETE_CONTACT_MUTATION } from '../../graphql/mutationsContact';
import { CONTACTS_QUERY } from '../../graphql/queries';
import { NotificationContext } from "../../NotificationProvider";
import { StyledButtonGreen } from "../components/style/ButtonStyles";
import { DeleteAndEditStyledLinkManagingDataTable } from "../components/style/TableStyles";
import ContactForm from "../simplesForms/ContactForm";
const {Search} = Input;
const ContactTable = () => {

    // Состояния
    const {openNotification} = useContext(NotificationContext);

    const [formSearch] = Form.useForm();
    const [contactModalStatus, setContactModalStatus] = useState(null);

    // Данные
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [currentSort, setCurrentSort] = useState({});

    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    const [search, setSearch] = useState('');

    const {loading: loading, error: error, data: data, refetch: refetch} = useQuery(CONTACTS_QUERY, {
        variables: {
            queryOptions: {page, limit, search, sortField, sortOrder}
        },
    });

    // Функции уведомлений


    // Мутация для удаления
    const [deleteContact] = useMutation(DELETE_CONTACT_MUTATION, {
        onCompleted: () => {
            refetch();
            openNotification('topRight', 'success', 'Данные успешно удалены!');
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при удалении данных: ' + error.message);
        }
    });

    // Обработчик событий
    const handleDelete = (contactId) => {
        deleteContact({variables: {id: contactId}});
    };
    const onSearch = (value) => {
        setSearch(value);
    };

    // Обработка загрузки и ошибок
    if (error) return `Ошибка! ${error.message}`;

    // Функция для форматирования даты
    const formatDate = (date) => {
        return format(new Date(date), 'dd.MM.yyyy');
    };
    // Формат таблицы
    const columns = [
        {
            title: 'ФИО', key: 'FIO',
            sorter: true, ellipsis: false,
            render: (text, record) =>
                `${record?.last_name ?? ""}  ${record?.first_name ?? ""} ${record?.patronymic ?? ""}`
        }, {
            title: 'Личный тел.', dataIndex: 'mobile_phone', key: 'mobile_phone',
            sorter: true, ellipsis: false,
        }, {
            title: 'Рабочий тел.', dataIndex: 'work_phone', key: 'work_phone',
            sorter: true, ellipsis: false,
        }, {
            title: 'Личный E-mail', dataIndex: 'email', key: 'email',
            sorter: true, ellipsis: false,
        }, {
            title: 'Рабочий E-mail', dataIndex: 'work_email', key: 'work_email',
            sorter: true, ellipsis: false,
        }, {
            title: 'Дата рождения', dataIndex: 'birth_day', key: 'birth_day',
            sorter: true, ellipsis: false,
            render: (birthDay) => birthDay ? formatDate(birthDay) : "",
        }, {
            title: 'Должность',
            dataIndex: 'position',
            key: 'position', ellipsis: false,
            render: (position) => position?.name ?? null,
        }, {
            title: 'Организация',
            dataIndex: 'organization',
            key: 'organization', ellipsis: false,
            render: (organization) => organization?.name ?? null,
        },
        {
            title: 'Управление', key: 'edit', ellipsis: true, width: 100, render: (text, record) => (
                <DeleteAndEditStyledLinkManagingDataTable
                    updatePermission={"update-contact"}
                    deletePermission={"delete-contact"}
                    title={"Удаление контакта"}
                    description={"Вы уверены, что нужно удалить этот контакт?"}
                    handleEdit={() => {
                        setContactModalStatus({contact: record, mode: "edit"})
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

                        data-permission={"create-contact"}
                        style={{marginBottom: 0}}
                        onClick={() => setContactModalStatus({contact: null, mode: "add"})}>

                        Создать новую запись
                    </StyledButtonGreen>
                </Space>
            </Form.Item>
        </Form>
        <Table
            data-permission={"read-contact"}
            size={'small'}
            sticky={{
                offsetHeader: '64px',
            }}
            loading={loading}
            dataSource={data?.contacts?.items?.map((row) => ({...row, key: row.id}))}
            columns={columns}
            onChange={(pagination, filters, sorter, extra) => onChange(sorter)}
            pagination={{
                total: data?.contacts?.count,
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
        />
        <Modal
            key={nanoid()}
            open={contactModalStatus?.mode === "add" || contactModalStatus?.mode === "edit"}
            onCancel={() => setContactModalStatus(null)}
            footer={null}
            width={"max-content"}
            title={"Контакт"}
            styles={{header: {textAlign: "center"}}}
        >
            {contactModalStatus?.mode === "edit" ? (
                (contactModalStatus?.contact) && (
                    <ContactForm
                        data-permission={"update-contact"}
                        onCompleted={() =>
                            setContactModalStatus(null)}
                        initialObject={contactModalStatus?.contact}
                        localObject={contactModalStatus?.contact}
                    />
                )
            ) : (
                <ContactForm data-permission={"create-contact"} onCompleted={() => setContactModalStatus(null)}/>
            )}
        </Modal>

    </div>);
};
export default ContactTable;
