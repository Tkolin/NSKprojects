import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, Steps, theme} from 'antd';
import {StyledBlockLarge} from "../components/style/BlockStyles";


import {NotificationContext} from "../../NotificationProvider";
import NewTasksToProjectForm from "./components/NewTasksToProjectForm";
import EmployeeToTasksForm from "./components/EmployeeToTasksForm";
import {useLazyQuery} from "@apollo/client";
import {PROJECTS_QUERY_BY_ID} from "../../graphql/queriesByID";
import TasksChartForm from "./components/TasksChartForm";

const DistributionTasksByProject = ({project}) => {
    const {openNotification} = useContext(NotificationContext);
    const {token} = theme.useToken();
    // Хранилище

    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(false)
    const [newCurrent, setNewCurrent] = useState(current)
    // Мутация
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
                        <Card title={"Первичная настройка задач"}>

                            <NewTasksToProjectForm
                                //onCompleted={onCompleted}
                                actualProject={project}
                                setLoading={setLoading}/>
                        </Card>
                        //)
                    )

                    :
                    current === 1 ? (
                            <Card title={"Распределение задач по сотрудникам"}>
                                <EmployeeToTasksForm
                                    //onCompleted={onCompleted}
                                    actualProject={project}
                                    setLoading={setLoading}/>
                            </Card>

                        ) :
                        current === 2 ? (
                                <StyledBlockLarge label={"График ганта"}>
                                    <TasksChartForm actualProject={project}/>
                                </StyledBlockLarge>) :
                            <></>
                }
            </div>
        </>

    )
        ;

};

export default DistributionTasksByProject;
