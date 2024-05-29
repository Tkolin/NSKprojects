import React, {useContext, useEffect, useState} from 'react';
import {Button, Form, Steps, theme} from 'antd';
import {StyledBlockLarge, StyledBlockRegular} from "../../../components/style/BlockStyles";

import {useProjectStore, useTasksStore} from "./Store";


import {NotificationContext} from "../../../NotificationProvider";
import TasksToProjectForm from "./components/TasksToProjectForm";
import EmployeeToTasksForm from "./components/EmployeeToTasksForm";


const Index = ({object}) => {
    const current = useTasksStore((state) => state.step);
    const setCurrent = useTasksStore((state) => state.setSteps);

    const project = useTasksStore((state) => state.project);
    const tasks = useTasksStore((state) => state.tasks);

    const updateProject = useTasksStore((state) => state.updateProject);
    const updateTasks = useTasksStore((state) => state.updateTasks);
    const [newCurrent, setNewCurrent] = useState(current)

    const {openNotification} = useContext(NotificationContext);


    const {token} = theme.useToken();


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
                            <TasksToProjectForm/>
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
