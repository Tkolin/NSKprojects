// Ваш проект/frontend/src/components/ContactList.js

import React, {useState} from 'react';
import { useQuery } from '@apollo/client';
import {Button, Modal, Table} from 'antd';
import { CONTACTS_QUERY } from '../../graphql/queries';
import ContactForm from "./ContactForm";

const ContactList = () => {

    // Состояния
    const { loading, error, data } = useQuery(CONTACTS_QUERY);
    const [selectedContact, setSelectedContact] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const handleClose = () => {setEditModalVisible(false);};
    const handleEdit = (contactId) => {
        const contact = data.contacts.find(contact => contact.id === contactId);
        setSelectedContact(contact);
        setEditModalVisible(true);
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
            title: 'Номер телефона',
            dataIndex: 'mobile_phone',
            key: 'mobile_phone',
        },
        {
            title: 'E-mail',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'E-mail Сибнипи',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Должность',
            dataIndex: 'position',
            key: 'email',
            render: (position) =>position ? position.name : null,
        },
        {
            title: 'Управление',
            key: 'edit',
            render: (text, record) => (
                <Button onClick={() => handleEdit(record.id)}>Изменить</Button>
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
