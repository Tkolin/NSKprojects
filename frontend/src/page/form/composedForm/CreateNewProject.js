import React, { useEffect } from 'react';
import { Button, Col, Divider, Row, Steps, Typography } from 'antd';
import ProjectForm from "../basicForm/ProjectForm";
import StagesProjectForm from "../aggregateComponent/projectForm/StagesProjectForm";
import IrdsProjectForm from "../aggregateComponent/projectForm/IrdsProjectForm";
import { StyledBlockBig, StyledBlockLarge, StyledBlockRegular } from "../../style/BlockStyles";
import ProjectFileDownload from "../../script/ProjectFileDownload";
import StagesProjectFileDownload from "../../script/StagesProjectFileDownload";
import IrdsProjectFileDownload from "../../script/IrdsProjectFileDownload";
import ActRenderingProjectDownload from "../../script/ActRenderingProjectDownload";
import PaymentInvoiceProjectDownload from "../../script/PaymentInvoiceProjectDownload";
import TechnicalSpecificationProjectForm from "../aggregateComponent/projectForm/TechnicalSpecificationProjectForm";
import useProjectStore from '../../stores/useProjectStore';

const { Step } = Steps;

const ComposedProjectForm = ({ editProject }) => {
    const {
        currentStep,
        project,
        setCurrentStep,
        setProject
    } = useProjectStore();

    useEffect(() => {
        if (editProject) {
            setProject(editProject);
        }
    }, [editProject, setProject]);

    const handleProject = (data) => {
        setProject(data);
    };

    const onNext = () => {
        setCurrentStep(currentStep + 1);
    }

    const onBack = () => {
        setCurrentStep(currentStep - 1);
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Row style={{ width: '100vh' }}>
                <Col span={4}>
                    <Steps current={currentStep} labelPlacement={"vertical"} style={{ height: 400, marginTop: 40 }} direction="vertical">
                        <Step title="Заполнения основных данных" />
                        <Step title="Заполнение Этапы" />
                        <Step title="Заполнение Ирд" />
                        <Step title="Техническое задание" />
                        <Step title="Документы" />
                    </Steps>
                    <Button disabled={currentStep <= 0} onClick={onBack}>Отменить шаг</Button>
                    <Button onClick={onNext}>Следующий шаг</Button>
                </Col>
                <Col span={20}>
                    {currentStep === 0 && (
                        <StyledBlockRegular label={"Основные данные об проекте"}>
                            <ProjectForm project={project} setProject={handleProject} onSubmit={onNext} />
                        </StyledBlockRegular>
                    )}
                    {currentStep === 1 && (
                        <StyledBlockLarge label={"Этапы"}>
                            <StagesProjectForm setProject={handleProject} project={project} onSubmit={onNext} />
                        </StyledBlockLarge>
                    )}
                    {currentStep === 2 && (
                        <StyledBlockLarge label={"Список ИРД"}>
                            <IrdsProjectForm setProject={handleProject} project={project} onSubmit={onNext} />
                        </StyledBlockLarge>
                    )}
                    {currentStep === 3 && (
                        <StyledBlockLarge label={"Техническое задание"}>
                            <TechnicalSpecificationProjectForm setProject={handleProject} project={project} onSubmit={onNext} />
                        </StyledBlockLarge>
                    )}
                    {currentStep === 4 && (
                        <StyledBlockBig bordered size={"small"} label={"Сформированная документация:"}>
                            <ul>
                                <Divider>Основные</Divider>
                                <li>
                                    <ProjectFileDownload projectId={project.id} text={'Договор с заказчиком'} />
                                </li>
                                <li>
                                    <StagesProjectFileDownload projectId={project.id} text={'График работ'} />
                                </li>
                                <li>
                                    <IrdsProjectFileDownload projectId={project.id} text={'Список ИРД'} />
                                </li>
                                <Divider>Акты выполненных работ</Divider>
                                <li>
                                    <PaymentInvoiceProjectDownload projectId={project.id} isPrepayment={true} text={'Аванс'} />
                                </li>
                                {project?.project_stages?.map((psid, index) => (
                                    <li key={index}>
                                        <PaymentInvoiceProjectDownload stageNumber={psid.number}
                                                                       projectId={project.id}
                                                                       text={`Этап №${psid.number} (${psid.stage.name})`}
                                                                       type="acts" />
                                    </li>
                                ))}
                                <Divider>Счета на оплату</Divider>
                                {project?.project_stages?.map((psid, index) => (
                                    <li key={index}>
                                        <ActRenderingProjectDownload stageNumber={psid.number}
                                                                     text={`Этап №${psid.number} (${psid.stage.name})`}
                                                                     projectId={project.id} type="acts" />
                                    </li>
                                ))}
                            </ul>
                        </StyledBlockBig>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default ComposedProjectForm;
