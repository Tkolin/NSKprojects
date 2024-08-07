import React, {useContext, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {Form, Space, Table, Typography} from 'antd';
import {USERS_QUERY} from '../../graphql/queries';
import {DELETE_CONTACT_MUTATION} from '../../graphql/mutationsContact';
import Search from "antd/es/input/Search";
import {StyledButtonGreen} from "../components/style/ButtonStyles";
import {format} from "date-fns";
 import {NotificationContext} from "../../NotificationProvider";
const {Text} = Typography;
const UserTable = () => {

    // Состояния
    const {openNotification} = useContext(NotificationContext);

    const [formSearch] = Form.useForm();
    const [contactModalStatus, setContactModalStatus] = useState(null);

    // Данные
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);


    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    const [search, setSearch] = useState('');

    const {loading: loading, error: error, data: data, refetch: refetch} = useQuery(USERS_QUERY, {
        variables: {
            queryOptions: {page, limit, search, sortField, sortOrder}
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при загрузке учётных записей: ' + error.message);
        }
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
            title: 'ID', key: 'id',
             dataIndex:  'id',  width: "10%",
        }, {
            title: 'email', dataIndex: 'email', key: 'email',   width: "40%",
         }, {
            title: 'roles',   key: 'permissions',   width: "40%",
            render: (row)=> (
                (row.roles?.length > 0) ? row.roles?.map(second_row => second_row.name) : <Text type={"danger"}>Роль не установлена</Text>
            )
         },
        {
            title: 'Управление', key: 'edit', ellipsis: true,width: "10%", render: (text, record) => (
                <>В разработке</>
            ),
        },
        ]
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
                        enterButton="Найти"
                        onSearch={onSearch}
                    />
                    <StyledButtonGreen
                        loading={true}
                        style={{marginBottom: 0}}
                        onClick={() => setContactModalStatus({contact: null, mode: "add"})}>

                        Создать новую запись
                    </StyledButtonGreen>
                </Space>
            </Form.Item>
        </Form>
        <Table
            size={'small'}
            sticky={{
                offsetHeader: '64px',
            }}
            loading={loading}
            dataSource={data?.users?.items?.map((row) => ({...row, key: row.id}))}
            columns={columns}
            onChange={(pagination, filters, sorter, extra) => onChange(sorter)}
            pagination={{
                total: data?.users?.count,
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

    </div>);
};
export default UserTable;
