// Ваш проект/frontend/src/components/ContactForm.js

import React, {useEffect, useMemo, useState} from 'react';
import {Form, Input, Button, Select, notification} from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import {
    CONTACTS_QUERY,
    ADD_CONTACT_MUTATION,
    ORGANIZATION_AND_POSITION_NAMES_QUERY,
    UPDATE_CONTACT_MUTATION
} from '../../graphql/queries';
import StyledFormBlock, { StyledForm, StyledFormItem, StyledButton } from '../style/FormStyles'; // Импорт стилей

const { Option } = Select;
const Context = React.createContext({
    name: 'Default',
});

function RadiusUprightOutlined() {
    return null;
}

const ContactForm = ({contact, onClose }) => {
    const [editingContact, setEditingContact] = useState(null);

    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };

    useEffect(() => {
        if (contact) {
            setEditingContact(contact);
            form.setFieldsValue(contact);
        }
    }, [contact]);

    const [addContact] = useMutation(ADD_CONTACT_MUTATION, {
        refetchQueries: [{ query: CONTACTS_QUERY }],
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно добавлены!');
            form.resetFields();
        },
        onError: () => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных.');
        }
    });

    // Логика обновления контакта
    const [updateContact] = useMutation(UPDATE_CONTACT_MUTATION, {
        refetchQueries: [{ query: CONTACTS_QUERY }],
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно обновлены!');
            setEditingContact(null);
            onClose();
        },
        onError: () => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных.' + contact.id);
        }
    });

    const { loading, error, data } = useQuery(ORGANIZATION_AND_POSITION_NAMES_QUERY);

    const handleSubmit = () => {
        if (editingContact) {
            updateContact({ variables: { id: editingContact.id, ...form.getFieldsValue() } });
        } else {
            addContact({ variables: form.getFieldsValue() });
        }
    };

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
                        {editingContact ? "Сохранить изменения" : "Добавить контакт"}
                    </Button>
                </StyledFormItem>
            </StyledForm>
        </StyledFormBlock>
    );
};

export default ContactForm;
