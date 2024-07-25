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
import {PROJECT_ARCHIVE_MUTATION} from "../../../../../graphql/mutationsProject";
import {
    CheckSquareOutlined,

    DeleteOutlined, EditOutlined, MailOutlined
} from "@ant-design/icons";
import ProjectForm from "../../../../ProjectForm";

import {StyledButtonGreen, StyledButtonRed} from "../../../../components/style/ButtonStyles";
import {NotificationContext} from "../../../../../NotificationProvider";


export const ColumnRequestMenuToolRender = ({record, text, onUpdated, expandable}) => {
    const {openNotification} = useContext(NotificationContext);

    const [upRequestModalStatus, setUpRequestModalStatus] = useState(null)
    const [archiveProjectMutate, {loading: archiveProjectLoading}] = useMutation(PROJECT_ARCHIVE_MUTATION, {
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
                        onClick={() => setUpRequestModalStatus("edit")}/>
            </Tooltip>
            <Divider style={{margin: 5, marginLeft: 0, marginRight: 0}}/>

            <Space.Compact align="start" direction={"vertical"}>

                <StyledButtonGreen style={{height: 32}} type={"text"} icon={<CheckSquareOutlined/>}
                                   onClick={() => setUpRequestModalStatus("kp")}/>
                <Popconfirm
                    title={"Архивация заявки"}
                    description={"Вы уверены? это перенесёт заявку в архив!"}
                    onConfirm={() => archiveProjectMutate({variables: {projectId: record.id}})}
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
                footer={null}
                title={(upRequestModalStatus === "kp") ? "Принятие заявки на согласование КП" : "Уточнение заявки"}
            >
                <ProjectForm type={upRequestModalStatus ? "requestUp" : "request"}
                             onCompleted={()=>onUpdated()}
                             project={{
                    ...record,
                    status_id: (upRequestModalStatus === "kp") ? "APPROVAL_KP" : "DESIGN_REQUEST",
                                 status: (upRequestModalStatus === "kp") ? {name: "APPROVAL_KP",name_key:"APPROVAL_KP"}  : {name: "DESIGN_REQUEST",name_key:"DESIGN_REQUEST"}
                }}/>
            </Modal>
        </>
    );
}
