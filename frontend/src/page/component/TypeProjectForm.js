import React, {useEffect, useState} from 'react';
import {Form, Input, Button, Select, notification} from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import {BIK_QUERY, TYPES_PROJECTS_QUERY} from '../../graphql/queries';
import {
    ADD_BIK_MUTATION,
    UPDATE_BIK_MUTATION
} from '../../graphql/mutationsBik';
import {StyledFormBlock, StyledForm, StyledFormItem } from '../style/FormStyles';
import {ADD_TYPE_PROJECTS_MUTATIOM, UPDATE_TYPE_PROJECTS_MUTATIOM} from "../../graphql/mutationsTypeProject";


const IrdForm = ({ typeProject, onClose }) => {

    // Состояния
    const [editingTypeProject, setEditingTypeProject] = useState(null);
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
        if (typeProject) {
            setEditingTypeProject(typeProject);
            form.setFieldsValue();
        }
    }, [typeProject, form]);

    // Мутации для добавления и обновления
    const [addTypeProject] = useMutation(ADD_TYPE_PROJECTS_MUTATIOM, {
        refetchQueries: [{ query: TYPES_PROJECTS_QUERY }],
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно добавлены!');
            form.resetFields();
        },
        onError: () => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных.');
        }
    });

    const [updateTypeProject] = useMutation(UPDATE_TYPE_PROJECTS_MUTATIOM, {
        refetchQueries: [{ query: TYPES_PROJECTS_QUERY }],
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно обновлены!');
            setEditingTypeProject(null);
            onClose();
        },
        onError: () => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных.');
        }
    });

    // Обработчик отправки формы
    const handleSubmit = () => {
        if (editingTypeProject) {
            updateTypeProject({ variables: { id: editingTypeProject.id, ...form.getFieldsValue() } });
        } else {
            addTypeProject({ variables: form.getFieldsValue() });
        }
    };

    return (
        <StyledFormBlock>
            <StyledForm form={form} layout="vertical">
                {contextHolder}
                <StyledFormItem name="name" label="Наименование"  rules={[{ required: true }]}>
                    <Input />
                </StyledFormItem>
                <StyledFormItem name="code" label="код"  rules={[{ required: true }]}>
                    <Input />
                </StyledFormItem>
                <StyledFormItem>
                    <Button type="primary" onClick={handleSubmit}>
                        {editingTypeProject ? "Сохранить изменения" : "Добавить"}
                    </Button>
                </StyledFormItem>
            </StyledForm>
        </StyledFormBlock>
    );
};

export default IrdForm;
