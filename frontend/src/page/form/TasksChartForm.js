import React, {useEffect, useState} from 'react';
import {Drawer, Form, Input, InputNumber, Popconfirm, Row, Table, Typography} from 'antd';
import {Chart} from 'react-google-charts';
import {useQuery} from "@apollo/client";
import {TASKS_TO_PROJECT_QUERY} from "../../graphql/queries";
import TaskProjectForm from "./TaskProjectForm";

const EditableCell = ({editing, dataIndex, title, inputType, record, index, children, ...restProps}) => {
    const inputNode = inputType === 'number' ? <InputNumber/> : <Input/>;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{margin: 0}}
                    rules={[{required: true, message: `Please Input ${title}!`}]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const TasksChartForm = ({projectId}) => {
        const [originData, setOriginData] = useState();
        const [openTaskProjectForm, setOpenTaskProjectForm] = useState(false);
        const [editTask, setEditTask] = useState(null);
        const [form] = Form.useForm();
        useEffect(() => {
            console.log("editTask ", editTask);
        }, [editTask]);

        const {
            loading: loadingTasks,
            error: errorTasks,
            refetch: refetchTasks,
            data: dataTasks
        } = useQuery(TASKS_TO_PROJECT_QUERY, {
            variables: {projectId: 24},
            onCompleted: (data) => {
                console.log(data);
                if (data)
                    buildData(data);
            }
        });
        const onCloseTaskProjectForm = () => {
            setOpenTaskProjectForm(false);
            setEditTask(null);
        }
        const buildData = (data) => {
            const {projectTasksQuery} = data;

            // Создаем объект для хранения зависимостей
            const dependenciesMap = {};

            // Перебираем задачи и строим карту зависимостей
            projectTasksQuery.forEach((task) => {
                const {id, sub_tasks} = task;
                sub_tasks.forEach((sub_task) => {
                    if (!dependenciesMap[sub_task.id]) {
                        dependenciesMap[sub_task.id] = [];
                    }
                    dependenciesMap[sub_task.id].push(id.toString());
                });
            });

            const rows = projectTasksQuery.map((task) => {
                const {id, task: {name}, executors, date_start, date_end, duration, sub_tasks} = task;
                const row = [
                    id.toString(),
                    name,
                    executors.map((executor) => executor.executor.passport.lastname).join(", "),
                    new Date(date_start).toISOString().slice(0, 10),
                    new Date(date_end).toISOString().slice(0, 10),
                    duration,
                    0, // Assuming this needs to be calculated based on sub-tasks or some other logic
                    dependenciesMap[id] ? dependenciesMap[id].join(", ") : "", // Use dependenciesMap to get dependencies

                ];
                return row;
            });

            console.log("rows ", rows);
            setOriginData(rows.map((r) => ({
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

        const edit = (record) => {

        };


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
                        setEditTask(dataTasks?.projectTasksQuery?.find(d => d.id === record.TaskID));
                        setOpenTaskProjectForm(true);
                    }}>
                        Изменить
                    </Typography.Link>
                )
            },
        ];
        // const mergedColumns = columns?.map((col) => {
        //     if (!col.editable) {
        //         return col;
        //     }
        //     return {
        //         ...col,
        //         onCell: (record) => ({
        //             record,
        //             inputType: col.dataIndex === 'Duration' || col.dataIndex === 'PercentComplete' ? 'number' : 'text',
        //             dataIndex: col.dataIndex,
        //             title: col.title,
        //             editing: isEditing(record),
        //         }),
        //     };
        // });

        const columnsChart = [
            {type: 'string', label: 'Task ID'},
            {type: 'string', label: 'Task Name'},
            {type: 'string', label: 'Resource'},
            {type: 'date', label: 'Start Date'},
            {type: 'date', label: 'End Date'},
            {type: 'number', label: 'Duration'},
            {type: 'number', label: 'Percent Complete'},
            {type: 'string', label: 'Dependencies'},
        ];
        if (errorTasks) {
            return errorTasks.message;
        }
        return (
            <>
                <Row style={{width: "100%"}} gutter={10}>
                    <Form form={form} component={false}>
                        <Table
                            style={{width: "100%"}}
                            components={{
                                body: {
                                    cell: EditableCell,
                                },
                            }}
                            size={"small"}
                            bordered
                            dataSource={originData}
                            columns={columns}
                            rowClassName="editable-row"
                        />
                    </Form>

                    {originData && (
                        <Chart
                            tyle={{width: "100%"}}
                            width={"100%"}
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
                                height: 400,
                                gantt: {
                                    trackHeight: 30,
                                },
                            }}
                        />
                    )}
                </Row>
                <Drawer title="Данные об задаче" width={520} closable={false} onClose={onCloseTaskProjectForm}
                        open={openTaskProjectForm}>
                    <TaskProjectForm tasksProject={editTask}/>
                </Drawer>
            </>
        );
    }
;

export default TasksChartForm;
