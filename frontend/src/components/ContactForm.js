// Ваш проект/frontend/src/components/ContactForm.js

import React, { useState } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useMutation } from '@apollo/client';
import { CONTACTS_QUERY, ADD_CONTACT_MUTATION } from '../graphql/queries';

const { Option } = Select;

const ContactForm = () => {
    const [form] = Form.useForm();
    const [addContact] = useMutation(ADD_CONTACT_MUTATION, {
        refetchQueries: [{ query: CONTACTS_QUERY }],
    });

    const onFinish = (values) => {
        addContact({ variables: values });
        form.resetFields();
    };

    return (
        <div>
            <h2>Add Contact</h2>
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item name="first_name" label="First Name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="last_name" label="Last Name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="mobile_phone" label="Mobile Phone" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="sibnipi_email" label="Sibnipi Email" rules={[{ required: true, type: 'email' }]}>
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add Contact
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ContactForm;

