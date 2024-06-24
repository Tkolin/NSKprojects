import React, {useEffect, useState} from "react";
 import moment from 'moment';
import {StyledContextBlock} from "../../components/style/BlockStyles";
 import loadingSpinnerStyles from "../../components/style/LoadingSpinnerStyles";
 import {StyledButtonGreen} from "../../components/style/ButtonStyles";
import {GanttOriginal, ViewMode} from "react-gantt-chart";

const TasksChartForm = ({actualProject}) => {
    const [tasks, setTasks] = useState(null);
    useEffect(() => {
        console.log("tasks", tasks)
    }, [tasks]);

    useEffect(() => {
        if (actualProject && actualProject.project_tasks) {
            const sortedTasks = [...actualProject.project_tasks];
            console.log("sortedTasks", sortedTasks);
            const updatedTasks = sortedTasks.sort((a, b) => {
                const dateA = new Date(a.date_start);
                const dateB = new Date(b.date_start);
                return dateA - dateB;
            }).map(row => {
                const stage = actualProject.project_tasks.find(stageRow => stageRow.stage_number === row.stage_number && !stageRow.inherited_task_ids.length);
                return {
                    line: row.stage_number,
                    type: row.inherited_task_ids.length > 0 ? "task" : "project",
                    id: row.id,
                    hideChildren: row.inherited_task_ids.length > 0 ? null : false,
                    dependencies: row.inherited_task_ids.length > 0 ? row?.inherited_task_ids?.map(row_second => row_second.project_inherited_task_id) : [],
                    progress: 20,
                    project: row.inherited_task_ids.length > 0 ?
                        stage.id
                        : null,
                    name: row.task.name,
                    start: row.date_start ? moment(row.date_start).startOf('day').toDate()
                        : (stage ? moment(stage.date_start).startOf('day').toDate() : new Date()),
                    end: row.date_end ? moment(row.date_end).startOf('day').toDate()
                        : (stage ? moment(stage.date_end).startOf('day').toDate() : new Date()),
                    data: {...row},
                }
            });
            setTasks(updatedTasks);
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
            <StyledButtonGreen onClick={()=>console.log(tasks)}/>
        </>


    );
};

export default TasksChartForm;
