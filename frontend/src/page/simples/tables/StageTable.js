import React, {useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {Button, Divider, Form, Modal, notification, Space, Table} from 'antd';
import {STAGES_QUERY} from '../../../graphql/queries';
import {DELETE_STAGE_MUTATION} from '../../../graphql/mutationsStage';
import StageForm from "../../../components/form/modelsForms/StageForm";
import Search from "antd/es/input/Search";
import {StyledButtonGreen} from "../../../components/style/ButtonStyles";
import Title from "antd/es/typography/Title";
import {DeleteAndEditStyledLinkManagingDataTable} from "../../../components/style/TableStyles";
import ContactModalForm from "../../../components/modal/ContactModalForm";
import {nanoid} from "nanoid";
import StageModalForm from "../../../components/modal/StageModalForm";

const StageTable = () => {
    // Состояния
    const [formSearch] = Form.useForm();
    const [stageModalStatus, setStageModalStatus] = useState(null);

    // Данные
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [currentSort, setCurrentSort] = useState({});

    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    const [search, setSearch] = useState('');

    const {loading, error, data, refetch: refetch} = useQuery(STAGES_QUERY, {
        variables: {
            queryOptions: {
                page,
                limit,
                search,
                sortField,
                sortOrder
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
    const [deleteStage] = useMutation(DELETE_STAGE_MUTATION, {
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
    const handleDelete = (stageId) => {
        deleteStage({variables: {id: stageId}});
    };
    const onSearch = (value) => {
        setSearch(value);
    };
    // Обработка загрузки и ошибок
    if (error) return `Ошибка! ${error.message}`;

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
                    title={"Удаление этапа"}
                    description={"Вы уверены, что нужно удалить этот этап?"}
                    handleEdit={() => {
                        setStageModalStatus({stage: record, mode: "edit"})
                    }}
                    handleDelete={() => handleDelete(record.id)}
                />
            ),
        }
    ];
    const onChange = (sorter) => {
        setSortField(sorter?.field ?? "");
        setSortOrder(sorter?.order === 'descend' ? 'desc' : sorter?.order === 'ascend' ? 'asc' : '');
    };
    return (
        <div>
            <Form form={formSearch} layout="horizontal">
                <Divider style={{marginTop: 0}}>
                    <Title style={{marginTop: 0}} level={2}>Справочник наименования этапов</Title>
                </Divider>
                <Form.Item label="Поиск:" name="search">
                    <Space>
                        <Search
                            placeholder="Найти..."
                            allowClear
                            enterButton="Найти"
                            onSearch={onSearch}
                        />
                        <StyledButtonGreen
                            style={{marginBottom: 0}}
                            onClick={() => setStageModalStatus({stage: null, mode: "add"})}>

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
                dataSource={data?.stages?.items}
                columns={columns}
                onChange={(pagination, filters, sorter, extra) => onChange(sorter)}
                pagination={{
                    total: data?.stages?.count,
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
            <StageModalForm
                key={stageModalStatus?.stage?.id ?? nanoid()}
                onClose={() => {
                    setStageModalStatus(null);
                    refetch();
                }}
                object={stageModalStatus?.stage ?? null}
                mode={stageModalStatus?.mode ?? null}
            />

        </div>
    );
}
    ;
    export default StageTable;
