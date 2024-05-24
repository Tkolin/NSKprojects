import React, {useContext, useState} from 'react';
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


const Index = () => {
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


    const {token} = theme.useToken();
    const rebuildProjectResultQuery = (data) => {
        const row = data?.createProject;
        return {
            ...data,
            date_create: dayjs(row?.date_create),
            date_end: dayjs(row?.date_end),
            date_signing: dayjs(row?.date_signing),
            delegates_id: row?.delegations?.map(k => k?.id),
            facility_id: row?.facilities?.map(k => k?.id),
            organization_customer_id: row?.organization_customer?.id,
            organization_customer_name: row?.organization_customer?.name,
            status_id: row?.status?.id,
            type_project_document_id: row?.type_project_document?.id,
            type_project_document_name: row?.type_project_document?.name,
        };
    };
    const rebuildStagesResultQuery = (data) => {
        console.log("rebuildStagesResultQuery");
        return data?.map((row, index) =>({
            ...row,
             date_range: [
                 row?.date_start ? dayjs(row?.date_start) : null,
                 row?.date_end ?  dayjs(row?.date_end)  : null],
            stage_number: index+1,
            stage_id: row?.stage?.id,
            stage_name: row?.stage?.name
        }));
    };
    const rebuildIrdsResultQuery = (data) => {
        return data?.map((row, index) =>({
            ...row,
            receivedDate:  row.receivedDate ? dayjs(row.receivedDate?.[1]).format("YYYY-MM-DD")  : null,
            ird_id: row?.IRD?.id,
            ird_name: row?.IRD?.name
        }));
    };
    const rebuildStagesToQuery = (data) => {
        if(!data)
            return [];
        const dataArray = Object.values(data);

        return dataArray?.map((row, index) =>({
            id: row?.id ?? null,
            project_id: project?.id ?? null,
            date_start: row.date_range?.[0] ? dayjs(row.date_range?.[0]).format("YYYY-MM-DD") : null,
            date_end: row.date_range?.[1] ? dayjs(row.date_range?.[1]).format("YYYY-MM-DD")  : null,
            duration: row?.duration ?? null,
            stage_id: row?.stage_id ?? null,
            stage_number: index+1,
            price: row?.price ?? null,
            percent: row?.percent ?? null,
            progress: row?.progress ?? null,
            price_to_paid: row?.price_to_paid ?? null,
        }));
    };
    const rebuildIrdToQuery = (data) => {
        if(!data)
            return [];
        const dataArray = Object.values(data);

        return dataArray?.map((row, index) =>({
            id:  row?.id ?? null,
            project_id: project?.id ?? null,
            ird_id: row?.ird_id ?? null,
            stageNumber: row?.stageNumber ? parseInt(row?.stageNumber) : null,
            applicationProject: row?.applicationProject ? parseInt(row?.applicationProject) : null,
            receivedDate: row?.receivedDate ? dayjs(row?.receivedDate).format("YYYY-MM-DD") : null,
        }));
    };

    const [mutateProject] = useMutation(project?.id ? UPDATE_PROJECT_MUTATION : ADD_PROJECT_MUTATION, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Создание новой записи в таблице  выполнено успешно`);
            updateProject(rebuildProjectResultQuery(data?.createProject));
            updateStages(rebuildStagesResultQuery(data?.createProject?.project_stages));

            updateIrds(rebuildIrdsResultQuery(data?.createProject?.project_irds));
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
            openNotification('topRight', 'error', `Ошибка при выполнении сооздания : ${error.message}`);
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
            openNotification('topRight', 'error', `Ошибка при выполнении сооздания : ${error.message}`);
            return false;
        },
    });
    const handleStage = (steps) => {


        setNewCurrent(steps)
        setCurrent(newCurrent);

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
                mutateIrd({variables: {data: rebuildIrdToQuery(irds)}});
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
                            <ProjectForm/>
                        </StyledBlockRegular>
                    ) :
                    current === 1 ? (
                            <StyledBlockLarge label={"Этапы"}>
                                <StagesProjectForm onCompleted={(value) => getNewProject(value, "STAGES")}/>
                            </StyledBlockLarge>
                        ) :
                        current === 2 ? (
                                <StyledBlockLarge label={"Ирд"}>
                                    <IrdsProjectForm onCompleted={(value) => getNewProject(value, "IRDS")}/>
                                </StyledBlockLarge>) :
                            current === 3 ? (<>
                                <ProjectDetails project={project}/>
                                </>) :
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
