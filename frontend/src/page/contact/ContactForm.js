// Ваш проект/frontend/src/components/ContactForm.js

import React, { useState } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import {
    CONTACTS_QUERY,
    ADD_CONTACT_MUTATION,
    POSITIONS_NAMES_QUERY,
    ORGANIZATION_NAMES_QUERY,
    ORGANIZATION_AND_POSITION_NAMES_QUERY
} from '../../graphql/queries';
import StyledFormBlock, { StyledForm, StyledFormItem, StyledButton } from '../style/FormStyles'; // Импорт стилей

const { Option } = Select;

const ContactForm = () => {
    const [form] = Form.useForm();
    const [addContact] = useMutation(ADD_CONTACT_MUTATION, {
        refetchQueries: [{ query: CONTACTS_QUERY }],
    });
    const { loading, error, data } = useQuery( ORGANIZATION_AND_POSITION_NAMES_QUERY);

    const onFinish = (values) => {
        addContact({ variables: values });
        form.resetFields();
    };

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    return (
        <StyledFormBlock>
        <StyledForm form={form} onFinish={onFinish} layout="vertical">
            <StyledFormItem name="first_name" label="Имя" rules={[{ required: true }]}>
                <Input />
            </StyledFormItem>
            <StyledFormItem name="last_name" label="Фамилия" rules={[{ required: true }]}>
                <Input />
            </StyledFormItem>
            <StyledFormItem name="patronymic" label="Отчество" rules={[{ required: true }]}>
                <Input />
            </StyledFormItem>
            <StyledFormItem name="mobile_phone" label="Мобильный номер телефона" rules={[{ required: true }]}>
                <Input />
            </StyledFormItem>
            <StyledFormItem name="email" label="E-mail" rules={[{ required: true, type: 'email' }]}>
                <Input />
            </StyledFormItem>
            <StyledFormItem name="sibnipi_email" label="E-mail в Сибнипи" rules={[{ required: true, type: 'email' }]}>
                <Input />
            </StyledFormItem>
            <StyledFormItem name="position_id" label="Должность" rules={[{ required: true }]}>
                <Select>
                    {data && data.positionsNames && data.positionsNames.map(position => (
                        <Select.Option key={position.id} value={position.id}>{position.name}</Select.Option>
                    ))}
                </Select>
            </StyledFormItem>
            <StyledFormItem name="organization_id" label="Организация" rules={[{ required: true }]}>
                <Select>
                    {data && data.organizationNames && data.organizationNames.map(organization => (
                        <Select.Option key={organization.id} value={organization.id}>{organization.name}</Select.Option>
                    ))}
                </Select>
            </StyledFormItem>
            <StyledFormItem>
                <Button type="primary" htmlType="submit">
                    Add Contact
                </Button>
            </StyledFormItem>
        </StyledForm>
        </StyledFormBlock>
    );
};

export default ContactForm;
