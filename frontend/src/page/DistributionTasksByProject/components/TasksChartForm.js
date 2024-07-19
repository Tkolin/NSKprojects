import React, {useContext, useEffect, useState} from "react";
import moment from 'moment';
import {StyledContextBlock} from "../../components/style/BlockStyles";
import loadingSpinnerStyles from "../../components/style/LoadingSpinnerStyles";
import {StyledButtonGreen} from "../../components/style/ButtonStyles";
import {GanttOriginal, ViewMode} from "react-gantt-chart";
import dayjs from "dayjs";
import {NotificationContext} from "../../../NotificationProvider";

const TasksChartForm = ({actualProject, onChange}) => {
        const [tasks, setTasks] = useState(null);
        const [error, setError] = useState(null);
        const {openNotification} = useContext(NotificationContext);
        const updateProjectTasks = () =>{
console.log("updateProjectTasks");
        }
        // const [updateProjectTasks, {loading: loadingMutationSecond}] = useMutation(UPDATE_TASK_TO_PROJECT_MUTATION, {
        //     onCompleted: (data) => {
        //         onChange && onChange();
        //         openNotification('topRight', 'success', `Создание новой записи выполнено успешно`);
        //     },
        //     onError: (error) => {
        //         openNotification('topRight', 'error', `Ошибка при выполнении создания: ${error.message}`);
        //     }
        // });
        useEffect(() => {
            console.log("tasks", tasks);
        }, [tasks]);

        useEffect(() => {
            try {
                if (actualProject && actualProject.project_tasks) {
                    const sortedTasks = [...actualProject.project_tasks];
                    console.log("sortedTasks", sortedTasks);
                    const updatedTasks = sortedTasks.sort((a, b) => {
                        const dateA = new Date(a.date_start);
                        const dateB = new Date(b.date_start);
                        return dateA - dateB;
                    }).map(row => {
                        const stage = actualProject.project_tasks.find(stageRow => stageRow.stage_number === row.stage_number && !stageRow.project_task_inherited_id);
                        return {
                            line: row.stage_number,
                            type: row.project_task_inherited_id !== null ? "task" : "project",
                            id: row.id,
                            hideChildren: row.project_task_inherited_id > 0 ? null : false,
                            dependencies: [row.project_task_inherited_id],
                            progress: 20,
                            project: row.project_task_inherited_id !== null ?
                                stage.id
                                : null,
                            name: row.task.name,
                            start: row.date_start ? moment(row.date_start).startOf('day').toDate()
                                : (stage ? moment(stage.date_start).startOf('day').toDate() : new Date()),
                            end: row.date_end ? moment(row.date_end).startOf('day').toDate()
                                : (stage ? moment(stage.date_end).startOf('day').toDate() : new Date()),
                            min_start: stage ? null : (row.project_task_inherited_id !== null ? actualProject.project_tasks.find(second_row => second_row.id === row.project_task_inherited_id).date_start : null),
                            max_end: stage ? null : (row.project_task_inherited_id !== null ? actualProject.project_tasks.find(second_row => second_row.id === row.project_task_inherited_id).date_end : null),
                            data: {...row},
                        }
                    });
                    setTasks(updatedTasks);
                }
            } catch (err) {
                setError(err.message);
            }
        }, [actualProject]);

        const [isChecked, setIsChecked] = useState(true);

        let columnWidth = 120;

        const handleTaskChange = (task) => {
            let newTask = {
                ...task,
                start: moment(task.start).startOf('day').toDate(),
                end: moment(task.end).startOf('day').toDate(),
            };
            if (newTask?.data?.project_task_inherited_id !== null) {
                const mainTask = tasks.find(second_row => second_row.id === newTask?.data?.project_task_inherited_id);

                // Если задача полностью выходит за рамки главной задачи
                if ((newTask.end >= mainTask.end && newTask.start >= mainTask.end) ||
                    (newTask.start <= mainTask.start && newTask.end <= mainTask.start) ||
                    (!newTask.end && !newTask.start)) {
                    console.log("newTask.end > mainTask.end && newTask.start > mainTask.end или новые даты отсутствуют");
                    newTask.end = mainTask.end;
                    newTask.start = mainTask.start;
                } else {
                    // Обрезаем конец, если он выходит за рамки
                    if (newTask.end > mainTask.end) {
                        console.log("newTask.end > mainTask.end");
                        newTask.end = mainTask.end;
                    }
                    // Обрезаем начало, если он выходит за рамки
                    if (newTask.start < mainTask.start) {
                        console.log("newTask.start < mainTask.start");
                        newTask.start = mainTask.start;
                    }
                }
            }

            console.log("oldTask", task);

            console.log("newTask", newTask);
            setTasks(tasks.map((t) => (t.id === newTask.id ? newTask : t)).sort((a, b) => {
                const dateA = new Date(a.start);
                const dateB = new Date(b.start);
                return dateA - dateB;
            }));
        };

        const handleTaskDelete = (task) => {
            const conf = window.confirm("Are you sure about " + task.name + " ?");
            if (conf) {
                setTasks(() => tasks.filter((t) => t.id !== task.id));
            }
            return conf;
        };

        const handleProgressChange = async (task) => {
            setTasks(() => tasks.map((t) => (t.id === task.id ? task : t)));
        };

        const handleExpanderClick = (task) => {
            setTasks(() => tasks.map((t) => (t.id === task.id ? task : t)));
        };
        const handleComplete = () => {
            updateProjectTasks({
                variables: {
                    data: tasks.map(row => ({
                        id: row.id,
                        date_start: dayjs(row.start).format("YYYY-MM-DD"),
                        date_end: dayjs(row.end).format("YYYY-MM-DD"),
                        project_id: actualProject.id,
                    }))
                }
            })
        };

        if (error) {
            return <div>Ошибка отображения: {error}</div>;
        }

        if (!tasks || !actualProject) {
            return <loadingSpinnerStyles/>;
        }

        return (
            <>
                <GanttOriginal
                    style={{locale: "ru"}}
                    tasks={tasks}
                    locale={"ru"}
                    TooltipContent={(props, context) => {
                        return (
                            <StyledContextBlock label={props.task.name + " | " + props.task.id}>
                                <>
                                    Продолжительность {" "}
                                    {props.task.start ? moment(props.task.start).format('DD.MM.YYYY') : ""} - {props.task.end ? moment(props.task.end).format('DD.MM.YYYY') : ""}
                                    <br/>
                                    <strong>Исполнители:</strong>
                                    <br/>
                                    {props.task.data && props?.task?.data?.executors?.map(row =>
                                        (
                                            <>
                                                - {row.executor.passport.lastname} {row.executor.passport.firstname} {row.executor.passport.patronymic};
                                                <br/>
                                            </>
                                        )
                                    )}
                                </>
                            </StyledContextBlock>
                        )
                    }}
                    todayColor={"yellow"}
                    viewMode={ViewMode.Month}
                    onDateChange={handleTaskChange}
                    onDelete={handleTaskDelete}
                    ganttHeight={"800px"}
                    onProgressChange={handleProgressChange}
                    onExpanderClick={handleExpanderClick}
                    listCellWidth={isChecked ? "155px" : ""}
                    columnWidth={columnWidth}
                    TaskList={false}
                />
                <StyledButtonGreen  onClick={() => handleComplete()}>
                    Сохранить время
                </StyledButtonGreen>
            </>
        );
    }
;

export default TasksChartForm;
