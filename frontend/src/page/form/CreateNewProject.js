import React, {useState} from 'react';
import {Button, Col, Row, Steps} from 'antd';
import TasksProjectExecutorForm from "../component/TasksProjectExecutorForm";
import TasksToProjectStageForm from "../component/TasksToProjectStageForm";
import ProjectForm from "../form/ProjectForm";
import StagesProjectForm from "../component/StagesProjectForm";
import IrdsProjectForm from "../component/IrdsProjectForm";
import {StyledBlockBig, StyledBlockLarge, StyledBlockRegular} from "../style/BlockStyles";

const { Step } = Steps;

const MyComponent = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [project, setProject] = useState({});

    const handleProject = (data) => {
        setProject(data.addProject);
    };
    const onNext = () =>
    {
        setCurrentStep(currentStep+1);
    }
    const onBack = () =>
    {
        if(currentStep <= 1){
        setCurrentStep(currentStep-1);
        }
    }

    return (


        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Row style={{width: '100vh'}}>
                <Col span={4} >
                    <Steps current={currentStep} labelPlacement={"vertical"} style={{height: 400, marginTop: 40}} direction="vertical" >
                        <Step title="Первичное заполнение"/>
                        <Step title="Этапы"/>
                        <Step title="Ирд"/>
                        <Step title="Список задач"/>
                        <Step title="Распределение задач"/>
                    </Steps>
                    <Button disabled={(currentStep <= 0)} onClick={onBack}>Отменить шаг</Button>

                </Col>
                <Col span={20}>
                        {currentStep === 0 && (
                            <StyledBlockRegular>
                                <ProjectForm setProject={handleProject} onSubmit={onNext}/>
                            </StyledBlockRegular>
                        )}
                        {currentStep === 1 && (
                            <StagesProjectForm project={project}  onSubmit={onNext}/>
                        )}
                        {currentStep === 2 && (
                            <IrdsProjectForm project={project}  onSubmit={onNext}/>
                        )}
                        {currentStep === 3 && (
                            <TasksToProjectStageForm project={project}  onSubmit={onNext}/>

                        )}
                        {currentStep === 4 && (
                            <TasksProjectExecutorForm project={project}  onSubmit={onNext}/>

                        )}
                </Col>
            </Row>
        </div>


    );
};


export default MyComponent;
