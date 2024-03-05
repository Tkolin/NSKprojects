import React, { useState } from 'react';
import { Steps } from 'antd';

const { Step } = Steps;

const MyComponent = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [step1Data, setStep1Data] = useState(null);
    const [step2Data, setStep2Data] = useState(null);

    const handleStep1Submit = (data) => {
        setStep1Data(data);
        setCurrentStep(1);
    };

    const handleStep2Submit = (data) => {
        setStep2Data(data);
        setCurrentStep(2);
    };

    return (
        <div>
            <Steps current={currentStep}>
                <Step title="Шаг 1" />
                <Step title="Шаг 2" />
                <Step title="Шаг 3" />
            </Steps>
            {currentStep === 0 && (
                <Step1 onSubmit={handleStep1Submit} />
            )}
            {currentStep === 1 && (
                <Step2 onSubmit={handleStep2Submit} />
            )}
            {currentStep === 2 && (
                <Step3 step1Data={step1Data} step2Data={step2Data} />
            )}
        </div>
    );
};

const Step1 = ({ onSubmit }) => {
    const [data, setData] = useState('');

    const handleSubmit = () => {
        onSubmit(data);
    };

    return (
        <div>
            <input value={data} onChange={(e) => setData(e.target.value)} />
            <button onClick={handleSubmit}>Следующий шаг</button>
        </div>
    );
};

const Step2 = ({ onSubmit }) => {
    const [data, setData] = useState('');

    const handleSubmit = () => {
        onSubmit(data);
    };

    return (
        <div>
            <input value={data} onChange={(e) => setData(e.target.value)} />
            <button onClick={handleSubmit}>Следующий шаг</button>
        </div>
    );
};

const Step3 = ({ step1Data, step2Data }) => {
    return (
        <div>
            <p>Данные из шага 1: {step1Data}</p>
            <p>Данные из шага 2: {step2Data}</p>
            <p>Это последний шаг</p>
        </div>
    );
};

export default MyComponent;
