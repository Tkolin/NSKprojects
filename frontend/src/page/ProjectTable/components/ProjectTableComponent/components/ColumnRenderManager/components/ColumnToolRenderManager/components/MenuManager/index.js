import {Button, Card, Divider, Dropdown, Tooltip} from "antd";
import CRUDBlock from "./components/CRUDBlock";
import ContractDocumentBlock from "./components/ContractDocumentBlock";
import {MoreOutlined} from "@ant-design/icons";
import React from "react";
import {nanoid} from "nanoid";
import KPDocumentBlock from "./components/KPDocumentBlock";

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
                              style={{width: 280, justifyContent: 'center', alignItems: 'center'}}>

                            {itemOptions.includes("crud") && <>
                                <CRUDBlock key={nanoid()} record={record} onUpdated={onUpdated}/>
                                <Divider style={{margin: 0}}/>
                            </>}
                            {itemOptions.includes("contract") && <>
                                <ContractDocumentBlock record={record} onUpdated={onUpdated}/>
                                <Divider style={{margin: 0}}/>
                            </>}
                            {itemOptions.includes("kp") && <>
                                <KPDocumentBlock project={record} onUpdated={onUpdated}/>
                                <Divider style={{margin: 0}}/>
                            </>}

                        </Card>
                    )}
                children={<Button type={"text"} icon={<MoreOutlined/>}/>}
            />
        </Tooltip>)
}
export default Index;