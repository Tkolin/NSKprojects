import {Alert, Col, notification, Progress, Row, Space, Table, Tooltip, Typography} from "antd";
import React, {useEffect} from "react";
import {EditOutlined} from "@ant-design/icons";
import Link from "antd/es/typography/Link";
import dayjs from "dayjs";
import {useMutation} from "@apollo/client";
import {PROJECT_TASK_UP_MUTATION} from "../../../../../../../graphql/mutationsProject";

const openNotification = (placement, type, message) => {
    notification[type]({
        message: message,
        placement,
    });
};

const {Text} = Typography;
const TableProjectTasksManagment = ({setEditModalStatus, project}) => {
    const columnsTasks = [{
            title:
                <Space>
                    <Tooltip title={"Список задач"}>
                        <Text style={{marginRight: 10}}>Список Задач на проекте</Text>
                    </Tooltip>
                    <Link type={"warning"}>
                        <EditOutlined onClick={() => setEditModalStatus && setEditModalStatus()}/>
                    </Link>
                </Space>,
            children: [
                {
                    width: '60%',
                    title: 'Основная информация',
                    key: 'task',
                    align: "left",
                    render: (text, record) => (
                        <Space.Compact direction={"vertical"} style={{alignContent: "start", width: "100%"}}>
                            <Text strong>{record?.task?.name}</Text>
                            <Row style={{width: "100%"}}>
                                <Col span={12}>
                                    <Space.Compact direction={"vertical"}>
                                        <CustomProgressBar projectTask={record}/>
                                    </Space.Compact>
                                </Col>
                                <Col span={12}>
                                    <Text strong>{record?.date_start} - {record?.date_end} ({record.duration})</Text>
                                </Col>
                            </Row>
                        </Space.Compact>
                    ),
                }, {
                    width: '20%',

                    title: 'Исполнитель',
                    key: 'task',
                    align: "left",
                    render: (text, record) => (
                        <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                            <Text
                                strong>{record?.executor?.passport?.last_name} {record?.executor?.passport?.first_name} {record?.executor?.passport?.patronymic}</Text>
                        </Space.Compact>
                    ),
                },
                {
                    width: '20%',
                    title: 'Статус',
                    key: 'task',
                    align: "left",
                    render: (text, record) => <StatusRender projectTask={record}/>
                },
            ]
        }
        ]
    ;
    return (
        <Table
            style={{margin: 0, width: "100%"}}
            size={"small"}
            columns={columnsTasks}
            dataSource={project.project_tasks.filter(row => row?.executor?.id > 0)}
            pagination={false}
        />);
}

export default TableProjectTasksManagment;
const CustomProgressBar = ({projectTask, ...props}) => {

    const progress = dayjs(projectTask.date_start).diff(dayjs(), "day");
    const naturalProgress = dayjs(projectTask.date_start).diff(dayjs(), "day");


    switch (projectTask.status) {
        case "NOT_EXECUTOR":
            return "Ошибка";
        case "AWAITING":
            return (<>
                {progress < 0 ?
                    (<Alert style={{padding: 2}} type="info" showIcon message={
                            <> До начала: {Math.abs(progress)} д. </>
                        }/>
                    )
                    : (<Alert style={{padding: 2}} type="error" showIcon message={
                            <> Просрочка на: {Math.abs(progress)} д. </>
                        }/>
                    )
                }
            </>);
        case "WORKING":
            return (<>
                {progress < 0 ?
                    (progress <= projectTask.duration ?
                            (
                                <>
                                    До начала: {Math.abs(progress)} д.
                                    <Progress steps={5} percent={projectTask.duration / 100 * Math.abs(progress)}

                                              size={[28, 14]}/>
                                </>
                            )
                            : (
                                <>
                                    Просрочка на: {Math.abs(progress)} д.
                                    <Progress steps={5} percent={Math.abs(progress) - projectTask.duration}
                                              size={[28, 14]}/>
                                </>
                            )
                    ) :
                    (
                        <>
                            Задача была начана заранее: {Math.abs(progress)} д.
                            <Progress steps={5} percent={0}
                                      size={[28, 14]}/>
                        </>
                    )
                    // (
                    //     <>
                    //         Просрочка
                    //         <Progress steps={5} percent={100} strokeColor={[green[6], green[6], red[5]]} size={[28, 14]}/>
                    //         {progress >= 0 ? "До начала работы " + Math.abs(progress) : Math.abs(progress) <= projectTask.duration ? "В работе" + Math.abs(progress) : "Со дня завершения " + (Math.abs(progress) - projectTask.duration)}
                    //
                    //     </>)
                    // : (<>
                    //     Нормально
                    //     <Progress steps={5} percent={100} strokeColor={[green[6], green[6], red[5]]} size={[28, 14]}/>
                    //     {progress >= 0 ? "До начала работы " + Math.abs(progress) : Math.abs(progress) <= projectTask.duration ? "В работе" + Math.abs(progress) : "Со дня завершения " + (Math.abs(progress) - projectTask.duration)}
                    // </>)
                }
            </>);
        case "COMPLETED":
            return (<>
                Задача выполнена
                <Progress steps={5} percent={100} size={[28, 14]}/>
                {progress >= 0 ? "До начала работы " + Math.abs(progress) : Math.abs(progress) <= projectTask.duration ? "В работе" + Math.abs(progress) : "Со дня завершения " + (Math.abs(progress) - projectTask.duration)}

            </>);
    }

}
const StatusRender = ({projectTask}) => {
    const x = 5;
    const dateNow = dayjs().subtract(projectTask.duration / x, 'day');
    useEffect(() => {
        console.log(projectTask.date_end, dateNow.format("YYYY-MM-DD"), dayjs(projectTask.date_end) <= dateNow)
    }, []);
    // Мутация
    const [upMutate, {loading: loadingSave}] = useMutation(PROJECT_TASK_UP_MUTATION, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Статус задачи повышен`);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка` + error.message);
        },
    });

    const handleStatusUp = (projectTask) => {
        upMutate({variables: {taskId: projectTask.id}});
    }
    const handleStatusDown = (projectTask) => {
        console.log("Ууу опускаем");
    }
    const DefaultLink = ({...props}) => {
        return <Link {...props} onClick={() => handleStatusUp(projectTask)}/>
    }
    const progress = dayjs(projectTask.date_start).diff(dayjs(), "day");
    console.log(progress);
    switch (projectTask.status) {
        case "NOT_EXECUTOR":
            return (<DefaultLink type={"danger"}>
                Исполнитель не назначен
            </DefaultLink>);
        case "AWAITING":
            return (<>
                Ожидание
                <br/>
                {dayjs(projectTask.date_start) >= dayjs().subtract(5, 'day') ? (
                        <DefaultLink>
                            Начать выполнение задачи
                        </DefaultLink>)
                    : (<DefaultLink>
                        Завершить досрочно?
                    </DefaultLink>)
                }
            </>);
        case "WORKING":
            return (<>
                В работе
                <br/>
                {dayjs(projectTask.date_end) <= dayjs().subtract(3, 'day') ? (
                        <DefaultLink>
                            Завершить?
                        </DefaultLink>)
                    : (<DefaultLink>
                        Завершить досрочно?
                    </DefaultLink>)
                }
            </>);
        case "COMPLETED":
            return (<>
                Задача выполнена
            </>);
    }
    return (<>Ошибка обработки</>)
}