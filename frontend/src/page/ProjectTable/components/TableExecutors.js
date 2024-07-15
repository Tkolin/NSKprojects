import {Modal, Space, Table, Tooltip, Typography} from "antd";
import {DownloadOutlined, EditOutlined, EyeOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import PersonContractFileDownload from "../../components/script/fileDownloadScripts/PersonContractFileDownload";
import TaskExecutorContractDownload from "../../components/script/fileDownloadScripts/TaskExecutorContractDownload";
import Link from "antd/es/typography/Link";
import {nanoid} from "nanoid";
import OrderExecutorManager from "../../OrderExecutorManager";

const {Text} = Typography;

const TableExecutors = ({setEditModalStatus, project, onUpdated}) => {
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
                <Text style={{marginRight: 10}}>Список Исполнителей (В разработке)</Text>


                {/*<IrdsProjectFileDownload text={<DownloadOutlined/>} projectId={CreateNewProject.id}/>*/}
                {/*<EditOutlined onClick={() => setEditModalStatus && setEditModalStatus({*/}
                {/*    status: "tasks",*/}
                {/*    project: project*/}
                {/*})}/>*/}
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
                            {record.executor.passport.lastname} {record.executor.passport.firstname} {record.executor.passport.patronymic}
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
                             Догова <EyeOutlined/>
                         </Link>

                        //  <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                        //     <TaskExecutorContractDownload
                        //         projectTasksIds={s}/>
                        // </Space.Compact>
                    )
                },
            }]
    }
    ];
    return (
<>


        <Table
            style={{margin: 0, width: "100%"}}
            size={"small"}
            columns={columnsExecutors}
            dataSource={
                groupTasksByExecutor(project.project_tasks)}
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
export default TableExecutors;