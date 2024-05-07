import React from 'react';
import {Form, Input, notification} from 'antd';
import {useMutation} from '@apollo/client';

import {StyledFormItem, StyledFormRegular} from "../../style/FormStyles";
import {StyledBlockRegular} from "../../style/BlockStyles";
import {StyledButtonGreen} from "../../style/ButtonStyles";
import {CREATE_FENRIR_MUTATION, CREATE_FENRIR_TEMPLATE_MUTATION} from "../../../graphql/mutationsFormula";

const FenrirForm = ({fenrir, type, onClose}) => {

    // Состояния
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();

    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };

    // Мутации для добавления и обновления

    const [createFenrir] = useMutation(CREATE_FENRIR_MUTATION, {
        onCompleted: () => {
            openNotification('topRight', 'success', 'Схема сохранена!');
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных payment: ' + error.message);
        }
    });
    const [createFenrirTemplate] = useMutation(CREATE_FENRIR_TEMPLATE_MUTATION, {
        onCompleted: () => {
            openNotification('topRight', 'success', 'Схема сохранена как шаблон!');
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных payment: ' + error.message);
        }
    });
    // Обработчик отправки формы
    const handleSubmit = () => {
        if (type === "shema") {
            createFenrir({
                variables: {
                    data: {
                        ...form.getFieldsValue(),
                        models: fenrir
                    }
                }
            });
        } else {
            createFenrirTemplate({
                variables: {
                    data: {
                        ...form.getFieldsValue(),
                        models: fenrir
                    }
                }
            });
        }
    };

    return (
        <StyledBlockRegular label={'Схема'}>
            <StyledFormRegular form={form}>
                <StyledFormItem name="name" label="Наименование" rules={[{required: true}]}>
                    <Input/>
                </StyledFormItem>
                <StyledFormItem name="description" label="Описание" rules={[{required: true}]}>
                    <Input/>
                </StyledFormItem>

                <div style={{textAlign: 'center'}}>
                    <StyledFormItem>
                        <StyledButtonGreen style={{marginBottom: 0}} type="primary" onClick={handleSubmit}>
                            {type ? "Сохранить схему" : "Сохранить шаблон"}
                        </StyledButtonGreen>
                    </StyledFormItem>
                </div>
            </StyledFormRegular>
        </StyledBlockRegular>
    );
};

export default FenrirForm;
