import React, {useEffect, useState} from 'react';
import {Button, Col, Divider, Form, Row, Typography} from "antd";
import TasksTreeComponent from "./TasksTreeComponent";
import TaskProjectForm from "./TaskProjectForm";
import {nanoid} from "nanoid";

const {Text} = Typography;


const EmployeeToTasksForm = ({actualProject, setLoading, onChange}) => {

    //Вынести за компонен
    const [form] = Form.useForm();
    const [checkedTasksId, setCheckedTasksId] = useState([]);
    useEffect(() => {
        console.log(".checkedTasks",checkedTasksId);
    }, [checkedTasksId]);
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
                title: task.id + ":" + task.task.name,
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
        if (actualProject && actualProject?.project_tasks) {
            rebuider(actualProject?.project_tasks)
            form.setFieldValue("tasks", rebuider(actualProject?.project_tasks))
        }
    }, [actualProject]);


    return (
        <Form form={form} style={{width: "100%"}} onChange={() => console.log("onChange")}>
            <Row gutter={4}>

                <Col span={8}>
                    {/*<Button onClick={() => actualProject && console.log("actualProject", actualProject)}>*/}
                    {/*    Проверить проект*/}
                    {/*</Button>*/}
                    {/*<Button onClick={() => form.setFieldValue("tasks", rebuider(actualProject?.project_tasks))}>*/}
                    {/*    Перегрузка*/}
                    {/*</Button>*/}
                    <Divider>Список задач</Divider>
                    <Form.Item name={"tasks"}>
                        <TasksTreeComponent
                            checkable
                            selectable={true}
                            onCheck={(value) => {
                                setCheckedTasksId(value ?? null)
                            }}
                        />
                    </Form.Item>
                </Col>
                <Col span={16}>
                    <Divider>Распределение</Divider>
                     <TaskProjectForm
                         onChange={()=>onChange && onChange()}
                        actualTaskToProject={checkedTasksId ? actualProject?.project_tasks.filter(row => checkedTasksId.includes(row.id)) : null}/>
                    {/*<StyledButtonGreen onClick={() => onSave()}>*/}
                    {/*    Сохранить*/}
                    {/*</StyledButtonGreen>*/}
                </Col>
            </Row>
        </Form>

    )
        ;

};

export default EmployeeToTasksForm;
