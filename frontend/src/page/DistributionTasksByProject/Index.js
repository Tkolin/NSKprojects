import React, {useContext, useEffect, useState} from 'react';
import {Button, Steps, theme} from 'antd';
import {StyledBlockLarge} from "../components/style/BlockStyles";


import {NotificationContext} from "../../NotificationProvider";
import NewTasksToProjectForm from "./components/NewTasksToProjectForm";
import EmployeeToTasksForm from "./components/EmployeeToTasksForm";
import {useLazyQuery} from "@apollo/client";
import {PROJECTS_QUERY_BY_ID} from "../../graphql/queriesByID";
import TasksChartForm from "./components/TasksChartForm";
import TasksToProjectForm from "./components/TasksToProjectForm";

const Index = ({project, onChange}) => {
    const {openNotification} = useContext(NotificationContext);
    const {token} = theme.useToken();
    // Хранилище

    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(false)
    const [newCurrent, setNewCurrent] = useState(current)
    // Мутация

    // const rebuildQueryToTasks = (tasksFromQuery) => {
    //     console.log("start rebuildQueryToTasks", tasksFromQuery);
    //     if (!tasksFromQuery)
    //         return null;
    //
    //     const map = {};
    //     const roots = [];
    //     const checkedKeys = {};
    //
    //     // Создание карты задач по их ID для быстрого доступа
    //     tasksFromQuery.forEach(task => {
    //         map[task.id] = {
    //             title: task?.task?.name,
    //             key: task?.task?.id,
    //             disableCheckbox: false,
    //             children: [],
    //         };
    //     });
    //
    //     // Построение дерева задач на основе inherited_task_ids
    //     tasksFromQuery.forEach(task => {
    //         if (task?.inherited_task_ids && task?.inherited_task_ids.length > 0) {
    //             const parentKey = task.inherited_task_ids[0].project_inherited_task_id;
    //             if (map[parentKey]) {
    //                 map[parentKey].children.push(map[task.id]);
    //             }
    //         } else {
    //             roots.push(map[task.id]);
    //         }
    //     });
    //
    //     // Создание checkedKeys
    //     tasksFromQuery.forEach(row => {
    //         if (!checkedKeys[row.stage_number]) {
    //             checkedKeys[row.stage_number] = [];
    //         }
    //         checkedKeys[row.stage_number].push(row?.task?.id);
    //     });
    //     console.log("end rebuildQueryToTasks checkedKeys", {
    //         gData: roots,
    //         checkedKeys: checkedKeys
    //     });
    //
    //     return {
    //         gData: roots,
    //         checkedKeys: checkedKeys
    //     };
    // };

    // TODO: Для проверки
    const [loadContext, {data: data}] = useLazyQuery(PROJECTS_QUERY_BY_ID, {
        variables: {id: project.id},
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Данные подгружены.`);

        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при загрузке данных: ${error.message}`);
        },
    });
    useEffect(() => {
        console.log("./useEffect", project);
        if (project?.id)
            loadContext();
    }, [project]);

    const handleStage = (steps) => {
        setNewCurrent(steps)
        switch (current) {
            case 0:
                setCurrent(steps);
                break;
            case 1:
                setCurrent(steps);
                break;
            case 2:
                setCurrent(steps);
                break;
            case 3:
                setCurrent(steps);
                break;
            case 4:
                setCurrent(steps);
        }
    }

    const next = () => {
        handleStage(current + 1);
    };

    const prev = () => {
        handleStage(current - 1);
    };

    const onChangeStep = (value) => {
        handleStage(value);
    };


    return (
        <>
            <Steps
                type="navigation"
                size="small"
                current={current}
                onChange={onChangeStep}
                className="site-navigation-steps"
                items={[
                    {
                        title: 'Этап 1',
                        status: 'Требует сохранения',
                        description: 'Создание списка задач.',
                    },
                    {
                        title: 'Этап 2',
                        status: 'Требует сохранения',
                        description: 'Распределение задач по сотрудникам.',
                    },
                    {
                        title: 'Этап 3',
                        status: 'Требует сохранения',
                        description: 'График ганта.',
                    }
                ]}
            />
        {/*    <Button type="primary" onClick={() => console.log("чек еп", project)}>*/}
        {/*    чек*/}
        {/*</Button>*/}
            <div>
                {current === 0 ?


                    // (   project?.project_tasks?.length >= 1 ?
                    //
                    //         (
                    //             <StyledBlockLarge label={"Настройка задач"}>
                    //                 kk
                    //                 <TasksToProjectForm
                    //                     onChange={onChange && onChange()}
                    //                     actualProject={project}
                    //                     setLoading={setLoading}/>
                    //             </StyledBlockLarge>
                    //         ) : (
                    (
                        <StyledBlockLarge label={"Первичная настройка задач"}>
                             <NewTasksToProjectForm
                                onChange={onChange && onChange()}
                                actualProject={project}
                                setLoading={setLoading}/>
                        </StyledBlockLarge>
                        //)
                    )

                    :
                    current === 1 ? (
                            <StyledBlockLarge label={"Распределение задач по сотрудникам"}>
                                <EmployeeToTasksForm
                                    onChange={() => onChange && onChange()}
                                    actualProject={project}
                                    setLoading={setLoading}/>
                            </StyledBlockLarge>
                        ) :
                        current === 2 ? (
                                <StyledBlockLarge label={"График ганта"}>
                                    <TasksChartForm actualProject={project}/>
                                </StyledBlockLarge>) :
                            <></>
                }
            </div>
            <div
                style={{
                    marginTop: 24,
                }}
            >
                {current < 3 - 1 && (
                    <Button type="primary" onClick={() => next()}>
                        Вперёд
                    </Button>
                )}
                {current === 3 - 1 && (
                    <Button type="primary" onClick={() => console.log('Processing complete!')}>
                        Завершить
                    </Button>
                )}
                {current > 0 && (
                    <Button
                        style={{
                            margin: '0 8px',
                        }}
                        onClick={() => prev()}
                    >
                        Назад
                    </Button>
                )}
            </div>
        </>

    )
        ;

};

export default Index;
