import React, {useEffect, useState} from 'react';
import {Button, Divider, Form, InputNumber, Modal, notification, Select, Space, Tooltip} from 'antd';
import {useMutation, useQuery} from '@apollo/client';
import {
    PERSONS_QUERY, TASKS_QUERY,
    TASKS_TO_PROJECT_QUERY
} from '../../../../graphql/queries';
import {
    ADD_TASK_TO_PROJECT_MUTATION,
    UPDATE_TASK_TO_PROJECT_MUTATION
} from '../../../../graphql/mutationsTask';

import {StyledFormItem, StyledFormRegular} from '../../../style/FormStyles';
import {StyledButtonGreen} from "../../../style/ButtonStyles";
import PersonForm from "../../basicForm/PersonForm";
import TaskForm from "../../simpleForm/TaskForm";
import {
    BaseStyledFormItemSelect,
    StyledFormItemSelect,

    StyledFormItemSelectAndCreateWitchEdit
} from "../../../style/SelectStyles";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {DatePicker} from "antd/lib";
import moment from "moment";
import FormItem from "antd/es/form/FormItem";

const {RangePicker} = DatePicker;

const TaskProjectForm = ({tasksProject, project, onClose}) => {
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

    useEffect(() => {
             form.resetFields();

    }, [tasksProject]);
    // События
    const handleAutoCompleteTask = (value) => {
        setAutoCompleteTask(value);
    };
    const handleSelectedTask = (value) => {
        setSelectedTask(value);
        handleAutoCompleteTask('');
    };
    const handleAutoCompletePerson = (value) => {
        setAutoCompletePerson(value);
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
            console.log("tasksProject ", tasksProject);
            form.setFieldsValue({
                task_id: tasksProject?.task?.id,
                date_range: [moment(tasksProject?.date_start), moment(tasksProject?.date_end)],
                price: tasksProject.price,
                inherited_task_ids: tasksProject?.inherited_task_ids?.map(({project_inherited_task_id}) => project_inherited_task_id),
                executorList: tasksProject?.executors?.map(executor => ({
                    executor_item: executor?.executor?.id,
                    price_item: executor.price,
                    duration_item: 0,
                }))
            });
        }
    }, [tasksProject, form]);

    if (errorTasks && errorPersons) return `Ошибка! ${errorTasks?.message} ${errorPersons?.message}`;

    // Обработчик отправки формы
    const getLocalDate = (dateString) => {
        const date = new Date(dateString);
        const utcOffset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (utcOffset * 60 * 1000));
        return localDate.toISOString().slice(0, 10);
    };
    const handleSubmit = () => {
        const fieldsValue = form.getFieldsValue();
        const executorList = fieldsValue.executorList || [];
        const mappedExecutorList = executorList.map(executor => ({
            executor_id: executor.executor_item,
            price: executor.price_item
        }));

        if (tasksProject) {
            console.log("editingTasks");
            updateTask({
                variables: {
                    data: {
                        id: tasksProject.id,
                        projectId: project.id,
                        inherited_task_ids: fieldsValue.inherited_task_ids,
                        task_id: fieldsValue.task_id,
                        date_start: getLocalDate(fieldsValue.date_range[0]),
                        date_end: getLocalDate(fieldsValue.date_range[1]),
                        duration: moment(fieldsValue.date_range[1]).diff(moment(fieldsValue.date_range[0]), 'days').toString(),
                        price: fieldsValue.price,
                        executors: mappedExecutorList,
                    }
                }
            });
        } else {
            console.log("addTask");
            addTask({
                variables: {
                    data: {
                        projectId: project.id,
                        inherited_task_ids: fieldsValue.inherited_task_ids,
                        task_id: fieldsValue.task_id,
                        date_start: getLocalDate(fieldsValue.date_range[0]),
                        date_end: getLocalDate(fieldsValue.date_range[1]),
                        duration: moment(fieldsValue.date_range[1]).diff(moment(fieldsValue.date_range[0]), 'days').toString(),
                        price: fieldsValue.price,
                        executors: mappedExecutorList,
                    }
                }
            });
        }
    };


    return (
        <>
            <StyledFormRegular form={form}
                               onFinish={handleSubmit}
                               labelCol={{span: 8}}
                               labelAlign="left"
                               wrapperCol={{span: 16}}>

                <FormItem name={"date_range"} label={"Продолжительность"}>
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
                <StyledFormItem name="task_id" label="Задача">
                    <Select
                        popupMatchSelectWidth={false}
                        allowClear
                        showSearch
                        onSearch={(value) => handleAutoCompleteTask(value)}
                        filterOption={false}
                        loading={loadingTasks}
                        placeholder="Начните ввод...">
                        {dataTasks?.tasks?.items?.map(row => (
                            <Select.Option key={row.id} value={row.id}>{row.name}</Select.Option>))}
                    </Select>
                </StyledFormItem>
                <StyledFormItem name="inherited_task_ids" label="Наслудует от">
                    <Select
                        popupMatchSelectWidth={false}
                        allowClear
                        showSearch
                        mode={'multiple'}
                        onSearch={(value) => handleAutoCompleteTask(value)}
                        filterOption={false}
                        loading={loadingTasks}
                        placeholder="Начните ввод...">
                        {project?.project_tasks?.map(row => (
                            <Select.Option key={row.id} value={row.id}>{row.task.name}</Select.Option>))}
                    </Select>
                </StyledFormItem>


                <Divider>Исполнители: </Divider>
                <Form.List name="executorList" style={{width: '100%'}}>
                    {(fields, {add, remove}) => (<>
                        {fields.map(({key, name, ...restField}) => (<Space
                            key={key}
                            style={{
                                width: '100%', marginBottom: 0, marginTop: 0
                            }}
                            align="baseline"
                        >
                            <Tooltip title="Исполнитель">
                                <StyledFormItemSelect
                                    width={350}
                                    formName={[name, 'executor_item']}
                                    items={dataPersons?.persons?.items}
                                    formatOptionText={(row) => `${row?.passport?.lastname} ${row?.passport?.firstname} ${row?.passport?.patronymic}`}
                                />
                            </Tooltip>
                            {/*<Tooltip title="Продолжительность">*/}
                            {/*    <Form.Item*/}
                            {/*        {...restField}*/}
                            {/*        style={{marginBottom: 0, display: 'flex'}}*/}
                            {/*        name={[name, 'duration_item']}>*/}
                            {/*        <InputNumber*/}
                            {/*            //onChange={handleChangeItemDuration}*/}
                            {/*            size={"middle"}*/}
                            {/*            min={1}*/}
                            {/*            max={325}*/}
                            {/*            style={{*/}
                            {/*                width: 50*/}
                            {/*            }}*/}
                            {/*        />*/}
                            {/*    </Form.Item>*/}
                            {/*</Tooltip>*/}
                            <Tooltip title="Стоимость">
                                <Form.Item
                                    {...restField}
                                    style={{marginBottom: 0, display: 'flex'}}
                                    name={[name, 'price_item']}>
                                    <InputNumber
                                        //onChange={handleChangeItemDuration}
                                        size={"middle"}
                                        min={1}
                                        style={{
                                            width: 80
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
                        <StyledButtonGreen type="primary" onClick={()=>handleSubmit()}>
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
