import React, { useState } from 'react';
import { Form, Input, Button, Space } from 'antd';

const FormulaInput = () => {
    const [formula, setFormula] = useState('');
    const [variables, setVariables] = useState([]);

    const handleAddVariable = () => {
        setVariables([...variables, { name: '', value: '' }]);
    };

    const handleRemoveVariable = (index) => {
        setVariables(variables.filter((_, i) => i !== index));
    };

    const handleVariableNameChange = (index, value) => {
        const updatedVariables = [...variables];
        updatedVariables[index].name = value;
        setVariables(updatedVariables);
    };

    const handleVariableValueChange = (index, value) => {
        const updatedVariables = [...variables];
        updatedVariables[index].value = value;
        setVariables(updatedVariables);
    };

    const handleFormulaChange = (value) => {
        setFormula(value);
    };

    const extractVariables = () => {
        const variableRegex = /\b[a-zA-Z][a-zA-Z0-9]*\b/g;
        const extractedVariables = formula.match(variableRegex);
        if (extractedVariables) {
            const uniqueVariables = Array.from(new Set(extractedVariables));
            const newVariables = uniqueVariables.map(variable => ({ name: variable, value: '' }));
            setVariables(newVariables);
        }
    };

    return (
        <div>
            <Form>
                <Form.Item label="Formula">
                    <Input value={formula} onChange={(e) => handleFormulaChange(e.target.value)} />
                </Form.Item>
                <Form.Item label="Variables">
                    <Space direction="vertical">
                        {variables.map((variable, index) => (
                            <Space key={index}>
                                <Input
                                    placeholder="Name"
                                    value={variable.name}
                                    onChange={(e) => handleVariableNameChange(index, e.target.value)}
                                />
                                <Input
                                    placeholder="Value"
                                    value={variable.value}
                                    onChange={(e) => handleVariableValueChange(index, e.target.value)}
                                />
                                <Button onClick={() => handleRemoveVariable(index)}>Remove</Button>
                            </Space>
                        ))}
                    </Space>
                    <Button onClick={handleAddVariable}>Add Variable</Button>
                    <Button onClick={extractVariables}>Extract Variables</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default FormulaInput;
