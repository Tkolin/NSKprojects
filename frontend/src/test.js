// import React, { useEffect, useState, useRef } from 'react';
// import { Button, Drawer, Form, Input, InputNumber, Popconfirm, Row, Table, Typography } from 'antd';
// import { Chart } from 'react-google-charts';
// import { useQuery } from "@apollo/client";
// import { TASKS_TO_PROJECT_QUERY } from "../../graphql/queries";
// import TaskProjectForm from "./TaskProjectForm";
//
// const TasksChartForm = ({ projectId }) => {
//     const [originData, setOriginData] = useState();
//     const [openTaskProjectForm, setOpenTaskProjectForm] = useState(false);
//     const [editTask, setEditTask] = useState(null);
//     const [form] = Form.useForm();
//     const [selectedRowIndex, setSelectedRowIndex] = useState(null);
//
//     useEffect(() => {
//         console.log("editTask ", editTask);
//     }, [editTask]);
//
//     const buildData = (data) => {
//         const { projectTasksQuery } = data;
//         console.log("buildData");
//
//         const rows = projectTasksQuery.map((task) => {
//             const { id, task: { name }, executors, date_start, date_end, duration, inherited_task_ids } = task;
//             const inheritedIds = inherited_task_ids.map(({ project_inherited_task_id }) => project_inherited_task_id).join(", ");
//             const row = [
//                 id.toString(),
//                 name,
//                 executors.map((executor) => executor.executor.passport.lastname).join(","),
//                 new Date(date_start).toISOString().slice(0, 10),
//                 new Date(date_end).toISOString().slice(0, 10),
//                 duration,
//                 0, // Assuming this needs to be calculated based on sub-tasks or some other logic
//                 inheritedIds, // Use dependenciesMap to get dependencies
//             ];
//             console.log('row ', row);
//             return row;
//         });
//
//         console.log("rows ", rows);
//         setOriginData(rows.map((r) => ({
//             key: r[0],
//             TaskID: r[0],
//             TaskName: r[1],
//             Resource: r[2],
//             StartDate: r[3],
//             EndDate: r[4],
//             Duration: r[5],
//             PercentComplete: r[6],
//             Dependencies: r[7]
//         })));
//     };
//
//     const {
//         loading: loadingTasks,
//         error: errorTasks,
//         refetch: refetchTasks,
//         data: dataTasks
//     } = useQuery(TASKS_TO_PROJECT_QUERY, {
//         variables: { projectId: 24 },
//         onCompleted: (data) => {
//             console.log("data ", data);
//             if (data)
//                 buildData(data);
//         }
//     });
//
//     const onCloseTaskProjectForm = () => {
//         setOpenTaskProjectForm(false);
//         setEditTask(null);
//     };
//
//     const newTask = () => {};
//
//
//     const columns = [
//         {
//             title: 'ID',
//             dataIndex: 'TaskID',
//             editable: true,
//         },
//         {
//             title: 'Наименование задачи',
//             dataIndex: 'TaskName',
//             editable: true,
//         },
//         {
//             title: 'Исполнители',
//             dataIndex: 'Resource',
//             editable: true,
//         },
//         {
//             title: 'Дата начала',
//             dataIndex: 'StartDate',
//             editable: true,
//         },
//         {
//             title: 'Дата завершения',
//             dataIndex: 'EndDate',
//             editable: true,
//         },
//         {
//             title: 'Продолжиельность',
//             dataIndex: 'Duration',
//             editable: true,
//         },
//         {
//             title: 'Процент выполнения',
//             dataIndex: 'PercentComplete',
//             editable: true,
//         },
//         {
//             title: 'Зависимости',
//             dataIndex: 'Dependencies',
//             editable: true,
//         },
//         {
//             title: 'Действия',
//             dataIndex: 'operation',
//             render: (text, record) => (
//                 <Typography.Link onClick={() => {
//                     setEditTask(dataTasks?.projectTasksQuery?.find(d => d.id === record.TaskID));
//                     setOpenTaskProjectForm(true);
//                 }}>
//                     Изменить
//                 </Typography.Link>
//             )
//         },
//     ];
//
//     const columnsChart = [
//         { type: 'string', label: 'Task ID' },
//         { type: 'string', label: 'Task Name' },
//         { type: 'string', label: 'Resource' },
//         { type: 'date', label: 'Start Date' },
//         { type: 'date', label: 'End Date' },
//         { type: 'number', label: 'Duration' },
//         { type: 'number', label: 'Percent Complete' },
//         { type: 'string', label: 'Dependencies' },
//     ];
//
//     if (errorTasks) {
//         return errorTasks.message;
//     }
// //
// // // Обработчик события выбора элемента на диаграмме
// //     const handleChartSelect = ({ chartWrapper }) => {
// //         const chart = chartWrapper.getChart();
// //         const selection = chart.getSelection();
// //         if (selection.length === 1) {
// //             const selectedItem = selection[0];
// //             const rowIndex = selectedItem.row;
// //             console.log(rowIndex);
// //             setSelectedRowIndex(rowIndex);
// //         }
// //     };
// //
// // // В таблице добавляем класс 'selected-row' к выбранной строке
// //     const rowClassName = (record, index) => {
// //         return index === selectedRowIndex ? 'selected-row' : '';
// //     };
//     return (
//         <>
//             <Row style={{ width: "100%", height: '100%', overflow: 'visible' }} gutter={10}>
//                 {originData && (
//                     <Chart
//                         style={{ width: '100%', height: '100%' }}
//                         chartType="Gantt"
//                         data={[columnsChart, ...originData?.map(item => [
//                             item.TaskID,
//                             item.TaskName,
//                             item.Resource,
//                             new Date(item.StartDate),
//                             new Date(item.EndDate),
//                             item.Duration,
//                             item.PercentComplete,
//                             item.Dependencies,
//                         ])]}
//                         options={{
//                             explorer: {
//                                 axis: 'horizontal',
//                                 keepInBounds: true,
//                                 maxZoomIn: 10.0,
//                                 maxZoomOut: 1.0,
//                             },
//                         }}
//                         // chartEvents={[
//                         //     {
//                         //         eventName: 'select',
//                         //         callback: handleChartSelect,
//                         //     },
//                         // ]}
//                     />
//                 )}
//                 <Form form={form} component={false}>
//                     <Table
//                         style={{width: '100%'}}
//                         size="small"
//                         bordered
//                         dataSource={originData}
//                         columns={columns}
//                         pagination={false}
//                     />
//                     <Button style={{ width: '100', margin: 10 }} onClick={() => newTask()}>Создать задачу</Button>
//                 </Form>
//             </Row>
//             <Drawer title="Данные об задаче" width={520} closable={false} onClose={onCloseTaskProjectForm} open={openTaskProjectForm}>
//                 <TaskProjectForm tasksProject={editTask} />
//             </Drawer>
//         </>
//     );
// };
//
// export default TasksChartForm;
