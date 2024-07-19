import {Button, Form, Input, notification, Space} from "antd";
import React from "react";
import {useMutation} from "@apollo/client";
import {StyledFormBig, StyledFormItem} from "../../style/FormStyles";
import {PlusOutlined} from "@ant-design/icons";
import {CREATE_REFERENCE_MUTATION} from "../../../graphql/mutationsFormula";
import TextArea from "antd/es/input/TextArea";

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
            console.log()
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

            addReferences({
                variables: {
                    data: {
                        name: name,
                        description: description,
                        values: JSON.stringify(valuesList.map(({name, value}) => ({name, value}))),
                    }
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
                        {fields.map(({key, name, ...restField}) => (
                            <Space
                                key={key}
                                style={{
                                    display: 'flex', marginBottom: 2, marginTop: 2
                                }}
                                align="horizontal"
                            >
                                <Form.Item
                                    {...restField}
                                    name={[name, 'name']}
                                    style={{margin: "1px"}}
                                >
                                    <TextArea style={{margin: "1px"}}
                                              placeholder={"Наименование"}/>
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'value']}
                                    style={{margin: "1px"}}

                                >
                                    <Input                                     style={{margin: "1px"}}
                                                                               placeholder={"Значение"}/>
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
