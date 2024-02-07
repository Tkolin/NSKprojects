import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../../graphql/queries';
import { Cookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [form] = Form.useForm();
    const [login, { loading, error }] = useMutation(LOGIN_MUTATION); // Добавлены loading и error

    const onFinish = async (values) => {
        const { email, password } = values; // Извлекаем значения email и password из формы
        try {
            const response = await login({ variables: { input: { email, password } } }); // Передаем переменные в формате, ожидаемом мутацией
            const { user, access_token } = response.data.login;

            // Сохраняем access token в localStorage
            localStorage.setItem('accessToken', access_token);
            console.log('Рэф токен:');

            // Обновляем страницу
            window.location.reload();
        } catch (error) {
            message.error(error.message);
        }
    };

    return (
        <Form
            form={form}
            name="loginForm"
            onFinish={onFinish}
            initialValues={{ remember: true }}
        >
            <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
            >
                <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Log in
                </Button>
            </Form.Item>

            {error && <p>Error: {error.message}</p>}
        </Form>
    );
};

export default LoginForm;
