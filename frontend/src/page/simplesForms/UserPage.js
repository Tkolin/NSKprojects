import React from 'react';
import RequestForm from "../components/form/modelsForms/RequestForm";
import {StyledBlockBig} from "../components/style/BlockStyles";
import UserForm from "../components/form/modelsForms/UserForm";


const UserPage = () => {
    return (
        <StyledBlockBig>
            <UserForm/>
        </StyledBlockBig>
     );
};

export default UserPage;
