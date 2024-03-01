import React, {useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {Button, Form, Modal, notification, Space, Table} from 'antd';
import {PERSON_QUERY, PERSON_TABLE_QUERY} from '../../graphql/queries';
import {DELETE_PERSON_MUTATION} from '../../graphql/mutationsPerson';
import PersonForm from "../form/PersonForm";
import LoadingSpinner from "../component/LoadingSpinner";
import Search from "antd/es/input/Search";
import {StyledFormLarge} from "../style/FormStyles";
import {StyledButtonGreen} from "../style/ButtonStyles";

const PersonList = () => {

    // Состояния
    const [formSearch] = Form.useForm();
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);

    // Данные
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [currentSort, setCurrentSort] = useState({});

    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    const [search, setSearch] = useState('');

    const {loading, error, data} = useQuery(PERSON_TABLE_QUERY, {
        variables: {
            page, limit, search, sortField, sortOrder,
        }, fetchPolicy: 'network-only',
    });

    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message, placement,
        });
    };

    // Мутация для удаления
    const [deletePerson] = useMutation(DELETE_PERSON_MUTATION, {
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно удалены!');
            window.location.reload();
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при удалении данных: ' + error.message);
            window.location.reload();
        }, update: (cache, {data: {deletePerson}}) => {
            const {persons} = cache.readQuery({query: PERSON_QUERY});
            const updatedPersons = persons.filter(person => person.id !== deletePerson.id);
            cache.writeQuery({
                query: PERSON_QUERY, data: {persons: updatedPersons},
            });
        },
    });

    // Обработчик событий
    const handleClose = () => {
        setEditModalVisible(false);
    };
    const handleEdit = (personId) => {
        const person = data.personsTable.persons.find(person => person.id === personId);
        setSelectedPerson(person);
        setEditModalVisible(true);
    };
    const handleAdd = () => {
        setAddModalVisible(true);
    };
    const handleDelete = (personId) => {
        deletePerson({variables: {id: personId}});
    };
    const onSearch = (value) => {
        setSearch(value);
    }

    // Обработка загрузки и ошибок
    if (!data) if (loading) return <LoadingSpinner/>;
    if (error) return `Ошибка! ${error.message}`;

    // Формат таблицы
    const columns = [{
        title: 'ФИО',
        dataIndex: 'passport',
        key: 'fio_name',
        render: (passport) => passport ? `${passport.lastname} ${passport.firstname} ${passport.patronymic}` : "",
    }, {
        title: 'Даные паспорта',
        dataIndex: 'passport',
        key: 'passport_data',
        render: (passport) => passport ?  `${passport.serial} ${passport.number} ${passport.date}` : "",

    }, {
        title: 'Дата рождения',
        dataIndex: 'passport',
        key: 'birth_day',
        render: (passport) => passport ? passport.birth_date : null,

    }, {
        title: 'СНИЛС', dataIndex: 'SHILS', key: 'SHILS',

        sorter: true, ellipsis: true,
    }, {
        title: 'ИНН', dataIndex: 'INN', key: 'INN',

        sorter: true, ellipsis: true,
    }, {
        title: 'Расчётный счёт', dataIndex: 'payment_account', key: 'payment_account',

        sorter: true, ellipsis: true,
    }, {
        title: 'Номер телефона', dataIndex: 'phone_number', key: 'phone_number',

        sorter: true, ellipsis: true,
    }, {
        title: 'email', dataIndex: 'email', key: 'email',

        sorter: true, ellipsis: true,
    }, {
        title: 'email Сибнипи', dataIndex: 'email_sibnipi', key: 'email_sibnipi',

        sorter: true, ellipsis: true,
    }, {
        title: 'банк', dataIndex: 'bank', key: 'bank', render: (bank) => bank ? bank.name : null,
    }, {
        title: 'бик',
        dataIndex: 'BIK',
        key: 'BIK',
        render: (BIK) => BIK ? BIK.name : null,
    }, {
        title: 'Управление', key: 'edit', render: (text, record) => (<div>
                <Button onClick={() => handleEdit(record.id)}>Изменить</Button>
                <Button danger={true} onClick={() => handleDelete(record.id)}>Удалить</Button>
            </div>),
    },];
    const onChange = (pagination, filters, sorter) => {
        if ((sorter.field !== undefined) && currentSort !== sorter) {
            setCurrentSort(sorter);
            console.log("Фильтры");
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
                dataSource={data.personsTable.persons}
                columns={columns}
                onChange={onChange}
                pagination={{
                    total: data.personsTable.count,
                    current: page,
                    pageSize: limit,
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
                open={editModalVisible}
                width={900}
                onCancel={() => setEditModalVisible(false)}
                footer={null}
                onClose={handleClose}
            >
                <PersonForm person={selectedPerson} onClose={handleClose}/>
            </Modal>
            <Modal
                open={addModalVisible}
                width={900}
                onCancel={() => setAddModalVisible(false)}
                footer={null}
                onClose={handleClose}
            >
                <PersonForm contact={null}  onClose={handleClose}/>
            </Modal>
        </div>);
};
export default PersonList;
