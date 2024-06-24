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
    // const rebuider = (tasks) => {
    //     const taskMap = {};
    //     let tree = {};
    //
    //     // Создаем хэш-таблицу для быстрого доступа к задачам по их ID
    //     tasks.forEach((task) => {
    //         const newTask = {
    //             key: task.id,
    //             id: task.id,
    //             stage_number: task.stage_number,
    //             title: task.id + ":" + task.task.name,
    //             children: []
    //         };
    //         taskMap[task.id] = newTask;
    //     });
    //
    //     // Строим дерево
    //     tasks.forEach((task) => {
    //         if (task.inherited_task_ids.length === 0) {
    //             console.log("1");
    //             const ftask = taskMap[task.id];
    //             tree = {...tree ?? null, [ftask.stage_number]: [...tree[ftask?.stage_number] ?? [], ftask]};
    //         } else {
    //             console.log("2");
    //             task.inherited_task_ids.forEach((inheritedTask) => {
    //                 const parentId = inheritedTask.project_inherited_task_id;
    //                 if (taskMap[parentId]) {
    //                     taskMap[parentId].children.push(taskMap[task.id]);
    //                 }
    //             });
    //         }
    //     });
    // }
    //
    // const flattenChildren = (obj) => {
    //     const result = {};
    //     Object.keys(obj).forEach((key) => {
    //         result[key] = obj[key].reduce((acc, cur) => {
    //             acc[cur.key] = cur;
    //             return acc;
    //         }, {});
    //     });
    //     return result;
    // };
    useEffect(() => {
    }, [actualProject]);
    if (loadingTasks)
        return <LoadingSpinnerStyles/>

    return (
        <Row gutter={1}>
            <Col span={24}>
                <Divider>Создание новой задачи</Divider>
                <TaskForm onCompleted={()=>refetchTasks()}/>
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
                                    <CustomAutoComplete
                                        placeholder={"Начните ввод..."}
                                        loading={loadingTasks}
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
