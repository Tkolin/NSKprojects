import React, {useEffect, useState} from 'react';
import {Col, Divider, Form, Radio, Row} from "antd";
import TaskForm from "../../../../components/form/modelsForms/TaskForm";
import TasksTreeComponent from "./TasksTreeComponent";
import {StyledFormItemAutoCompleteAndCreateWitchEdit} from "../../../../components/style/SearchAutoCompleteStyles";
import {useQuery} from "@apollo/client";
import {LEGAL_FORM_QUERY_COMPACT, TASKS_QUERY_COMPACT} from "../../../../graphql/queriesCompact";
import LoadingSpinnerStyles from "../../../../components/style/LoadingSpinnerStyles";
import {colors} from "../../../../components/style/colors";
import StageRadioComponent from "./StageRadioComponent";


const TasksToProjectForm = ({actualTasks, updateTasks, actualProject}) => {

    //Вынести за компонент
    const actualStages = [
        {
            id: 1,
            name: "этап 1",
            number: 1,
        }, {
            id: 2,
            name: "этап 2",
            number: 2,

        }, {
            id: 3,
            name: "этап 3",
            number: 3,

        }, {
            id: 4,
            name: "этап 4",
            number: 4,
        },
    ]


    const [form] = Form.useForm();
    const [stageNumber, setStageNumber] = useState()


    // Обновление при наличии tasks
    useEffect(() => {

    }, [actualTasks]);
    // калбек для изменений
    const formUpdate = () => {

    }
    // Список задач
    const {
        loading: loadingTasks, error: errorTasks,
        data: dataTasks
    } = useQuery(TASKS_QUERY_COMPACT);
    const [tasksAutoComplete, setTasksAutoComplete] = useState({options: [], selected: {}});
    const [tasksModalStatus, setTasksModalStatus] = useState(null);


    // Синхронизация компонентов
    useEffect(() => {
        if (tasksAutoComplete?.selected > 0) {
            const oldTasks = form.getFieldValue("tasks")
            const newTask = tasksAutoComplete;
            console.log("oldTasks ", oldTasks, " newTask", newTask)
            form.setFieldValue("tasks", {
                ...oldTasks,
                gData: [...oldTasks?.gData ?? [], {
                    title: newTask.options.find(row => row.data === newTask.selected).label,
                    key: newTask.selected
                }]
            })
        }
    }, [tasksAutoComplete?.selected]);
    const handleStageChange = (value) => {
        form.setFieldValue("stage_radio", value)
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
                <Form form={form}>
                    <Divider>Список этапов</Divider>
                    <Form.Item name={"stage_radio"}>
                        <StageRadioComponent
                            actualStages={actualStages}
                            onChange={(value) => setStageNumber(value?.number)}
                        />
                    </Form.Item>

                    <Divider>Структура задач</Divider>

                    <Form.Item name={"tasks"}>
                        <TasksTreeComponent
                            stageNumber={stageNumber }
                            onChange={(value) => {
                                console.log("TasksTreeComponent",value);
                                //updateTasks(checkedKeys, selectedKeys, gData);
                            }}/>
                    </Form.Item>


                    <StyledFormItemAutoCompleteAndCreateWitchEdit
                        formName={"director_name"}
                        formLabel={"Добавить задачу"}
                        placeholder={"Начните ввод..."}
                        loading={loadingTasks}
                        firstBtnOnClick={() => setTasksModalStatus("add")}
                        secondBtnOnClick={() => setTasksModalStatus("edit")}

                         data={dataTasks?.tasks?.items}
                        stateSearch={tasksAutoComplete}
                        setStateSearch={setTasksAutoComplete}
                    />
                </Form>

            </Col>
        </Row>

    )
        ;

};

export default TasksToProjectForm;
