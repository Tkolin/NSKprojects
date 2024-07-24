import {
    Avatar,
    Badge,
    Button, Card, Col,
    Divider,
    Dropdown, message,
    Modal,
    notification,
    Popconfirm,
    Row,
    Space,
    Tooltip,
    Typography
} from "antd";
import React, {useState} from "react";
import {useMutation} from "@apollo/client";
import {CHANGE_TEMPLATE_TYPE_PROJECT} from "../../../../graphql/mutationsProject";
import Link from "antd/es/typography/Link";
import {
    AppleOutlined, CheckSquareOutlined,
    DatabaseOutlined,
    DeleteOutlined, DownloadOutlined, DownOutlined,
    EditOutlined, FileOutlined, MailOutlined, MinusOutlined, MoreOutlined,
    PlusOutlined,
    PushpinFilled,
    PushpinOutlined,
    ReconciliationOutlined, SettingOutlined, SubnodeOutlined, UploadOutlined, UpOutlined, UserOutlined
} from "@ant-design/icons";
import ProjectTasks from "../../../DistributionTasksByProject";
import ProjectForm from "../../../ProjectForm";
import LinkToDownload from "../../../components/script/fileDownloadScripts/LinkToDownload";
import ProjectFileDownload from "../../../components/script/fileDownloadScripts/ProjectFileDownload";
import {UploadFileProjectContractSigned} from "../../../components/UploadFile";
import {StyledButtonGreen, StyledButtonRed} from "../../../components/style/ButtonStyles";


export const ColumnRequestMenuToolRender = ({record, text, options, expandable}) => {
    const [upRequestModalStatus, setUpRequestModalStatus] = useState()


    return (
        <>
            <Space.Compact align="start" direction={"vertical"}>

                <StyledButtonGreen style={{height: 32}} type={"text"} icon={<CheckSquareOutlined/>}
                                   onClick={() => setUpRequestModalStatus(true)}/>
                <Popconfirm
                    title={"Архивация заявки"}
                    description={"Вы уверены? это перенесёт заявку в архив!"}
                    onConfirm={() => console.log("ss")}
                    icon={
                        <DeleteOutlined/>
                    }
                >
                    <StyledButtonRed style={{height: 32}} type={"text"} icon={<DeleteOutlined/>}
                                     onClick={() =>setUpRequestModalStatus(true)}/>
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
                onCancel={()=>setUpRequestModalStatus(false)}
                footer={null}
                title={"Принятие заявки на согласование КП"}
            >
                <ProjectForm type={"request"} project={{...record, status_id: "APPROVAL_KP", status: {name_key: "APPROVAL_KP", name: "Согласование КП"}}}/>
            </Modal>
        </>
    );
}
