import {Space, Table, Tooltip, Typography} from "antd";
import {DownloadOutlined, EditOutlined} from "@ant-design/icons";
import React from "react";
const {Text} = Typography;

const TableExecutors = ({setEditModalStatus, project}) => {
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
                acc.push({ executor, tasks: [task] });
            }
            return acc;
        }, []);
    };
    const columnsExecutors = [{
        title:
            <Space>
                <Tooltip title={'Список Исполнителей (В разработке)'}>

                    <Text style={{marginRight: 10}}>Список Исполнителей (В разработке)</Text>
                    <DownloadOutlined/>
                </Tooltip>
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
                        {record.tasks.map(row=>(<Text>
                            - {row.task.name}
                        </Text>))}
                    </Space.Compact>
                ),
            },
            {
                title: 'Договор',
                width: '15%',
                key: 'contract',
                align: "left",
                render: (text, record) => (
                    <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                    </Space.Compact>
                ),
            }]
    }
    ];
    return (

        <Table
            style={{margin: 0, width: "100%"}}
            size={"small"}
            columns={columnsExecutors}
            dataSource={
                groupTasksByExecutor(project.project_tasks)}
            pagination={false}
        />
    )
}
export default TableExecutors;