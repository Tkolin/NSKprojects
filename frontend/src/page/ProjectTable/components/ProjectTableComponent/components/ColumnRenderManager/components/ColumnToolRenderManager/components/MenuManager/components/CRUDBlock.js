import {Divider, Modal, Tooltip} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import CustomMenuButton from "./CustomMenuButton";
import ProjectFormExstra from "../../../../../../../../../../ProjectFormExstra";

const CRUDBlock = ({record, onUpdated}) => {
    const [editProjectModalStatus, setEditProjectModalStatus] = useState(false);

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