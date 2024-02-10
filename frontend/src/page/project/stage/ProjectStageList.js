// Ваш проект/frontend/src/components/ContactList.js

import React, {useState} from 'react';
import { useQuery } from '@apollo/client';
import {Button, Modal, Table} from 'antd';
import {PROJECT_QUERY, PROJECT_STAGE_QUERY} from '../../../graphql/queries';
import ProjectForm from "..//ProjectForm";

const ProjectList = () => {

    // Состояния
    const {loading, error, data} = useQuery(PROJECT_STAGE_QUERY);
    const [selectedStage, setSelectedStage] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);

    // Обработка загрузки и ошибок
    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    // Формат таблицы
    const columns = [
        Table.EXPAND_COLUMN,
        {
            title: 'Номер',
            dataIndex: 'number',
            key: 'number',
            render: (id) =>project ? project.id : null,
        },
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
            render: (name) =>project ? project.name : null,
        },
        {
            title: 'Управление',
            key: 'edit',
            render: (text, record) => (
                <Button onClick={() => handleEdit(record.id)}>Изменить</Button>
            ),
        },
        // Add more columns as needed
    ];

    // Логика
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

    return(
        <div>
            <Table dataSource={data.projects}
                   columns={columns}
                   onChange={onChange}
                   expandable={{
                       expandedRowRender: (record) => (
                           <>
                               <p>
                                   Дата подписания: {record.date_signing}
                               </p>
                               <p>
                                   Продолжительность: {record.duration}
                               </p>
                               <p>
                                   Дата окончания: {record.date_end}

                               </p>
                               <p>
                                   Дата фактического завершения: {record.date_completion}
                               </p>
                           </>
                       ),
                   }}
            />
            <Modal
                visible={editModalVisible}
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
