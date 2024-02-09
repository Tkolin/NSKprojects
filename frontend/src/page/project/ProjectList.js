// Ваш проект/frontend/src/components/ContactList.js

import React from 'react';
import { useQuery } from '@apollo/client';
import { Table } from 'antd';
import { PROJECT_QUERY} from '../../graphql/queries';

const ProjectList = () => {
    const { loading, error, data } = useQuery(PROJECT_QUERY);

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

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

        // Add more columns as needed
    ];

    return <Table dataSource={data.projects} columns={columns} />;
};

export default ProjectList;
