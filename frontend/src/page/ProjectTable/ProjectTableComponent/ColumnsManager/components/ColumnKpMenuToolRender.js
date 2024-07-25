import {
    Alert,

    Button,
    Divider,
    Modal,
    Popconfirm,
    Space,
    Tooltip, Typography, Upload,
} from "antd";
import React, {useContext, useState} from "react";
import {useMutation} from "@apollo/client";
import {PROJECT_ARCHIVE_MUTATION} from "../../../../../graphql/mutationsProject";
import {
    CheckSquareOutlined,

    DeleteOutlined,
    DownloadOutlined,
    DownOutlined,
    EditOutlined,
    EyeOutlined,
    MailOutlined,
    MoreOutlined,
    UploadOutlined,
    UpOutlined
} from "@ant-design/icons";
import ProjectForm from "../../../../ProjectForm";

import {StyledButtonGreen, StyledButtonGreenGhost, StyledButtonRed} from "../../../../components/style/ButtonStyles";
import {NotificationContext} from "../../../../../NotificationProvider";
import StageToProjectForm from "../../../../StageToProjectForm";
import {UploadFileProjectContractSigned} from "../../../../components/UploadFile";

const {Text} = Typography;

export const ColumnKpMenuToolRender = ({record, text, onUpdated, expandable}) => {
    const {openNotification} = useContext(NotificationContext);
    const [left, setLeft] = useState(true)
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
    const onCompleted  = (projectId) => {
        openNotification('top', 'warring', `TODO: Просит загрузить подписанный договор, и првоеряет данные у проекта`);
    }
    return (
        <>
            <Tooltip title={"Внести уточнения"}>

                <Button style={{height: 32}} type={"text"} icon={<EditOutlined/>}
                        onClick={() => setUpRequestModalStatus("edit")}/>
            </Tooltip>
            <Divider style={{margin: 5, marginLeft: 0, marginRight: 0}}/>

            <Space.Compact align="start" direction={"vertical"}>

                <Upload ellipsis={true}>
                    <StyledButtonGreen icon={<CheckSquareOutlined/>}/>
                </Upload>
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
                width={"max-content"}
                footer={null}
             >
                <Space direction={"vertical"}>
                    <Alert style={{marginBottom: 10, width: 200}} type={"warning"} message={
                        <Text strong>Сохраните перед уходом, компонент в разработке</Text>}/>
                    <Space.Compact block >
                        {/*TODO: Надо спрашивать об сохранении изменений*/}
                        <Button style={{width: "50%"}}
                                disabled={left}
                                children={"Проект"}
                                onClick={() => setLeft(true)} icon={left ? "" : <EyeOutlined/>}/>
                        <Button style={{width: "50%"}}
                                disabled={!left}
                                children={"Этапы"}
                                onClick={() => setLeft(false)} icon={!left ? "" : <EyeOutlined/>}/>
                    </Space.Compact>
                    {
                        left ? (
                                <ProjectForm type={upRequestModalStatus ? "requestUp" : "request"}
                                            cardProps={{title: "Принятие заявки на согласование КП"}}
                                             onCompleted={() => onUpdated()}
                                             project={{
                                                 ...record,
                                                 status_id: (upRequestModalStatus === "kp") ? "APPROVAL_KP" : "DESIGN_REQUEST",
                                                 status: (upRequestModalStatus === "kp") ? {
                                                     name: "APPROVAL_KP",
                                                     name_key: "APPROVAL_KP"
                                                 } : {name: "DESIGN_REQUEST", name_key: "DESIGN_REQUEST"}
                                             }}/>
                            ) :
                            (
                                <StageToProjectForm cardProps={{title: "Уточнение заявки"}} project={record}/>
                            )
                    }
                    <Divider style={{margin: 2}}/>

                    <Space.Compact style={{ justifyContent: "center", width: "100%"}} direction={"horizontal"}>
                        <Button
                            icon={<DownloadOutlined/>}
                            onClick={() =>  openNotification('top', 'warring', `TODO: Кп скачивается если все данные хватает`)}>
                            Сформировать КП
                        </Button>
                        <Button
                            icon={<UploadOutlined/>}
                            onClick={() =>  openNotification('top', 'warring', `TODO: Мы согласовали кп и сказали финальный вариант`)}>
                            Скачать последнее КП
                        </Button>
                        <Button
                            icon={<UploadOutlined/>}
                            onClick={() =>  openNotification('top', 'warring', `TODO: Мы согласовали кп и сказали финальный вариант`)}>
                            Утвердить КП
                        </Button>
                        <Button icon={<MoreOutlined/>}
                                onClick={() =>  openNotification('top', 'warring', `TODO: Тут смотрим изменения по КП (все варианты)`)}/>
                    </Space.Compact>
                    <Alert style={{marginBottom: 10, width: 200}} type={"warning"} message={
                        <Text strong>После загрузки финального варианта, статус проекта переходит в согласование договора</Text>}/>
                </Space>
            </Modal>
        </>
    );
}
