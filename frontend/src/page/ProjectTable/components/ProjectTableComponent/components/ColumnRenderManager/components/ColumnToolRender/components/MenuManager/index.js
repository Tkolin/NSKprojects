import {Button, Card, Divider, Dropdown, Tooltip} from "antd";
import CRUDBlock from "./components/CRUDBlock";
import ContractDocumentBlock from "./components/ContractDocumentBlock";
import {MoreOutlined} from "@ant-design/icons";
import React from "react";

const Index = ({record, onUpdated, itemOptions = []}) => {
    return (
        <Tooltip title={"Внести уточнения"}>
            <Dropdown
                placement={"bottomLeft"}
                trigger={['click']}
                arrow={{
                    pointAtCenter: true,
                }}
                dropdownRender={() =>
                    (
                        <Card size={"small"}
                              style={{width: 300, justifyContent: 'center', alignItems: 'center'}}>

                            {itemOptions.includes("crud") && <>
                                <CRUDBlock record={record}/>
                                <Divider/>
                            </>}
                            {itemOptions.includes("contract") && <>
                                <ContractDocumentBlock record={record} onUpdated={onUpdated}/>
                                <Divider/>
                            </>}

                        </Card>
                    )}
                children={<Button type={"text"} icon={<MoreOutlined/>}/>}
            />
        </Tooltip>)
}
export default Index;