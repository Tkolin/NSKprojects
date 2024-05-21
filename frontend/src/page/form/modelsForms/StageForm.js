import React, {useContext, useEffect, useState} from 'react';
import {Form, Input} from 'antd';
import {useLazyQuery, useMutation} from '@apollo/client';
import { StyledFormItem, StyledFormRegular} from '../../style/FormStyles';
import {StyledBlockRegular} from "../../style/BlockStyles";
import {StyledButtonGreen} from "../../style/ButtonStyles";
import {NotificationContext} from "../../../NotificationProvider";
import {STAGES_QUERY_BY_ID} from "../../../graphql/queriesByID";
import LoadingSpinnerStyles from "../../style/LoadingSpinnerStyles";
import {ADD_STAGE_MUTATION, UPDATE_STAGE_MUTATION} from "../../../graphql/mutationsStage";

const IrdForm = ({ initialObject, onCompleted }) => {
    // Первичные данные
    const { openNotification } = useContext(NotificationContext);
    const [form] = Form.useForm();
    const nameModel = 'Этапы';
    const [actualObject, setActualObject] = useState(initialObject ?? null);
    const [loadContext, {loading, data}] = useLazyQuery(STAGES_QUERY_BY_ID, {
        variables: {id: initialObject?.id},
        onCompleted: (data) => {
            setActualObject(data?.stages?.items[0]);
            updateForm(data?.stages?.items[0])
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при загрузке данных: ${error.message}`);
        },
    });

    // Мутация
    const [mutate] = useMutation(actualObject ? UPDATE_STAGE_MUTATION : ADD_STAGE_MUTATION, {
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
            <StyledFormRegular form={form} layout="vertical">
                <StyledFormItem name="name" label="Наименование" rules={[{required: true}]}>
                    <Input/>
                </StyledFormItem>
                <div style={{textAlign: 'center'}}>
                    <StyledFormItem>
                        <StyledButtonGreen type="primary" onClick={handleSubmit}>
                            {actualObject ? `Обновить` : `Создать`}
                        </StyledButtonGreen>
                    </StyledFormItem>
                </div>
            </StyledFormRegular>
        </StyledBlockRegular>
);
};

export default IrdForm;
