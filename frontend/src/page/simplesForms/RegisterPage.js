import React from 'react';
import RegisterForm from "../components/form/authForm/RegisterForm";
import {StyledBlockRegular} from "../components/style/BlockStyles";


const RegisterPage = () => {
    return (
        <StyledBlockRegular>
            <RegisterForm/>
        </StyledBlockRegular>
    );
};

export default RegisterPage;
