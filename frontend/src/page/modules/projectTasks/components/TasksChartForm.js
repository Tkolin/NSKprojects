import React, {useEffect, useState} from "react";
import {GanttNationalResources, GanttOriginal, TaskList, ViewMode} from "react-gantt-chart";
import moment from 'moment';
import {StyledBlockSmall, StyledContextBlock, StyledContextBlockSmall} from "../../../../components/style/BlockStyles";
import dayjs from "dayjs";
import loadingSpinnerStyles from "../../../../components/style/LoadingSpinnerStyles";

const TasksChartForm = ({actualProject}) => {
    const [tasks, setTasks] = useState(null);


    useEffect(() => {
        if (actualProject && actualProject.project_tasks) {
            const sortedTasks = [...actualProject.project_tasks];
            console.log("sortedTasks", sortedTasks);
            const updatedTasks = sortedTasks.sort((a, b) => {
                const dateA = new Date(a.date_start);
                const dateB = new Date(b.date_start);
                return dateA - dateB;
            }).map(row => ({
                type: row.inherited_task_ids.length > 0 ? "task" : "project",
                id: row.id,
                dependencies: row.inherited_task_ids.length > 0 ? row?.inherited_task_ids?.map(row_second => row_second.project_inherited_task_id) : [],
                progress: 20,
                project: "ProjectSample",
                name: row.task.name,
                start: row.date_start ? moment(row.date_start).startOf('day').toDate() : new Date(2021, 6, 30),
                end: row.date_end ? moment(row.date_end).startOf('day').toDate() : new Date(2021, 6, 30),
                data: {...row},
            }));
            setTasks(updatedTasks);
        }
    }, [actualProject]);
    // const getStartEndDateForProject = (tasks, projectId) => {
    //     const projectTasks = tasks.filter((t) => t.project === projectId);
    //     let start = projectTasks[0].start;
    //     let end = projectTasks[0].end;
    //
    //     for (let i = 0; i < projectTasks.length; i++) {
    //         const task = projectTasks[i];
    //         if (start.getTime() > task.start.getTime()) {
    //             start = task.start;
    //         }
    //         if (end.getTime() < task.end.getTime()) {
    //             end = task.end;
    //         }
    //     }
    //     return [start, end];
    // };


    const [isChecked, setIsChecked] = useState(true);

    let columnWidth = 120;

    const handleTaskChange = (task) => {
        let newTask = {
            ...task,
            start: moment(task.start).startOf('day').toDate(),
            end: moment(task.end).startOf('day').toDate(),
        };

        if (newTask?.data?.inherited_task_ids.length !== 0) {
            const stageTask = tasks.find(row => {
                console.log(row.data.stage_number, "===", task.data.stage_number, "&&", row?.data?.inherited_task_ids.length, "===", 0);
                return (row.data.stage_number === task.data.stage_number && row?.data?.inherited_task_ids.length === 0);
            });

            if (newTask.end > stageTask.end)
                newTask.end = stageTask.end;
            if (newTask.start < stageTask.start)
                newTask.start = stageTask.start;
        }

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
    if (!tasks) {
        return <loadingSpinnerStyles/>
    }
    return (

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
                    </StyledContextBlock>)
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


    );
};

export default TasksChartForm;
