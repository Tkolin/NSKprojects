import {Col, Modal, notification, Popconfirm, Row, Tooltip} from "antd";
import {DeleteOutlined, EditOutlined, PushpinFilled, PushpinOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import CustomMenuButton from "./CustomMenuButton";
import {useMutation} from "@apollo/client";
import {CHANGE_TEMPLATE_TYPE_PROJECT} from "../../../../../../../../../../../graphql/mutationsProject";
import ProjectFormExstra from "../../../../../../../../../../ProjectFormExstra";

const EditMenuItem = ({onClick, ...props}) => {
    return (
        <Tooltip title={"Изменить данные проекта"}>
            <CustomMenuButton icon={<EditOutlined/>}
                              onClick={onClick}
                              {...props}/>
        </Tooltip>
    )
}
const DeleteMenuItem = ({onClick, ...props}) => {
    return (
        <Tooltip title={"Удаление недоступно (администратор)"}>
            <CustomMenuButton disabled icon={<DeleteOutlined/>}
                              onClick={onClick}
                              {...props}/>
        </Tooltip>
    )
}
const TemplateMenuItem = ({isTemplate, onClick, ...props}) => {
    return (
        isTemplate ?
            (
                <Tooltip title={"Является шаблоном"}>
                    <CustomMenuButton disabled icon={<PushpinFilled/>}
                                      {...props}/>
                </Tooltip>
            )
            :
            <Tooltip title={"Установить как шаблон"}>
                <Popconfirm
                    title={"Создание шаблона на основе этого проекта"}
                    description={"Вы уверены? это изменит существующий шаблон!"}
                    onConfirm={() => console.log("ss")}
                    icon={
                        <PushpinOutlined/>
                    }
                >
                    <CustomMenuButton icon={<PushpinOutlined/>}
                                      {...props}/>
                </Popconfirm>
            </Tooltip>
    )
}
const CRUDBlock = ({record}) => {
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };

    const [editProjectModalStatus, setEditProjectModalStatus] = useState(null);
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
            <Row style={{width: "100%"}}>
                <Col span={8}>
                    <EditMenuItem onClick={() => setEditProjectModalStatus(true)}/>
                </Col>
                <Col span={8}>
                    <DeleteMenuItem onClick={() => console.log("НОУ")}/>
                </Col>
                <Col span={8}>
                    <TemplateMenuItem onClick={() => createTemplate(record.id)}
                                      isTemplate={record.id === record?.type_project_document?.template_project_id}/>
                </Col>
            </Row>
            <Modal
                key={record.id}
                open={editProjectModalStatus}
                onCancel={() => setEditProjectModalStatus(false)}
                width={"max-content"}
                footer={null}
            >
                <ProjectFormExstra project={record}
                                   status={record.status.name_key}/>
            </Modal>
        </>
    )
}
export default CRUDBlock;