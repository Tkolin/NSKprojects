import React, { useState } from 'react';
import { Button, Space, Table } from 'antd';
const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sydney No. 1 Lake Park',
    },
    {
        key: '4',
        name: 'Jim Red',
        age: 32,
        address: 'London No. 2 Lake Park',
    },
];

const App = () => {
    const [sortedInfo, setSortedInfo] = useState({});
    const handleChange = (pagination, filters, sorter) => {
        sorter && sorter.order &&
            console.log(sorter.order === "ascend" ? "asc" : "desc")
        console.log(pagination, filters, sorter);
            setSortedInfo(sorter);

    };
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',

            sorter: (a, b) => a.name.length - b.name.length,
            sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,

        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',

            sorter: (a, b) => a.age - b.age,
            sortOrder: sortedInfo.columnKey === 'age' ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',

            sorter: (a, b) => true,
            sortOrder: sortedInfo.columnKey === 'address' ? sortedInfo.order : null,
            ellipsis: true,
        },
    ];
    return (
        <>
            <Table columns={columns} dataSource={data} onChange={handleChange} />
        </>
    );
};
export default App;