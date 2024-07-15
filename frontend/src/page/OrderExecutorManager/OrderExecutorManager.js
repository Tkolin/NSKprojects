import {
    Alert,
    Button,
    Card,
    Col,
    Divider,
    Form,
    Input,
    Modal,
    Row,
    Space,
    Table,
    Tree,
    TreeSelect,
    Typography
} from "antd";
import {HeaderExecutorInfoComponent} from "./components/HeaderExecutorInfoComponent";
import {ProjectTasksTable} from "./components/ProjectTasksTable";
import {ExecutorOrdersTable} from "./components/ExecutorOrdersTable";
import {useQuery} from "@apollo/client";
import {PROJECTS_QUERY} from "../../graphql/queries";
import React, {useEffect, useState} from "react";
import {EXECUTOR_ORDERS_QUERY} from "../../graphql/queriesSpecial";
import {nanoid} from "nanoid";
import TypeProjectForm from "../components/form/modelsForms/TypeProjectForm";
import TasksTreeComponent from "../DistributionTasksByProject/components/TasksTreeComponent";
import {StyledButtonGreen} from "../components/style/ButtonStyles";
import TextArea from "antd/es/input/TextArea";
import {CarryOutOutlined} from "@ant-design/icons";
import GenerateOrderForm from "./components/GenerateOrderForm";

const {Text} = Typography;

export const OrderExecutorManager = ({executor, projectId, projectTasks, onUpdated}) => {
    const [executorOrders, setExecutorOrders] = useState([]);

    const [orderGeneratorModalStatus, setOrderGeneratorModalStatus] = useState();
    const {refetch: refetchOrders}
        = useQuery(EXECUTOR_ORDERS_QUERY, {
        variables: {
            executorId: executor.id, projectId: projectTasks[0].project_id
        },
        onCompleted: (data) => {
            console.log("onCompleted: ",data);
            setExecutorOrders(data?.executorOrders?.map(row => ({
                ...row,
                project_tasks: [...row?.project_tasks?.map(second_row => second_row.id)]
            })))
        },

    });
    useEffect(() => {
        refetchOrders();
    }, [orderGeneratorModalStatus]);

    if (!executor || !projectTasks)
        return <>Исполнитель не был передан корректно, повторите попытку</>

    return (
        <Card
            title={
                <HeaderExecutorInfoComponent executor={executor}
                                             onClick={() => setOrderGeneratorModalStatus(true)}
                />
            }>
            <Space.Compact style={{width: "100%"}}>
                <div style={{width: "100%"}}>

                    <ProjectTasksTable projectTasks={projectTasks} style={{width: "100%"}}/>
                </div>

                <Divider type="vertical"/>
                <div style={{width: "100%"}}>

                    <ExecutorOrdersTable executorOrders={executorOrders} style={{width: "100%"}}/>
                </div>

            </Space.Compact>
            <Modal
                key={nanoid()}
                open={orderGeneratorModalStatus}
                onCancel={() => setOrderGeneratorModalStatus(null)}
                footer={null}
                onClose={() => setOrderGeneratorModalStatus(null)}
                width={"600px"}
                title={"Генерация договора"}
            >
                <GenerateOrderForm onCompleted={() => {
                    setOrderGeneratorModalStatus(null);
                    refetchOrders();
                }} executorOrders={executorOrders} projectTasks={projectTasks}/>
            </Modal>
        </Card>)
}
export default OrderExecutorManager;