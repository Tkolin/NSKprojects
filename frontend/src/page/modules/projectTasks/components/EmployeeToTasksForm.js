import React, {useEffect, useState} from 'react';
import {Col, Divider, Form, Row} from "antd";
import TaskForm from "../../../../components/form/modelsForms/TaskForm";
import TasksTreeComponent from "./TasksTreeComponent";
import {CustomAutoCompleteAndCreateWitchEdit} from "../../../../components/style/SearchAutoCompleteStyles";
import {useQuery} from "@apollo/client";
import {TASKS_QUERY_COMPACT} from "../../../../graphql/queriesCompact";
import LoadingSpinnerStyles from "../../../../components/style/LoadingSpinnerStyles";
import StageRadioComponent from "./StageRadioComponent";
import TasksToProjectForm from "./TasksToProjectForm";
import TaskProjectForm from "./TaskProjectForm";
import styled, {css} from "styled-components";
import {StyledButtonGreen} from "../../../../components/style/ButtonStyles";


const EmployeeToTasksForm = ({actualTasks, updateTasks, actualProject, setLoading}) => {

    //Вынести за компонен
    const [formLoad, setFormLoad] = useState(false);
    const [form] = Form.useForm();
    const [stageNumber, setStageNumber] = useState()
    const [selectedTaskTree, setSelectedTaskTree] = useState(true);

    useEffect(() => {
        console.log("setSelectedTaskTree", selectedTaskTree);
    }, [selectedTaskTree]);
    useEffect(() => {
        setFormLoad(true)
    }, []);
    useEffect(() => {
        if (actualTasks) {
            console.log("newActualTasksetfield", actualTasks)
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
            console.log("handleSelectTask", value);
        }
    }
    const onSave = () => {
        console.log("onSave", form.getFieldValue());
    }
    if (loadingTasks)
        return <LoadingSpinnerStyles/>

    return (
        <Form form={form} style={{width: "100%"}} onChange={() => console.log("onChange")}>
            <Row gutter={4}>
                <Col span={6}>
                    <Divider>Пулл сотрудников</Divider>
                    <TaskForm/>
                </Col>
                <Col span={6}>
                    <Divider>Список задач</Divider>
                    <Form.Item name={"tasks"}>
                        <TasksTreeComponent
                            onSelect={(value) => setSelectedTaskTree( value)}
                            selectable={true}
                            stageNumber={stageNumber}
                            value={actualTasks}
                            mode={"selector"}
                            onSelected={(value) => {
                                handleSelectTask(value)
                            }}/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Divider>Распределение</Divider>
                    <TaskProjectForm task={{id: selectedTaskTree}}/>
                    <StyledButtonGreen onClick={() => onSave()}>
                        Сохранить
                    </StyledButtonGreen>
                </Col>
            </Row>
        </Form>

    )
        ;

};

export default EmployeeToTasksForm;
