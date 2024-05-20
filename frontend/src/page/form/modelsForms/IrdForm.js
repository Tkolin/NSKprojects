import React, {useContext, useEffect, useState} from 'react';
import {Form, Input, notification} from 'antd';
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import {IRDS_QUERY} from '../../../graphql/queries';
import {StyledFormItem, StyledFormRegular} from '../../style/FormStyles';
import {ADD_IRD_MUTATION, UPDATE_IRD_MUTATION} from "../../../graphql/mutationsIrd";
import {StyledBlockRegular} from "../../style/BlockStyles";
import {StyledButtonGreen} from "../../style/ButtonStyles";
import {NotificationContext} from "../../../NotificationProvider";
import {ADD_CONTACT_MUTATION, UPDATE_CONTACT_MUTATION} from "../../../graphql/mutationsContact";
import moment from "moment/moment";
import {ORGANIZATIONS_QUERY_COMPACT, POSITIONS_QUERY_COMPACT} from "../../../graphql/queriesCompact";
import {BIKS_QUERY_BY_ID, IRDS_QUERY_BY_ID} from "../../../graphql/queriesByID";
import {ADD_BIK_MUTATION, UPDATE_BIK_MUTATION} from "../../../graphql/mutationsBik";
import LoadingSpinnerStyles from "../../style/LoadingSpinnerStyles";

const IrdForm = ({initialObject, onCompleted}) => {
    // Первичные данные
    const {openNotification} = useContext(NotificationContext);
    const [form] = Form.useForm();
    const nameModel = 'ИРД';
    const [actualObject, setActualObject] = useState(initialObject);
    const [loadContext, {loading, data}] = useLazyQuery(IRDS_QUERY_BY_ID, {
        variables: {id: initialObject.id},
        onCompleted: (data) => {
            setActualObject(data?.irds?.items[0]);
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
        if (initialObject.id)
            loadContext();
    }, [actualObject, form]);
    useEffect(() => {
        form.resetFields();
        actualObject && form.setFieldsValue({...actualObject});
    }, [actualObject]);

    // Завершение
    const handleSubmit = () => {
        mutate({variables: {...(actualObject ? {id: actualObject.id} : {}), ...form.getFieldsValue()}});
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
                        <StyledButtonGreen style={{marginBottom: 0}} type="primary" onClick={handleSubmit}>
                            {actualObject ? "Обновить" : "Создать"}
                        </StyledButtonGreen>
                    </StyledFormItem>
                </div>
            </StyledFormRegular>
        </StyledBlockRegular>
    );
};

export default IrdForm;
