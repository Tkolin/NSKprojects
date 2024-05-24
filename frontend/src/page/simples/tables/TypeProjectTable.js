import React, {useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {Button, Form, Modal, notification, Space, Table} from 'antd';
import {TYPES_PROJECTS_QUERY} from '../../../graphql/queries';
import {DELETE_TYPE_PROJECT_MUTATION} from '../../../graphql/mutationsTypeProject';
import TypeProjectForm from "../../../components/form/modelsForms/TypeProjectForm";

import LoadingSpinnerStyles from "../../../components/style/LoadingSpinnerStyles";
import Search from "antd/es/input/Search";
import {StyledButtonGreen} from "../../../components/style/ButtonStyles";
import {StyledFormLarge} from "../../../components/style/FormStyles";

const TypeProjectTable = () => {

    // Состояния
    const [selectedTypeProject, setSelectedTypeProject] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [formSearch] = Form.useForm();

    // Данные
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [currentSort, setCurrentSort] = useState({});

    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    const [search, setSearch] = useState('');

    const {loading, error, data, refetch} = useQuery(TYPES_PROJECTS_QUERY, {
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
    const [deleteTypeProject] = useMutation(DELETE_TYPE_PROJECT_MUTATION, {
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно удалены!');
            refetch();
        },
        onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при удалении данных: ' + error.message);
            refetch();
        }
    });

    // Обработчик событий
    const handleClose = () => {
        refetch();
        setEditModalVisible(false);
    };
    const handleEdit = (typeProjectId) => {
        const typeProject = data.typeProjects.items.find(typeProject => typeProject.id === typeProjectId);
        setSelectedTypeProject(typeProject);
        setEditModalVisible(true);
    };
    const handleAdd = () => {
        setAddModalVisible(true);
    };
    const handleDelete = (typeProjectId) => {
        deleteTypeProject({variables: {id: typeProjectId}});
    };
    const onSearch = (value) => {
        setSearch(value);
    };
    // Обработка загрузки и ошибок
    if (error) return `Ошибка! ${error.message}`;

    // Формат таблицы
    const columns = [
        {
            title: 'Код',
            dataIndex: 'code',
            key: 'code',

            sorter: true,
            ellipsis: true,
        },
        {
            title: 'Наименование',
            dataIndex: 'name',
            key: 'name',

            sorter: true,
            ellipsis: true,
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
    const onChange = (sorter) => {
        setSortField(sorter?.field ?? "");
        setSortOrder(sorter?.order === 'descend' ? 'desc' : sorter?.order === 'ascend' ? 'asc' : '');
    };

    return (
        <div>
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
                dataSource={data?.typeProjects?.items.map((org, index) => ({...org, key: index}))}
                columns={columns}
                onChange={(pagination, filters, sorter, extra) => onChange(sorter)}
                pagination={{
                    total: data?.typeProjects?.count,
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
                    pageSizeOptions: ['10', '20', '50', '100'],
                }}
            />
            <Modal
                key={selectedTypeProject?.id}
                open={editModalVisible}
                width={900}
                onCancel={() => setEditModalVisible(false)}
                footer={null}
                onClose={handleClose}
            >
                <TypeProjectForm typeProject={selectedTypeProject} onClose={handleClose}/>
            </Modal>
            <Modal
                open={addModalVisible}
                width={900}
                onCancel={() => setAddModalVisible(false)}
                footer={null}
                onClose={handleClose}
            >
                <TypeProjectForm typeProject={null} onClose={handleClose}/>
            </Modal>
        </div>
    );
};
export default TypeProjectTable;
