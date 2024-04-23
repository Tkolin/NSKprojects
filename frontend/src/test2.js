import React, {useEffect, useState} from 'react';
import { Input, Button, Space } from 'antd';
import {useQuery} from "@apollo/client";

const FormulaDetails = ({ formulaData }) => {
    const [values, setValues] = useState({});
    const [result, setResult] = useState('');

    const handleInputChange = (key, value) => {
        setValues({ ...values, [key]: value });
    };

    const evaluateFormula = () => {
        const stack = [];
        const formula = formulaData?.rpn_formula.split(' ');

        formula.forEach(token => {
            if (!isNaN(token)) {
                stack.push(parseFloat(token));
            } else if (token in values) {
                stack.push(parseFloat(values[token]));
            } else {
                const b = stack.pop();
                const a = stack.pop();
                switch (token) {
                    case '+':
                        stack.push(a + b);
                        break;
                    case '-':
                        stack.push(a - b);
                        break;
                    case '*':
                        stack.push(a * b);
                        break;
                    case '/':
                        stack.push(a / b);
                        break;
                }
            }
        });

        setResult(stack.pop());
    };

    useEffect(() => {
        console.log('2 ',formulaData )
    }, [formulaData]);
    return (
        <div>
            <h2>Formula Details</h2>
            <p><strong>Name:</strong> {formulaData?.name}</p>
            <p><strong>Description:</strong> {formulaData?.description}</p>
            <p><strong>Original Formula:</strong> {formulaData?.original_formula}</p>
            <Space direction="vertical">
                {formulaData?.variable_data?.map(variable => (
                    <Input
                        key={variable.name}
                        placeholder={variable.name}
                        onChange={(e) => handleInputChange(variable.name, e.target.value)}
                    />
                ))}
            </Space>
            <Button onClick={evaluateFormula}>Calculate</Button>
            <p><strong>Result:</strong> {result}</p>
        </div>
    );
};

export default FormulaDetails;
