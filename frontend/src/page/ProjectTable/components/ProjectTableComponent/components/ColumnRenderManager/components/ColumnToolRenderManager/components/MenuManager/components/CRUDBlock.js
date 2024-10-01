import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Divider, Modal, Tooltip } from "antd";
import React, { useState } from "react";
import ProjectFormExstra from "../../../../../../../../../../ProjectFormExstra";
import CustomMenuButton from "./CustomMenuButton";

const CRUDBlock = ({record, onUpdated}) => {

    const [editProjectModalStatus, setEditProjectModalStatus] = useState(false);
    const permissions = JSON.parse(localStorage.getItem("userPermissions")).map(row=>row.name_key);
    if(!permissions.includes("update-project"))
        return null;
    return (
        <>
            <Divider style={{margin: "5px"}} orientation={"left"}>Основная информация</Divider>
            <CustomMenuButton icon={<EditOutlined/>}
                              onClick={() => setEditProjectModalStatus(true)}
            >
                Изменить данные проекта
            </CustomMenuButton>

            <Tooltip title={"Удаление недоступно (администратор)"}>
                <CustomMenuButton disabled icon={<DeleteOutlined/>}
                >Удалить проект</CustomMenuButton>
            </Tooltip>

            <Modal
                key={record.id}
                open={editProjectModalStatus}
                onCancel={() => setEditProjectModalStatus(false)}
                width={"max-content"}
                footer={null}
            >
                <ProjectFormExstra project={record}
                                    key={record.id}
                                   onCompleted={() => {
                                       onUpdated();
                                       setEditProjectModalStatus(false)
                                   }}
                                   status={record.status.name_key}/>
            </Modal>
        </>
    )
}
export default CRUDBlock;