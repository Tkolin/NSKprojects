import React, {useContext, useEffect, useState} from 'react';
import {Form, Input, Button, notification} from 'antd';
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import {
    ADD_PPI_MUTATION,
    UPDATE_PPI_MUTATION
} from '../../../graphql/mutationsPerson';
import {StyledFormItem, StyledFormBig} from '../../style/FormStyles';
import {PPI_QUERY} from "../../../graphql/queries";
import {StyledBlockBig} from "../../style/BlockStyles";
import {NotificationContext} from "../../../NotificationProvider";
import {ADD_CONTACT_MUTATION, UPDATE_CONTACT_MUTATION} from "../../../graphql/mutationsContact";
import moment from "moment/moment";
import {ORGANIZATIONS_QUERY_COMPACT, POSITIONS_QUERY_COMPACT} from "../../../graphql/queriesCompact";
import {ADD_BIK_MUTATION, UPDATE_BIK_MUTATION} from "../../../graphql/mutationsBik";
import {BIKS_QUERY_BY_ID, PASSPORTS_PLACE_ISSUES_QUERY_BY_ID} from "../../../graphql/queriesByID";


const PassportPlaceIssuesForm = ({initialObject, onCompleted}) => {
    // Первичные данные
    const {openNotification} = useContext(NotificationContext);
    const [form] = Form.useForm();
    const nameModel = 'Адресс регистрации';
    const [actualObject, setActualObject] = useState(initialObject);
    const [loadContext, {loading, data}] = useLazyQuery(PASSPORTS_PLACE_ISSUES_QUERY_BY_ID, {
        variables: {id: 0},
        onCompleted: (data) => {
            setActualObject(data?.passportPlaceIssues?.items[0]);
            updateForm(data?.passportPlaceIssues?.items[0]);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при загрузке данных: ${error.message}`);
        },
    });
    // Мутация
    const [mutate] = useMutation(initialObject ? UPDATE_PPI_MUTATION : ADD_PPI_MUTATION, {
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
    }, []);
    const updateForm = (data) =>  {
        if (data) {
            form.resetFields();
            form.setFieldsValue({...data});}
    };

    // Завершение
    const handleSubmit = () => {
        mutate({variables: {...(initialObject ? {id: initialObject.id} : {}), ...form.getFieldsValue()}});
    };

    return (
        <StyledBlockBig>
            <StyledFormBig form={form} layout="vertical">
                <StyledFormItem name="name" label="Наименование" rules={[{required: true}]}>
                    <Input/>
                </StyledFormItem>
                <StyledFormItem name="code" label="Код" rules={[{required: true}]}>
                    <Input/>
                </StyledFormItem>
                <StyledFormItem>
                    <Button type="primary" onClick={handleSubmit}>
                        {actualObject ? "Сохранить изменения" : "Добавить"}
                    </Button>
                </StyledFormItem>
            </StyledFormBig>
        </StyledBlockBig>
    );
};

export default PassportPlaceIssuesForm;
