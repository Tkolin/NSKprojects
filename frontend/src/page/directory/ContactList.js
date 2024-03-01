import React, {useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {Button, Form, Modal, notification, Space, Table} from 'antd';
import {CONTACTS_QUERY, CONTACTS_TABLE_QUERY} from '../../graphql/queries';
import {DELETE_CONTACT_MUTATION} from '../../graphql/mutationsContact';
import ContactForm from "../form/ContactForm";
import LoadingSpinner from "../component/LoadingSpinner";
import Search from "antd/es/input/Search";
import {StyledFormLarge, StyledFormRegular} from "../style/FormStyles";
import {StyledButtonGreen} from "../style/ButtonStyles";

const ContactList = () => {

    // Состояния
    const [formSearch] = Form.useForm();
    const [selectedContact, setSelectedContact] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);

    // Данные
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(50);

    const [currentSort, setCurrentSort] = useState({});

    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    const [search, setSearch] = useState('');

    const {loading: loading, error: error, data: data, refetch: refetch} = useQuery(CONTACTS_TABLE_QUERY, {
        variables: {
            page, limit, search, sortField: sortField, sortOrder,
        }, fetchPolicy: 'network-only',
    });

    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message, placement,
        });
    };

    // Мутация для удаления
    const [deleteContact] = useMutation(DELETE_CONTACT_MUTATION, {
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно удалены!');
            window.location.reload();
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при удалении данных: ' + error.message);
            window.location.reload();
        }, update: (cache, {data: {deleteContact}}) => {
            const {contacts} = cache.readQuery({query: CONTACTS_TABLE_QUERY});
            const updatedContacts = contacts.filter(contact => contact.id !== deleteContact.id);
            cache.writeQuery({
                query: CONTACTS_QUERY, data: {contacts: updatedContacts},
            });
        },
    });

    // Обработчик событий
    const handleClose = () => {
        refetch();
        setEditModalVisible(false);
    };
    const handleEdit = (contactId) => {
        const contact = data.contactsTable.contacts.find(contact => contact.id === contactId);
        setSelectedContact(contact);
        setEditModalVisible(true);
    };
    const handleAdd = () => {
        setAddModalVisible(true);
    };
    const handleDelete = (contactId) => {
        deleteContact({variables: {id: contactId}});
    };
    const onSearch = (value) => {
        setSearch(value);
    };

    // Обработка загрузки и ошибок
    if (!data) if (loading) return <LoadingSpinner/>;
    if (error) return `Ошибка! ${error.message}`;

    // Формат таблицы
    const columns = [
        {
        title: 'Имя', dataIndex: 'first_name', key: 'first_name',

        sorter: true, ellipsis: true,
    }, {
        title: 'Фамилия', dataIndex: 'last_name', key: 'last_name',

        sorter: true, ellipsis: true,
    }, {
        title: 'Отчество', dataIndex: 'patronymic', key: 'patronymic',

        sorter: true, ellipsis: true,
    }, {
        title: 'Дата рождения', dataIndex: 'birth_day', key: 'birth_day',

        sorter: true, ellipsis: true,
    }, {
        title: 'Номер телефона', dataIndex: 'mobile_phone', key: 'mobile_phone',
            render: (mobile_phone) => mobile_phone ? "+7" + mobile_phone : '',

        sorter: true, ellipsis: true,
    }, {
        title: 'Рабочий Номер телефона', dataIndex: 'work_phone', key: 'work_phone',
            render: (work_phone) => work_phone ? "+7" + work_phone : '',

        sorter: true, ellipsis: true,
    }, {
        title: 'Личный E-mail', dataIndex: 'email', key: 'email',

        sorter: true, ellipsis: true,
    }, {
        title: 'Рабочий E-mail', dataIndex: 'work_email', key: 'work_email',

        sorter: true, ellipsis: true,
    }, {
        title: 'Должность',
        dataIndex: 'position',
        key: 'position',
        render: (position) => position ? position.name : null,
    }, {
        title: 'Организация',
        dataIndex: 'organization',
        key: 'organization',
        render: (organization) => organization ? organization.name : null,
    }, {
        title: 'Управление', key: 'edit', render: (text, record) => (<div>
                <Button onClick={() => handleEdit(record.id)}>Изменить</Button>
                <Button danger={true} onClick={() => handleDelete(record.id)}>Удалить</Button>
            </div>),
    },];

    const onChange = (pagination, filters, sorter) => {
        if ((sorter.field !== undefined) && currentSort !== sorter) {
            setCurrentSort(sorter);
            if (sortField !== sorter.field) {
                setSortField(sorter.field);
                setSortOrder("asc");
            } else {
                setSortField(sortField);
                switch (sortOrder) {
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
        } else console.log("Фильтры сохранены");
    };
    return (<div>
            <StyledFormLarge form={formSearch} layout="horizontal">
                <Form.Item label="Поиск:" name="search">
                    <Space>
                        <Search
                            placeholder="Найти..."
                            allowClear
                            enterButton="Найти"
                            onSearch={onSearch}
                        />
                        <StyledButtonGreen   style={{    marginBottom: 0}} onClick={() => handleAdd()}>Создать новую запись</StyledButtonGreen>
                    </Space>
                </Form.Item>
            </StyledFormLarge>
            <Table
                size={'small'}
                sticky={{
                    offsetHeader: 0,
                }}
                loading={loading}
                dataSource={data.contactsTable.contacts.map((org, index) => ({...org, key: index}))}
                columns={columns}
                onChange={onChange}
                pagination={{
                    total: data.contactsTable.count,
                    current: page,
                    pageSize: limit,
                    onChange: (page, limit) => setPage(page),
                    onShowSizeChange: (current, size) => {
                        setPage(1);
                        setLimit(size);
                    },
                    showSizeChanger: true,
                    pageSizeOptions: ['50', '100', '200'],
                }}
            />
            <Modal
                open={editModalVisible}
                onCancel={() => setEditModalVisible(false)}
                footer={null}
                onClose={handleClose}
            >
                <ContactForm contact={selectedContact} onClose={handleClose}/>
            </Modal>
            <Modal
                open={addModalVisible}
                onCancel={() => setAddModalVisible(false)}
                footer={null}
                onClose={handleClose}
            >
                <ContactForm contact={null} onClose={handleClose}/>
            </Modal>
        </div>);
};
export default ContactList;
