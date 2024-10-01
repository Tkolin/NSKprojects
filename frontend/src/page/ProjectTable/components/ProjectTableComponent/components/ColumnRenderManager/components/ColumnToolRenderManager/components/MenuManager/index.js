import { MoreOutlined } from "@ant-design/icons";
import { Button, Drawer, Tooltip } from "antd";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import CRUDBlock from "./components/CRUDBlock";
import ContractDocumentBlock from "./components/ContractDocumentBlock";
import KPDocumentBlock from "./components/KPDocumentBlock";
import TasksManagementBlock from "./components/TasksManagementBlock";
import TechSpecDocumentBlock from "./components/TechSpecDocumentBlock";
import TemplateBlock from "./components/TemplateBlock";

const Index = ({record, onUpdated, itemOptions = []}) => {

    const [open, setOpen] = useState(false)
    useEffect(() => {
        console.log(open);
    }, [open]);
    return (
        <>
            <Tooltip title={"Внести уточнения"}>


                <Button type={"text"} onClick={() => setOpen(!open)} icon={<MoreOutlined/>}/>


            </Tooltip>
            <Drawer
                key={record.id}
                title="Меню инструментов"
                placement="left"
                open={open}
                onClose={() => setOpen(false)}
            >
                {/*<Card size={"small"}*/}
                {/*      style={{width: 280, justifyContent: 'center', alignItems: 'center'}}>*/}

                {itemOptions.includes("crud")  && <>
                    <CRUDBlock key={nanoid()} record={record} onUpdated={onUpdated}/>
                </>}
                {itemOptions.includes("template")  && <>
                    <TemplateBlock key={nanoid()} record={record} onUpdated={onUpdated}/>
                </>}
                {itemOptions.includes("contract") && true && <>
                    <ContractDocumentBlock   record={record} onUpdated={onUpdated}/>
                </>}
                {itemOptions.includes("tasks_management")  && <>
                    <TasksManagementBlock record={record} onUpdated={onUpdated}/>
                </>}
                {itemOptions.includes("kp")  && <>
                    <KPDocumentBlock project={record} onUpdated={onUpdated}/>
                </>}
                {itemOptions.includes("tech_spec")  && <>
                    <TechSpecDocumentBlock project={record} onUpdated={onUpdated}/>
                </>}

                {/*</Card>*/}

            </Drawer>

        </>
    )
}
export default Index;