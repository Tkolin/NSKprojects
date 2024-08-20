import {Modal, Space} from "antd";
import Link from "antd/es/typography/Link";
import {EditOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import PersonForm from "../../simplesForms/PersonForm";
import CustomMenuButton
    from "../../ProjectTable/components/ProjectTableComponent/components/ColumnRenderManager/components/ColumnToolRenderManager/components/MenuManager/components/CustomMenuButton";


export const HeaderExecutorInfoComponent = ({executor, onClick, isLink = true}) => {
    const [openEditExecutor, setOpenEditExecutor] = useState(false)
    return (
        <Space.Compact direction={"vertical"}>
            <Space.Compact direction={"horizontal"}>
                {executor.passport.last_name ?? ""} {executor?.passport.patronymic ?? ""} {executor.passport.first_name ?? ""}
                <Link type={"warning"} onClick={() => setOpenEditExecutor(true)}
                      style={{alignContent: 'center', justifyContent: 'center', textAlign: "center"}}>
                    <EditOutlined/>
                </Link>
            </Space.Compact>
            {isLink ? <Link onClick={() => onClick()} children={
                <CustomMenuButton children={"Сгенерировать договор"}/>}
            /> : ""}
            <Modal
                key={executor.id + "exe12"}
                open={openEditExecutor}
                onCancel={() => setOpenEditExecutor(null)}
                footer={null}
                width={"max-content"}
                title={"Изменение данных исполнителя"}
                children={
                    <PersonForm
                        onCompleted={() =>
                            setOpenEditExecutor(false)}
                        initialObject={{id: executor.id}}
                    />
                }
            />
        </Space.Compact>
    );
}