import React from 'react';
import RequestForm from "../components/form/modelsForms/RequestForm";
import {StyledBlockBig} from "../components/style/BlockStyles";


const RequestPage = () => {
    return (
        <StyledBlockBig label={"Новая заявка"}>
            <RequestForm/>
        </StyledBlockBig>
    );
};

export default RequestPage;
