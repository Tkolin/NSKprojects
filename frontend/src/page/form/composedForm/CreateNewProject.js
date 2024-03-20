import React, {useState} from 'react';
import {Button, Col, Descriptions, Row, Space, Steps} from 'antd';
import TasksProjectExecutorForm from "../aggregateComponent/projectForm/TasksProjectExecutorForm";
import TasksToProjectStageForm from "../aggregateComponent/projectForm/TasksToProjectStageForm";
import ProjectForm from "../basicForm/ProjectForm";
import StagesProjectForm from "../aggregateComponent/projectForm/StagesProjectForm";
import IrdsProjectForm from "../aggregateComponent/projectForm/IrdsProjectForm";
import {StyledBlockBig, StyledBlockLarge, StyledBlockRegular, StyledBlockSmall} from "../../style/BlockStyles";
import ProjectDetails from "../../view/detailsView/ProjectDetails";
import PersonContractFileDownload from "../../script/PersonContractFileDownload";
import ProjectFileDownload from "../../script/ProjectFileDownload";
import StagesProjectFileDownload from "../../script/StagesProjectFileDownload";
import IrdsProjectFileDownload from "../../script/IrdsProjectFileDownload";

const {Step} = Steps;

const MyComponent = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [project, setProject] = useState(null);

    const handleProject = (data) => {
        setProject(null);
        setProject(data);
        console.log("hancldeProjectCreater ", data);
    };
    const onNext = () => {

        setCurrentStep(currentStep + 1);
    }
    const onBack = () => {

       setCurrentStep(currentStep - 1);
    }

    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <Row style={{width: '100vh'}}>
                <Col span={4}>
                    <Steps current={currentStep} labelPlacement={"vertical"} style={{height: 400, marginTop: 40}}
                           direction="vertical">
                        <Step title="Заполнения основных данных"/>
                        <Step title="Заполнение Этапы"/>
                        <Step title="Заполнение Ирд"/>
                        <Step title="Документы"/>
                        {/*<Step title="Проверка данных"/>*/}
                    </Steps>
                    <Button disabled={(currentStep <= 0)} onClick={onBack}>Отменить шаг</Button>
                    <Button  onClick={onNext}>----</Button>
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
                        <StyledBlockBig label={"Сформированная документация:"}>
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
                            </Descriptions>
                        </StyledBlockBig>
                        // <ProjectDetails project={project} onSubmit={onNext}/>
                    )}
                </Col>
            </Row>
        </div>
    );
};


export default MyComponent;
