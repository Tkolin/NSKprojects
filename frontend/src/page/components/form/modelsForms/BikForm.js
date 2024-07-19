import React, {useContext, useEffect, useState} from 'react';
import { Form, Input } from 'antd';

import { StyledButtonGreen } from '../../style/ButtonStyles';
import { NotificationContext } from '../../../../NotificationProvider';
import {useLazyQuery, useMutation} from '@apollo/client';
import { ADD_BIK_MUTATION, UPDATE_BIK_MUTATION } from '../../../../graphql/mutationsBik';
import {BIKS_QUERY_BY_ID} from "../../../../graphql/queriesByID";
import LoadingSpinnerStyles from "../../style/LoadingSpinnerStyles";

const BikForm = ({ localObject ,initialObject, onCompleted }) => {
    // Первичные данные
    const { openNotification } = useContext(NotificationContext);
    const [form] = Form.useForm();
    const nameModel = 'БИК';
    const [actualObject, setActualObject] = useState(localObject ?? (initialObject ?? null));
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
    const [mutate, {loading: loadingSave}] = useMutation(actualObject ? UPDATE_BIK_MUTATION : ADD_BIK_MUTATION, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Мутация ${nameModel} выполнена успешно`);
            form.resetFields();
            onCompleted && onCompleted(data?.createBik || data?.updateBik);
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
    useEffect(() => {
        if (localObject?.id)
            updateForm(localObject);
    }, [localObject]);
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
        const formData = form.getFieldsValue();
        const data = {
            BIK: formData.BIK,
            name: formData.name,
            correspondent_account: formData.correspondent_account,
        };
        mutate({ variables: { ...(actualObject ? { id: actualObject.id } : {}),data} });
    };
    if (loading || loadingSave) return <LoadingSpinnerStyles/>

    return (
        <div>
            <Form form={form}>
                <Form.Item name="BIK" label="Бик" rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name="name" label="Наименование" rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name="correspondent_account" label="Корреспондентский счёт">
                    <Input/>
                </Form.Item>
                <div style={{textAlign: 'center'}}>
                    <Form.Item>
                        <StyledButtonGreen loading={loading} style={{marginBottom: 0}} type="primary" onClick={handleSubmit}>
                            {actualObject ? `Обновить` : `Создать`}
                        </StyledButtonGreen>
                    </Form.Item>
                </div>
            </Form>
        </div>
    );
};

export default BikForm;
