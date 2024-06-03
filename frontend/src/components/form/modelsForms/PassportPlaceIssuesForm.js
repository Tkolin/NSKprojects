import React, {useContext, useEffect, useState} from 'react';
import {Form, Input} from 'antd';
import {useLazyQuery, useMutation} from '@apollo/client';
import {
    ADD_PPI_MUTATION,
    UPDATE_PPI_MUTATION
} from '../../../graphql/mutationsPerson';
import {NotificationContext} from "../../../NotificationProvider";
import {PASSPORTS_PLACE_ISSUES_QUERY_BY_ID} from "../../../graphql/queriesByID";
import {StyledButtonGreen} from "../../style/ButtonStyles";


const PassportPlaceIssuesForm = ({localObject,initialObject, onCompleted}) => {
    // Первичные данные
    const {openNotification} = useContext(NotificationContext);
    const [form] = Form.useForm();
    const nameModel = 'Адресс регистрации';
    const [actualObject, setActualObject] = useState(localObject ?? (initialObject ?? null));
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
    }, [initialObject]);
    useEffect(() => {
        if (localObject?.id)
            updateForm(localObject);
    }, [localObject]);
    const updateForm = (data) => {
        if (data) {
            form.resetFields();
            form.setFieldsValue({...data});
        }
    };

    // Завершение
    const handleSubmit = () => {
        mutate({variables: {...(initialObject ? {id: initialObject.id} : {}), ...form.getFieldsValue()}});
    };

    return (
        <div>
            <Form form={form} layout="vertical">
                <Form.Item name="name" label="Наименование" rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name="code" label="Код" rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <div style={{textAlign: 'center'}}>
                    <Form.Item>
                        <StyledButtonGreen style={{marginBottom: 0}} type="primary" onClick={handleSubmit}>
                            {actualObject ? `Обновить` : `Создать`}
                        </StyledButtonGreen>
                    </Form.Item>
                </div>
            </Form>
        </div>
    );
};

export default PassportPlaceIssuesForm;
