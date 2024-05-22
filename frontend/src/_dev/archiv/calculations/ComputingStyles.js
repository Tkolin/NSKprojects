import styled from "styled-components";
import {Form} from "antd";

export const StyledFormItemComputing = styled(Form.Item)`
    margin: 0;
    &.ant-form-item .ant-form-item-label >label {
 
        font-size: 11px; 
    }
    &.two-level-form-item {
        margin-left: 20px;
    }
`;

export default {StyledFormItemComputing};