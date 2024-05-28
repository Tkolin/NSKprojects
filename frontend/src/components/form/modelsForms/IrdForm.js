import React, {useContext, useEffect, useState} from 'react';
import {Form, Input} from 'antd';
import {useLazyQuery, useMutation} from '@apollo/client';
import {StyledFormItem, StyledFormRegular} from '../../style/FormStyles';
import {ADD_IRD_MUTATION, UPDATE_IRD_MUTATION} from "../../../graphql/mutationsIrd";
import {StyledButtonGreen} from "../../style/ButtonStyles";
import {NotificationContext} from "../../../NotificationProvider";
import { IRDS_QUERY_BY_ID} from "../../../graphql/queriesByID";
import LoadingSpinnerStyles from "../../style/LoadingSpinnerStyles";

const IrdForm = ({localObject,initialObject, onCompleted}) => {
    // Первичные данные
    const { openNotification } = useContext(NotificationContext);
    const [form] = Form.useForm();
    const nameModel = 'ИРД';
    const [actualObject, setActualObject] = useState(localObject ?? (initialObject ?? null));
    const [loadContext, {loading, data}] = useLazyQuery(IRDS_QUERY_BY_ID, {
        variables: {id: initialObject?.id},
        onCompleted: (data) => {
            setActualObject(data?.irds?.items[0]);
            updateForm(data?.irds?.items[0])
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при загрузке данных: ${error.message}`);
        },
    });

    // Мутация
    const [mutate] = useMutation(actualObject ? UPDATE_IRD_MUTATION : ADD_IRD_MUTATION, {
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
        <div>
            <StyledFormRegular form={form} layout="vertical">
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
            </StyledFormRegular>
        </div>
    );
};

export default IrdForm;
