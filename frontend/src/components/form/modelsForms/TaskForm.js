import React, {useContext, useEffect, useState} from 'react';
import {Form, Input} from 'antd';
import {useLazyQuery, useMutation} from '@apollo/client';
import { StyledFormItem, StyledFormRegular} from '../../style/FormStyles';
import {StyledBlockRegular} from "../../style/BlockStyles";
import {StyledButtonGreen} from "../../style/ButtonStyles";
import {NotificationContext} from "../../../NotificationProvider";
import {BIKS_QUERY_BY_ID, TASKS_QUERY_BY_ID} from "../../../graphql/queriesByID";
import {ADD_BIK_MUTATION, UPDATE_BIK_MUTATION} from "../../../graphql/mutationsBik";
import LoadingSpinnerStyles from "../../style/LoadingSpinnerStyles";
import {ADD_TASK_MUTATION, UPDATE_TASK_MUTATION} from "../../../graphql/mutationsTask";

const TaskForm = ({localObject, initialObject, onCompleted }) => {
    // Первичные данные
    const { openNotification } = useContext(NotificationContext);
    const [form] = Form.useForm();
     const [actualObject, setActualObject] = useState(localObject ?? (initialObject ?? null));
    const [loadContext, {loading, data}] = useLazyQuery(TASKS_QUERY_BY_ID, {
        variables: {id: initialObject?.id},
        onCompleted: (data) => {
            setActualObject(data?.tasks?.items[0]);
            updateForm(data?.tasks?.items[0])
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при загрузке данных: ${error.message}`);
        },
    });

    // Мутация
    const [mutate] = useMutation(actualObject ? UPDATE_TASK_MUTATION : ADD_TASK_MUTATION, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Мутация  выполнена успешно`);
            form.resetFields();
            onCompleted && onCompleted(data);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при выполнении мутации: ${error.message}`);
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
        <>
            <Form form={form} layout="vertical">
                <StyledFormItem name="name" label="Наименование" rules={[{required: true}]}>
                    <Input/>
                </StyledFormItem>
                <div style={{textAlign: 'center'}}>
                    <StyledFormItem>
                        <StyledButtonGreen style={{marginBottom: 0}} type="primary" onClick={handleSubmit}>
                            {actualObject ? `Обновить` : `Создать`}
                        </StyledButtonGreen>
                    </StyledFormItem>
                </div>
            </Form>
        </>
    );
};

export default TaskForm;
