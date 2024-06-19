import React, {useContext, useState} from 'react';
import {Col, Divider, Form, notification, Row, Space, Typography} from "antd";
import TaskForm from "../../components/form/modelsForms/TaskForm";
import TasksTreeComponent from "./TasksTreeComponent";
import {CustomAutoCompleteAndCreateWitchEdit} from "../../components/style/SearchAutoCompleteStyles";
import {useMutation, useQuery} from "@apollo/client";
import {TASKS_QUERY_COMPACT} from "../../../graphql/queriesCompact";
import LoadingSpinnerStyles from "../../components/style/LoadingSpinnerStyles";
import {StyledButtonGreen} from "../../components/style/ButtonStyles";
import {CREATE_TASKS_TO_PROJECT} from "../../../graphql/mutationsTask";
import {NotificationContext} from "../../../NotificationProvider";
import dayjs from "dayjs";

const {Text} = Typography;

const TasksToProjectForm = ({actualProject, setLoading}) => {
    //Вынести за компонен
    const [form] = Form.useForm();
    const [tasksModalStatus, setTasksModalStatus] = useState({options: [], selected: {}});
    const {openNotification} = useContext(NotificationContext);

    // Список задач
    const {
        loading: loadingTasks, error: errorTasks,
        data: dataTasks
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
                inherited_from_task_id: null,
            };
            result.push(task);
        });

        const traverse = (nodes, stageNumber, parentKey = null) => {
            nodes.forEach(node => {
                const task = {
                    project_id: project.id,
                    task_id: node.key,
                    stage_number: stageNumber,
                    inherited_from_task_id: parentKey || result.find(t => t.stage_number === stageNumber)?.task_id || null
                };
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
                    extractKeys(Object.entries(form.getFieldsValue()).reduce((acc, [stageNumber, stageData]) => {
                        acc[stageNumber] = stageData.tasks || [];
                        return acc;
                    }, {}), actualProject)
            }
        })

    }
    const handleSelectTask = (index, value) => {
        if (value?.id > 0) {
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

    if (loadingTasks)
        return <LoadingSpinnerStyles/>

    return (
        <Row gutter={1}>
            <Col span={6}>
                <Divider>Создание новой задачи</Divider>
                <TaskForm/>
            </Col>
            <Col span={18}>
                <Form form={form} onChange={() => console.log("onChange")}>
                    <Divider>Список этапов</Divider>
                    {actualProject?.project_stages?.map((row) => (
                        <Space.Compact style={{width: "100%"}} direction={"vertical"}>
                            <div style={{width: "100%"}}>
                                <Typography.Title level={4}>
                                    {row?.number ?? "s"}. {row?.stage?.name}. {row?.stage?.task_id}
                                </Typography.Title>
                            </div>
                            <div style={{width: "100%"}}>
                                <Form.Item name={[row.number, "tasks"]}>
                                    <TasksTreeComponent draggable/>
                                </Form.Item>

                                <Form.Item name={[row.number, "task_adder"]} label={"Добавить задачу"}>
                                    <CustomAutoCompleteAndCreateWitchEdit
                                        placeholder={"Начните ввод..."}

                                        loading={loadingTasks}
                                        firstBtnOnClick={() => setTasksModalStatus("add")}
                                        secondBtnOnClick={() => setTasksModalStatus("edit")}
                                        saveSelected={false}
                                        onSelect={(value) => handleSelectTask(row.number, value)}
                                        data={dataTasks?.tasks?.items.filter((task) =>
                                            !actualProject.project_stages.flatMap(stage => stage.stage.task_id).includes(parseInt(task.id))
                                        )}
                                    />
                                </Form.Item>
                            </div>
                            <div style={{width: "100%"}}>
                                <Divider/>
                            </div>
                        </Space.Compact>
                    ))}
                    <div style={{alignContent: "center", width: "100%"}}>
                        <StyledButtonGreen onClick={() => {
                            handleSubmit();


                        }}>
                            Извлечь
                        </StyledButtonGreen>
                    </div>
                </Form>

            </Col>
        </Row>

    )
        ;

};

export default TasksToProjectForm;
