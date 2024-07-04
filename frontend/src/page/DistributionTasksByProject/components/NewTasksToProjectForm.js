import React, {useContext, useEffect, useState} from 'react';
import {Card, Col, Divider, Form, Row, Space, Typography} from "antd";
import TaskForm from "../../components/form/modelsForms/TaskForm";
import TasksTreeComponent from "./TasksTreeComponent";
import {
    CustomAutoComplete, CustomAutoCompleteAndCreate,
    CustomAutoCompleteAndCreateWitchEdit
} from "../../components/style/SearchAutoCompleteStyles";
import {useMutation, useQuery} from "@apollo/client";
import {TASKS_QUERY_COMPACT} from "../../../graphql/queriesCompact";
import LoadingSpinnerStyles from "../../components/style/LoadingSpinnerStyles";
import {StyledButtonGreen} from "../../components/style/ButtonStyles";
import {ADD_TASK_MUTATION, CREATE_TASKS_TO_PROJECT, UPDATE_TASK_MUTATION} from "../../../graphql/mutationsTask";
import {NotificationContext} from "../../../NotificationProvider";
import {PlusOutlined, SaveOutlined} from "@ant-design/icons";


const {Text} = Typography;

const NewTasksToProjectForm = ({actualProject, setLoading}) => {
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

        // Создание задач из этапов проекта
        projectStages.forEach(stage => {
            const task = {
                project_id: project.id,
                task_id: stage?.stage?.task_id?.toString(),
                stage_number: stage.number,
                date_start: stage.date_start,
                date_end: stage.date_end,
                project_task_inherited_id: null,
            };
            result.push(task);
        });

        const traverse = (nodes, stageNumber, parentKey = null) => {
            nodes.forEach(node => {
                let task = {
                    project_id: project.id,
                    task_id: node.key,
                    stage_number: stageNumber,
                    project_task_inherited_id: parentKey || result.find(t => t.stage_number === stageNumber)?.task_id || null,
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
    const [mutateTasksToProject, {loading: loadingMutation}] = useMutation(CREATE_TASKS_TO_PROJECT, {
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
    const handleSelectTask = (index, value) => {
        if (value?.id > 0) {
            setSelectedTasksIds([...selectedTasksIds, parseInt(value.id)]);
            const oldTasks = form.getFieldValue([index, "tasks"]);

            form.setFieldValue([index, "tasks"], [
                ...oldTasks ?? [],
                {
                    title: value.name,
                    key: value.id
                }
            ])
        }
    }

    const rebuider = (tasks) => {
        const taskMap = {};
        const tree = [];

        if (!tasks || !tasks.length) {
            console.error('Tasks data is null or empty.');
            return;
        }

        // Создаем хэш-таблицу для быстрого доступа к задачам по их ID
        tasks.forEach((task) => {
            const newTask = {
                stage_number: task.stage_number,
                key: task.task.id,
                id: task.task.id,
                title: task.id + ":" + task.task.name,
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
        if(!tasks)
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
        setSelectedTasksIds(actualProject.project_stages.map(row => row.stage.task_id));

        if (actualProject.project_tasks.length > 0) {
            setSelectedTasksIds([...selectedTasksIds, ...actualProject.project_tasks.map(row => row.task_id)])
            const taskStagesIdsArray = actualProject.project_tasks.filter(row => row.project_task_inherited_id === null).map(row => row.id);


            form.setFieldsValue((groupTasksByStageNumber(rebuider(actualProject.project_tasks.filter(row => row.project_task_inherited_id !== null).map(
                row => {
                    console.log(taskStagesIdsArray, " + ", row.project_task_inherited_id, " = ", taskStagesIdsArray.includes(row.project_task_inherited_id));
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
            )))));
        }
    }, [actualProject]);
    const [mutate, {loading: loadingSave}] = useMutation(ADD_TASK_MUTATION, {
        onCompleted: (data) => {
            refetchTasks();
            const rowID = mutate.rowID;
            console.log('rowID', rowID, "data", data);
            openNotification('topRight', 'success', `Задача создана`);
            handleSelectTask(rowID, data?.createTask);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при создании задачи: ${error.message}`);
        },
    });
    if (loadingTasks)
        return <LoadingSpinnerStyles/>

    return (
        <Row gutter={1}>
            <Col span={24}>

                <Form form={form} onChange={() => console.log("onChange")}>
                    {actualProject?.project_stages?.map((row) => (
                        <Card style={{marginBottom: 5, paddingTop: 0}} title={row?.number + " " + row?.stage?.name}>
                            <Space.Compact style={{width: "100%"}} direction={"vertical"}>
                                <div style={{width: "100%"}}>
                                    <Form.Item name={[row.number, "tasks"]}>
                                        <TasksTreeComponent draggable/>
                                    </Form.Item>

                                    <Form.Item name={[row.number, "task_adder"]}>
                                        <CustomAutoCompleteAndCreate
                                            size={"small"}
                                            placeholder={"Начните ввод для поиска этапа..."}
                                            loading={loadingTasks}

                                            firstBtnOnClick={() => {
                                                mutate.rowID = row.number;

                                                mutate({
                                                    variables: {name: form.getFieldValue([row.number, "task_adder"])?.output ?? ""}
                                                })
                                            }}
                                            saveSelected={false}
                                            onSelect={(value) => handleSelectTask(row.number, value)}
                                            data={dataTasks?.tasks?.items.filter((task) =>
                                                !selectedTasksIds.includes(parseInt(task.id))
                                            )}
                                        />
                                    </Form.Item>
                                </div>
                            </Space.Compact>

                        </Card>

                    ))}
                    <Space style={{justifyContent: "center", width: "100%", marginTop: 10}}>
                        <StyledButtonGreen onClick={() => handleSubmit()} icon={<SaveOutlined/>}>Сохранить</StyledButtonGreen>
                    </Space>


                </Form>

            </Col>
        </Row>

    )
        ;

};

export default NewTasksToProjectForm;
