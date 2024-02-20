import React, {useEffect, useState} from 'react';
import {Form, Input, Button, Select, notification} from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import {BIK_QUERY} from '../../graphql/queries';
import {
    ADD_BIK_MUTATION,
    UPDATE_BIK_MUTATION
} from '../../graphql/mutationsBik';
import {StyledFormBlock, StyledForm, StyledFormItem } from '../style/FormStyles';
import {ADD_STAGE_MUTATION, UPDATE_STAGE_MUTATION} from "../../graphql/mutationsStage";


const IrdForm = ({ stage, onClose }) => {

    // Состояния
    const [editingStage, setEditingStage] = useState(null);
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
        if (stage) {
            setEditingStage(stage);
            form.setFieldsValue({name: stage.name});
        }
    }, [stage, form]);

    // Мутации для добавления и обновления
    const [addStage] = useMutation(ADD_STAGE_MUTATION, {
        refetchQueries: [{ query: BIK_QUERY }],
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно добавлены!');
            form.resetFields();
        },
        onError: () => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных.');
        }
    });

    const [updateStage] = useMutation(UPDATE_STAGE_MUTATION, {
        refetchQueries: [{ query: BIK_QUERY }],
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно обновлены!');
            setEditingStage(null);
            onClose();
        },
        onError: () => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных.');
        }
    });

    // Обработчик отправки формы
    const handleSubmit = () => {
        if (editingStage) {
            updateStage({ variables: { id: editingStage.id, ...form.getFieldsValue() } });
        } else {
            addStage({ variables: form.getFieldsValue() });
        }
    };

    return (
        <StyledFormBlock>
            <StyledForm form={form} layout="vertical">
                {contextHolder}
                <StyledFormItem name="name" label="Наименование"  rules={[{ required: true }]}>
                    <Input />
                </StyledFormItem>
                <StyledFormItem>
                    <Button type="primary" onClick={handleSubmit}>
                        {editingStage ? "Сохранить изменения" : "Добавить"}
                    </Button>
                </StyledFormItem>
            </StyledForm>
        </StyledFormBlock>
    );
};

export default IrdForm;
