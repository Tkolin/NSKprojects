import React, {useContext, useEffect, useState} from 'react';
import {Col, Divider, Form, Row, Space, Typography} from "antd";
import TaskForm from "../../components/form/modelsForms/TaskForm";
import TasksTreeComponent from "./TasksTreeComponent";
import {
    CustomAutoComplete,
    CustomAutoCompleteAndCreateWitchEdit
} from "../../components/style/SearchAutoCompleteStyles";
import {useMutation, useQuery} from "@apollo/client";
import {TASKS_QUERY_COMPACT} from "../../../graphql/queriesCompact";
import LoadingSpinnerStyles from "../../components/style/LoadingSpinnerStyles";
import {StyledButtonGreen} from "../../components/style/ButtonStyles";
import {CREATE_TASKS_TO_PROJECT} from "../../../graphql/mutationsTask";
import {NotificationContext} from "../../../NotificationProvider";


const {Text} = Typography;

const NewTasksToProjectForm = ({actualProject, setLoading}) => {
    //Вынести за компонен
    const [form] = Form.useForm();
    const [tasksModalStatus, setTasksModalStatus] = useState({options: [], selected: {}});
    const {openNotification} = useContext(NotificationContext);

    // Список задач
    const {
        loading: loadingTasks, error: errorTasks,
        data: dataTasks, refetch: refetchTasks
    } = useQuery(TASKS_QUERY_COMPACT);


    const extractKeys = (tasks) => {
        const result = [];

        const transfer = (task, parent = null) => {
            const newTask = {
                task_id: task.key,
                inherited: parent,
            };
            result.push(newTask);

            if (task.children) {
                task.children.forEach((child) => transfer(child, task.key));
            }
        };

        tasks.forEach((task) => {
            transfer(task);
        });

        console.log("formTasks", result);
        return result;
    };
    const [mutateTasksToProject, {loading: loadingMutation}] = useMutation(CREATE_TASKS_TO_PROJECT, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Создание новой записи в таблице контакт выполнено успешно`);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при выполнении сооздания контакта: ${error.message}`);

        }
    });
    const handleSubmit = () => {
        mutateTasksToProject({
            variables: {
                data:
                    extractKeys(form.getFieldValue("tasks"), actualProject)
            }
        })


    }
    const handleSelectTask = (value) => {
        if (value?.id > 0) {
            const oldTasks = form.getFieldValue("tasks");

            form.setFieldValue("tasks", [
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
                key: task.id,
                id: task.id,
                disabled: task?.inherited_task_ids?.length === 0,
                title: task?.inherited_task_ids?.length === 0 ? ("Этап " + task.stage_number + " :" + task.task.name) : task.task.name,
                children: []
            };
            taskMap[task.id] = newTask;
        });

        // Строим дерево
        tasks.forEach((task) => {
            if (task?.inherited_task_ids?.length === 0) {
                tree.push(taskMap[task.id]);
            } else {
                task?.inherited_task_ids?.forEach((inheritedTask) => {
                    const parentId = inheritedTask.project_inherited_task_id;
                    if (taskMap[parentId]) {
                        taskMap[parentId].children.push(taskMap[task.id]);
                    }
                });
            }
        });
        return tree;
    }

    useEffect(() => {
        if (actualProject?.project_tasks)
            form.setFieldValue("tasks", rebuider(actualProject?.project_tasks));
    }, [actualProject]);
    if (loadingTasks)
        return <LoadingSpinnerStyles/>

    return (
        <Row gutter={1}>
            <Col span={24}>
                <Form form={form} onChange={() => console.log("onChange")}>
                    <Divider>Список задач</Divider>

                    <Space.Compact style={{width: "100%"}} direction={"vertical"}>

                        <div style={{width: "100%"}}>
                            <Form.Item name={"tasks"}>
                                <TasksTreeComponent draggable/>
                            </Form.Item>

                            <Form.Item name={"task_adder"} label={"Добавить задачу к списку"}>
                                <CustomAutoComplete
                                    placeholder={"Начните ввод..."}
                                    loading={loadingTasks}
                                    saveSelected={false}
                                    onSelect={(value) => handleSelectTask(value)}
                                    data={dataTasks?.tasks?.items.filter((task) =>
                                        !actualProject.project_stages.flatMap(stage => stage.stage.task_id).includes(parseInt(task.id))
                                    )}
                                />
                            </Form.Item>
                        </div>
                    </Space.Compact>
                    <div style={{alignContent: "center", width: "100%"}}>
                        {/*<StyledButtonGreen onClick={() => {*/}
                        {/*    console.log("1",*/}
                        {/*        form.getFieldsValue());*/}
                        {/*    console.log("2", rebuider(actualProject.project_tasks));*/}
                        {/*}}>*/}
                        {/*    Извлеч*/}
                        {/*</StyledButtonGreen> */}
                        <StyledButtonGreen
                            onClick={() =>
                                handleSubmit()}>
                            Сохранить
                        </StyledButtonGreen>
                    </div>
                </Form>

            </Col>
        </Row>

    )
        ;

};

export default NewTasksToProjectForm;
