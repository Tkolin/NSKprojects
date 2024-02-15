import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../../graphql/mutationsAuth';
import { useNavigate } from 'react-router-dom';
import {StyledFormBlock, StyledFormItem} from '../style/FormStyles';

const LoginForm = () => {
    const [form] = Form.useForm();
    const [login, { loading, error }] = useMutation(LOGIN_MUTATION); // Добавлены loading и error

    const navigate = useNavigate();

    const onFinish = async (values) => {
        const { email, password } = values; // Извлекаем значения email и password из формы
        try {
            const response = await login({ variables: { input: { email, password } } }); // Передаем переменные в формате, ожидаемом мутацией
            const { access_token } = response.data.login;
            localStorage.setItem('accessToken', access_token);
            console.log('Рэф токен:');
            navigate('/');
            window.location.reload();

        } catch (error) {
            message.error(error.message);
        }
    };

    return (
        <StyledFormBlock
            form={form}
            name="loginForm"
            onFinish={onFinish}
            initialValues={{ remember: true }}
        >
            <StyledFormItem
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
            >
                <Input placeholder="Email" />
            </StyledFormItem>

            <StyledFormItem
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password placeholder="Password" />
            </StyledFormItem>

            <StyledFormItem>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Log in
                </Button>
            </StyledFormItem>

            {error && <p>Error: {error.message}</p>}
        </StyledFormBlock>
    );
};

export default LoginForm;
