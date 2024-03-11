import React, {useState} from 'react';
import {Button, Col, Row, Steps} from 'antd';
import TasksProjectExecutorForm from "../aggregateComponent/projectForm/TasksProjectExecutorForm";
import TasksToProjectStageForm from "../aggregateComponent/projectForm/TasksToProjectStageForm";
import ProjectForm from "../basicForm/ProjectForm";
import StagesProjectForm from "../aggregateComponent/projectForm/StagesProjectForm";
import IrdsProjectForm from "../aggregateComponent/projectForm/IrdsProjectForm";
import { StyledBlockRegular} from "../../style/BlockStyles";

const {Step} = Steps;

const MyComponent = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [project, setProject] = useState(null);

    const handleProject = (data) => {
        setProject(data);
    };
    const onNext = () => {
        console.log("Вперёд");
        console.log(project);
        setCurrentStep(currentStep + 1);
    }
    const onBack = () => {
        console.log("Назад");
        console.log(project);
       setCurrentStep(currentStep - 1);
    }

    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <Row style={{width: '100vh'}}>
                <Col span={4}>
                    <Steps current={currentStep} labelPlacement={"vertical"} style={{height: 400, marginTop: 40}}
                           direction="vertical">
                        <Step title="Первичное заполнение"/>
                        <Step title="Этапы"/>
                        <Step title="Ирд"/>
                    </Steps>
                    <Button disabled={(currentStep <= 0)} onClick={onBack}>Отменить шаг</Button>
                </Col>
                <Col span={20}>
                    {currentStep === 0 && (
                        <StyledBlockRegular>
                            {project ? (
                                <ProjectForm project={project} setProject={handleProject} onSubmit={onNext}/>
                                ):(
                                <ProjectForm setProject={handleProject} onSubmit={onNext}/>
                                )}
                        </StyledBlockRegular>
                    )}
                    {currentStep === 1 && (
                        <StagesProjectForm project={project} onSubmit={onNext}/>
                    )}
                    {currentStep === 2 && (
                        <IrdsProjectForm project={project} onSubmit={onNext}/>
                    )}
                    {currentStep === 3 && (
                        <IrdsProjectForm project={project} onSubmit={onNext}/>
                    )}
                </Col>
            </Row>
        </div>
    );
};


export default MyComponent;
