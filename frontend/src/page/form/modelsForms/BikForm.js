import React, {useContext, useEffect, useState} from 'react';
import { Form, Input } from 'antd';

import { StyledFormItem, StyledFormRegular } from '../../style/FormStyles';
import { StyledBlockRegular } from '../../style/BlockStyles';
import { StyledButtonGreen } from '../../style/ButtonStyles';
import { NotificationContext } from '../../../NotificationProvider';
import {useLazyQuery, useMutation} from '@apollo/client';
import { ADD_BIK_MUTATION, UPDATE_BIK_MUTATION } from '../../../graphql/mutationsBik';
import {BIKS_QUERY_BY_ID} from "../../../graphql/queriesByID";
import LoadingSpinnerStyles from "../../style/LoadingSpinnerStyles";

const BikForm = ({ localObject ,initialObject, onCompleted }) => {
    // Первичные данные
    const { openNotification } = useContext(NotificationContext);
    const [form] = Form.useForm();
    const nameModel = 'БИК';
    const [actualObject, setActualObject] = useState(initialObject ?? null);
    const [loadContext, {loading, data}] = useLazyQuery(BIKS_QUERY_BY_ID, {
        variables: {id: initialObject?.id},
        onCompleted: (data) => {
            setActualObject(data?.biks?.items[0]);
            updateForm(data?.biks?.items[0])
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при загрузке данных: ${error.message}`);
        },
    });

    // Мутация
    const [mutate] = useMutation(actualObject ? UPDATE_BIK_MUTATION : ADD_BIK_MUTATION, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Мутация ${nameModel} выполнена успешно`);
            form.resetFields();
            onCompleted && onCompleted(data);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при выполнении мутации ${nameModel}: ${error.message}`);
        },
    });

    // Подгрузка при обновлении
    useEffect(() => {
        if (initialObject?.id)
            loadContext();
    }, [initialObject]);
    const updateForm = (data) => {
        if (data) {
            form.resetFields();
            form.setFieldsValue({
                ...data,
            });
        }
    };

    // Завершение
    const handleSubmit = () => {
        mutate({ variables: { ...(actualObject ? { id: actualObject.id } : {}), ...form.getFieldsValue() } });
    };
    if (loading) return <LoadingSpinnerStyles/>

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
                            {actualObject ? `Обновить` : `Создать`}
                        </StyledButtonGreen>
                    </StyledFormItem>
                </div>
            </StyledFormRegular>
        </StyledBlockRegular>
    );
};

export default BikForm;
