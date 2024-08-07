import React, {useState} from 'react';

import {useMutation, useQuery} from '@apollo/client';
import {Button, notification, Table} from 'antd';
import {CONTACTS_QUERY} from '../../graphql/queries';
import {DELETE_CONTACT_MUTATION} from '../../graphql/mutationsContact';

const ProjectPaymentExecutorOrderTable = () => {

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
    if (error) return `Ошибка! ${error.message}`;

    // Формат таблицы
    const columns = [
        {
            title: 'Наименование проекта',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Номер проекта',
            dataIndex: 'name',
            key: 'name',
        },
    ];

    return (
        <div>
            <Table
                size={'small'}
                sticky={{
                    offsetHeader: 0,
                }}
                loading={loading}
                dataSource={data?.irds?.items}
                columns={columns}
                onChange={onChange}
                pagination={{
                    total: data?.irds?.count,
                    current: page,
                    limit: limit,
                    onChange: (page, limit) => {
                        setPage(page);
                        setLimit(limit);},
                    onShowSizeChange: (current, size) => {
                        setPage(1);
                        setLimit(size);
                    },
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100'],
                }}
            />
        </div>
    );
};
export default ProjectPaymentExecutorOrderTable;
