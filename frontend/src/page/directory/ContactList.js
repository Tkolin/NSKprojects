import React, {useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {Button, FloatButton, Form, Input, Modal, notification, Table} from 'antd';
import {CONTACTS_QUERY, CONTACTS_TABLE_QUERY} from '../../graphql/queries';
import {DELETE_CONTACT_MUTATION} from '../../graphql/mutationsContact';
import ContactForm from "../form/ContactForm";
import LoadingSpinner from "../component/LoadingSpinner";
import Search from "antd/es/input/Search";
import TypeProjectForm from "../form/TypeProjectForm";
import {PlusSquareOutlined} from "@ant-design/icons";

const ContactList = () => {

    // Состояния
    const [selectedContact, setSelectedContact] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [formSearch] = Form.useForm();
    const [addModalVisible, setAddModalVisible] = useState(false);

    // Данные
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [currentSort, setCurrentSort] = useState({});

    const [sortColum, setSortColum] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    const [search, setSearch] = useState('');

    const { loading, error, data } = useQuery(CONTACTS_TABLE_QUERY, {
        variables: {
            page,
            limit,
            search,
            sortField: sortColum,
            sortOrder,
        },
    });

    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };

    // Мутация для удаления
    const [deleteContact] = useMutation(DELETE_CONTACT_MUTATION, {
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно удалены!');
            window.location.reload();
        },
        onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при удалении данных: ' + error.message);
            window.location.reload();
        },
        update: (cache, { data: { deleteContact } }) => {
            const { contacts } = cache.readQuery({ query: CONTACTS_TABLE_QUERY });
            const updatedContacts = contacts.filter(contact => contact.id !== deleteContact.id);
            cache.writeQuery({
                query: CONTACTS_QUERY,
                data: { contacts: updatedContacts },
            });
        },
    });

    // Обработчик событий
    const handleClose = () => {setEditModalVisible(false);};
    const handleEdit = (contactId) => {
        const contact = data.contactsTable.contacts.find(contact => contact.id === contactId);
        setSelectedContact(contact);
        setEditModalVisible(true);
    };
    const handleAdd = () => {
        setAddModalVisible(true);
    };
    const handleDelete = (contactId) => {
        deleteContact({ variables: { id: contactId}});
    };
    const onSearch = (value) =>{
        setSearch(value);
    };

    // Обработка загрузки и ошибок
    if(!data)
        if (loading) return <LoadingSpinner/>;
    if (error) return `Ошибка! ${error.message}`;

    // Формат таблицы
    const columns = [
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id',

            sorter: true,
            ellipsis: true,
        },
        {
            title: 'Имя',
            dataIndex: 'first_name',
            key: 'first_name',

            sorter: true,
            ellipsis: true,
        },
        {
            title: 'Фамилия',
            dataIndex: 'last_name',
            key: 'last_name',

            sorter: true,
            ellipsis: true,
        },
        {
            title: 'Отчество',
            dataIndex: 'patronymic',
            key: 'patronymic',

            sorter: true,
            ellipsis: true,
        },
        {
            title: 'Дата рождения',
            dataIndex: 'birth_day',
            key: 'birth_day',

            sorter: true,
            ellipsis: true,
        },
        {
            title: 'Номер телефона',
            dataIndex: 'mobile_phone',
            key: 'mobile_phone',

            sorter: true,
            ellipsis: true,
        },
        {
            title: 'Рабочий Номер телефона',
            dataIndex: 'work_phone',
            key: 'work_phone',

            sorter: true,
            ellipsis: true,
        },
        {
            title: 'Личный E-mail',
            dataIndex: 'email',
            key: 'email',

            sorter: true,
            ellipsis: true,
        },
        {
            title: 'Рабочий E-mail',
            dataIndex: 'work_email',
            key: 'work_email',

            sorter: true,
            ellipsis: true,
        },
        {
            title: 'Должность',
            dataIndex: 'position',
            key: 'position',
            render: (position) =>position ? position.name : null,
        },
        {
            title: 'Организация',
            dataIndex: 'organization',
            key: 'organization',
            render: (organization) =>organization ? organization.name : null,
        },
        {
            title: 'Управление',
            key: 'edit',
            render: (text, record) => (
                <div>
                    <Button onClick={() => handleEdit(record.id)}>Изменить</Button>
                    <Button danger={true} onClick={() => handleDelete(record.id)}>Удалить</Button>
                </div>
            ),
        },
    ];

    const onChange = (pagination, filters, sorter) => {

        if((sorter.field !== undefined) && currentSort !== sorter){
            setCurrentSort(sorter);
            if (sortColum !== sorter.field) {
                setSortColum(sorter.field);
                setSortOrder("asc");
            }
            else {
                setSortColum(sortColum);
                switch (sortOrder){
                    case ("asc"):
                        setSortOrder("desc");
                        break;
                    case ("desc"):
                        setSortOrder("");
                        break;
                    case (""):
                        setSortOrder("asc");
                        break;
                }
            }
        }else
            console.log("Фильтры сохранены");
    };
    return (
        <div>
            <FloatButton
                style={{  display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'green'  }}
                onClick={() => handleAdd()}
                tooltip={<div>Создать новую запись</div>}
            >
                <PlusSquareOutlined style={{ fontSize: '90px', color: 'green' }} />
            </FloatButton>
            <Form form={formSearch} layout="horizontal">
                <Form.Item label="Поиск:" name="search">
                    <Search
                        placeholder="Найти..."
                        allowClear
                        enterButton="Search"
                        onSearch={onSearch}
                    />
                </Form.Item>
            </Form>
            <Table
                size={'small'}
                sticky={{
                    offsetHeader: 0,
                }}
                loading={loading}
                dataSource={data.contactsTable.contacts}
                columns={columns}
                onChange={onChange}
                pagination={{
                    total: data.contactsTable.count,
                    current: page,
                    limit,
                    onChange: (page, limit) => setPage(page),
                    onShowSizeChange: (current, size) => {
                        setPage(1);
                        setLimit(size);
                    },
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100'],
                }}
            />
            <Modal
                visible={editModalVisible}
                title="Изменить контакт"
                onCancel={() => setEditModalVisible(false)}
                footer={null}
                onClose={handleClose}
            >
                <ContactForm contact={selectedContact} onClose={handleClose}/>
            </Modal>
            <Modal
                visible={addModalVisible}
                title="Создать этап"
                onCancel={() => setAddModalVisible(false)}
                footer={null}
                onClose={handleClose}
            >
                <ContactForm onClose={handleClose}/>
            </Modal>
        </div>
    );
};
export default ContactList;
