import React, {useContext, useEffect, useState} from 'react';
import {Button, Space, Steps, theme} from 'antd';
import {StyledBlockLarge, StyledBlockRegular} from "../../../components/style/BlockStyles";
import StagesProjectForm from "./components/StagesProjectForm";

import ProjectForm from "./components/ProjectForm";
import {useProjectStore} from "./Store";
import IrdsProjectForm from "./components/IrdsProjectForm";
import {useMutation} from "@apollo/client";
import {
    ADD_PROJECT_MUTATION, UPDATE_IRDS_TO_PROJECT_MUTATION,
    UPDATE_PROJECT_MUTATION,
    UPDATE_STAGES_TO_PROJECT_MUTATION
} from "../../../graphql/mutationsProject";
import {NotificationContext} from "../../../NotificationProvider";
import { rebuildProjectResultQuery, rebuildStagesResultQuery, rebuildIrdsResultQuery, rebuildStagesToQuery, rebuildIrdToQuery, rebuildProjectToQuery } from '../../../components/script/rebuildData/ProjectRebuilderQuery';
import ProjectDetails from "./components/ProjectDetails";
import {StyledButtonGreen} from "../../../components/style/ButtonStyles";


const Index = ({object}) => {
    const current = useProjectStore((state) => state.step);
    const setCurrent = useProjectStore((state) => state.setSteps);

    const project = useProjectStore((state) => state.project);
    const irds = useProjectStore((state) => state.irds);
    const stages = useProjectStore((state) => state.stages);

    const updateProject = useProjectStore((state) => state.updateProject);
    const updateIrds = useProjectStore((state) => state.updateIrds);
    const updateStages = useProjectStore((state) => state.updateStages);
    const [newCurrent, setNewCurrent] = useState(current)

    const {openNotification} = useContext(NotificationContext);
    useEffect(() => {
        if (object && object.id) {
            setCurrent(0);
            console.log("object", object)
            reconstructProjectToIrdsAndStages(object);
        }
    }, [object]);

    const {token} = theme.useToken();


    const reconstructProjectToIrdsAndStages = (project) => {
        console.log("reconstructProjectToIrdsAndStages", project);
        console.log("updateProject", rebuildProjectResultQuery(project));

        updateProject(rebuildProjectResultQuery(project));

        updateStages(rebuildStagesResultQuery(project?.project_stages));

        updateIrds(rebuildIrdsResultQuery(project?.project_irds));
    }
    const [mutateProject] = useMutation(project?.id ? UPDATE_PROJECT_MUTATION : ADD_PROJECT_MUTATION, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Создание новой записи в таблице  выполнено успешно`);
            reconstructProjectToIrdsAndStages(data?.createProject);

            setCurrent(newCurrent);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при выполнении сооздания : ${error.message}`);
        },
    });

    const [mutateIrd] = useMutation(UPDATE_IRDS_TO_PROJECT_MUTATION, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Создание новой записи в таблице  выполнено успешно`);
            updateIrds(rebuildIrdsResultQuery(data?.updateIrdsToProject));
            setCurrent(newCurrent);

        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при выполнении сооздания ирд : ${error.message}`);
            return false;
        },
    });

    const [mutateStage] = useMutation(UPDATE_STAGES_TO_PROJECT_MUTATION, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Создание новой записи в таблице  выполнено успешно`);
            updateStages(rebuildStagesResultQuery(data?.updateStagesToProject));
            setCurrent(newCurrent);

        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при выполнении сооздания этапа : ${error.message}`);
            return false;
        },
    });
    const handleStage = (steps) => {


        setNewCurrent(steps)

        switch (current) {
            case 0:
                mutateProject({variables: {data: rebuildProjectToQuery(project,project)}});
                break;
            case 1:
                mutateStage({variables: {data: rebuildStagesToQuery(stages, project)}});
                break;
            case 2:
                console.log("project", project);

                const data = rebuildIrdToQuery(irds,project);
                console.log("mutateIrd", data);
                mutateIrd({variables: {data: data}});
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

    const getNewProject = (value, type) => {
        console.log('onChange:', value);
        //setCurrent(value);
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
                        description: 'Заполнение основной ифнормации.',
                    },
                    {
                        title: 'Этап 2',
                        status: 'Требует сохранения',
                        description: 'Указание этапов проекта.',
                    },
                    {
                        title: 'Этап 3',
                        status: 'Требует сохранения',
                        description: 'Указание ИРД по проекту.',
                    },
                    {
                        title: 'Этап 4',
                        status: 'Требует сохранения',
                        description: 'Вывод документов.',
                    },
                ]}
            />
            <div style={contentStyle}>
                {current === 0 ? (
                        <StyledBlockRegular label={"Основные данные об проекте"}>
                            <ProjectForm actualProject={project} onCompleted={() => next()}
                                         updateProject={(value) => {console.log("updateProject",value); updateProject(value);}}
                                         // confirmFormButton={
                                         //     <div style={{textAlign: 'center'}}>
                                         //         <Space>
                                         //             <StyledButtonGreen style={{marginBottom: 0}} htmlType="submit">
                                         //                 Сохранить проект
                                         //             </StyledButtonGreen>
                                         //         </Space>
                                         //     </div>
                                         // }
                            />
                        </StyledBlockRegular>
                    ) :
                    current === 1 ? (
                            <StyledBlockLarge label={"Этапы"}>
                                <StagesProjectForm
                                    updateStages={(value) => {console.log("updateStages",value); updateStages(value)}}
                                    actualStages={stages}
                                    project={project}/>
                            </StyledBlockLarge>
                        ) :
                        current === 2 ? (
                                <StyledBlockLarge label={"Ирд"}>
                                    <IrdsProjectForm
                                        actualIrds={irds}
                                        updateIrds={(value) => updateIrds(value)}/>
                                </StyledBlockLarge>) :
                            current === 3 ? (<>
                                    <ProjectDetails project={project}/>
                                </>) :
                                <></>
                }
            </div>
            <div style={{display: 'flex', justifyContent: 'center', marginTop: 24}}>

                {current < 4 - 1 && (
                    <Button type="primary" onClick={() => next()}>
                        Вперёд
                    </Button>
                )}
                {current === 4 - 1 && (
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
