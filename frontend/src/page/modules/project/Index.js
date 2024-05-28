import React, {useContext, useEffect, useState} from 'react';
import {Button, Form, Steps, theme} from 'antd';
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
import {UPDATE_IRD_MUTATION} from "../../../graphql/mutationsIrd";
import {UPDATE_STAGE_MUTATION} from "../../../graphql/mutationsStage";
import {NotificationContext} from "../../../NotificationProvider";
import dayjs from "dayjs";
import ProjectDetails from "./components/ProjectDetails";
import TasksProjectExecutorForm from "./components/TasksProjectExecutorForm";
import TasksToProjectStageForm from "./components/TasksToProjectStageForm";
import TaskProjectForm from "./components/TaskProjectForm";


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
            console.log("object",object)
            reconstructProjectToIrdsAndStages(object);
        }
    }, [object]);

    const {token} = theme.useToken();
    const rebuildProjectResultQuery = (data) => {
        return {
            ...data,
            date_create: data?.date_create ? dayjs(data?.date_create) : null,
            date_end: data?.date_end ? dayjs(data?.date_end): null,
            date_signing: data?.date_signing ? dayjs(data?.date_signing): null,
            delegates_id: data?.delegations?.map(k => k?.id),
            facility_id: data?.facilities?.map(k => k?.id),
            organization_customer_id: data?.organization_customer?.id,
            organization_customer_name: data?.organization_customer?.name,
            status_id: data?.status?.id,
            type_project_document_id: data?.type_project_document?.id,
            type_project_document_name: data?.type_project_document?.name,
        };
    };
    const rebuildStagesResultQuery = (data) => {
        return data?.map((row, index) => ({
            ...row,
            date_range: [
                row?.date_start ? dayjs(row?.date_start) : null,
                row?.date_end ? dayjs(row?.date_end) : null],
            stage_number: index + 1,
            stage_id: row?.stage?.id,
            stage_name: row?.stage?.name
        }));
    };
    const rebuildIrdsResultQuery = (data) => {
        return data?.map((row, index) => ({
            ...row,
            receivedDate: row.receivedDate ? dayjs(row.receivedDate?.[1]).format("YYYY-MM-DD") : null,
            ird_id: row?.IRD?.id,
            ird_name: row?.IRD?.name
        }));
    };
    const rebuildStagesToQuery = (data) => {
        if (!data)
            return [];
        const dataArray = Object.values(data);
        console.log("rebuildStagesToQuery", data);

        return dataArray?.map((row, index) => ({
            id: row?.id ?? null,
            project_id: project?.id ?? null,
            date_start: row.date_range?.[0] ? dayjs(row.date_range?.[0]).format("YYYY-MM-DD") : null,
            date_end: row.date_range?.[1] ? dayjs(row.date_range?.[1]).format("YYYY-MM-DD") : null,
            duration: row?.duration ?? null,
            stage_id: row?.stage_id ?? null,
            stage_number: index + 1,
            price: row?.price ?? null,
            percent: row?.percent ?? null,
            progress: row?.progress ?? null,
            price_to_paid: row?.price_to_paid ?? null,
        }));
    };
    const rebuildIrdToQuery = (data) => {
        if (!data)
            return [];
        const dataArray = Object.values(data);

        return dataArray?.map((row, index) => ({
            id: row?.id ?? null,
            project_id: project?.id ?? null,
            ird_id: row?.ird_id ?? null,
            stageNumber: row?.stageNumber ? parseInt(row?.stageNumber) : null,
            applicationProject: row?.applicationProject ? parseInt(row?.applicationProject) : null,
            receivedDate: row?.receivedDate ? dayjs(row?.receivedDate).format("YYYY-MM-DD") : null,
        }));
    };
    const rebuildProjectToQuery = (daprojectta) => {
        if (!project)
            return [];

        return{
            id: project?.id ?? null,
            number: project?.number,
            name: project?.name,
            organization_customer_id: project?.organization_customer_id,
            type_project_document_id: project?.type_project_document_id,
            date_signing: dayjs(project?.date_signing).format("YYYY-MM-DD"),
            duration: project?.duration,
            date_end: dayjs(project?.date_end).format("YYYY-MM-DD"),
            date_create: dayjs(project?.date_create).format("YYYY-MM-DD"),
            status_id: project?.status_id,
            date_completion: dayjs(project?.date_completion).format("YYYY-MM-DD"),
            price: project?.price,
            prepayment: project?.prepayment,
            facility_id: project?.facility_id?.map(row => row[3][0]),
            delegates_id: project?.delegates_id,
        };
    };
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
                mutateProject({
                    variables: {
                        data: {
                            id: project?.id ?? null,
                            number: project?.number,
                            name: project?.name,
                            organization_customer_id: project?.organization_customer_id,
                            type_project_document_id: project?.type_project_document_id,
                            date_signing: dayjs(project?.date_signing).format("YYYY-MM-DD"),
                            duration: project?.duration,
                            date_end: dayjs(project?.date_end).format("YYYY-MM-DD"),
                            date_create: dayjs(project?.date_create).format("YYYY-MM-DD"),
                            status_id: project?.status_id,
                            date_completion: dayjs(project?.date_completion).format("YYYY-MM-DD"),
                            price: project?.price,
                            prepayment: project?.prepayment,
                            facility_id: project?.facility_id?.map(row => row[3][0]),
                            delegates_id: project?.delegates_id,
                        }
                    }
                });

                break;
            case 1:
                mutateStage({variables: {data: rebuildStagesToQuery(stages)}});
                break;
            case 2:
                console.log("project", project);

                const data = rebuildIrdToQuery(irds);
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
                        subTitle: 'waiting for longlong time',
                        status: 'Требует сохранения',
                        description: 'Вывод документов.',
                    },
                ]}
            />
            <div style={contentStyle}>
                {current === 0 ? (
                        <StyledBlockRegular label={"Основные данные об проекте"}>
                            <ProjectForm actualProject={project} updateProject={(value) => updateProject(value)}/>
                        </StyledBlockRegular>
                    ) :
                    current === 1 ? (
                            <StyledBlockLarge label={"Этапы"}>
                                <StagesProjectForm
                                    updateStages={(value) => updateStages(value)}
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
                                <TaskProjectForm project={project}/>
                                </>) :
                                current === 4 ? (<>
                                        <ProjectDetails project={project}/>
                                    </>):
                                <></>
                }
            </div>
            <div
                style={{
                    marginTop: 24,
                }}
            >
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
