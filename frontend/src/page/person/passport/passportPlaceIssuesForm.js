import React, {useEffect, useState} from 'react';
import {Form, Input, Button, Select, notification} from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import {
    ADD_PPI_MUTATION,
    UPDATE_PPI_MUTATION
} from '../../../graphql/mutationsPerson';
import {StyledFormBlock, StyledForm, StyledFormItem } from '../../style/FormStyles';
import {ADD_BIK_MUTATION, UPDATE_BIK_MUTATION} from "../../../graphql/mutationsBik";
import {PPI_QUERY} from "../../../graphql/queries";


const PassportPlaceIssuesForm = ({ issues, onClose }) => {

    // Состояния
    const [editingIssues, setEditingIssues] = useState(null);
    const [form] = Form.useForm();
    const [ api,contextHolder] = notification.useNotification();

    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };


    // Заполнение формы данными контакта при его редактировании
    useEffect(() => {
        if (issues) {
            setEditingIssues(issues);
            form.setFieldsValue();
        }
    }, [issues, form]);

    // Мутации для добавления и обновления
    const [addIssues] = useMutation(ADD_PPI_MUTATION, {
        refetchQueries: [{ query: PPI_QUERY }],
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно добавлены!');
            form.resetFields();
        },
        onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных: '+ error.message);
        }
    });

    const [updateIssues] = useMutation(UPDATE_PPI_MUTATION, {
        refetchQueries: [{ query:  PPI_QUERY}],
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно обновлены!');
            setEditingIssues(null);
            onClose();
        },
        onError: () => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных.');
        }
    });

    // Обработчик отправки формы
    const handleSubmit = () => {
        if (editingIssues) {
            updateIssues({ variables: { id: editingIssues.id, ...form.getFieldsValue() } });
        } else {
            addIssues({ variables: form.getFieldsValue() });
        }
    };

    return (
        <StyledFormBlock>
            <StyledForm form={form} layout="vertical">
                {contextHolder}
                <StyledFormItem name="name" label="Наименование"  rules={[{ required: true }]}>
                    <Input />
                </StyledFormItem>
                <StyledFormItem name="code" label="Код"  rules={[{ required: true }]}>
                    <Input />
                </StyledFormItem>
                <StyledFormItem>
                    <Button type="primary" onClick={handleSubmit}>
                        {editingIssues ? "Сохранить изменения" : "Добавить"}
                    </Button>
                </StyledFormItem>
            </StyledForm>
        </StyledFormBlock>
    );
};

export default PassportPlaceIssuesForm;
