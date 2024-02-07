// Ваш проект/frontend/src/components/ContactList.js

import React from 'react';
import { useQuery } from '@apollo/client';
import { Table } from 'antd';
import { CONTACTS_QUERY } from '../../graphql/queries';

const ContactList = () => {
    const { loading, error, data } = useQuery(CONTACTS_QUERY);

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    const columns = [
        {
            title: 'First Name',
            dataIndex: 'first_name',
            key: 'first_name',
        },
        {
            title: 'Last Name',
            dataIndex: 'last_name',
            key: 'last_name',
        },
        {
            title: 'Mobile Phone',
            dataIndex: 'mobile_phone',
            key: 'mobile_phone',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        // Add more columns as needed
    ];

    return <Table dataSource={data.contacts} columns={columns} />;
};

export default ContactList;
