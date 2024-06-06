import React, {useEffect, useState} from 'react';
import {Button, Col, Divider, Form, Radio, Row} from "antd";
import TaskForm from "../../../../components/form/modelsForms/TaskForm";
import TasksTreeComponent from "./TasksTreeComponent";
import {CustomAutoCompleteAndCreateWitchEdit} from "../../../../components/style/SearchAutoCompleteStyles";
import {useMutation, useQuery} from "@apollo/client";
import {TASKS_QUERY_COMPACT} from "../../../../graphql/queriesCompact";
import LoadingSpinnerStyles from "../../../../components/style/LoadingSpinnerStyles";
import StageRadioComponent from "./StageRadioComponent";
import styled, {css} from "styled-components";


const TasksToProjectForm = ({actualTasks, updateTasks, actualProject, setLoading}) => {
    //Вынести за компонен
    const [formLoad, setFormLoad] = useState(false);
    const [firstField, setFirstField] = useState(true);
    const [form] = Form.useForm();
    const [selectedStage, setSelectedStage] = useState()
    const [tasksModalStatus, setTasksModalStatus] = useState({options: [], selected: {}});
    const [localData, setLocalData] = useState()
    // Список задач
    const {
        loading: loadingTasks, error: errorTasks,
        data: dataTasks
    } = useQuery(TASKS_QUERY_COMPACT);
    useEffect(() => {
        setFormLoad(true)
    }, []);
    useEffect(() => {
        if (actualTasks && actualTasks.gData && actualTasks.checkedKeys && firstField) {
            setFirstField(false)
            console.log("setFirstFiel",actualTasks);
            form.setFieldValue("tasks", actualTasks)
         }
    }, [actualTasks]);
    const handleChange = () => {
        if (formLoad) {
            const value = form.getFieldValue("tasks");
            if (value?.gData && value?.checkedKeys && actualProject?.id){
                setLocalData(value);
                console.log(value);
                updateTasks && updateTasks(rebuildFormDataToOutput(value?.gData, value?.checkedKeys, actualProject?.id));
            }
        }
    }
    const rebuildFormDataToOutput = (treeTasksInForm, listStageNumbersStageInForm, projectId) => {
        const result = [];
        console.log("start rebuildFormDataToOutput", treeTasksInForm, listStageNumbersStageInForm, projectId);
        if (projectId, treeTasksInForm, listStageNumbersStageInForm) {
            console.error("проекта нет для задачи ");
        }
        const processNode = (node, parentKey = null) => {
            const task = {
                projectId: projectId,
                task_id: node.key.toString(),
            };

            if (parentKey) {
                task.inherited_task_ids = [parentKey.toString()];
            }

            result.push(task);
            if (node.children) {
                node.children.forEach(child => processNode(child, task.task_id)); // Обновленный вызов с передачей node.key
            }
        };
        console.log("processNode",result);
        treeTasksInForm.forEach(node => processNode(node));
        result.forEach(task => {
            for (const [stageNumber, taskIds] of Object.entries(listStageNumbersStageInForm)) {
                if (taskIds.includes(task.task_id)) {
                    task.stage_number = parseInt(stageNumber);
                    break;
                }
            }
        });

        return result;
    };


    const handleSelectTask = (value) => {
        if (value?.id > 0) {
            const oldTasks = form.getFieldValue("tasks")

            form.setFieldValue("tasks", {
                ...oldTasks,
                gData: [...oldTasks?.gData ?? [], {
                    title: value.name,
                    key: value.id
                }]
            })
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
                    <Form.Item name={"stage_radio"}>
                        <StageRadioComponent
                            actualStages={actualProject?.project_stages?.map((row) => ({
                                    id: row.id,
                                    name: row?.stage?.name,
                                    number: row?.number
                                }

                            ))}
                            onChange={(value) => setSelectedStage(value?.number)}
                        />
                    </Form.Item>

                    <Divider>Структура задач</Divider>

                    <Form.Item name={"tasks"}>
                        <TasksTreeComponent
                            stageNumber={selectedStage}
                            value={actualTasks}

                            onChange={(value) => {
                                console.log("TasksTreeComponent", value);
                                handleChange()
                            }}/>
                    </Form.Item>

                    <Form.Item name={"task"} label={"Добавить задачу"}>
                        <CustomAutoCompleteAndCreateWitchEdit
                            placeholder={"Начните ввод..."}
                            loading={loadingTasks}
                            firstBtnOnClick={() => setTasksModalStatus("add")}
                            secondBtnOnClick={() => setTasksModalStatus("edit")}
                            onSelect={(value) => handleSelectTask(value)}

                            data={dataTasks?.tasks?.items}
                        />
                    </Form.Item>
                </Form>

            </Col>
        </Row>

    )
        ;

};

export default TasksToProjectForm;
