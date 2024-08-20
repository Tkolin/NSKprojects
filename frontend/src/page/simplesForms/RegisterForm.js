import React from 'react';
import {Button, Form, Input, message} from 'antd';
import {useMutation} from '@apollo/client';
import {REGISTER_MUTATION} from '../../graphql/mutationsAuth';
import {Cookies} from 'react-cookie';

const RegisterForm = () => {
    const [form] = Form.useForm();
    const [register] = useMutation(REGISTER_MUTATION);
    const cookies = new Cookies();

    const onFinish = (values) => {
        const inputValues = { ...values };
        register({ variables: { input: inputValues } })
            .then((response) => {
                const { user, access_token } = response.data.register;
                //     cookies.set('accessToken', access_token, { path: '/' });
                console.log(cookies.get('accessToken'));
                message.success(`Registration successful. Welcome, ${user.name}!`);
                form.resetFields();
            })
            .catch((error) => {
                message.error(error.message);
            });
    };

    return (

        <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                <Input />
            </Form.Item>
            <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
                <Input.Password />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Register
                </Button>
            </Form.Item>
        </Form>
    );
};

export default RegisterForm;
