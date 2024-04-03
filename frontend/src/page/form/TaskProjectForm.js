import React, {useEffect, useState} from 'react';
import {Button, Divider, Form, InputNumber, Modal, notification, Space, Tooltip} from 'antd';
import {useMutation, useQuery} from '@apollo/client';
import {
    PERSONS_QUERY, TASKS_QUERY,
    TASKS_TO_PROJECT_QUERY
} from '../../graphql/queries';
import {
    ADD_TASK_TO_PROJECT_MUTATION,
    UPDATE_TASK_TO_PROJECT_MUTATION
} from '../../graphql/mutationsTask';

import {StyledFormItem, StyledFormRegular} from '../style/FormStyles';
import {StyledButtonGreen} from "../style/ButtonStyles";
import PersonForm from "./basicForm/PersonForm";
import TaskForm from "./simpleForm/TaskForm";
import {

    StyledFormItemSelectAndCreateWitchEdit
} from "../style/SelectStyles";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {DatePicker} from "antd/lib";
import moment from "moment";
import FormItem from "antd/es/form/FormItem";

const {RangePicker} = DatePicker;

const TaskProjectForm = ({tasksProject, onClose}) => {
    // Состояния
    const [editingTasks, setEditingTasks] = useState(null);
    const [form] = Form.useForm();
    const [,] = notification.useNotification();
    const [autoCompleteTask, setAutoCompleteTask] = useState('');
    const [autoCompletePerson, setAutoCompletePerson] = useState('');
    const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
    const [addPersonModalVisible, setAddPersonModalVisible] = useState(false);
    const [editTaskModalVisible, setEditTaskModalVisible] = useState(false);
    const [editPersonModalVisible, setEditPersonModalVisible] = useState(false);

    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedPerson, setSelectedPerson] = useState(null);

    // События
    const handleAutoCompleteTask = (value) => {
        setAutoCompleteTask(value);
    };
    const handleSelectedTask = (value) => {
        setSelectedTask(value);
        handleAutoCompleteTask('');
    };
    const handleAutoCompletePerson = (value) => {
        setAutoCompleteTask(value);
    };
    const handleSelectedPerson = (value) => {
        setSelectedPerson(value);
        handleAutoCompletePerson('');
    };
    const handleCloseModalFormView = () => {
        refetchPersons();
        refetchTasks();
        setAddPersonModalVisible(false);
        setAddPersonModalVisible(false);
        setEditTaskModalVisible(false);
        setEditPersonModalVisible(false);
    };

    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };

    // Получение данных для формы
    const {
        loading: loadingTasksProject,
        error: errorTasksProject,
        refetch: refetchTasksProject,
        data: dataTasksProject
    } = useQuery(TASKS_TO_PROJECT_QUERY);
    const [dataTasks, setDataTasks] = useState();
    const addingDataTasks = (newData) => {
        // if (!dataStages || !value) return;
        // const newStages = value.map(a => ({
        //     id: a.stage ? a.stage.id : null, name: a.stage ? a.stage.name : null,
        // }));
        // const existingStages = dataStages.stages ? dataStages.stages.items : [];
        // const updatedStages = [...existingStages, ...newStages];
        // setDataStages({
        //     ...dataStages,
        //     stages: {
        //         ...dataStages.stages,
        //         items: updatedStages,
        //     },
        // });
    }
    const {loading: loadingTasks, error: errorTasks, refetch: refetchTasks} = useQuery(TASKS_QUERY, {
        variables: {
            queryOptions: {search: autoCompleteTask, limit: 10, page: 1}
        },
        onCompleted: (data) => setDataTasks(data)
    });
    const [dataPersons, setDataPersons] = useState();
    const addingDataPersons = (newData) => {
        // if (!dataStages || !value) return;
        // const newStages = value.map(a => ({
        //     id: a.stage ? a.stage.id : null, name: a.stage ? a.stage.name : null,
        // }));
        // const existingStages = dataStages.stages ? dataStages.stages.items : [];
        // const updatedStages = [...existingStages, ...newStages];
        // setDataStages({
        //     ...dataStages,
        //     stages: {
        //         ...dataStages.stages,
        //         items: updatedStages,
        //     },
        // });
    }
    const {loading: loadingPersons, error: errorPersons, refetch: refetchPersons} = useQuery(PERSONS_QUERY, {
        variables: {
            queryOptions: {search: autoCompletePerson, limit: 10, page: 1}
        },
        onCompleted: (data) => setDataPersons(data)
    });

    // Мутации для добавления и обновления

    const [updateTask] = useMutation(UPDATE_TASK_TO_PROJECT_MUTATION, {
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно добавлены!');
            form.resetFields();
            if (onClose())
                onClose()
        },
        onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных:' + error.message);
        }
    });
    const [addTask] = useMutation(ADD_TASK_TO_PROJECT_MUTATION, {
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно добавлены!');
            form.resetFields();
            if (onClose())
                onClose()
        },
        onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных:' + error.message);
        }
    });

    // Загрузка формы
    useEffect(() => {
        form.resetFields();
    }, []);

    useEffect(() => {
        if (tasksProject) {
            setEditingTasks(tasksProject);
            console.log(tasksProject);
            form.setFieldsValue({
                task_id: tasksProject?.task?.id,
                date_range: [moment(tasksProject?.date_start), moment(tasksProject?.date_end)],
                price: tasksProject.price
            });
        }
    }, [tasksProject, form]);

    if (errorTasks && errorPersons) return `Ошибка! ${errorTasks?.message} ${errorPersons?.message}`;

    // Обработчик отправки формы
    const handleSubmit = () => {
        if (editingTasks) {
            updateTask(
                //{variables: {id: editingContact.id, ...form.getFieldsValue()}}
            );
        } else {
            addTask(
                //{variables: {...form.getFieldsValue()}}
            );
        }
    };

    return (
        <>
            <StyledFormRegular form={form}
                               onFinish={handleSubmit}
                               labelCol={{span: 8}}
                               labelAlign="left"
                               wrapperCol={{span: 16}}>
                <StyledFormItemSelectAndCreateWitchEdit
                    formName={"task_id"}
                    formLabel={"Задача"}
                    placeholder={"Задача"}
                    loading={loadingTasks}
                    //items={dataTasks?.tasks?.items}
                    firstBtnOnClick={setAddTaskModalVisible}
                    formatOptionText={(row) => `${row.name}`}
                />
                <FormItem name={"date_range"}>
                    <RangePicker
                        style={{width: "100%"}}
                        // minDate={actualityProjectData.date_signing}
                        // maxDate={actualityProjectData.date_end}
                        // onChange={handleDateStageRebuild}
                        id={{
                            start: 'date_start_item',
                            end: 'date_end_item',
                        }}
                    />
                </FormItem>

                <StyledFormItem name="price" style={{width: '100%'}} label="Стоимость">
                    <InputNumber suffix={"₽"} style={{width: '100%'}}
                                 formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                 parser={value => `${value}`.replace(/[^0-9]/g, '')}/>
                </StyledFormItem>
                {/*<StyledFormItem*/}
                {/*    formName={"inherited_task_id"}*/}
                {/*    formLabel={"Наслудует от"}*/}
                {/*    loading={loadingTasksProject}*/}
                {/*    items={dataTasksProject?.tasks?.items}*/}
                {/*    //firstBtnOnClick={setAddContactModalVisibleMode}*/}
                {/*    //formatOptionText={(row) => `${row?.passport?.last_name} ${row?.passport?.first_name} ${row?.passport?.patronymic}`}*/}
                {/*/>*/}
                <Divider>Исполнители: </Divider>
                <Form.List name="stageList">
                    {(fields, {add, remove}) => (<>
                        {fields.map(({key, name, ...restField}) => (<Space
                            key={key}
                            style={{
                                display: 'flex', marginBottom: 0, marginTop: 0
                            }}
                            align="baseline"
                        >
                            <Tooltip title="Исполнитель">
                                <Form.Item
                                    {...restField}
                                    style={{marginBottom: 0, display: 'flex'}}
                                    name={[name, 'procent_item']}>
                                    <InputNumber
                                        //onChange={handleChangeItemPercent}
                                        size={"middle"}
                                        min={1}
                                        max={100}
                                        style={{
                                            width: 50
                                        }}/>
                                </Form.Item>
                            </Tooltip>
                            <Tooltip title="Продолжительность этапа">
                                <Form.Item
                                    {...restField}
                                    style={{marginBottom: 0, display: 'flex'}}
                                    name={[name, 'duration_item']}>
                                    <InputNumber
                                        //onChange={handleChangeItemDuration}
                                        size={"middle"}
                                        min={1}
                                        max={325}
                                        style={{
                                            width: 50
                                        }}
                                    />
                                </Form.Item>
                            </Tooltip>
                            <Tooltip title="Стоимость">
                                <Form.Item
                                    {...restField}
                                    style={{marginBottom: 0, display: 'flex'}}
                                    name={[name, 'duration_item']}>
                                    <InputNumber
                                        //onChange={handleChangeItemDuration}
                                        size={"middle"}
                                        min={1}
                                        max={325}
                                        style={{
                                            width: 50
                                        }}
                                    />
                                </Form.Item>
                            </Tooltip>
                            <MinusCircleOutlined onClick={() => remove(name)}/>
                        </Space>))}
                        <Divider style={{margin: '20px 0'}}/>

                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block
                                    icon={<PlusOutlined/>}>
                                Добавить элемент
                            </Button>
                        </Form.Item>
                    </>)}
                </Form.List>

                <StyledFormItem labelCol={{span: 24}} wrapperCol={{span: 24}}>
                    <div style={{textAlign: 'center'}}>
                        <StyledButtonGreen type="primary" htmlType={"submit"}>
                            Сохранить изменения
                        </StyledButtonGreen>
                    </div>
                </StyledFormItem>
            </StyledFormRegular>
            <Modal
                key={selectedTask?.id}
                open={addTaskModalVisible}
                onCancel={() => setAddTaskModalVisible(false)}
                footer={null}
                onClose={handleCloseModalFormView}
            >
                <TaskForm task={null} onClose={handleCloseModalFormView}/>
            </Modal>
            <Modal
                key={selectedTask?.id}
                open={editTaskModalVisible}
                onCancel={() => setEditingTasks(false)}
                footer={null}
                onClose={handleCloseModalFormView}
            >
                <TaskForm task={selectedTask} onClose={handleCloseModalFormView}/>
            </Modal>
            <Modal
                key={selectedPerson?.id}
                open={addPersonModalVisible}
                onCancel={() => setAddPersonModalVisible(false)}
                footer={null}
                onClose={handleCloseModalFormView}
            >
                <PersonForm person={null} onClose={handleCloseModalFormView}/>
            </Modal>
            <Modal
                key={selectedPerson?.id}
                open={editPersonModalVisible}
                onCancel={() => setEditPersonModalVisible(false)}
                footer={null}
                onClose={handleCloseModalFormView}
            >
                <PersonForm person={selectedPerson} onClose={handleCloseModalFormView}/>
            </Modal>
        </>
    );
};

export default TaskProjectForm;
