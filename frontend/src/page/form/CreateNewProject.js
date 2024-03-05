import React, {useState} from 'react';
import { Steps, Button, message } from 'antd';
import TasksProjectExecutorForm from "../component/TasksProjectExecutorForm";
import TasksToProjectStageForm from "../component/TasksToProjectStageForm";
import ProjectForm from "../form/ProjectForm";
import StagesProjectForm from "../component/StagesProjectForm";
import IrdsProjectForm from "../component/IrdsProjectForm";
import {StyledBlockLarge} from "../style/BlockStyles";

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

    return (
        <div>
            <Steps current={currentStep}>
                <Step title="Первичное заполнение" />
                <Step title="Этапы" />
                <Step title="Ирд" />
                <Step title="Список задач" />
                <Step title="Список задач" />
            </Steps>
            {currentStep === 0 && (
                <ProjectForm setProject={handleProject} onSubmit={onNext} />
            )}
            {currentStep === 1 && (
                <StagesProjectForm project={project}/>
            )}
            {currentStep === 3 && (
                <IrdsProjectForm />
            )}
            {currentStep === 4 && (
                <TasksToProjectStageForm />
            )}
            {currentStep === 5 && (
                <TasksProjectExecutorForm />
            )}
        </div>
    );
};


export default MyComponent;
