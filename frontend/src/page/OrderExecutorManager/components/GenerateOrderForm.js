import { CarryOutOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Alert, Card, Divider, Form, Tree } from "antd";
import React, { useContext, useState } from "react";
import { EXECUTOR_ORDER_GENERATED } from "../../../graphql/mutationsFileGenerated";
import { NotificationContext } from "../../../NotificationProvider";
import ExecutorOrderFileGenerated from "../../components/script/fileGenerated/ExecutorOrderFileGenerated";
import { StyledButtonGreen } from "../../components/style/ButtonStyles";

const GenerateOrderForm = ({executorOrders, projectTasks, onCompleted}) => {
    const {openNotification} = useContext(NotificationContext);

    const [form] = Form.useForm();
    const [checkedKeys, setCheckedKeys] = useState();
    const [generatedOrder, {loading: loadingGenerated}] = useMutation(EXECUTOR_ORDER_GENERATED, {
        onCompleted: (data) => {
            onCompleted && onCompleted(data)
            openNotification('topRight', 'success', `Данные обновлены`);
            },
        onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при загрузке: ' + error.graphQLErrors?.flatMap(row => row?.extensions?.debugMessage));
        }
    });
    const handleSubmit = () => {
         generatedOrder({variables: {data:  checkedKeys}})
    }
    const rebuider = (tasks) => {
        const tasksIncludedOrder = executorOrders?.flatMap(row => row.project_tasks);
        return tasks.sort((a, b) => {
            // Преобразуем даты в объекты Date для корректной сортировки
            const dateA = new Date(a.date_start);
            const dateB = new Date(b.date_start);
            return dateA - dateB;
        }).map(task => {
            const isIncludedOrder = tasksIncludedOrder?.includes(task.id) ?? false;
           return {
                key: task.id,
                id: task.id,
                disabled: isIncludedOrder ? true : false,
                icon: isIncludedOrder ? <CarryOutOutlined/> : null,
                title: task.task.name
            }
        });
    };

    return (
        <Card layout="vertical" >
            <Alert message="Выберите задачи которые необходимо указать в договре." type="info" showIcon/>
            <Divider/>
            <Tree showIcon showLine checkable checkedKeys={checkedKeys} onCheck={(data)=>setCheckedKeys(data)}
                  treeData={rebuider(projectTasks)}/>
            <Divider/>
            <ExecutorOrderFileGenerated  projecTaskIds={checkedKeys} disabled={!checkedKeys} onCompleted={onCompleted}
                                           children={<StyledButtonGreen children={"Сгенерировать договор"}/>}/>

         </Card>
    )
}
export default GenerateOrderForm;