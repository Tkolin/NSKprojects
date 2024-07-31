import React, {useContext, useEffect, useState} from 'react';
import {Card, Col, Form, Row, Skeleton, Space, Tooltip, Typography} from "antd";
import TasksTreeComponent from "./TasksTreeComponent";
import {
    CustomAutoCompleteAndCreate,
} from "../../components/style/SearchAutoCompleteStyles";
import {useMutation, useQuery} from "@apollo/client";
import {TASKS_QUERY_COMPACT} from "../../../graphql/queriesCompact";
import LoadingSpinnerStyles from "../../components/style/LoadingSpinnerStyles";
import {StyledButtonGreen} from "../../components/style/ButtonStyles";
import {ADD_TASK_MUTATION} from "../../../graphql/mutationsTask";
import {NotificationContext} from "../../../NotificationProvider";
import {DeleteOutlined, SaveOutlined} from "@ant-design/icons";
import Link from "antd/es/typography/Link";
import {PROJECT_TASKS_STRUCTURE_UPDATE} from "../../../graphql/mutationsProject";
import dayjs from "dayjs";


const {Text} = Typography;

const NewTasksToProjectForm = ({actualProject, setLoading, onCompleted}) => {
    //Вынести за компонен
    const [form] = Form.useForm();
    const [tasksModalStatus, setTasksModalStatus] = useState({options: [], selected: {}});
    const {openNotification} = useContext(NotificationContext);
    const [selectedTasksIds, setSelectedTasksIds] = useState([]);
    const [stageTaskArray, setStageTaskArray] = useState([]);
    // const [addMarker, setAddMarker] = useState();
    // Список задач
    const {
        loading: loadingTasks, error: errorTasks,
        data: dataTasks, refetch: refetchTasks
    } = useQuery(TASKS_QUERY_COMPACT);


    const extractKeys = (tasksByStage, project) => {
        const result = [];
        const projectStages = project.project_stages;
        // task_id: ID
        // project_id: ID
        // inherited_task_id: ID
        // date_start: String
        // date_end: String
        // duration: Int
        // stage_number: Int
        // Создание задач из этапов проекта
        projectStages.forEach(stage => {
            const task = {
                task_id: stage?.stage?.task_id?.toString(),
                project_id: project.id,
                inherited_task_id: null,
                date_start: stage.date_start,
                date_end: stage.date_end,
                duration: dayjs(stage.date_end).diff(stage.date_start, 'day'),
                stage_number: stage.number,
            };
            result.push(task);
        });

        const traverse = (nodes, stageNumber, parentKey = null) => {
            nodes.forEach(node => {
                let task = {
                    project_id: project.id,
                    task_id: node.key,
                    stage_number: stageNumber,
                    inherited_task_id: parentKey || result.find(t => t.stage_number === stageNumber)?.task_id || null,
                    date_start: result.find(t => t.stage_number === stageNumber)?.date_start || null,
                    date_end: result.find(t => t.stage_number === stageNumber)?.date_end || null
                };
                if (project.project_tasks.length > 0) {
                    const oldData = project.project_tasks.find(row => {
                            console.log(row.task.id, " === ", node.key, " : ", (row.task.id === node.key));
                            return ((row.task.id === node.key))
                        }
                    );
                    console.log("oldData", oldData)
                    task = {...task, date_start: oldData?.date_start, date_end: oldData?.date_end}
                }
                result.push(task);
                if (node.children) {
                    traverse(node.children, stageNumber, node.key);
                }
            });
        };
        for (const [stageNumber, tasks] of Object.entries(tasksByStage)) {
            traverse(tasks, parseInt(stageNumber));

        }

        return result;
    };
    const [mutateTasksToProject, {loading: loadingMutation}] = useMutation(PROJECT_TASKS_STRUCTURE_UPDATE, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Создание новой записи выполнено успешно`);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при выполнении создания: ${error.message}`);

        }
    });
    const handleSubmit = () => {
        mutateTasksToProject({
            variables: {
                data:
                    extractKeys(Object.entries(form.getFieldsValue()).reduce((acc, [stageNumber, stageData]) => {
                        acc[stageNumber] = stageData.tasks || [];
                        return acc;
                    }, {}), actualProject)
            }
        })


    }
    const handleSelectTask = (index, value, handleDelete) => {
        if (value?.id > 0) {

            setSelectedTasksIds([...selectedTasksIds,  value.id]);
            const oldTasks = form.getFieldValue([index, "tasks"]);

            form.setFieldValue([index, "tasks"], [
                ...oldTasks ?? [],
                {
                    title: <Space.Compact direction={"horizontal"}>
                        <Text>{handleDelete && (
                            <Tooltip title={"Удалить задачу"}>
                                <Link onClick={() => handleDelete(value.id)} type={"danger"}><DeleteOutlined/></Link>
                            </Tooltip>)} {value.name}
                        </Text>

                    </Space.Compact>,
                    key: value.id
                }
            ])
        }
    }

    const handleDeleteTaskToProject = (taskToProjectId) => {
        if (taskToProjectId > 0) {
            const oldTasks = form.getFieldsValue();
            if (!oldTasks)
                return;
            const newTasks = {};
            Object.keys(oldTasks).forEach(key => {
                const oldTask = oldTasks[key];
                newTasks[key] = {
                    ...oldTask,
                    tasks: oldTask?.tasks?.filter(row =>
                        row.id !== taskToProjectId
                    )
                }
            });
            form.setFieldsValue(newTasks); // Обновляем форму с новыми значениями
        }
    }
    const rebuider = (tasks, handleDelete) => {
        const taskMap = {};
        const tree = [];

        if (!tasks || !tasks.length) {
            return;
        }

        // Создаем хэш-таблицу для быстрого доступа к задачам по их ID
        tasks.forEach((task) => {
            const newTask = {
                stage_number: task.stage_number,
                key: task.task.id,
                id: task.task.id,
                title: <Space.Compact direction={"horizontal"}>
                    <Text>{handleDelete && (
                        <Tooltip title={"Удалить задачу"}>
                            <Link onClick={() => handleDelete(task.task.id)} type={"danger"}><DeleteOutlined/></Link>
                        </Tooltip>)} {task.task.name}
                    </Text>

                </Space.Compact>,
                children: []
            };
            taskMap[task.id] = newTask;
        });


        // Строим дерево
        tasks.forEach((task) => {
            if (!task.project_task_inherited_id) {
                tree.push(taskMap[task.id]);
            } else {
                const parentId = task.project_task_inherited_id;
                if (taskMap[parentId]) {
                    taskMap[parentId].children.push(taskMap[task.id]);
                }
            }
        });


        return tree;
    };
    const groupTasksByStageNumber = (tasks) => {
        if (!tasks)
            return null;
        return tasks.reduce((acc, task) => {
            const stageNumber = task.stage_number;
            if (!acc[stageNumber]) {
                acc[stageNumber] = {tasks: []};
            }
            acc[stageNumber].tasks.push(task);
            return acc;
        }, {});
    };

    useEffect(() => {
         if (actualProject.project_tasks.length > 0) {
            setSelectedTasksIds([...actualProject.project_stages.map(row => row.stage.task_id), ...actualProject.project_tasks.map(row => row.task.id ?? row.task_id)]);
             console.log("kgfj ", [...actualProject.project_stages.map(row => row.stage.task_id), ...actualProject.project_tasks.map(row => parseInt(row.task.id ?? row.task_id))]);
            const taskStagesIdsArray = actualProject.project_tasks.filter(row => row.project_task_inherited_id === null).map(row => row.id);
            form.setFieldsValue((groupTasksByStageNumber(
                rebuider(actualProject.project_tasks.filter(row => row.project_task_inherited_id !== null).map(
                    row => {
                        if (
                            (taskStagesIdsArray.includes(row.project_task_inherited_id))) {
                            return ({
                                ...row,
                                project_task_inherited_id: null,
                            })
                        } else {
                            return row
                        }
                    }
                ), handleDeleteTaskToProject))));
        }
    }, [actualProject]);
    useEffect(() => {
        console.log(dataTasks?.tasks?.items?.filter((task) =>
            !selectedTasksIds.includes(parseInt(task.id))))
    }, [selectedTasksIds]);
    const [mutate, {loading: loadingSave}] = useMutation(ADD_TASK_MUTATION, {
        onCompleted: (data) => {
            refetchTasks();
            const rowID = mutate.rowID;
            openNotification('topRight', 'success', `Задача создана`);
            handleSelectTask(rowID, data?.createTask);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при создании задачи: ${error.message}`);
        },
    });


    return (

        <Row gutter={1}>
            <Col span={24}>

                <Form form={form} onChange={() => console.log("onChange")}>
                    {!loadingTasks ?
                        (actualProject?.project_stages?.map((row) => (
                            <Card style={{marginBottom: 5, paddingTop: 0}} title={row?.number + " " + row?.stage?.name}>
                                <Space.Compact style={{width: "100%"}} direction={"vertical"}>
                                    <div style={{width: "100%"}}>
                                        <Form.Item name={[row.number, "tasks"]}>
                                            <TasksTreeComponent draggable/>
                                        </Form.Item>

                                        <Form.Item name={[row.number, "task_adder"]}>
                                            <CustomAutoCompleteAndCreate
                                                size={"small"}
                                                placeholder={"Начните ввод для поиска задачи..."}
                                                loading={loadingTasks}

                                                firstBtnOnClick={() => {
                                                    mutate.rowID = row.number;

                                                    mutate({
                                                        variables: {name: form.getFieldValue([row.number, "task_adder"])?.output ?? ""}
                                                    })
                                                }}
                                                saveSelected={false}
                                                onSelect={(value) => handleSelectTask(row.number, value, handleDeleteTaskToProject)}
                                                data={dataTasks?.tasks?.items?.filter((task) =>
                                                    !selectedTasksIds.includes(parseInt(task.id))
                                                )}
                                            />
                                        </Form.Item>
                                    </div>
                                </Space.Compact>

                            </Card>

                        )))
                        : <Skeleton active/>}
                    <Space style={{justifyContent: "center", width: "100%", marginTop: 10}}>
                        <StyledButtonGreen loading={loadingMutation} onClick={() => handleSubmit()}
                                           icon={<SaveOutlined/>}>Сохранить</StyledButtonGreen>
                    </Space>


                </Form>

            </Col>
        </Row>

    )
        ;

};

export default NewTasksToProjectForm;
