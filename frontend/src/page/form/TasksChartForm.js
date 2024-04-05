import React, { useEffect, useState, useRef } from 'react';
import { Button, Drawer, Form, Input, InputNumber, Popconfirm, Row, Table, Typography } from 'antd';
import { Chart } from 'react-google-charts';
import { useQuery } from "@apollo/client";
import {PROJECTS_QUERY, TASKS_TO_PROJECT_QUERY} from "../../graphql/queries";
import TaskProjectForm from "./TaskProjectForm";

const TasksChartForm = ({ project, setProject }) => {
    const [originData, setOriginData] = useState();
    const [openTaskProjectForm, setOpenTaskProjectForm] = useState(false);
    const [addTasksProject, setAddTasksProject] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [form] = Form.useForm();

    const buildData = (data) => {
        const rows = data.map((task) => {
            const { id, task: { name }, executors, date_start, date_end, duration, inherited_task_ids } = task;
            const inheritedIds = inherited_task_ids.map(({ project_inherited_task_id }) => project_inherited_task_id).join(", ");
            const row = [
                id.toString(),
                name,
                executors.map((executor) => executor.executor.passport.lastname).join(","),
                new Date(date_start).toISOString().slice(0, 10),
                new Date(date_end).toISOString().slice(0, 10),
                duration,
                0, // Assuming this needs to be calculated based on sub-tasks or some other logic
                inheritedIds, // Use dependenciesMap to get dependencies
            ];
            console.log('row ', row);
            return row;
        });

        console.log("rows ", rows);
        setOriginData(rows.map((r) => ({
            key: r[0],
            TaskID: r[0],
            TaskName: r[1],
            Resource: r[2],
            StartDate: r[3],
            EndDate: r[4],
            Duration: r[5],
            PercentComplete: r[6],
            Dependencies: r[7]
        })));
    };
    const [actualityProjectData, setActualityProjectData] = useState(null);

    const {
        loading: loadingTasks,
        error: errorTasks,
        refetch: refetchTasks,
        data: dataTasks
    } = useQuery(PROJECTS_QUERY, {
        variables: { projectId: 24 },
        onCompleted: (data) => {
            console.log("data ", data?.projects?.items[0]?.project_tasks);
            if (data?.projects?.items[0]?.project_tasks)
                buildData(data?.projects?.items[0]?.project_tasks);
            setActualityProjectData(data?.projects?.items[0]);
        }
    });

    const onCloseTaskProjectForm = () => {
        setOpenTaskProjectForm(false);
        setEditTask(null);
        setAddTasksProject(false);
    };

    const newTask = () => {};


    const columns = [
        {
            title: 'ID',
            dataIndex: 'TaskID',
            editable: true,
        },
        {
            title: 'Наименование задачи',
            dataIndex: 'TaskName',
            editable: true,
        },
        {
            title: 'Исполнители',
            dataIndex: 'Resource',
            editable: true,
        },
        {
            title: 'Дата начала',
            dataIndex: 'StartDate',
            editable: true,
        },
        {
            title: 'Дата завершения',
            dataIndex: 'EndDate',
            editable: true,
        },
        {
            title: 'Продолжиельность',
            dataIndex: 'Duration',
            editable: true,
        },
        {
            title: 'Процент выполнения',
            dataIndex: 'PercentComplete',
            editable: true,
        },
        {
            title: 'Зависимости',
            dataIndex: 'Dependencies',
            editable: true,
        },
        {
            title: 'Действия',
            dataIndex: 'operation',
            render: (text, record) => (
                <Typography.Link onClick={() => {
                    setEditTask(actualityProjectData?.project_tasks?.find(d => d.id === record.TaskID));
                    setOpenTaskProjectForm(true);
                }}>
                    Изменить
                </Typography.Link>
            )
        },
    ];

    const columnsChart = [
        { type: 'string', label: 'Task ID' },
        { type: 'string', label: 'Task Name' },
        { type: 'string', label: 'Resource' },
        { type: 'date', label: 'Start Date' },
        { type: 'date', label: 'End Date' },
        { type: 'number', label: 'Duration' },
        { type: 'number', label: 'Percent Complete' },
        { type: 'string', label: 'Dependencies' },
    ];

    if (errorTasks) {
        return errorTasks.message;
    }

    return (
        <div style={{width: '100%', margin: 10}}>
            <div style={{ width: "100vh", height: '50vh', overflow: 'visible' }}>
                {originData && (
                    <Chart
                        style={{ width: '100%', height: '100%' }}
                        chartType="Gantt"
                        data={[columnsChart, ...originData?.map(item => [
                            item.TaskID,
                            item.TaskName,
                            item.Resource,
                            new Date(item.StartDate),
                            new Date(item.EndDate),
                            item.Duration,
                            item.PercentComplete,
                            item.Dependencies,
                        ])]}
                        options={{
                            explorer: {
                                axis: 'horizontal',
                                keepInBounds: true,
                                maxZoomIn: 10.0,
                                maxZoomOut: 1.0,
                            },
                        }}
                    />
                )}
            </div>
            <div style={{width: '100%'}}>
                <Form form={form} component={false}>
                    <Table
                        style={{width: '100%'}}
                        size="small"
                        bordered
                        dataSource={originData}
                        columns={columns}
                        pagination={false}
                    />
                    <Button style={{ width: '100', margin: 10 }} onClick={() => newTask()}>Создать задачу</Button>
                </Form>
            </div>
            <Drawer title="Данные об задаче" width={520} closable={false} onClose={onCloseTaskProjectForm} open={openTaskProjectForm}>
                {addTasksProject ?
                    (<TaskProjectForm project={actualityProjectData} />)
                :
                    (<TaskProjectForm project={actualityProjectData} tasksProject={editTask} />)}
            </Drawer>
        </div>
    );
};

export default TasksChartForm;
