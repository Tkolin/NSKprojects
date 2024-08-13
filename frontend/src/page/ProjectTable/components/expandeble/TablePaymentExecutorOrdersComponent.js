import {Alert, Button, Col, notification, Progress, Row, Space, Table, Tooltip, Typography} from "antd";
import React, {useEffect} from "react";
import {DownloadOutlined, EditOutlined} from "@ant-design/icons";
import Link from "antd/es/typography/Link";
import dayjs from "dayjs";
import {green, red} from "@ant-design/colors";
import {useLazyQuery, useMutation, useQuery} from "@apollo/client";
import {PROJECT_TASK_UP_MUTATION} from "../../../../graphql/mutationsProject";
import {CONTACTS_QUERY, PROJECTS_QUERY} from "../../../../graphql/queries";
import {EXECUTOR_ORDERS_PROJECT_QUERY} from "../../../../graphql/queriesSpecial";

const openNotification = (placement, type, message) => {
    notification[type]({
        message: message,
        placement,
    });
};

const {Text} = Typography;
const TablePaymentExecutorOrdersComponent = ({setEditModalStatus, project}) => {


    const {data: executorOrders, loading: loading, error: error} = useQuery(EXECUTOR_ORDERS_PROJECT_QUERY,
        {variables:
            {
                projectId: project?.id
            }});

    useEffect(() => {
        console.log(executorOrders);
    }, [executorOrders]);

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
                        <Space.Compact
                            direction={"vertical"}
                            style={{alignContent: "start", width: "100%"}}>
                            <Text strong>{record?.number}</Text>
                            {/*{record.project_tasks.map(row=><>{row?.task?.name}</>)}*/}
                        </Space.Compact>
                    ),
                },  {
                    width: '60%',
                    title: 'Статус',
                    key: 'task',
                    align: "left",
                    render: (text, record) => (
                        <Space.Compact
                            direction={"vertical"}
                            style={{alignContent: "start", width: "100%"}}>
                            <Text strong>{record?.project_tasks}</Text>
                            {/*{record.project_tasks.map(row=><>{row?.task?.name}</>)}*/}
                        </Space.Compact>
                    ),
                },
                // {
                //     width: '20%',
                //
                //     title: 'Исполнитель',
                //     key: 'task',
                //     align: "left",
                //     render: (text, record) => (
                //         <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                //             <Text
                //                 strong>{record?.executor?.passport?.lastname} {record?.executor?.passport?.firstname} {record?.executor?.passport?.patronymic}</Text>
                //         </Space.Compact>
                //     ),
                // },
                // {
                 //     width: '20%',
                //     title: 'Статус',
                //     key: 'task',
                //     align: "left",
                //     render: (text, record) => <StatusRender projectTask={record}/>
                // },
            ]
        }
        ]
    ;
    return (
        <Table
            style={{margin: 0, width: "100%"}}
            size={"small"}
            columns={columnsTasks}
            loading={loading}
            dataSource={executorOrders?.executorOrders}
            pagination={false}
        />);
}


export default TablePaymentExecutorOrdersComponent;

const LinkCustom = ({}) => {
    return <Link></Link>
}

const LinkUploadPrepayment = ({}) => {
    return <LinkCustom>
        Загрузить файл оплаты аванса
    </LinkCustom>
}

const LinkUploadMainPayment = ({}) => {
    return <LinkCustom>
        Загрузить файл оплаты аванса
    </LinkCustom>
}

const LinkUploadPostPayment = ({}) => {
    return <LinkCustom>
        Загрузить файл оплаты аванса
    </LinkCustom>
}