import { PushpinFilled, PushpinOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { notification, Popconfirm } from "antd";
import React, { useState } from "react";
import { CHANGE_TEMPLATE_TYPE_PROJECT } from "../../../../../../../../../../../graphql/mutationsProject";
import CustomMenuButton from "./CustomMenuButton";


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
const TemplateBlock = ({record, onUpdated}) => {
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
    const permissions = JSON.parse(localStorage.getItem("userPermissions")).map(row=>row.name_key);
    if(!permissions.includes("update-project-template"))
        return null;
    return (
        <>
            <TemplateMenuItem onClick={() => createTemplate(record.id)}
                              isTemplate={record.id === record?.type_project_document?.template_project_id}/>
        </>
    )
}
export default TemplateBlock;