import React, {useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {Button, Modal, notification, Table} from 'antd';
import {CONTACTS_QUERY} from '../../graphql/queries';
import {DELETE_CONTACT_MUTATION} from '../../graphql/mutationsContact';
import ContactForm from "./ContactForm";

const ContactList = () => {

    // Состояния
    const { loading, error, data } = useQuery(CONTACTS_QUERY);
    const [selectedContact, setSelectedContact] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);

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
            const { contacts } = cache.readQuery({ query: CONTACTS_QUERY });
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
        const contact = data.contacts.find(contact => contact.id === contactId);
        setSelectedContact(contact);
        setEditModalVisible(true);
    };
    const handleDelete = (contactId) => {
        deleteContact({ variables: { id: contactId}});
    };

    // Обработка загрузки и ошибок
    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    // Формат таблицы
    const columns = [
        {
            title: 'Имя',
            dataIndex: 'first_name',
            key: 'first_name',
        },
        {
            title: 'Фамилия',
            dataIndex: 'last_name',
            key: 'last_name',
        },
        {
            title: 'Отчество',
            dataIndex: 'patronymic',
            key: 'patronymic',
        },
        {
            title: 'Дата рождения',
            dataIndex: 'birth_day',
            key: 'birth_day',
        },
        {
            title: 'Номер телефона',
            dataIndex: 'mobile_phone',
            key: 'mobile_phone',
        },
        {
            title: 'Рабочий Номер телефона',
            dataIndex: 'work_phone',
            key: 'work_phone',
        },
        {
            title: 'Личный E-mail',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Рабочий E-mail',
            dataIndex: 'work_email',
            key: 'work_email',
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

    return (
        <div>
            <Table dataSource={data.contacts} columns={columns} />
            <Modal
                visible={editModalVisible}
                title="Изменить контакт"
                onCancel={() => setEditModalVisible(false)}
                footer={null}
                onClose={handleClose}
            >
                <ContactForm contact={selectedContact} onClose={handleClose}/>
            </Modal>
        </div>
    );
};
export default ContactList;
