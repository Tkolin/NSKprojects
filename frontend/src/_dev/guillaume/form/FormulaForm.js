import React, {useState} from 'react';
import {Form, Input, Button, Space, notification, Row, Col} from 'antd';
import {StyledFormItem} from "../../style/FormStyles";
import {useForm} from "antd/es/form/Form";
import {CaretUpOutlined} from "@ant-design/icons";
import {useMutation} from "@apollo/client";
import {UPDATE_PAYMENTS_TO_PROJECT_MUTATION} from "../../../graphql/mutationsProject";
import {CREATE_FORMULA_MUTATION} from "../../../graphql/mutationsFormula";

const FormulaForm = () => {
    const [form] = Form.useForm();
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message, placement,
        });
    };
    // Мутации для добавления
    const [updatePaymentToProject] = useMutation(CREATE_FORMULA_MUTATION, {
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно добавлены payment!');
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных payment: ' + error.message);
        }
    });

    const extractVariables = () => {
        const variableRegex = /\b[a-zA-Z0-9]+\b/g;
        const extractedVariables = form.getFieldValue('original_formula').match(variableRegex);
        if (extractedVariables) {
            const uniqueVariables = Array.from(new Set(extractedVariables));
            const existingVariables = form.getFieldValue('valuesList') || [];
            const newVariables = uniqueVariables.map(variable => ({name: variable, description: ''}));
            const filteredNewVariables = newVariables.filter(newVar => !existingVariables.some(existingVar => existingVar.name === newVar.name));
            const updatedVariables = [...existingVariables, ...filteredNewVariables];
            form.setFieldsValue({'valuesList': updatedVariables});
        }
    };
    const handleSumbit = () => {
        form.validateFields().then((values) => {
            const {name, original_formula, description, valuesList} = values;
            const variable_data = valuesList.map(variable => ({
                name: variable.name,
                name_key: variable.name,
                description: variable.description
            }));

            // Вызов мутации для создания формулы
            updatePaymentToProject({
                variables: {
                    data: {
                        original_formula: original_formula,
                        name: name,
                        description: description,
                        variable_data: variable_data
                    }
                }
            });
        });
    };
    return (
        <div>
            <Form form={form}>
                <StyledFormItem label="Наименование" name='name'>
                    <Input/>
                </StyledFormItem>
                <StyledFormItem label="Формула" name='original_formula'>
                    <Input/>
                </StyledFormItem>
                <StyledFormItem label="Описание" name='description'>
                    <Input/>
                </StyledFormItem>
                <Form.List name="valuesList">
                    {(fields, {add, remove}) => (
                        <>
                            {fields.map(({key, name, ...restField}) => (
                                <Row
                                    key={key}
                                    style={{display: 'flex', marginBottom: 2, marginTop: 2}}
                                    gutter={2}
                                >
                                    <Col span={10}>

                                        <StyledFormItem name={[name, 'name']}>
                                            <Input placeholder="Переменная"/>
                                        </StyledFormItem>
                                    </Col>
                                    <Col span={10}>
                                        <StyledFormItem name={[name, 'description']}>
                                            <Input placeholder="Описание"/>
                                        </StyledFormItem>
                                    </Col>
                                    <Col span={4}>
                                        <Button onClick={() => remove(name)}>Удалить</Button>
                                    </Col>
                                </Row>
                            ))}
                            <Button onClick={() => add()}>Создать переменную</Button>
                        </>
                    )}
                </Form.List>
                <Button onClick={extractVariables}>Извлечь переменные из формулы</Button>
                <Button onClick={handleSumbit}>Сохранить</Button>

            </Form>
        </div>
    );
};

export default FormulaForm;
