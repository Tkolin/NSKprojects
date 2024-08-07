import React, {useContext} from 'react';
import {Form, Input, Button, message, Card} from 'antd';
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import {LOGIN_MUTATION} from '../../graphql/mutationsAuth';
import {useNavigate} from 'react-router-dom';
 import {Cookies} from "react-cookie";
import {GET_CURRENT_USER} from "../../graphql/queries";
import {NotificationContext} from "../../NotificationProvider";
import {ModalButton} from "./formComponents/ModalButtonComponent";

const LoginForm = ({cardProps}) => {
    const [form] = Form.useForm();
    const [login, {loading, error}] = useMutation(LOGIN_MUTATION);
    const {openNotification} = useContext(NotificationContext);

    const navigate = useNavigate();
    const [  loadUser, {loadingUser, dataUser}] = useLazyQuery(GET_CURRENT_USER, {onCompleted: ()=> {

            openNotification('topRight', 'success', 'Вход выполнен!');
            navigate('/');
        }, onError: (error)=>{
            openNotification('topRight', 'error', 'Ошибка авторизации!');
        }});
    const onFinish = async (values) => {
        const {email, password} =form.getFieldsValue(); // Извлекаем значения email и password из формы
        if(!email && !password)
            return;
        try {
            const response = await login({variables: {input: {email, password}}});
            const {access_token} = response.data.login;
            const cookies = new Cookies();
            cookies.set('accessToken', access_token);
            loadUser && loadUser();


        } catch (error) {
            message.error(error.message);
        }
    };

    return (
        <Card style={{width: 400}}
            {...cardProps}
              actions={[
                  <ModalButton
                      modalType={"primary"}
                      lodaing={loadingUser}
                      isMany={cardProps?.actions}
                      onClick={()=>form.submit()}
                      children={`Вход`}/>
                  , ...cardProps?.actions ?? []
              ]}
              children={


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

                {error && <p>Error: {error.message}</p>}
            </Form> }
              />


    );
};

export default LoginForm;
