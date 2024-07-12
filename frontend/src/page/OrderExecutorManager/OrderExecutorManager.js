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
import React, {useState} from "react";
import {EXECUTOR_ORDERS_QUERY} from "../../graphql/queriesSpecial";
import {nanoid} from "nanoid";
import TypeProjectForm from "../components/form/modelsForms/TypeProjectForm";
import TasksTreeComponent from "../DistributionTasksByProject/components/TasksTreeComponent";
import {StyledButtonGreen} from "../components/style/ButtonStyles";
import TextArea from "antd/es/input/TextArea";
import {CarryOutOutlined} from "@ant-design/icons";
import GenerateOrderForm from "./components/GenerateOrderForm";

const {Text} = Typography;

export const OrderExecutorManager = ({executor, projectId, projectTasks}) => {
    const [executorOrders, setExecutorOrders] = useState([]);
    const [orderGeneratorModalStatus, setOrderGeneratorModalStatus] = useState();
    const {refetch: rf}
        = useQuery(EXECUTOR_ORDERS_QUERY, {
        variables: {
            projectId: "152", executorId: "9"
        },
        onCompleted: (data) => {
            console.log(data?.executorOrders?.map(row => ({
                ...row,
                project_tasks: [...row?.project_tasks?.map(second_row => second_row.id)]
            })));
            setExecutorOrders(data?.executorOrders?.map(row => ({
                ...row,
                project_tasks: [...row?.project_tasks?.map(second_row => second_row.id)]
            })))
        }
    });


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
                onCancel={() => setExecutorOrders(null)}
                footer={null}
                onClose={() => setExecutorOrders(null)}
                width={"600px"}
                title={"Генерация договора"}
            >
                <GenerateOrderForm executorOrders={executorOrders} projectTasks={projectTasks}/>
            </Modal>
        </Card>)
}
export default OrderExecutorManager;