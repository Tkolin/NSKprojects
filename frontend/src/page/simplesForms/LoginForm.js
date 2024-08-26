import React, {useContext, useState} from 'react';
import {Card, Form, Input, message} from 'antd';
import {useMutation} from '@apollo/client';
import {LOGIN_MUTATION} from '../../graphql/mutationsAuth';
import {useNavigate} from 'react-router-dom';
import {Cookies} from "react-cookie";
import {NotificationContext} from "../../NotificationProvider";
import {ModalButton} from "./formComponents/ModalButtonComponent";

const LoginForm = ({cardProps}) => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loadingSecond, setLoadingSecond] = useState(false);
    const {openNotification} = useContext(NotificationContext);
    const [login, {loading, error}] = useMutation(LOGIN_MUTATION, {
        onCompleted: () => {
            openNotification('topRight', 'success', 'Вход выполнен!');
        }
    });

    // const [  loadUser, {loadingUser, dataUser}] = useLazyQuery(GET_CURRENT_USER, {
    //     onCompleted: ()=> {
    //         openNotification('topRight', 'success', 'Вход выполнен!');
    //         navigate('/');
    //     }, onError: (error)=>{
    //         openNotification('topRight', 'error', 'Ошибка авторизации!');
    //     }});
    const onFinish = async (values) => {
        const {email, password} =form.getFieldsValue(); // Извлекаем значения email и password из формы
        if(!email && !password)
            return;
        try {
            setLoadingSecond(true);
            //  Получение ответа
            const response = await login({variables: {input: {email, password}}});
            //  Распоковка ответа
            const {access_token, permissions, user} = response.data.login;
            //  Установка ответа в куки и локалсторадж
            const cookies = new Cookies();
            cookies.set('accessToken', access_token);
            localStorage.setItem('userData', JSON.stringify(user));
            localStorage.setItem('userPermissions', JSON.stringify(permissions));
            //  Переход на главную страницу с перезагрузкой (для подключения localStorage)
            navigate("/");
            setLoadingSecond(false);
            window.location.reload();
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
                      lodaing={loading || loadingSecond}
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
