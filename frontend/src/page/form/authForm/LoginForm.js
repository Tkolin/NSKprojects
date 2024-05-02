import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../../../graphql/mutationsAuth';
import { useNavigate } from 'react-router-dom';
import { StyledFormItem, StyledFormRegular} from '../../style/FormStyles';
import {Cookies} from "react-cookie";
import {StyledBlockRegular} from "../../style/BlockStyles";

const LoginForm = () => {
    const [form] = Form.useForm();
    const [login, { loading, error }] = useMutation(LOGIN_MUTATION);

    const navigate = useNavigate();

    const onFinish = async (values) => {
        const { email, password } = values; // Извлекаем значения email и password из формы
        try {
            const response = await login({ variables: { input: { email, password } } });
            const { access_token } = response.data.login;
            const cookies = new Cookies();
            cookies.set('accessToken', access_token);
            navigate('/');
            window.location.reload();

        } catch (error) {
            message.error(error.message);
        }
    };

    return (
        <StyledBlockRegular>
            <StyledFormRegular
                form={form}
                name="loginForm"
                onFinish={onFinish}
                initialValues={{ remember: true }}
            >
                <StyledFormItem
                    name="email"
                    rules={[{ required: true, message: 'Пожалуйста введите email!' }]}
                >
                    <Input placeholder="Email" />
                </StyledFormItem>

                <StyledFormItem
                    name="password"
                    rules={[{ required: true, message: 'Пожалуйста введите пароль!' }]}
                >
                    <Input.Password placeholder="Password" />
                </StyledFormItem>

                <StyledFormItem>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Вход
                    </Button>
                </StyledFormItem>

                {error && <p>Error: {error.message}</p>}
            </StyledFormRegular>
        </StyledBlockRegular>

    );
};

export default LoginForm;
