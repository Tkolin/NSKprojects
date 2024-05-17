import React, { useContext, useEffect } from 'react';
import { Form, Input } from 'antd';

import { StyledFormItem, StyledFormRegular } from '../../style/FormStyles';
import { StyledBlockRegular } from '../../style/BlockStyles';
import { StyledButtonGreen } from '../../style/ButtonStyles';
import { NotificationContext } from '../../../NotificationProvider';
import { useMutation } from '@apollo/client';
import { ADD_BIK_MUTATION, UPDATE_BIK_MUTATION } from '../../../graphql/mutationsBik';

const BikForm = ({ initialObject, onCompleted }) => {
    // Первичные данные
    const { openNotification } = useContext(NotificationContext);
    const [form] = Form.useForm();
    const nameModel = 'БИК';

    // Мутация
    const [mutate] = useMutation(initialObject ? UPDATE_BIK_MUTATION : ADD_BIK_MUTATION, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Мутация ${nameModel} выполнена успешно`);
            onCompleted && onCompleted(data);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при выполнении мутации ${nameModel}: ${error.message}`);
        },
    });

    // Подгрузка при обновлении
    useEffect(() => {
        initialObject && form.setFieldsValue({ ...initialObject });
    }, [initialObject, form]);

    // Завершение
    const handleSubmit = () => {
        mutate({ variables: { ...(initialObject ? { id: initialObject.id } : {}), ...form.getFieldsValue() } });
    };

    return (
        <StyledBlockRegular label={nameModel}>
            <StyledFormRegular form={form}>
                <StyledFormItem name="BIK" label="Бик" rules={[{ required: true }]}>
                    <Input />
                </StyledFormItem>
                <StyledFormItem name="name" label="Наименование" rules={[{ required: true }]}>
                    <Input />
                </StyledFormItem>
                <StyledFormItem name="correspondent_account" label="Корреспондентский счёт">
                    <Input />
                </StyledFormItem>
                <div style={{ textAlign: 'center' }}>
                    <StyledFormItem>
                        <StyledButtonGreen style={{ marginBottom: 0 }} type="primary" onClick={handleSubmit}>
                            {initialObject ? `Обновить ${nameModel}` : `Создать ${nameModel}`}
                        </StyledButtonGreen>
                    </StyledFormItem>
                </div>
            </StyledFormRegular>
        </StyledBlockRegular>
    );
};

export default BikForm;
