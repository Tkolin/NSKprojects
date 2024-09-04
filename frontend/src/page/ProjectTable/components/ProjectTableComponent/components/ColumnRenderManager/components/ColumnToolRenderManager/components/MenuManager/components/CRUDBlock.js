import {Divider, Modal, notification, Popconfirm, Tooltip} from "antd";
import {DeleteOutlined, EditOutlined, PushpinFilled, PushpinOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import CustomMenuButton from "./CustomMenuButton";
import {useMutation} from "@apollo/client";
import {CHANGE_TEMPLATE_TYPE_PROJECT} from "../../../../../../../../../../../graphql/mutationsProject";
import ProjectFormExstra from "../../../../../../../../../../ProjectFormExstra";


const TemplateMenuItem = ({isTemplate, onClick, ...props}) => {
    return (
        isTemplate ?
            (
                <CustomMenuButton disabled icon={<PushpinFilled/>}
                                  {...props}>Является шаблоном</CustomMenuButton>
            )
            :
            <Popconfirm
                title={"Создание шаблона на основе этого проекта"}
                description={"Вы уверены? это изменит существующий шаблон!"}
                onConfirm={() => console.log("ss")}
                icon={
                    <PushpinOutlined/>
                }
            >
                <CustomMenuButton icon={<PushpinOutlined/>}
                                  {...props}>Установить как шаблон</CustomMenuButton>
            </Popconfirm>
    )
}
const CRUDBlock = ({record, onUpdated}) => {
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };

    const [editProjectModalStatus, setEditProjectModalStatus] = useState(false);

    const [mutateChangeTemplate] = useMutation(CHANGE_TEMPLATE_TYPE_PROJECT, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Шаблон изменён`);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при изменении шаблона : ${error.message}`);
        },
    });
    const createTemplate = () => {
        mutateChangeTemplate({variables: {typeProject: record.type_project_document.id, newTemplate: record.id}});
    }

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
            <TemplateMenuItem onClick={() => createTemplate(record.id)}
                              isTemplate={record.id === record?.type_project_document?.template_project_id}/>

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