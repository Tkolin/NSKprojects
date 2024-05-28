import React from 'react';
import PersonForm from "../../../components/form/modelsForms/PersonForm";
import {StyledBlockBig} from "../../../components/style/BlockStyles";


const PersonPage = () => {
    return (
        <StyledBlockBig label={"Подрядчик"}>
            <PersonForm/>
        </StyledBlockBig>
    );
};

export default PersonPage;
