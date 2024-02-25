import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Table, Select, InputNumber, DatePicker, Button } from 'antd';
import {GET_TEMPLATES_TASKS_TYPE_PROJECTS, SEARCH_PERSONS_QUERY} from "../../graphql/queriesSearch";

const TasksProjectExecutorTable = ({ project,typeProjectId }) => {
    const [dataPersons, setDataPersons] = useState(null);
    const [autoCompletePersons, setAutoCompletePersons] = useState('');
    const [typeProjectId, setTypeProjectId] = useState('')
    const handleAutoCompletePersonsSelect = (value, taskId) => {
        console.log(taskId);
        handleExecutorChange(value, taskId);
        if (value === 'CREATE_NEW') {
            setAutoCompletePersons('');
        }
    };

    const handleAutoCompletePersons = (value) => {
        setAutoCompletePersons(value);
    };

    const { loading, error, data } = useQuery(GET_TEMPLATES_TASKS_TYPE_PROJECTS, {
        variables: { typeProjectId },
    });

    const { loading: loadingPersons, error: errorPersons, refetch: refetchPersons } = useQuery(SEARCH_PERSONS_QUERY, {
        variables: { search: autoCompletePersons },
        onCompleted: (data) => setDataPersons(data),
    });

    const [tasksData, setTasksData] = useState([]);

    const handleSave = () => {
        console.log('Saved tasks data:', tasksData);
    };

    const buildHierarchy = (tasks, parentId = null) => {
        return tasks
            .filter(task => task.inherited_task_id === parentId)
            .map(task => {
                const children = buildHierarchy(tasks, task.id);
                return { ...task, children };
            });
    };

    const tasksHierarchy = buildHierarchy(data?.templatesTasksTypeProjects || []);

    const updateExecutorInChildren = (dataSource, parentId, executor) => {
        return dataSource.map(item => {
            if (item.key === parentId) {
                return {
                    ...item,
                    executor: executor,
                    children: item.children ? updateExecutorInChildren(item.children, null, executor) : null
                };
            } else if (item.children) {
                return {
                    ...item,
                    children: updateExecutorInChildren(item.children, parentId, executor)
                };
            }
            return item;
        });
    };

    const handleExecutorChange = (value, taskId) => {
        setTasksData(prevState => {
            const updatedData = updateExecutorInChildren(prevState, taskId, value);
            return updatedData;
        });
    };

    const renderTable = (dataSource) => {
        return dataSource.map(item => ({
            key: item.id,
            task: item.task.name,
            stage_number: item.stage_number,
            executor: (
                <Select
                    style={{ maxWidth: 380, minWidth: 380, marginBottom: 0 }}
                    popupMatchSelectWidth={false}
                    filterOption={false}
                    placeholder="Исполнитель..."
                    onSearch={(value) => handleAutoCompletePersons(value)}
                    onSelect={(value) => handleAutoCompletePersonsSelect(value, item.id)} // Pass taskId directly
                    allowClear
                    showSearch
                    loading={loadingPersons}
                >
                    {dataPersons && dataPersons.personsTable && dataPersons.personsTable.persons && dataPersons.personsTable.persons.map(person => (
                        <Select.Option key={person.id} value={person.id}>{person.passport.lastname} {person.passport.firstname}</Select.Option>
                    ))}
                </Select>
            ),
            cost: <InputNumber defaultValue={0} onChange={(value) => {
                setTasksData(prevState => [...prevState, { id: item.id, cost: value }]);
            }} />,
            deadline: <DatePicker onChange={(date, dateString) => {
                setTasksData(prevState => [...prevState, { id: item.id, deadline: dateString }]);
            }} />,
            children: item.children ? renderTable(item.children) : null,
        }));
    };

    const dataSource = renderTable(tasksHierarchy);

    const columns = [
        { title: 'Задача', dataIndex: 'task', key: 'task' },
        { title: 'Исполнитель', dataIndex: 'executor', key: 'executor' },
        { title: 'Цена', dataIndex: 'cost', key: 'cost' },
        { title: 'Срок (Либо 2 даты либо дата и продолжительность)', dataIndex: 'deadline', key: 'deadline' },
    ];

    return (
        <>
            <Table columns={columns} dataSource={dataSource} />
            <Button onClick={handleSave}>Save</Button>
        </>
    );
};

export default TasksProjectExecutorTable;

