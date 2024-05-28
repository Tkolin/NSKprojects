import {Form, Input} from "antd";
import React from "react";

export const EmptyFormItem = ({name,onChange, value }) => {
    return (
        <Form.Item  name={name} style={{width: 0, height: 0, margin: 0}}>
            <Input style={{width: 0, height: 0, margin: 0}} disabled={true}/>
        </Form.Item>
    );
};