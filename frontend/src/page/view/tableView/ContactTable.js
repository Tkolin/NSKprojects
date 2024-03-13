import React, {useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {Button, Form, Modal, notification, Space, Table} from 'antd';
import {CONTACTS_QUERY} from '../../../graphql/queries';
import {DELETE_CONTACT_MUTATION} from '../../../graphql/mutationsContact';
import ContactForm from "../../form/basicForm/ContactForm";
import LoadingSpinnerStyles from "../../style/LoadingSpinnerStyles";
import Search from "antd/es/input/Search";
import {StyledFormLarge} from "../../style/FormStyles";
import {StyledButtonGreen} from "../../style/ButtonStyles";

const ContactTable = () => {

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

    const {loading: loading, error: error, data: data, refetch: refetch} = useQuery(CONTACTS_QUERY, {
        variables: {
            queryOptions: {
                page, limit, search, sortField: sortField, sortOrder
            }
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
            refetch();
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при удалении данных: ' + error.message);
        }, update: (cache, {data: {deleteContact}}) => {
            const {contacts} = cache.readQuery({query: CONTACTS_QUERY});
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
        setAddModalVisible(false);
    };
    const handleEdit = (contactId) => {
        const contact = data.contacts.items.find(contact => contact.id === contactId);
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
    if (!data) if (loading) return <LoadingSpinnerStyles/>;
    if (error) return `Ошибка! ${error.message}`;

    // Формат таблицы
    const columns = [
        {
            title: 'ФИО', key: 'FIO',

            sorter: true,
            render: (text, record) => `${record.last_name}  ${record.first_name} ${record.patronymic}`
        }, {
            title: 'Личный тел.', dataIndex: 'mobile_phone', key: 'mobile_phone',
            sorter: true,
        }, {
            title: 'Рабочий тел.', dataIndex: 'work_phone', key: 'work_phone',
            sorter: true,
        }, {
            title: 'Личный E-mail', dataIndex: 'email', key: 'email',
            sorter: true,
        }, {
            title: 'Рабочий E-mail', dataIndex: 'work_email', key: 'work_email',
            sorter: true,
        },  {
            title: 'Дата рождения', dataIndex: 'birth_day', key: 'birth_day',
            sorter: true,
        }, {
            title: 'Должность',
            dataIndex: 'position',
            key: 'position',
            render: (position) => position?.name ?? null,
        }, {
            title: 'Организация',
            dataIndex: 'organization',
            key: 'organization',
            render: (organization) => organization?.name ?? null,
        },
       {
            title: 'Управление', key: 'edit', render: (text, record) => (
                <Space size="middle">
                    <Button size={"small"} onClick={() => handleEdit(record.id)}>Изменить</Button>
                    <Button size={"small"} danger={true} onClick={() => handleDelete(record.id)}>Удалить</Button>
                </Space>),
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
                    <StyledButtonGreen style={{marginBottom: 0}} onClick={() => handleAdd()}>Создать новую
                        запись</StyledButtonGreen>
                </Space>
            </Form.Item>
        </StyledFormLarge>
        <Table
            size={'small'}
            sticky={{
                offsetHeader: '64px',
            }}
            loading={loading}
            dataSource={data.contacts.items.map((org, index) => ({...org, key: index}))}
            columns={columns}
            onChange={onChange}
            pagination={{
                total: data.contacts.count,
                current: page,
                pageSize: limit,
                onChange: (page, limit) => setPage(page) && setLimit(limit),
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
export default ContactTable;
