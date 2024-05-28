import React from 'react';
import {StyledFormRegular} from "../../../components/style/FormStyles";
import RegisterForm from "../../../components/form/authForm/RegisterForm";
import {StyledBlockRegular} from "../../../components/style/BlockStyles";


const RegisterPage = () => {
    return (
        <StyledBlockRegular label={"Регистрация"}>
            <RegisterForm/>
        </StyledBlockRegular>
    );
};

export default RegisterPage;
