import {Button, Form, InputNumber, Modal, notification, Select, Space} from "antd";
import React, {useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {
    SEARCH_TASKS_QUERY,
    SEARCH_TEMPLATE_IRDS_OR_TYPE_PROJECT_QUERY,
    SEARCH_TEMPLATE_OR_TYPE_PROJECT_QUERY, SEARCH_TEMPLATE_TASKS_OR_TYPE_PROJECT_QUERY
} from "../../graphql/queriesSearch";
import {UPDATE_TASKS_TEMPLATE_MUTATION} from "../../graphql/mutationsTemplate";
import LoadingSpinner from "./LoadingSpinner";
import {StyledFormBig} from "../style/FormStyles";
import {LoadingOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {StyledButtonGreen} from "../style/ButtonStyles";
import TypeProjectForm from "../form/TypeProjectForm";
import TemplateForm from "../form/TemplateForm";

const TasksTemplateForm = ({typeProjectId, triggerMethod, setTriggerMethod  }) => {
    // Состояния
    const [formTask] = Form.useForm();
    const [taskFormViewModalVisible, setTaskFormViewModalVisible] = useState(false);
    const [autoCompleteTask, setAutoCompleteTask] = useState('');
    const handleAutoCompleteTaskSelect = (value) => {
        if (value == 'CREATE_NEW') {
            setTaskFormViewModalVisible(true);
            setAutoCompleteTask('');
        } else {
            setAutoCompleteTask('');
        }
    };
    const handleAutoCompleteTask = (value) => {
        setAutoCompleteTask(value)
    };
    const handleTaskFormView = () => {
        setTaskFormViewModalVisible(false);
    };
    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message, placement,
        });
    };

    // Получение данных для выпадающих списков
    const [dataTasks, setDataTasks] = useState(null);
    const {loading: loadingTasks, error: errorTasks, refetch: refetchTasks} = useQuery(SEARCH_TASKS_QUERY, {
        variables: {search: autoCompleteTask}, onCompleted: (data) => setDataTasks(data)
    });
    const {
        loading: loadingTemplate, error: errorTemplate, data: dataTemplate
    } = useQuery(SEARCH_TEMPLATE_TASKS_OR_TYPE_PROJECT_QUERY, {
        variables: {typeProject: typeProjectId},
        fetchPolicy: 'network-only',
        onCompleted: (data) => addingTasks(data)
    });

    // Загрузка шаблонов при редактировании
    const addingTasks = (value) => {
        if (dataTasks && value) {
            const newTasks = value.templatesTasksTypeProjects.map(a => ({
                id: a.task ? a.task.id : null, name: a.task ? a.task.name : null,
            }));

            refetchTasks({search: autoCompleteTask}).then(({data}) => {
                const existingTasks = dataTasks.tasksTable ? dataTasks.tasksTable.tasks : [];
                const updatedTasks = [...existingTasks, ...newTasks];
                setDataTasks({
                    ...dataTasks, tasksTable: {
                        ...dataTasks.tasksTable, tasks: updatedTasks,
                    },
                });
            });
            loadTemplate();
        }
    }

    // Мутации для добавления и обновления
    const [updateTemplateTask] = useMutation(UPDATE_TASKS_TEMPLATE_MUTATION, {
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно обновлены tt!');
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных: tt' + error.message);
        }
    });

    // Обработчик отправки формы
    const handleSubmit = () => {
        const tasksData = formTask.getFieldsValue().taskList.map(task => ({
            task_id: task.task_item, up_task_id: task.up_task_item, stage_number: task.stage_item,
        }));
        // Вызов мутаций для обновления данных
        updateTemplateTask({
            variables: {
                typeProjectId: typeProjectId,
                listTasks_id: tasksData && tasksData.map(task => parseInt(task.task_id)),
                listInheritedTasks_id: tasksData && tasksData.map(task => parseInt(task.up_task_id)),
                stageNumber: tasksData && tasksData.map(task => task.stage_number),
            }
        });
    };
    // Триггер
    if (triggerMethod) {
        handleSubmit();
        setTriggerMethod(false); // Reset the trigger
    }
    // Подстановка значений
    const loadTemplate = () => {
        if (dataTemplate) {
            const tasks = dataTemplate && dataTemplate.templatesTasksTypeProjects;
            const initialValuesTasks = tasks && tasks.map(data => ({
                task_item: data.task.id,
                up_task_item: data.inheritedTask && data.inheritedTask.task && data.inheritedTask.task.id,
                stage_item: data.stage_number,
            }));
            formTask.setFieldsValue({taskList: initialValuesTasks});
        }
    };

    if(loadingTemplate)
        return <LoadingOutlined
            style={{
                fontSize: 24,
            }}
            spin
        />
    return (<>
            <StyledFormBig
                name="dynamic_form_nest_itemы"
                style={{maxWidth: 600}}
                form={formTask}
            >

                <Form.List name="taskList">
                    {(fields, {add, remove}) => (<>
                        {fields.map(({key, name, ...restField}) => (<Space
                                key={key}
                                style={{
                                    display: 'flex', marginBottom: 0, marginTop: 0
                                }}
                                align="baseline"
                            >
                                <Form.Item
                                    {...restField}
                                    style={{
                                        display: 'flex', marginBottom: 0, marginTop: 0
                                    }}
                                    name={[name, 'task_item']}
                                >
                                    <Select
                                        style={{maxWidth: 380, minWidth: 380, marginBottom: 0}}
                                        popupMatchSelectWidth={false}
                                        filterOption={false}
                                        placeholder="Задача..."
                                        onSearch={(value) => handleAutoCompleteTask(value)}
                                        onSelect={(value) => handleAutoCompleteTaskSelect(value)}
                                        allowClear
                                        showSearch
                                        loading={loadingTasks}
                                    >
                                        {dataTasks && dataTasks.tasksTable && dataTasks.tasksTable.tasks && dataTasks.tasksTable.tasks.map(task => (
                                            <Select.Option key={task.id}
                                                           value={task.id}>{task.name}</Select.Option>))}
                                        {dataTasks && dataTasks.tasksTable && dataTasks.tasksTable.tasks && dataTasks.tasksTable.tasks.length === 0 && (
                                            <Select.Option value="CREATE_NEW">Создать новый
                                                ИРД?</Select.Option>)}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    style={{
                                        display: 'flex', marginBottom: 0, marginTop: 0
                                    }}
                                    name={[name, 'up_task_item']}
                                >
                                    <Select
                                        style={{maxWidth: 250, minWidth: 250, marginBottom: 0}}
                                        popupMatchSelectWidth={false}
                                        filterOption={false}
                                        placeholder="Наследуемая от..."
                                        onSearch={(value) => handleAutoCompleteTask(value)}
                                        onSelect={(value) => handleAutoCompleteTaskSelect(value)}
                                        allowClear
                                        showSearch
                                        loading={loadingTasks}
                                    >
                                        {dataTasks && dataTasks.tasksTable && dataTasks.tasksTable.tasks && dataTasks.tasksTable.tasks.map(task => (
                                            <Select.Option key={task.id}
                                                           value={task.id}>{task.name}</Select.Option>))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    style={{
                                        width: '100%', display: 'flex', marginBottom: 0, marginTop: 0
                                    }}
                                    name={[name, 'stage_item']}
                                >
                                    <InputNumber
                                        size={"middle"}
                                        min={1}
                                        max={100}
                                        placeholder="Номер этапа"
                                        style={{
                                            width: 60
                                        }}/>
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(name)}/>
                            </Space>))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block
                                    icon={<PlusOutlined/>}>
                                Добавить задачу к шаблону
                            </Button>
                        </Form.Item>
                    </>)}
                </Form.List>
                <div style={{textAlign: 'center'}}>
                    <StyledButtonGreen
                        type={'dashed'}
                        onClick={() => setTaskFormViewModalVisible(true)}>Создать Задачу</StyledButtonGreen></div>

            </StyledFormBig>
            <Modal
                open={taskFormViewModalVisible}
                onCancel={() => setTaskFormViewModalVisible(false)}
                footer={null}
                //onClose={handleTypeProjectFormView}
            >
                {/* TODO: добавить
                <TypeProjectForm/>*/}
            </Modal>
        </>)
};
export default TasksTemplateForm;