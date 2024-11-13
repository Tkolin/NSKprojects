import { Modal, Space, Table, Typography } from "antd";
import React, { useState } from "react";

import Link from "antd/es/typography/Link";
import { nanoid } from "nanoid";
import OrderExecutorManager from "../../../../../../OrderExecutorManager";

const {Text} = Typography;

const TableExecutorsComponent = ({setEditModalStatus, project, onUpdated}) => {
    const [executorOrderModalStatus, setExecutorOrderModalStatus] = useState()
    const groupTasksByExecutor = (tasks) => {
        return tasks.reduce((acc, task) => {
            if (!task.executor) {
                return acc; // Пропускаем задачи без исполнителя
            }
            const executor = task.executor;
            const executorTasks = acc.find((item) => item.executor.id === executor.id);
            if (executorTasks) {
                executorTasks.tasks.push(task);
            } else {
                acc.push({executor, tasks: [task]});
            }
            return acc;
        }, []);
    };
    const columnsExecutors = [{
        title:
            <Space>
                <Text style={{marginRight: 10}}>Список Исполнителей</Text>
            </Space>,
        children: [
            {
                title: 'Исполнитель',
                width: '45%',
                key: 'executor',
                align: "left",
                render: (text, record) => (

                    <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                        <Text>
                            {record.executor.passport.last_name} {record.executor.passport.first_name} {record.executor.passport.patronymic}
                        </Text>
                    </Space.Compact>

                ),
            },
            {
                title: 'Список задач',
                width: '40%',
                key: 'tasks',
                align: "left",
                render: (text, record) => (
                    <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                        {record.tasks.map(row => (<Text>
                            - {row.task.name}
                        </Text>))}
                    </Space.Compact>
                ),
            },
            {
                title: 'Договоры',
                width: '15%',
                key: 'contract',
                align: "left",
                render: (text, record) => {
                     const s = project?.project_tasks?.filter(row => row?.executor?.id === record?.executor.id);
                     return (
                         <Link onClick={()=>setExecutorOrderModalStatus({projectTasks: s, executor: record.executor})}>
                             Договора...
                         </Link>
                    )
                },
            }]
    }
    ];
    return (
<>


        <Table
            style={{margin: 0, width: "max-content"}}
            size={"small"}
            columns={columnsExecutors}
            dataSource={
                groupTasksByExecutor(project.project_tasks).sort((a, b) => new Date(a.date_start) - new Date(b.date_start))}
            pagination={false}
        />
    <Modal
        key={nanoid()}
        open={executorOrderModalStatus?.executor && executorOrderModalStatus?.projectTasks}
        onCancel={() => setExecutorOrderModalStatus(null)}
        footer={null}
        title={"Договора с исполнителем"}
        width={ 1300}
        onClose={() => setExecutorOrderModalStatus(null)}
    >
       <OrderExecutorManager  onUpdated={()=>onUpdated()} executor={executorOrderModalStatus?.executor} projectTasks={executorOrderModalStatus?.projectTasks}/>
    </Modal>
</>
    )
}
export default TableExecutorsComponent;