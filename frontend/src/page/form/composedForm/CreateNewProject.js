import React, {useEffect, useState} from 'react';
import {Button, Col, Descriptions, Row, Steps, Typography} from 'antd';
import ProjectForm from "../basicForm/ProjectForm";
import StagesProjectForm from "../aggregateComponent/projectForm/StagesProjectForm";
import IrdsProjectForm from "../aggregateComponent/projectForm/IrdsProjectForm";
import {StyledBlockBig, StyledBlockLarge, StyledBlockRegular} from "../../style/BlockStyles";
import ProjectFileDownload from "../../script/ProjectFileDownload";
import StagesProjectFileDownload from "../../script/StagesProjectFileDownload";
import IrdsProjectFileDownload from "../../script/IrdsProjectFileDownload";
import ActRenderingProjectDownload from "../../script/ActRenderingProjectDownload";
import PaymentInvoiceProjectDownload from "../../script/PaymentInvoiceProjectDownload";
import TechnicalSpecificationForm from "../aggregateComponent/projectForm/SectionReferenceProjectForm.js";

const {Step} = Steps;
const { Text } = Typography;

const ComposedProjectForm = ({editProject}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [project, setProject] = useState(editProject || null);
    useEffect(() => {
        console.log(project);
        console.log(editProject);
    }, [project]);

    const handleProject = (data) => {
        setProject(null);
        setProject(data);
    };
    const onNext = () => {setCurrentStep(currentStep + 1);}
    const onBack = () => {setCurrentStep(currentStep - 1);}

    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <Row style={{width: '100vh'}}>
                <Col span={4}>
                    <Steps current={currentStep} labelPlacement={"vertical"} style={{height: 400, marginTop: 40}}
                           direction="vertical">
                        <Step title="Заполнения основных данных"/>
                        <Step title="Заполнение Этапы"/>
                        <Step title="Заполнение Ирд"/>
                        <Step title="Техническое задание"/>
                        <Step title="Документы"/>
                    </Steps>
                    <Button disabled={(currentStep <= 0)} onClick={onBack}>Отменить шаг</Button>
                    <Button onClick={onNext}>----</Button>
                </Col>
                <Col span={20}>
                    {currentStep === 0 && (
                        <StyledBlockRegular label={"Основные даннные об проекте"}>
                            {project ? (
                                <ProjectForm project={project} setProject={handleProject} onSubmit={onNext}/>
                                ):(
                                <ProjectForm setProject={handleProject} onSubmit={onNext}/>
                                )}
                        </StyledBlockRegular>
                    )}
                    {currentStep === 1 && (
                        <StyledBlockLarge label={"Этапы"}>
                            <StagesProjectForm setProject={handleProject} project={project} onSubmit={onNext}/>
                        </StyledBlockLarge>
                    )}
                    {currentStep === 2 && (
                        <StyledBlockLarge label={"Список ИРД"}>
                            <IrdsProjectForm setProject={handleProject} project={project} onSubmit={onNext}/>
                        </StyledBlockLarge>
                    )}
                    {currentStep === 3 && (
                        <StyledBlockLarge label={"Техническоое задание"}>
                            <TechnicalSpecificationForm setProject={handleProject} project={project} onSubmit={onNext}/>
                        </StyledBlockLarge>
                    )}
                    {currentStep === 4 && (
                        <StyledBlockBig  bordered size={"small"}  label={"Сформированная документация:"}>
                            <Descriptions>
                                <Descriptions.Item label="Договор с заказчиком">
                                    <ProjectFileDownload projectId={project.id}/>
                                </Descriptions.Item>
                                <Descriptions.Item label="График работ">
                                    <StagesProjectFileDownload projectId={project.id}/>
                                </Descriptions.Item>
                                <Descriptions.Item label="Список ИРД">
                                    <IrdsProjectFileDownload projectId={project.id}/>
                                </Descriptions.Item>
                                    <Descriptions.Item column={1} label="Акты выполненных работ" span={3}>
                                        {project?.project_stages?.map(psid => (
                                            psid.stage.id !== 0 && (
                                            <div>
                                                <Text style={{marginRight: 20}}>Этап №{psid.number} ({psid.stage.name}):   </Text>
                                                <PaymentInvoiceProjectDownload stageNumber={psid.number} projectId={project.id} type="acts"/>
                                            </div>)
                                        ) )}
                                    </Descriptions.Item>
                                    <Descriptions.Item column={2} label="Счета на оплату" span={3}>
                                        {project?.project_stages?.map(psid => (
                                                <div>
                                                    <Text style={{marginRight: 20}}>Этап №{psid.number} ({psid.stage.name}):   </Text>
                                                    <ActRenderingProjectDownload stageNumber={psid.number}
                                                                                 projectId={project.id} type="acts"/>
                                                </div>
                                        ))}
                                    </Descriptions.Item>

                            </Descriptions>
                        </StyledBlockBig>
                    )}
                </Col>
            </Row>
        </div>
    );
};


export default ComposedProjectForm;
