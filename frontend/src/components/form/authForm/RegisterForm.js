import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useMutation } from '@apollo/client';
import { REGISTER_MUTATION } from '../../../graphql/mutationsAuth';
import { Cookies } from 'react-cookie';
import { StyledFormItem, StyledFormRegular } from '../../style/FormStyles';

const RegisterForm = () => {
    const [form] = Form.useForm();
    const [register] = useMutation(REGISTER_MUTATION);
    const cookies = new Cookies();

    const onFinish = (values) => {
        const inputValues = { ...values };
        register({ variables: { input: inputValues } })
            .then((response) => {
                const { user, access_token } = response.data.register;
                cookies.set('accessToken', access_token, { path: '/' });
                console.log(cookies.get('accessToken'));
                message.success(`Registration successful. Welcome, ${user.name}!`);
                form.resetFields();
            })
            .catch((error) => {
                message.error(error.message);
            });
    };

    return (
        <StyledFormRegular form={form} onFinish={onFinish} layout="vertical">
            <StyledFormItem name="name" label="Name" rules={[{ required: true }]}>
                <Input />
            </StyledFormItem>
            <StyledFormItem name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                <Input />
            </StyledFormItem>
            <StyledFormItem name="password" label="Password" rules={[{ required: true, min: 6 }]}>
                <Input.Password />
            </StyledFormItem>
            <StyledFormItem>
                <Button type="primary" htmlType="submit">
                    Register
                </Button>
            </StyledFormItem>
        </StyledFormRegular>
    );
};

export default RegisterForm;
