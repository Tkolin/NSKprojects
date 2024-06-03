import React, {useEffect, useState} from 'react';
import {Button, Col, Divider, Form, Radio, Row} from "antd";
import TaskForm from "../../../../components/form/modelsForms/TaskForm";
import TasksTreeComponent from "./TasksTreeComponent";
import {CustomAutoCompleteAndCreateWitchEdit} from "../../../../components/style/SearchAutoCompleteStyles";
import {useMutation, useQuery} from "@apollo/client";
import {TASKS_QUERY_COMPACT} from "../../../../graphql/queriesCompact";
import LoadingSpinnerStyles from "../../../../components/style/LoadingSpinnerStyles";
import StageRadioComponent from "./StageRadioComponent";
import {UPDATE_TASK_TO_PROJECT_MUTATION} from "../../../../graphql/mutationsTask";


const TasksToProjectForm = ({actualTasks, updateTasks, actualProject}) => {

    //Вынести за компонен
    const [formLoad, setFormLoad] = useState(false);
    const [form] = Form.useForm();
    const [stageNumber, setStageNumber] = useState()

    useEffect(() => {
        setFormLoad(true)
    }, []);
    useEffect(() => {
        if(actualTasks){
            form.setFieldValue("tasks", actualTasks)
        }
    }, [actualTasks]);
    const handleChange = () => {
        if (formLoad) {
            const value = form.getFieldValue("tasks");
            if (value)
                updateTasks(value);
        }
    }
    // Список задач
    const {
        loading: loadingTasks, error: errorTasks,
        data: dataTasks
    } = useQuery(TASKS_QUERY_COMPACT);
    const [tasksModalStatus, setTasksModalStatus] = useState({options: [], selected: {}});
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
                            actualStages={actualProject?.project_stage ?? [{id: 1, name: "s", number: 1}, {
                                id: 2,
                                name: "ss",
                                number: 2
                            }, {id: 3, name: "sss", number: 3}, {id: 4, name: "ssss", number: 4},]}
                            onChange={(value) => setStageNumber(value?.number)}
                        />
                    </Form.Item>

                    <Divider>Структура задач</Divider>

                    <Form.Item name={"tasks"}>
                        <TasksTreeComponent
                            stageNumber={stageNumber}
                            value={actualTasks}
                            onChange={(value) => {

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
