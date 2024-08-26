import React, {useContext, useEffect, useState} from 'react';
import {Card, Col, Divider, Form, Input, Row, Space, Tooltip, Typography} from "antd";
import TasksTreeComponent from "./components/TasksTreeComponent";
import TaskProjectForm from "../ProjectTaskForm/TaskProjectForm";
import TasksPriceTotal from "./components/TasksPriceTotal";
import {NotificationContext} from "../../NotificationProvider";

const {Text} = Typography;


const ProjectTasksManagerForm = ({actualProject, onCompleted}) => {

    //Вынести за компонент
    const [form] = Form.useForm();
    const [checkedTasks, setCheckedTasks] = useState();

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
    const findMainDuration = (checkedTasksId, tasks) => {

        const taskOwner = tasks.find(row => row.id === checkedTasksId);
        const projectTaskInherited = tasks.find(row => row.id === taskOwner?.project_task_inherited_id);

        return projectTaskInherited?.duration ?? 0;
    };
    const rebuider = (tasks) => {
        const taskMap = {};
        const tree = [];

        if (!tasks || !tasks.length) return;

        // Создаем хэш-таблицу для быстрого доступа к задачам по их ID
        tasks.forEach((task) => {
            const newTask = {
                key: task.id,
                id: task.id,
                executor: task.executor,
                name: task.task.name,
                title: <Space>
                    <Space.Compact style={{width: 70}}>
                        <Tooltip title={"Сдвижка*"} children={
                            <Input size={"small"} disabled
                                   value={task.offset}/>
                        }/>
                        <Tooltip title={"продолжительность*"} children={
                            <Input size={"small"} disabled
                                   value={task.duration}/>
                        }/>


                    </Space.Compact>


                    {task.executor ?
                        (<Text style={{color: "green"}}>
                            {task.task.name}
                        </Text>) :
                        (<Text style={{color: "red"}}>
                            {task.task.name}
                        </Text>)}
                </Space>,
                children: []
            };
            taskMap[task.id] = newTask;
        });

        // Функция поиска исполнителя среди родителей
        const hasExecutor = (taskId) => {
            let currentId = taskId;
            while (currentId) {
                const task = taskMap[currentId];
                console.log(task);
                // Проверяем, есть ли у текущей задачи исполнитель
                if (task && task.executor) return true;
                // Переходим к родительской задаче
                currentId = task?.project_task_inherited_id;
            }
            // Если достигли корня и не нашли исполнителя
            return false;
        };

        // Формируем дерево и устанавливаем стили заголовков
        tasks.forEach((task) => {

            if (!task.project_task_inherited_id) {
                tree.push(taskMap[task.id]);
            } else {
                console.log(hasExecutor(task.id))

                if (!hasExecutor(task.id)) {
                    taskMap[task.id].title = (
                        <Space.Compact style={{color: "#faad14"}}>
                            {task.task.name}
                        </Space.Compact>
                    );
                }
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
        <Form form={form} style={{width: 1200}}>
            <Divider>Статистика</Divider>

            <TasksPriceTotal
                projectTasks={actualProject?.project_tasks}
                projectStages={actualProject?.project_stages}
            />

            <Divider>Распределение</Divider>
            <Row gutter={4} style={{width: "100%"}}>
                <Col span={12}>
                    <Card title={"Список задач"}>
                        <Form.Item name={"tasks"}>
                            <TasksTreeComponent
                                onSelect={(value) => {
                                    setCheckedTasks(actualProject?.project_tasks.find(row => value[0] === row.id) ?? null);
                                }}
                            />
                        </Form.Item>
                    </Card>

                </Col>
                <Col span={12}>
                    <TaskProjectForm
                        cardProps={{title: "Параметры задачи"}}
                        onCompleted={onCompleted}
                        durationLock={!checkedTasks?.project_task_inherited_id}
                        limitDuration={findMainDuration(checkedTasks?.id, actualProject.project_tasks)}
                        mainTaskToProject={
                            checkedTasks &&
                            !isTaskExclusivity(checkedTasks?.id, actualProject.project_tasks) &&
                            findMainTask(checkedTasks?.id, actualProject.project_tasks)}
                        taskToProject={checkedTasks}
                    />
                </Col>
            </Row>
        </Form>

    )
        ;

};

export default ProjectTasksManagerForm;
