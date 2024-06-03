import React, {useContext, useEffect, useState} from 'react';
import {Button, Form, Steps, theme} from 'antd';
import {StyledBlockLarge, StyledBlockRegular} from "../../../components/style/BlockStyles";

import {useProjectStore, useTasksStore} from "./Store";


import {NotificationContext} from "../../../NotificationProvider";
import TasksToProjectForm from "./components/TasksToProjectForm";
import EmployeeToTasksForm from "./components/EmployeeToTasksForm";
import {useMutation} from "@apollo/client";
import {UPDATE_TASK_TO_PROJECT_MUTATION} from "../../../graphql/mutationsTask";


const Index = ({object}) => {
    const current = useTasksStore((state) => state.step);
    const setCurrent = useTasksStore((state) => state.setSteps);

    const project = useTasksStore((state) => state.project);
    const tasks = useTasksStore((state) => state.tasks);

    const updateProject = useTasksStore((state) => state.updateProject);
    const updateTasks = useTasksStore((state) => state.updateTasks);
    const [newCurrent, setNewCurrent] = useState(current)

    const {openNotification} = useContext(NotificationContext);

    useEffect(() => {
        if (object) {
            updateProject(object)
            object?.project_tasks && updateTasks(object?.project_tasks);
        }
    }, [object]);
    useEffect(() => {
        if (tasks) {
            console.log("oldTasks", tasks)
        }
    }, []);

    const {token} = theme.useToken();
    const [mutateTasksToProject] = useMutation(UPDATE_TASK_TO_PROJECT_MUTATION, {
        onCompleted: (data) => {
            console.log("mutateTasksToProject", data);
            updateTasks({...tasks, ...data?.updateTaskToProject});
            setCurrent(newCurrent)
        },
        onError: (error) => {
            console.log("mutateTasksToProject error", error.message);

        },
    });
    const rebuildTasksToQuery = (treeTasksInForm, listStageNumbersStageInForm, projectId) => {
        const result = [];
        if (projectId) {
            console.error("проекта нет для задачи ");
        }
        const processNode = (node, parentKey = null) => {
            const task = {
                projectId: 108,//TODO: projectId ? projectId?.toString() : null,
                inherited_task_ids: parentKey ? [parentKey?.toString()] : [],
                task_id: node?.key?.toString(),
            };

            result.push(task);
            if (node.children) {
                node.children.forEach(child => processNode(child, node.key));
            }
        };

        treeTasksInForm.forEach(node => processNode(node));
        result.forEach(task => {
            for (const [stageNumber, taskIds] of Object.entries(listStageNumbersStageInForm)) {
                if (taskIds.includes(task.task_id)) {
                    task.stage_number = parseInt(stageNumber);
                    break;
                }
            }
        });

        return result;
    };
    const handleStage = (steps) => {
        setNewCurrent(steps)
        switch (current) {
            case 0:
                mutateTasksToProject({
                    variables: {
                        data:
                            rebuildTasksToQuery(tasks.gData,
                                tasks.checkedKeys, project.id)
                    }
                })
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
                                actualProject={project}
                                actualTasks={tasks}/>
                        </StyledBlockLarge>
                    ) :
                    current === 1 ? (
                            <StyledBlockLarge label={"Распределение задач по сотрудникам"}>
                                <EmployeeToTasksForm/>
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
