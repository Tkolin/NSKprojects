import React from 'react';
import LoginForm from "../../../components/form/authForm/LoginForm";
import {StyledBlockRegular} from "../../../components/style/BlockStyles";


const LoginPage = () => {
    return (
        <StyledBlockRegular label={"Авторизация"}>
            <LoginForm/>
        </StyledBlockRegular>
    );
};

export default LoginPage;
