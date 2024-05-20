import React, {useEffect, useState, useRef, useContext} from 'react';
import {Button, Col, Drawer, Form, Input, InputNumber, Popconfirm, Row, Table, Typography} from 'antd';
import {Chart} from 'react-google-charts';
import {useMutation, useQuery} from "@apollo/client";
import {PROJECTS_QUERY, TASKS_TO_PROJECT_QUERY} from "../../../graphql/queries";
import TaskProjectForm from "../aggregateComponent/projectForm/TaskProjectForm";
import {DELETE_TASK_TO_PROJECT_MUTATION, UPDATE_TASK_TO_PROJECT_MUTATION} from "../../../graphql/mutationsTask";
import {useParams} from "react-router";
import {StyledButtonGreen} from "../../style/ButtonStyles";
import {QuestionCircleOutlined} from "@ant-design/icons";
import StyledLinkManagingDataTable from "../../style/TableStyles";
import {NotificationContext} from "../../../NotificationProvider";
import {ADD_CONTACT_MUTATION, UPDATE_CONTACT_MUTATION} from "../../../graphql/mutationsContact";
import moment from "moment/moment";
import {ORGANIZATIONS_QUERY_COMPACT, POSITIONS_QUERY_COMPACT} from "../../../graphql/queriesCompact";

const TasksChartForm = ({ initialObject, mutation, onCompleted }) => {
    // Первичные данные
    const {openNotification} = useContext(NotificationContext);
    const [form] = Form.useForm();
    const nameModel = 'Контакт';

    // Состояния
    const [organizationModalStatus, setOrganizationModalStatus] = useState(null);
    const [organizationAutoComplete, setOrganizationAutoComplete] = useState({options: [], selected: {}});
    const [positionAutoComplete, setPositionAutoComplete] = useState({options: [], selected: {}});

    // Мутация
    const [mutate] = useMutation(initialObject ? UPDATE_CONTACT_MUTATION : ADD_CONTACT_MUTATION, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Создание новой записи в таблице ${nameModel} выполнено успешно`);
            form.resetFields();
            onCompleted && onCompleted(data);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при выполнении сооздания ${nameModel}: ${error.message}`);
        },
    });

    // Подгрузка при обновлении
    useEffect(() => {
        if (initialObject) {
            form.resetFields();
            form.setFieldsValue({
                ...initialObject,
                birth_day: initialObject?.birth_day ? moment(initialObject.birth_day) : null,
                position_id: initialObject?.position.id ?? null,
                organization_id: initialObject?.organization?.id ?? null
            });
        }
    }, [initialObject, form]);

    // Получение данных для выпадающих списков
    const {loading: loadingPositions, error: errorPositions, data: dataPositions} = useQuery(POSITIONS_QUERY_COMPACT);
    const {
        loading: loadingOrganizations,
        error: errorOrganizations,
        data: dataOrganizations
    } = useQuery(ORGANIZATIONS_QUERY_COMPACT);

    const handleSubmit = () => {
        mutate({variables: {...(initialObject ? {id: initialObject.id} : {}), ...form.getFieldsValue(),
                organization_id: organizationAutoComplete?.selected, position_id: positionAutoComplete?.selected}});
    };

    if (errorOrganizations || errorPositions) return `Ошибка! ${errorOrganizations?.message || errorPositions?.message}`;
    // Первичные данные
    const {openNotification} = useContext(NotificationContext);
    const [form] = Form.useForm();
    const nameModel = 'Контакт';

    // Состояния
    const [organizationModalStatus, setOrganizationModalStatus] = useState("add");
    const [selectedOrganizationData, setSelectedOrganizationData] = useState(null);


    // Изменение состояния
    const handleSelectedOrganization = (value) => {
        setAutoCompleteOrganization(null);
        setSelectedOrganizationData(dataOrganizations?.organizations?.items?.find(org => org.id === value));
    };

    // Мутация
    const [mutate] = useMutation(initialObject ? UPDATE_CONTACT_MUTATION : ADD_CONTACT_MUTATION, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Мутация ${nameModel} выполнена успешно`);
            onCompleted && onCompleted(data);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при выполнении мутации ${nameModel}: ${error.message}`);
        },
    });

    // Подгрузка при обновлении
    useEffect(() => {
        initialObject &&
        form.setFieldsValue({
            ...initialObject,
            birth_day: initialObject?.birth_day ? moment(initialObject.birth_day) : null,
            position_id: initialObject?.position.id ?? null,
            organization_id: initialObject?.organization?.id ?? null
        });
    }, [initialObject, form]);


    // Получение данных для выпадающих списков
    const {loading: loadingPositions, error: errorPositions, data: dataPositions} = useQuery(POSITIONS_QUERY_COMPACT);

    const {
        loading: loadingOrganizations,
        error: errorOrganizations,
        data: dataOrganizations
    } = useQuery(ORGANIZATIONS_QUERY_COMPACT);

    // Завершение
    const handleSubmit = () => {
        mutate({variables: {...(initialObject ? {id: initialObject.id} : {}), ...form.getFieldsValue()}});
    };

    if (errorOrganizations || errorPositions) return `Ошибка! ${errorOrganizations?.message || errorPositions?.message}`;
//////TODO:
//
//
//
// /////////////////////////////////////////////////////////////////////////////////////

    const {projectId} = useParams();

    // Состояния
    const [originData, setOriginData] = useState();
    const [openTaskProjectForm, setOpenTaskProjectForm] = useState(false);
    const [addTasksProject, setAddTasksProject] = useState(false);
    const [editTask, setEditTask] = useState(null);

    // Обработка полученых данных
    const buildData = (data) => {
        const rows = data?.map((task) => {
            const {
                id, task: {name} = {name: " - "}, executors, date_start, date_end, duration, inherited_task_ids
            } = task;
            const inheritedIds = inherited_task_ids.map(({project_inherited_task_id}) => project_inherited_task_id).join(", ");
            const row = [id.toString(), name ?? "-", executors.map((executor) => executor.executor.passport.lastname + " " + executor.executor.passport.firstname + " " + executor.executor.passport.patronymic).join(", "), new Date(date_start).toISOString().slice(0, 10), new Date(date_end).toISOString().slice(0, 10), duration, 0, // Assuming this needs to be calculated based on sub-tasks or some other logic
                inheritedIds, // Use dependenciesMap to get dependencies
            ];
            return row;
        });
        setOriginData(rows.map((r) => ({
            key: r[0],
            TaskID: r[0],
            TaskName: r[1],
            Resource: r[2],
            StartDate: r[3],
            EndDate: r[4],
            Duration: r[5],
            PercentComplete: r[6],
            Dependencies: r[7]
        })));
    };

    // Обновление данных об проекте и задач
    const [actualityProjectData, setActualityProjectData] = useState(null);
    const [refetchTaskSub, setRefetchTaskSub] = useState(false);
    const refetchTasks = () => {
        setRefetchTaskSub(!refetchTaskSub);
    }
    const {
        loading: loadingTasks, error: errorTasks, data: dataTasks
    } = useQuery(PROJECTS_QUERY, {
        variables: {projectId: projectId, refetch: refetchTaskSub},
        fetchPolicy: 'network-only',
        onCompleted: (data) => {
            console.log("onCompleted ");
            if (data?.projects?.items[0]?.project_tasks) buildData(data?.projects?.items[0]?.project_tasks);
            setActualityProjectData(data?.projects?.items[0]);
        },
        refetchWritePolicy: "overwrite"
    });
    // Удаление данных
    const [deleteTaskToProject] = useMutation(DELETE_TASK_TO_PROJECT_MUTATION, {
        onCompleted: () => {
            refetchTasks();
        },
    });

    // События
    const onCloseTaskProjectForm = () => {
        setOpenTaskProjectForm(false);
        setEditTask(null);
        setAddTasksProject(false);
        refetchTasks();
    };

    const newTask = () => {
        setAddTasksProject(true);
        setAddTasksProject(null);
        setOpenTaskProjectForm(true);
    };
    const deleteProjectTask = (taskToProjectId) => {
        console.log("taskToProjectId", taskToProjectId);
        deleteTaskToProject({variables: {id: taskToProjectId}});
    };

    const columns = [{
            title: 'ID', dataIndex: 'TaskID',
        }, {
            title: 'Наименование задачи', dataIndex: 'TaskName',
        }, {
            title: 'Исполнители', dataIndex: 'Resource',
        }, {
            title: 'Дата начала', dataIndex: 'StartDate',
        }, {
            title: 'Дата завершения', dataIndex: 'EndDate',
        }, {
            title: 'Продолжиельность', dataIndex: 'Duration',
        }, {
            title: 'Процент выполнения', dataIndex: 'PercentComplete',
        }, {
            title: 'Зависимости', dataIndex: 'Dependencies',
        }, {
            title: 'Действия', dataIndex: 'operation', render: (text, record) => (
                <StyledLinkManagingDataTable
                    title={"Удаление задачи"}
                    description={"Вы уверены, что нужно удалить это задание?"}
                    handleEdit={() => {
                        setEditTask(actualityProjectData?.project_tasks?.find(d => d.id === record.TaskID));
                        setOpenTaskProjectForm(true);
                    }}
                    handleDelete={() => deleteProjectTask(record.key)}
                />
            )
        },]
    ;

    const columnsChart = [{type: 'string', label: 'Task ID'}, {type: 'string', label: 'Task Name'}, {
        type: 'string',
        label: 'Resource'
    }, {type: 'date', label: 'Start Date'}, {type: 'date', label: 'End Date'}, {
        type: 'number',
        label: 'Duration'
    }, {type: 'number', label: 'Percent Complete'}, {type: 'string', label: 'Dependencies'},];

    if (errorTasks) {
        return errorTasks.message;
    }

    return (
        <>
            <Row style={{width: '100%', height: '100%', margin: 10}}>
                <Col style={{width: '100%', height: '100%', margin: 10}}>
                    <Form form={form} component={false}>
                        <Table
                            style={{width: '100%'}}
                            size="small"
                            bordered
                            loading={loadingTasks}
                            dataSource={originData}
                            columns={columns}
                            pagination={false}
                        />
                    </Form>
                    <StyledButtonGreen style={{width: '100%', marginTop: 10, marginBottom: 10 }} onClick={() => newTask()}>Создать
                        задачу</StyledButtonGreen>
                    {originData && (<Chart
                        style={{height: '100%'}}
                        chartType="Gantt"
                        data={[columnsChart, ...originData?.map(item => [item.TaskID, item.TaskName, item.Resource, new Date(item.StartDate), new Date(item.EndDate), item.Duration, item.PercentComplete, item.Dependencies,])]}
                        chartLanguage={"ru"}
                    />)}
                </Col>
            </Row>

            <Drawer title="Данные об задаче" width={520} closable={false} onClose={onCloseTaskProjectForm}
                    open={openTaskProjectForm}>
                <TaskProjectForm project={actualityProjectData} tasksProject={editTask}
                                 onClose={onCloseTaskProjectForm}/>
            </Drawer>


        </>


    );
};

export default TasksChartForm;
