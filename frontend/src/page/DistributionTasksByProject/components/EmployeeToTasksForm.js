import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, Col, Divider, Form, Row, Space, Typography} from "antd";
import TasksTreeComponent from "./TasksTreeComponent";
import TaskProjectForm from "./TaskProjectForm";
import TasksPriceTotal from "./TasksPriceTotal";
import {nanoid} from "nanoid";
import {NotificationContext} from "../../../NotificationProvider";

const {Text} = Typography;


const EmployeeToTasksForm = ({actualProject, setLoading, onCompleted}) => {

    //Вынести за компонент
    const [form] = Form.useForm();
    const [checkedTasksId, setCheckedTasksId] = useState();

    const {openNotification} = useContext(NotificationContext);

    const isTaskExclusivity = (taskId, projectTasks) => {
        if (!taskId && !projectTasks) return false;
        const startTask = projectTasks.find(row => row.id === taskId);

        if (startTask?.executor?.id) return true;
        return false;
    }
    const findMainTask = (taskId, projectTasks) => {
        if (!taskId && !projectTasks) return;
        const startTask = projectTasks.find(row => row.id === taskId);
        if (!startTask) return;
        if (!startTask.project_task_inherited_id) {
            console.log("!startTask.project_task_inherited_id: ", !startTask.project_task_inherited_id);
            return null;
        }
        const transparent = (task) => {
            const inheritedTask = projectTasks.find(row => row.id === task.project_task_inherited_id);
            if (!inheritedTask) {
                return task?.executor?.id ? task : null;
            } else {
                return transparent(inheritedTask);
            }
        }
        return transparent(startTask);
    }

    const rebuider = (tasks) => {
        const taskMap = {};
        const tree = [];

        if (!tasks || !tasks.length)
            return;

        // Создаем хэш-таблицу для быстрого доступа к задачам по их ID
        tasks.forEach((task) => {
            const newTask = {
                key: task.id,
                id: task.id,
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


    useEffect(() => {
        if (actualProject && actualProject?.project_tasks) {
            form.setFieldValue("tasks", rebuider(actualProject?.project_tasks))
        }
    }, [actualProject]);


    return (
        <Form form={form} style={{width: "100%"}}>
            <Divider>Статистика</Divider>

                <TasksPriceTotal
                    projectTasks={actualProject?.project_tasks}
                    projectStages={actualProject?.project_stages}
                />

            <Divider>Распределение</Divider>
            <Row gutter={4}>
                <Col span={10}>
                    <Card title={"Список задач"}>
                        <Form.Item name={"tasks"}>
                            <TasksTreeComponent
                                onSelect={(value) => {
                                    setCheckedTasksId(value[0] ?? null)
                                }}
                            />
                        </Form.Item>
                    </Card>

                </Col>
                <Col span={14}>
                    <Card title={"Параметры"}>
                        <TaskProjectForm
                            onCompleted={onCompleted}
                            mainTaskToProject={
                                checkedTasksId &&
                                !isTaskExclusivity(checkedTasksId, actualProject.project_tasks) &&
                                findMainTask(checkedTasksId, actualProject.project_tasks)}
                            taskToProject={checkedTasksId ? actualProject?.project_tasks.find(row => checkedTasksId === row.id) : null}
                        />
                    </Card>
                </Col>
            </Row>
        </Form>

    )
        ;

};

export default EmployeeToTasksForm;
