import React, {useState} from 'react';
import { useQuery } from '@apollo/client';
import {Button, Modal, notification, Table} from 'antd';
import {PROJECT_QUERY} from '../../graphql/queries';
import ProjectForm from "../form/ProjectForm";
import LoadingSpinner from "../component/LoadingSpinner";

const ProjectList = () => {

    // Состояния
    const {loading, error, data} = useQuery(PROJECT_QUERY);
    const [selectedProject, setSelectedProject] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [search,setSearch] = useState(null);
    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };

    // Мутация для удаления
    // TODO: Нужна ли?
    const onSearch = (value) =>{
        setSearch(value);
    }
    // Обработчик событий
    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    const handleClose = () => {
        setEditModalVisible(false);
    };
    const handleEdit = (contactId) => {
        const contact = data.projects.find(contact => contact.id === contactId);
        setSelectedProject(contact);
        setEditModalVisible(true);
    };


    // Обработка загрузки и ошибок
    if (loading) return <LoadingSpinner/>;
    if (error) return `Ошибка! ${error.message}`;

    // Формат таблицы
    const columns = [
        {
            title: 'Номер',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Заказчик',
            dataIndex: 'organization_customer',
            key: 'organization_customer',
            render: (organization_customer) => organization_customer ?
                organization_customer.name : "",
        },
        {
            title: 'Представитель',
            dataIndex: 'delegate',
            key: 'delegate',
            render: (delegate) => delegate ?
                delegate.first_name +" "+ delegate.last_name +" "+ delegate.patronymic : "",
        },
        {
            title: 'Тип документации',
            dataIndex: 'type_project_document',
            key: 'type_project_document',
            render: (type_project_document) => type_project_document ?
                type_project_document.name : ""
        },
        {
            title: 'Объект',
            dataIndex: 'facility',
            key: 'facility',
            render: (facility) => facility ?
                facility.name : ""

        },
        {
            title: 'Дата подписания',
            dataIndex: 'date_signing',
            key: 'date_signing',

        },
        {
            title: 'Продолжительность',
            dataIndex: 'duration',
            key: 'duration',
        },
        {
            title: 'Дата окончания',
            dataIndex: 'date_end',
            key: 'date_end',
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            render: (status) => status ?
                status.name : ""
        },
        {
            title: 'Дата фактического окончания',
            dataIndex: 'date_completion',
            key: 'date_completion',
        },
        {
            title: 'Управление',
            key: 'edit',
            render: (text, record) => (
                <Button onClick={() => handleEdit(record.id)}>Изменить</Button>
            ),
        },
    ];

    return(
    <div>
        <Table dataSource={data.projects}
               columns={columns}
               onChange={onChange}/>
        <Modal
            visible={editModalVisible}
            width={1200}
            title="Изменить контакт"
            onCancel={() => setEditModalVisible(false)}
            footer={null}
            onClose={handleClose}
        >
            <ProjectForm project={selectedProject} onClose={handleClose}/>
        </Modal>
    </div>
    )};

export default ProjectList;
