import React from 'react';
import {StyledBlockBig} from "../components/style/BlockStyles";
import RoleForm from "../components/form/modelsForms/RoleForm/Index";
import styled from "styled-components";
import {Card} from "antd";

const RolePage = () => {
    return (
        <StyledBlockBig>
            <RoleForm/>
        </StyledBlockBig>
    );
};

export default RolePage;
