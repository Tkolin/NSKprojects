import {
    Alert,

    Button,
    Divider,
    Modal,
    Popconfirm,
    Space,
    Tooltip
} from "antd";
import React, {useContext, useState} from "react";
import {useMutation} from "@apollo/client";
import {CHANGE_STATUS_PROJECT} from "../../../../../graphql/mutationsProject";
import {
    CheckSquareOutlined,

    DeleteOutlined,
    DownloadOutlined,
     EditOutlined,
    EyeOutlined,
    MailOutlined,
    MoreOutlined, SaveOutlined,
    UploadOutlined,
 } from "@ant-design/icons";
import ProjectForm from "../../../../ProjectForm";

import {StyledButtonGreen, StyledButtonRed} from "../../../../components/style/ButtonStyles";
import {NotificationContext} from "../../../../../NotificationProvider";
import StageToProjectForm from "../../../../StageToProjectForm";


export const ColumnKpMenuToolRender = ({record, text, onUpdated, expandable}) => {
    const {openNotification} = useContext(NotificationContext);
    const [left, setLeft] = useState(true)
    const [upRequestModalStatus, setUpRequestModalStatus] = useState(null)

    const [changeProjectStatusMutate, {loading: changeProjectStatusLoading}] = useMutation(CHANGE_STATUS_PROJECT, {
        onCompleted: () => {
            openNotification('topRight', 'success', `Статус проекта изменён`);
            onUpdated();
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при изменении статуса проекта: ${error.message}`);
        }

    });
    const handleUpProject = (projectId) => {
        changeProjectStatusMutate({variables: {projectId: projectId, statusKey: "APPROVAL_AGREEMENT"}});
    }
    const handleArchiveProject = (projectId) => {
        changeProjectStatusMutate({variables: {projectId: projectId, statusKey: "ARCHIVE"}})
     }
    return (
        <>
            <Tooltip title={"Внести уточнения"}>

                <Button style={{height: 32}} type={"text"} icon={<EditOutlined/>}
                        onClick={() => setUpRequestModalStatus("edit")}/>
            </Tooltip>
            <Divider style={{margin: 5, marginLeft: 0, marginRight: 0}}/>

            <Space.Compact align="start" direction={"vertical"}>

                <Tooltip title={record?.project_stages?.length <= 0 ? "Этапы не указанны" : "Принять проект на согласование договора"}>
                    <StyledButtonGreen loading={changeProjectStatusLoading}
                                       disabled={record?.project_stages?.length <= 0} onClick={() => handleUpProject(record.id)}
                                       icon={<CheckSquareOutlined/>}/>
                </Tooltip>
                <Popconfirm
                    title={"Архивация заявки"}
                    description={"Вы уверены? это перенесёт заявку в архив!"}
                    onConfirm={() =>handleArchiveProject(record.id) }
                    icon={
                        <DeleteOutlined/>
                    }
                >
                    <StyledButtonRed loading={changeProjectStatusLoading} style={{height: 32}} type={"text"}
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


                    <Space.Compact style={{justifyContent: "center", alignContent: "center", width: "100%"}}
                                   direction={"vertical"}>
                        {record?.project_stages?.length <= 0 ?
                            <Alert
                                message="Внимание!"
                                description="Пока этапы не заполнены, нельза сформировать КП."
                                type="warning"
                                showIcon
                            />
                            : ""}
                        <Button
                            disabled={record?.project_stages?.length <= 0}
                            block
                            icon={<DownloadOutlined/>}
                            onClick={() => openNotification('top', 'warring', `TODO: Кп скачивается если все данные хватает`)}>
                            Сформировать КП
                        </Button>
                        <Button block
                                disabled={record?.project_stages?.length <= 0}
                                icon={<UploadOutlined/>}
                                onClick={() => openNotification('top', 'warring', `TODO: Мы согласовали кп и сказали финальный вариант`)}>
                            Скачать последнее КП
                        </Button>

                        <Button
                            block
                            disabled={record?.project_stages?.length <= 0}
                            icon={<UploadOutlined/>}
                            onClick={() => openNotification('top', 'warring', `TODO: Мы согласовали кп и сказали финальный вариант`)}>
                            Утвердить КП
                        </Button>
                        <Button
                            block
                            disabled={record?.project_stages?.length <= 0}
                            icon={<MoreOutlined/>}
                            onClick={() => openNotification('top', 'warring', `TODO: Тут смотрим изменения по КП (все варианты)`)}/>
                        <Divider/>
                    </Space.Compact>

                    <Space.Compact block>
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
                                <ProjectForm
                                    cardProps={{title: "Согласование КП"}}
                                    type={"kp"}
                                    onCompleted={() => onUpdated()}
                                    disabledOptions={["status_id", "organization_customer", "date_create"]}
                                    requiredOptions={["name",
                                        "type_project_document",
                                        "organization_customer",
                                        "date_range",
                                        "price",
                                        "prepayment"]}
                                    project={record}

                                />
                            ) :
                            (
                                <Space.Compact direction={"vertical"}>
                                    <StyledButtonGreen size={"small"} type={"text"} icon={<SaveOutlined/>}
                                                       onClick={() => console.log("ss")}
                                                       children={"Загрузить шаблонные этапы"}/>
                                    <StageToProjectForm cardProps={{title: "Уточнение заявки"}} project={record}/>
                                </Space.Compact>

                            )
                    }
                    <Divider style={{margin: 2}}/>
                </Space>

            </Modal>
        </>
    )
        ;
}
