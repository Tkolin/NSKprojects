import {Divider, Space, Typography} from "antd";
import Title from "antd/es/typography/Title";
import React from "react";
const {Text} = Typography;

const ColumnMainDataRender =  ({text, record}) => {
    return (
        <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
            <Title level={5} style={{marginTop: 0}}>{record.name}</Title>
            <Divider style={{margin: "3px"}}/>
            <Text>{record.number}</Text>
            <Text>({record.type_project_document?.code ?? ""}) {record.type_project_document?.name ?? ""}</Text>
            <Divider style={{margin: "3px", marginBottom: 0}}/>
        </Space.Compact>
    );
}
export default ColumnMainDataRender;