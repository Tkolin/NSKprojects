import React, {useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {Button, notification, Table} from 'antd';
import {CONTACTS_QUERY} from '../../../graphql/queries';
import {DELETE_CONTACT_MUTATION} from '../../../graphql/mutationsContact';
import LoadingSpinnerStyles from "../../style/LoadingSpinnerStyles";

const BikTable = () => {

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
            refetch();
        },
        onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при удалении данных: ' + error.message);
            refetch();
        },
    });

    // Обработчик событий
    const handleClose = () => {       refetch(); setEditModalVisible(false);};
    const handleEdit = (contactId) => {
        const contact = data.contacts.find(contact => contact.id === contactId);
        setSelectedContact(contact);
        setEditModalVisible(true);
    };
    const handleDelete = (contactId) => {
        deleteContact({ variables: { id: contactId}});
    };

    // Обработка загрузки и ошибок
    if (loading) return <LoadingSpinnerStyles/>;
    if (error) return `Ошибка! ${error.message}`;

    // Формат таблицы
    const columns = [
        {
            title: 'Бик',
            dataIndex: 'BIK',
            key: 'BIK',
        },
        {
            title: 'Банк',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Счёт',
            dataIndex: 'correspondent_account',
            key: 'correspondent_account',
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
                    <Button  onClick={() => handleEdit(record.id)}>Изменить</Button>
                    <Button danger={true} onClick={() => handleDelete(record.id)}>Удалить</Button>
                </div>

            ),
        },
    ];

    return (
        <div>
            <Table dataSource={data.contacts} columns={columns} />
        </div>
    );
};
export default BikTable;
