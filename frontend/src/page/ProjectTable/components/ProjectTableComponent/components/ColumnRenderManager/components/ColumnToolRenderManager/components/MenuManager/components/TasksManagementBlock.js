import {Button, Col, Divider, Modal, Row, Tooltip} from "antd";
import {
    AppstoreAddOutlined,
    DownloadOutlined,
    FilePdfOutlined,
    FileWordOutlined,
    PlusOutlined,
    UploadOutlined
} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import LinkToDownload from "../../../../../../../../../../components/script/LinkToDownload";
import {UploadFilePopconfirm} from "../../../../../../../../../../components/UploadFile";
import ProjectFileDownload
    from "../../../../../../../../../../components/script/fileDownloadScripts/ProjectFileDownload";
import CustomMenuButton from "./CustomMenuButton";
import ContactForm from "../../../../../../../../../../simplesForms/ContactForm";
import CombinedProjectTasksForms from "../../../../../../../../../../CombinedProjectTasksForms";


const TasksManagementBlock = ({record, onUpdated}) => {

    const [openTaskManager, setOpenTaskManager] = useState(false)
    useEffect(() => {
        console.log("3 TasksManagementBlock project", record.project_tasks);
    }, [record]);
    return (
        <>
            <Divider style={{margin: "5px"}} orientation={"left"}>Управление задачами</Divider>

            <CustomMenuButton onClick={() => setOpenTaskManager(true)} icon={<AppstoreAddOutlined/>}>
                Распределение задач
            </CustomMenuButton>

            <Modal
                key={record?.id + "_talsks_manager"}
                open={openTaskManager}
                onCancel={() => setOpenTaskManager(null)}
                footer={null}
                width={"max-content"}
                children={
                    <CombinedProjectTasksForms
                        project={record}
                    />
                }

            />
        </>
    )
}
export default TasksManagementBlock;