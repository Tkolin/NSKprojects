import {
    Button,
    Card,
    Divider,
    Modal,
    Space,
    Typography
} from "antd";
import {HeaderExecutorInfoComponent} from "./components/HeaderExecutorInfoComponent";
import {ProjectTasksTable} from "./components/ProjectTasksTable";
import {ExecutorOrdersTable} from "./components/ExecutorOrdersTable";
import {useLazyQuery, useQuery} from "@apollo/client";
import React, {useContext, useEffect, useState} from "react";
import {EXECUTOR_ORDERS_QUERY} from "../../graphql/queriesSpecial";
import {nanoid} from "nanoid";
import GenerateOrderForm from "./components/GenerateOrderForm";
import {NotificationContext} from "../../NotificationProvider";

const {Text} = Typography;

export const OrderExecutorManager = ({executor, projectId, projectTasks, onUpdated}) => {
    const {openNotification} = useContext(NotificationContext);
    useEffect(() => {
        loadOrders();
    }, []);
    useEffect(() => {
        console.log("projectTasks", projectTasks);
    }, [projectTasks]);
    const [executorOrders, setExecutorOrders] = useState([]);
    const [orderGeneratorModalStatus, setOrderGeneratorModalStatus] = useState();
    const [loadOrders, {loading, data}] = useLazyQuery(EXECUTOR_ORDERS_QUERY, {
        variables: {
            executorId: executor.id, projectId: projectTasks[0].project_id
        },
        fetchPolicy: "cache-and-network",
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Данные подгружены.`);
            //onUpdated && onUpdated();
            setExecutorOrders(data?.executorOrders?.map(row => ({
                ...row,
                project_tasks: [...row?.project_tasks?.map(second_row => second_row.id)]
            }))) 
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка: ` + error.message);

        }
    });


    if (!executor || !projectTasks)
        return <>Исполнитель не был передан корректно, повторите попытку</>

    return (
        <Card
            loading={loading}
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
                    <ExecutorOrdersTable projectId={projectId}  onUpdated={()=>loadOrders()} executorOrders={executorOrders} style={{width: "100%"}}/>
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
                    loadOrders();
                }} executorOrders={executorOrders} projectTasks={projectTasks}/>
            </Modal>
        </Card>)
}
export default OrderExecutorManager;