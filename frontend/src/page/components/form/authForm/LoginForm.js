import React from 'react';
import {Form, Input, Button, message} from 'antd';
import {useMutation, useQuery} from '@apollo/client';
import {LOGIN_MUTATION} from '../../../../graphql/mutationsAuth';
import {useNavigate} from 'react-router-dom';
 import {Cookies} from "react-cookie";
import {GET_CURRENT_USER} from "../../../../graphql/queries";

const LoginForm = () => {
    const [form] = Form.useForm();
    const [login, {loading, error}] = useMutation(LOGIN_MUTATION);

    const navigate = useNavigate();
    const { refetch: refetchCurrentUser} = useQuery(GET_CURRENT_USER);
    const onFinish = async (values) => {
        const {email, password} = values; // Извлекаем значения email и password из формы
        try {
            const response = await login({variables: {input: {email, password}}});
            const {access_token} = response.data.login;
            const cookies = new Cookies();
            cookies.set('accessToken', access_token);
            refetchCurrentUser && refetchCurrentUser();
            navigate('/');
            // setTimeout(() => {
            //     navigate('/');
            //     cookies.set('accessToken', access_token);
            //     window.location.reload();
            //     cookies.set('accessToken', access_token);
            // }, 2000); // Задержка в 100 миллисекунд

        } catch (error) {
            message.error(error.message);
        }
    };

    return (
        <div style={{marginTop: "20px"}}>
            <Form
                form={form}
                name="loginForm"
                onFinish={onFinish}
                initialValues={{remember: true}}
            >
                <Form.Item
                    name="email"
                    rules={[{required: true, message: 'Пожалуйста введите email!'}]}
                >
                    <Input placeholder="Email"/>
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{required: true, message: 'Пожалуйста введите пароль!'}]}
                >
                    <Input.Password placeholder="Password"/>
                </Form.Item>
                <div style={{textAlign: 'center'}}>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Вход
                        </Button>
                    </Form.Item>
                </div>
                {error && <p>Error: {error.message}</p>}
            </Form>
        </div>

    );
};

export default LoginForm;
