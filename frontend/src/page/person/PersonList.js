import React, {useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {Button, Modal, notification, Table} from 'antd';
import {PERSON_QUERY} from '../../graphql/queries';
import {DELETE_PERSON_MUTATION} from '../../graphql/mutationsPerson';
import PersonForm from "./PersonForm";

const PersonList = () => {

    // Состояния
    const { loading, error, data } = useQuery(PERSON_QUERY);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);

    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };

    // Мутация для удаления
    const [deletePerson] = useMutation(DELETE_PERSON_MUTATION, {
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно удалены!');
            window.location.reload();
        },
        onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при удалении данных: ' + error.message);
            window.location.reload();
        },
        update: (cache, { data: { deletePerson } }) => {
            const { persons } = cache.readQuery({ query: PERSON_QUERY });
            const updatedPersons = persons.filter(person => person.id !== deletePerson.id);
            cache.writeQuery({
                query: PERSON_QUERY,
                data: { persons: updatedPersons },
            });
        },
    });

    // Обработчик событий
    const handleClose = () => {setEditModalVisible(false);};
    const handleEdit = (personId) => {
        const person = data.persons.find(person => person.id === personId);
        setSelectedPerson(person);
        setEditModalVisible(true);
    };
    const handleDelete = (personId) => {
        deletePerson({ variables: { id: personId}});
    };

    // Обработка загрузки и ошибок
    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    // Формат таблицы
    const columns = [
        {
            title: 'ФИО',
            dataIndex: 'passport',
            key: 'fio_name',
            render: (passport) => passport ? `${passport.lastname} ${passport.firstname} ${passport.patronymic}` : "",
        },
        {
            title: 'Даные паспорта',
            dataIndex: 'passport',
            key: 'passport_data',
            render: (passport) => passport ?
                passport.serial +" "+ passport.number +" "+ passport.date : "",

        },
        {
            title: 'Дата рождения',
            dataIndex: 'passport',
            key: 'birth_day',
            render: (passport) =>passport ? passport.birth_date : null,

        },
        {
            title: 'СНИЛС',
            dataIndex: 'SHILS',
            key: 'SHILS',
        },
        {
            title: 'ИНН',
            dataIndex: 'INN',
            key: 'INN',
        },
        {
            title: 'Расчётный счёт',
            dataIndex: 'payment_account',
            key: 'payment_account',
        },
        {
            title: 'Номер телефона',
            dataIndex: 'phone_number',
            key: 'phone_number',
        },
        {
            title: 'email',
            dataIndex: 'email',
            key: 'email',
          },
        {
            title: 'email Сибнипи',
            dataIndex: 'email_sibnipi',
            key: 'email_sibnipi',
          },
        {
            title: 'банк',
            dataIndex: 'bank',
            key: 'bank',
            render: (bank) =>bank ? bank.name : null,
        },
        {
            title: 'бик',
            dataIndex: 'bik',
            key: 'bik',
            render: (bik) =>bik ? bik.Bik : null,
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
            <Table dataSource={data.persons} columns={columns} />
            <Modal
                visible={editModalVisible}
                title="Изменить контакт"
                onCancel={() => setEditModalVisible(false)}
                footer={null}
                onClose={handleClose}
            >
                <PersonForm person={selectedPerson} onClose={handleClose}/>
            </Modal>
        </div>
    );
};
export default PersonList;
