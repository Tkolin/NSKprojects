import React, {useState} from 'react';
import { useQuery } from '@apollo/client';
import {Button, Modal, Table} from 'antd';
import { PROJECT_QUERY} from '../../graphql/queries';
import ProjectForm from "./ProjectForm";

const ProjectList = () => {

    // Данные

    const {loading, error, data} = useQuery(PROJECT_QUERY);
    const [selectedProject, setSelectedProject] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;


    // Дизайн

    const columns = [
        Table.EXPAND_COLUMN,
        Table.SELECTION_COLUMN,
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

    // Вывод

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
