import {Button, Form, Input, InputNumber, Modal, notification, Select, Space, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {StyledFormBig, StyledFormItem} from "../../style/FormStyles";
import {UPDATE_IRDS_TO_PROJECT_MUTATION} from "../../../graphql/mutationsProject";
import {PlusOutlined} from "@ant-design/icons";
import {CREATE_REFERENCE_MUTATION} from "../../../graphql/mutationsFormula";

const ReferenceForm = ({project, setProject, onSubmit, disable}) => {
    // Состояния
    const [form] = Form.useForm();

    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message, placement,
        });
    };

    // Мутации для добавления и обновления
    const [addReferences] = useMutation(CREATE_REFERENCE_MUTATION, {
        onCompleted: () => {
            if (onSubmit)
                onSubmit();
            openNotification('topRight', 'success', 'Данные ИРД успешно обновлены !');
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных ird: ' + error.message);
        }
    });
    const handleSubmit = () => {
        form.validateFields().then((values) => {
            const {name, description, valuesList} = values;
            const input = {
                name,
                description,
                values: JSON.stringify(valuesList.map(({name, value}) => ({name, value}))),
            };

            addReferences({
                variables: {
                    data: input
                }
            });
        }).catch((errorInfo) => {
            console.log('Validation failed:', errorInfo);
        });
    };


    return (
        <StyledFormBig form={form} autoComplete="off" disabled={disable}>
            <StyledFormItem label="Наименование" name='name'>
                <Input/>
            </StyledFormItem>
            <StyledFormItem label="Описание" name='description'>
                <Input/>
            </StyledFormItem>
            <Form.List name="valuesList">
                {(fields, {add, remove}) => (<>
                        {fields.map(({key, name, ...restField}) => (<Space
                                key={key}
                                style={{
                                    display: 'flex', marginBottom: 2, marginTop: 2
                                }}
                                align="baseline"
                            >
                                <Form.Item
                                    {...restField}
                                    name={[name, 'name']}

                                >
                                    <Input placeholder={"Наименование"}/>
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'value']}

                                >
                                    <Input placeholder={"Значение"}/>
                                </Form.Item>
                            </Space>
                        ))}
                            <Button style={{width: "100%"}} type="dashed" onClick={() => add()}
                                    icon={<PlusOutlined/>}>
                                Добавить переменную
                            </Button>
                    </>
                )}

            </Form.List>
            <Button type="dashed" onClick={() => handleSubmit()}
                    icon={<PlusOutlined/>}>
                Сохранить </Button>
        </StyledFormBig>
    )
};

export default ReferenceForm;
