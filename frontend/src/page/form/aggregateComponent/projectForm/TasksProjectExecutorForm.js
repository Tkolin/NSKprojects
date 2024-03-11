import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import {Table, Select, InputNumber, DatePicker} from 'antd';

import {LoadingOutlined} from "@ant-design/icons";
import {PERSONS_QUERY, PERSONS_SHORT_QUERY, TEMPLATE_TASKS_TYPE_PROJECTS_QUERY} from "../../../../graphql/queries";


const TasksProjectExecutorForm = ({ project, triggerMethod, setTriggerMethod }) => {
    const [dataPersons, setDataPersons] = useState(null);
    const [autoCompletePersons, setAutoCompletePersons] = useState('');
    const handleAutoCompletePersons = (value) => {setAutoCompletePersons(value);};


    const handleAutoCompletePersonsSelect = (value, taskId) => {
        console.log(taskId);
        handleExecutorChange(value, taskId);
        if (value === 'CREATE_NEW') {
            setAutoCompletePersons('');
        }
    };


    const { loading: loading, error, data: data } = useQuery(TEMPLATE_TASKS_TYPE_PROJECTS_QUERY, {
        variables: { typeProjectId: project?.type_project_document?.id },
    });

    const { loading: loadingPersons, error: errorPersons, refetch: refetchPersons } = useQuery(PERSONS_SHORT_QUERY, {
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
                    popupMatchSelectWidth={false}
                    filterOption={false}
                    placeholder="Исполнитель..."
                    onSearch={(value) => handleAutoCompletePersons(value)}
                    onSelect={(value) => handleAutoCompletePersonsSelect(value, item.id)} // Pass taskId directly
                    allowClear
                    showSearch
                    loading={loadingPersons}
                >
                    {dataPersons?.persons?.items?.map(row => (
                        <Select.Option key={row.id} value={row.id}>{row.passport.lastname} {row.passport.firstname}</Select.Option>
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

    if(loading)
        return <LoadingOutlined
            style={{
                fontSize: 24,
            }}
            spin
        />

    return (
        <>
            <Table columns={columns} dataSource={dataSource} />
        </>
    );
};

export default TasksProjectExecutorForm;
