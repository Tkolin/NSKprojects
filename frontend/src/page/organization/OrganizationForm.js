import React, {useEffect, useState} from 'react';
import {Form, Input, Button, Select, notification} from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import {
    ORGANIZATION_QUERY,
    ORGANIZATION_FORM_QUERY,
    UPDATE_ORGANIZATION_MUTATION,
    ADD_ORGANIZATION_MUTATION,
} from '../../graphql/queries';
import StyledFormBlock, { StyledForm, StyledFormItem} from '../style/FormStyles'; // Импорт стилей
const OrganizationForm = ({ organization, onClose }) => {

    // Состояния
    const [editingOrganization, setEditingOrganization] = useState(null);
    const [form] = Form.useForm();
    const [api,contextHolder] = notification.useNotification();

    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };

    // Получение данных для выпадающих списков
    const { loading, error, data } = useQuery(ORGANIZATION_FORM_QUERY);

    // Заполнение формы данными контакта при его редактировании
    useEffect(() => {
        if (organization) {
            setEditingOrganization(organization);
            form.setFieldsValue(organization);
        }
    }, [organization, form]);

    // Мутации для добавления и обновления
    const [addOrganization] = useMutation(ADD_ORGANIZATION_MUTATION, {
        refetchQueries: [{ query: ORGANIZATION_QUERY }],
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно добавлены!');
            form.resetFields();
        },
        onError: () => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных.');
        }
    });

    const [updateOrganization] = useMutation(UPDATE_ORGANIZATION_MUTATION, {
        refetchQueries: [{ query: ORGANIZATION_QUERY }],
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно обновлены!');
            setEditingOrganization(null);
            onClose();
        },
        onError: () => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных.');
        }
    });

    // Обработчик отправки формы
    const handleSubmit = () => {
        if (editingOrganization) {
            updateOrganization({ variables: { id: editingOrganization.id, ...form.getFieldsValue() } });
        } else {
            addOrganization({ variables: form.getFieldsValue() });
        }
    };

    // Обработка загрузки и ошибок
    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    return (
        <StyledFormBlock>
            <StyledForm form={form} layout="vertical">
                {contextHolder}
                <StyledFormItem name="first_name" label="Имя" rules={[{ required: true }]}>
                    <Input />
                </StyledFormItem>
                <StyledFormItem name="last_name" label="Фамилия"  rules={[{ required: true }]}>
                    <Input />
                </StyledFormItem>
                <StyledFormItem name="patronymic" label="Отчество" >
                    <Input />
                </StyledFormItem>
                <StyledFormItem name="mobile_phone" label="Мобильный номер телефона" >
                    <Input />
                </StyledFormItem>
                <StyledFormItem name="email" label="E-mail" >
                    <Input />
                </StyledFormItem>
                <StyledFormItem name="sibnipi_email" label="E-mail в Сибнипи" >
                    <Input />
                </StyledFormItem>
                <StyledFormItem name="position_id" label="Должность" >
                    <Select>
                        {data && data.positionsNames && data.positionsNames.map(position => (
                            <Select.Option key={position.id} value={position.id}>{position.name}</Select.Option>
                        ))}
                    </Select>
                </StyledFormItem>
                <StyledFormItem name="organization_id" label="Организация">
                    <Select>
                        {data && data.organizations && data.organizations.map(organization => (
                            <Select.Option key={organization.id} value={organization.id}>{organization.name}</Select.Option>
                        ))}
                    </Select>
                </StyledFormItem>
                <StyledFormItem>
                    <Button type="primary" onClick={handleSubmit}>
                        {editingOrganization ? "Сохранить изменения" : "Добавить контакт"}
                    </Button>
                </StyledFormItem>
            </StyledForm>
        </StyledFormBlock>
    );
};

export default OrganizationForm;
