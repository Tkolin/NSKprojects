import { useMutation, useQuery } from '@apollo/client';
import { Divider, Form, Input, notification, Space, Table, Text } from 'antd';
import { nanoid } from "nanoid";
import React, { useState } from 'react';
import { DELETE_IRD_MUTATION } from '../../graphql/mutationsIrd';
import { IRDS_QUERY } from '../../graphql/queries';
import IrdModalForm from "../components/modal/IrdModalForm";
import { StyledButtonGreen } from "../components/style/ButtonStyles";
import { DeleteAndEditStyledLinkManagingDataTable } from "../components/style/TableStyles";
const {Search} = Input;
const {Title} = Text;
const IrdTable = () => {

    // Состояния
    const [formSearch] = Form.useForm();
    const [irdModalStatus, setIrdModalStatus] = useState(null);

    // Данные
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [currentSort, setCurrentSort] = useState({});

    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    const [search, setSearch] = useState('');

    const {loading: loading, error: error, data: data, refetch: refetch} = useQuery(IRDS_QUERY, {
        variables: {
            queryOptions: {
                page,
                limit,
                search,
                sortField,
                sortOrder,
            }
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
    const [deleteIrd] = useMutation(DELETE_IRD_MUTATION, {
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


    const handleDelete = (irdId) => {
        deleteIrd({variables: {id: irdId}});
    };
    const onSearch = (value) => {
        setSearch(value);
    };


    // Формат таблицы
    const columns = [
        {
            title: 'Наименование',
            dataIndex: 'name',
            key: 'name',

            sorter: true,
            ellipsis: true,
        },
        {
            title: 'Управление', key: 'edit', ellipsis: true, width: 100, render: (text, record) => (
                <DeleteAndEditStyledLinkManagingDataTable
                    title={"Удаление ИРД"}
                    description={"Вы уверены, что нужно удалить этот ИРД?"}
                    handleEdit={() => {
                        setIrdModalStatus({ird: record, mode: "edit"})
                    }}
                    handleDelete={() => handleDelete(record.id)}
                />
            ),
        }

    ];
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
        } else
            console.log("Фильтры сохранены");
    };
    return (
        <div>
            <Form form={formSearch} layout="horizontal">
                <Divider style={{marginTop: 0}}>
                    <Title style={{marginTop: 0}} level={2}>Справочник наименования ИРД</Title>
                </Divider>
                <Form.Item label="Поиск:" name="search">
                    <Space>
                        <Search
                            placeholder="Найти..."
                            allowClear
                            
                            onSearch={onSearch}
                        />
                        <StyledButtonGreen
                            data-permission={"create-ird"}
                            loading={loading}
                            style={{marginBottom: 0}}
                            onClick={() => setIrdModalStatus({ird: null, mode: "add"})}>

                            Создать новую запись
                        </StyledButtonGreen>
                    </Space>
                </Form.Item>
            </Form>
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
                    pageSize: limit,
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
            <IrdModalForm
                key={irdModalStatus?.ird?.id ??  nanoid()}
                onClose={()=> {
                    setIrdModalStatus(null);}}
                object={irdModalStatus?.ird ?? null}
                mode={irdModalStatus?.mode ?? null}
            />
        </div>
    );
};
export default IrdTable;
