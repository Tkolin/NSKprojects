import React, {useContext, useEffect, useState} from 'react';
import {Button, Form, Steps, theme} from 'antd';
import {StyledBlockLarge, StyledBlockRegular} from "../../../components/style/BlockStyles";

import {useProjectStore, useTasksStore} from "./Store";


import {NotificationContext} from "../../../NotificationProvider";
import TasksToProjectForm from "./components/TasksToProjectForm";
import EmployeeToTasksForm from "./components/EmployeeToTasksForm";
import {useLazyQuery, useMutation} from "@apollo/client";
import {UPDATE_TASK_TO_PROJECT_MUTATION} from "../../../graphql/mutationsTask";
import {CONTACTS_QUERY_BY_ID, PROJECTS_QUERY_BY_ID} from "../../../graphql/queriesByID";

const Index = ({object}) => {
    const {openNotification} = useContext(NotificationContext);
    const {token} = theme.useToken();
    // Хранилище
    const current = useTasksStore((state) => state.step);
    const setCurrent = useTasksStore((state) => state.setSteps);
    const loading = useTasksStore((state) => state.loading);
    const setLoading = useTasksStore((state) => state.setLoading);
    const project = useTasksStore((state) => state.project);
    const setProject = useTasksStore((state) => state.setProject);
    const updateTasks = useTasksStore((state) => state.updateTasks)
    // Активные состояния
    const [newCurrent, setNewCurrent] = useState(current)
    // Мутация
    const [mutateTasksToProject] = useMutation(UPDATE_TASK_TO_PROJECT_MUTATION,{
        onCompleted: (data)=>{
            console.log("UPDATE_TASK_TO_PROJECT_MUTATION",data);
            updateTasks(data.updateTaskToProject);
        },
        onError: (error) => {

        }
    });
    const rebuildQueryToTasks = (tasksFromQuery) => {
        console.log("start rebuildQueryToTasks", tasksFromQuery);
        if(!tasksFromQuery)
            return null;

        const map = {};
        const roots = [];
        const checkedKeys = {};

        // Создание карты задач по их ID для быстрого доступа
        tasksFromQuery.forEach(task => {
            map[task.id] = {
                title: task?.task?.name,
                key: task?.task?.id,
                disableCheckbox: false,
                children: [],
            };
        });

        // Построение дерева задач на основе inherited_task_ids
        tasksFromQuery.forEach(task => {
            if (task?.inherited_task_ids && task?.inherited_task_ids.length > 0) {
                const parentKey = task.inherited_task_ids[0].project_inherited_task_id;
                if (map[parentKey]) {
                    map[parentKey].children.push(map[task.id]);
                }
            } else {
                roots.push(map[task.id]);
            }
        });

        // Создание checkedKeys
        tasksFromQuery.forEach(row => {
            if (!checkedKeys[row.stage_number]) {
                checkedKeys[row.stage_number] = [];
            }
            checkedKeys[row.stage_number].push(row?.task?.id);
        });
        console.log("end rebuildQueryToTasks checkedKeys", {
            gData: roots,
            checkedKeys: checkedKeys});

        return {
            gData: roots,
            checkedKeys: checkedKeys};
    };

    // TODO: Для проверки
    const [loadContext, {data: data}] = useLazyQuery(PROJECTS_QUERY_BY_ID, {
        variables: {id: 108},
        onCompleted: (data) => {
            setProject(data?.projects?.items[0]);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при загрузке данных: ${error.message}`);
        },
    });
    useEffect(() => {
        loadContext();
    }, []);

    // Прослушка
    useEffect(() => {
        if (object) {
            //setProject(object)
            object?.project_tasks && updateTasks(object?.project_tasks);
        }
    }, [object]);



    const handleStage = (steps) => {
        setNewCurrent(steps)
        switch (current) {
            case 0:
                mutateTasksToProject({
                    variables: {
                        data: project.project_tasks,
                        rules: "delete_inherited"
                    }
                })
                break;
            case 1:
                // mutateTasksToProject({
                //     variables: {
                //         data:
                //             rebuildTasksToQuery(project.project_tasks.gData,
                //                 project.project_tasks.checkedKeys, project.id),
                //         rules: "not_delete"
                //     }
                // })
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


    const contentStyle = {
        lineHeight: '260px',
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `1px dashed ${token.colorBorder}`,
        marginTop: 16,
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
            <div style={contentStyle}>
                {current === 0 ? (
                        <StyledBlockLarge label={"Создание списка задач"}>
                            <TasksToProjectForm
                                updateTasks={(value) => updateTasks(value)}
                                actualTasks={project?.project_tasks ? rebuildQueryToTasks(project?.project_tasks) :  []}
                                actualProject={project}
                                setLoading={setLoading}/>
                        </StyledBlockLarge>
                    ) :
                    current === 1 ? (
                            <StyledBlockLarge label={"Распределение задач по сотрудникам"}>
                                <EmployeeToTasksForm
                                    updateTasks={(value) => updateTasks(value)}
                                    actualTasks={project?.project_tasks ? rebuildQueryToTasks(project?.project_tasks) :  []}
                                    actualProject={project}
                                    setLoading={setLoading}/>
                            </StyledBlockLarge>
                        ) :
                        current === 2 ? (
                                <StyledBlockLarge label={"График"}>

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
