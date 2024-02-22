// Ваш проект/frontend/src/components/TypeProjectList.js

import React, {useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {Button, FloatButton, Form, Modal, notification, Table} from 'antd';
import { TYPES_PROJECTS_QUERY} from '../../graphql/queries';
import { DELETE_TYPE_PROJECT_MUTATION} from '../../graphql/mutationsTypeProject';
import TypeProjectForm from "../form/TypeProjectForm";

import LoadingSpinner from "../component/LoadingSpinner";
import Search from "antd/es/input/Search";
import {EditTwoTone, PlusSquareOutlined} from "@ant-design/icons";

const TypeProjectList = () => {

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

    const { loading, error, data } = useQuery(TYPES_PROJECTS_QUERY, {
        variables: {
            page,
            limit,
            search,
            sortField,
            sortOrder,
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
            window.location.reload();

        },
        onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при удалении данных: ' + error.message);
            window.location.reload();

        },
        update: (cache, { data: { deleteTypeProject } }) => {
            const { typeProjects } = cache.readQuery({ query: TYPES_PROJECTS_QUERY });
            const updatedTypeProjects = typeProjects.filter(typeProject => typeProject.id !== deleteTypeProject.id);
            cache.writeQuery({
                query: TYPES_PROJECTS_QUERY,
                data: { typeProjects: updatedTypeProjects },
            });
        },
    });

    // Обработчик событий
    const handleClose = () => {setEditModalVisible(false);};
    const handleEdit = (typeProjectId) => {
        const typeProject = data.typeProjectsTable.typeProjects.find(typeProject => typeProject.id === typeProjectId);
        setSelectedTypeProject(typeProject);
        setEditModalVisible(true);
    };
    const handleAdd = () => {
        setAddModalVisible(true);
    };
    const handleDelete = (typeProjectId) => {
        deleteTypeProject({ variables: { id: typeProjectId}});
    };
    const onSearch = (value) =>{
        setSearch(value);
    };
    // Обработка загрузки и ошибок
    if(!data)
        if (loading) return <LoadingSpinner/>;
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
                <div style={{display: 'flex', gap: '8px'}}>
                    <Button  onClick={() => handleEdit(record.id)}>Изменить</Button>
                    <Button danger={true} onClick={() => handleDelete(record.id)}>Удалить</Button>
                </div>

            ),
        },
    ];
    const onChange = (pagination, filters, sorter) => {

        if((sorter.field !== undefined) && currentSort !== sorter){
            setCurrentSort(sorter);
            if (sortField !== sorter.field) {
                setSortField(sorter.field);
                setSortOrder("asc");
            }
            else {
                setSortField(sortField);
                switch (sortOrder){
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
        }else
            console.log("Фильтры сохранены");
    };
    return (
        <div>

            <FloatButton
                style={{  display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'green'  }}
                onClick={() => handleAdd()}
                tooltip={<div>Создать новую запись</div>}
            >
                <PlusSquareOutlined style={{ fontSize: '90px', color: 'green' }} />
            </FloatButton>

            <Form form={formSearch} layout="horizontal">
                <Form.Item label="Поиск:" name="search">
                    <Search
                        placeholder="Найти..."
                        allowClear
                        enterButton="Search"
                        onSearch={onSearch}
                    />
                </Form.Item>
            </Form>
            <Table
                size={'small'}
                sticky={{
                    offsetHeader: 64,
                }}
                loading={loading}
                dataSource={data.typeProjectsTable.typeProjects}
                columns={columns}
                onChange={onChange}
                pagination={{
                    total: data.typeProjectsTable.count,
                    current: page,
                    limit,
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
                visible={editModalVisible}
                title="Изменить тип проекта"
                onCancel={() => setEditModalVisible(false)}
                footer={null}
                onClose={handleClose}
            >
                <TypeProjectForm typeProject={selectedTypeProject} onClose={handleClose}/>
            </Modal>
            <Modal
                visible={addModalVisible}
                title="Создать тип проекта"
                onCancel={() => setAddModalVisible(false)}
                footer={null}
                onClose={handleClose}
            >
                <TypeProjectForm onClose={handleClose}/>
            </Modal>
        </div>
    );
};
export default TypeProjectList;
