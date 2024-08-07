import {

    Button,
    Divider,
    Modal,
    Popconfirm,
    Space,
    Tooltip,
} from "antd";
import React, {useContext, useState} from "react";
import {useMutation} from "@apollo/client";
import {CHANGE_STATUS_PROJECT} from "../../../../graphql/mutationsProject";

import {
    CheckSquareOutlined,

    DeleteOutlined, EditOutlined, MailOutlined
} from "@ant-design/icons";
import ProjectForm from "../../../ProjectForm";

import {StyledButtonGreen, StyledButtonRed} from "../../../components/style/ButtonStyles";
import {NotificationContext} from "../../../../NotificationProvider";


const ColumnRequestMenuToolRender = ({record, text, onUpdated, expandable}) => {
    const {openNotification} = useContext(NotificationContext);

    const [upRequestModalStatus, setUpRequestModalStatus] = useState(null)
    const [archiveProjectMutate, {loading: archiveProjectLoading}] = useMutation(CHANGE_STATUS_PROJECT, {

        onCompleted: () => {
            openNotification('topRight', 'success', `Заявка перенесена в архив`);
            onUpdated();
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при архивации: ${error.message}`);
        }

    });

    return (
        <>
            <Tooltip title={"Внести уточнения"}>
                <Button style={{height: 32}} type={"text"} icon={<EditOutlined/>}
                        onClick={() => setUpRequestModalStatus("request")}/>
            </Tooltip>
            <Divider style={{margin: 5, marginLeft: 0, marginRight: 0}}/>

            <Space.Compact align="start" direction={"vertical"}>

                <StyledButtonGreen style={{height: 32}} type={"text"} icon={<CheckSquareOutlined/>}
                                   onClick={() => setUpRequestModalStatus("kp")}/>
                <Popconfirm
                    title={"Архивация заявки"}
                    description={"Вы уверены? это перенесёт заявку в архив!"}
                    onConfirm={() => archiveProjectMutate({variables: {projectId: record.id, statusKey: "ARCHIVE"}})}

                    icon={
                        <DeleteOutlined/>
                    }
                >
                    <StyledButtonRed loading={archiveProjectLoading} style={{height: 32}} type={"text"}
                                     icon={<DeleteOutlined/>}/>
                </Popconfirm>


            </Space.Compact>
            <Divider style={{margin: 5, marginLeft: 0, marginRight: 0}}/>
            <Tooltip title={"В разработке"}>

                <Button style={{height: 32}} disabled type={"text"} icon={<MailOutlined/>}
                        onClick={() => console.log("ss")}/>
            </Tooltip>
            <Modal
                key={record.id}
                open={upRequestModalStatus}
                onCancel={() => setUpRequestModalStatus(false)}
                width={"max-content"}
                footer={null}
            >
                <ProjectForm type={upRequestModalStatus}
                             onCompleted={() => onUpdated()}
                             disabledOptions={["status_id", "date_create"]}
                             requiredOptions={
                                 upRequestModalStatus && upRequestModalStatus === "kp" ? ["name",
                                     "type_project_document",
                                     "organization_customer",
                                     "date_range",
                                     "price",
                                     "prepayment"
                                 ] : upRequestModalStatus === "request" ?
                                     ["name",
                                         "organization_customer",
                                     ] : null
                             }
                             project={{
                                 ...record,
                                 status_id: (upRequestModalStatus === "kp") ? "APPROVAL_KP" : "DESIGN_REQUEST",
                                 status: (upRequestModalStatus === "kp") ? {
                                     name: "APPROVAL_KP",
                                     name_key: "APPROVAL_KP"
                                 } : {name: "DESIGN_REQUEST", name_key: "DESIGN_REQUEST"}
                             }}/>

            </Modal>
        </>
    );
}
export default ColumnRequestMenuToolRender;