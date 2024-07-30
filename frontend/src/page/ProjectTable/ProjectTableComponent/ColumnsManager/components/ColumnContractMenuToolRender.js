import {
    Alert,

    Button, Card, Col,
    Divider, Dropdown,
    Modal,
    Popconfirm, Row,
    Space,
    Tooltip
} from "antd";
import React, {useContext, useEffect, useState} from "react";
import {useMutation} from "@apollo/client";
import {CHANGE_STATUS_PROJECT, CHANGE_TEMPLATE_TYPE_PROJECT} from "../../../../../graphql/mutationsProject";
import {
    CheckSquareOutlined,

    DeleteOutlined,
    DownloadOutlined, DownSquareOutlined,
    EditOutlined,
    EyeOutlined,
    MailOutlined,
    MoreOutlined, PlusOutlined, PushpinFilled, PushpinOutlined, ReconciliationOutlined, SaveOutlined,
    UploadOutlined, UpSquareOutlined,
} from "@ant-design/icons";
import ProjectForm from "../../../../ProjectForm";

import {StyledButtonGreen, StyledButtonRed} from "../../../../components/style/ButtonStyles";
import {NotificationContext} from "../../../../../NotificationProvider";
import StageToProjectForm from "../../../../StageToProjectForm";
import IrdToProjectForm from "../../../../IrdToProjectForm";
import LinkToDownload from "../../../../components/script/fileDownloadScripts/LinkToDownload";
import ProjectFileDownload from "../../../../components/script/fileDownloadScripts/ProjectFileDownload";
import {UploadFileProjectContractSigned} from "../../../../components/UploadFile";

const buttonProps = {type: "text", style: {width: "100%"}, size: "large"}
const EditMenuItem = ({onClick, ...props}) => {
    return (
        <Tooltip title={"Изменить данные проекта"}>
            <Button icon={<EditOutlined/>}
                    onClick={onClick}
                    {...buttonProps}
                    {...props}/>
        </Tooltip>
    )
}
const DeleteMenuItem = ({onClick, ...props}) => {
    return (
        <Tooltip title={"Удаление недоступно (администратор)"}>
            <Button disabled icon={<DeleteOutlined/>}
                    onClick={onClick}
                    {...buttonProps}
                    {...props}/>
        </Tooltip>
    )
}
const TaskMenuItem = ({isFullStages, onClick, ...props}) => {
    return (
        isFullStages ? (
                <Tooltip title={"Недостаточно данных об этапах, для создания задач"}> <Button {...buttonProps}
                                                                                              {...props} disabled icon={
                    <ReconciliationOutlined/>} danger>Создать задачи</Button>
                </Tooltip>)
            : <Button {...buttonProps}
                      {...props} icon={<ReconciliationOutlined/>} onClick={() => onClick}>Распределение задач</Button>)
}
const getStatusApprovalTitle = (isIrdFull, signed) => {
    if (isIrdFull && signed)
        return "Договор полностью согласован, замечаний нет, приступить к работе?"
    return ((isIrdFull ? "Ирд полученно" : "Не всё ирд было полученно; ") + (signed ? "Договор подписан" : "Договор не подписан"));

}
const ProjectContractMenuItem = ({record, onUpdated}) => {
    const maxNumberRecord = record?.project_contract_history?.reduce((max, current) => {
        return (current.number > (max?.number || 0)) ? current : max;
    }, null);

    const fileId = maxNumberRecord ? maxNumberRecord.file_id : null;
    return (record?.signed_file_id ? (
                <>
                    <LinkToDownload fileId={record.signed_file_id} {...buttonProps}>Скачать (подписан)
                        от {record.date_signing}</LinkToDownload>
                </>
            ) :
            (
                <>
                    <ProjectFileDownload projectId={record.id} icon={<PlusOutlined/>} {...buttonProps}>Сгенерировать
                        договор</ProjectFileDownload>
                    {(fileId) ?
                        (<>
                                <UploadFileProjectContractSigned
                                    type={"primary"}
                                    icon={<UploadOutlined/>}
                                    onUpdated={() => onUpdated()}
                                    projectId={record.id}
                                    {...buttonProps}>Загрузить
                                    подписанный файл</UploadFileProjectContractSigned>

                                <LinkToDownload
                                    fileId={fileId}
                                    icon={<DownloadOutlined/>}
                                    {...buttonProps}>Скачать
                                    последний вариант</LinkToDownload>
                            </>
                        ) :
                        (
                            <>
                            </>
                        )}

                </>
            )
    )
}
const TemplateMenuItem = ({isTemplate, onClick, ...props}) => {
    return (
        isTemplate ?
            (

                <Tooltip title={"Является шаблоном"}>
                    <Button {...buttonProps} disabled icon={<PushpinFilled/>}
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
                    <Button {...buttonProps} icon={<PushpinOutlined/>}
                            {...props}/>
                </Popconfirm>
            </Tooltip>
    )
}
export const ColumnContractMenuToolRender = ({record, text, onUpdated, expandable}) => {
    const {openNotification} = useContext(NotificationContext);
    const [left, setLeft] = useState(true);
    const [editProjectModalStatus, setEditProjectModalStatus] = useState(null);
    const [page, setPage] = useState("project");
    const [isIrdFull, setIsIrdFull] = useState(false);
    useEffect(() => {
        setPage("project");
    }, []);
    useEffect(() => {
        setIsIrdFull(record?.project_irds?.filter(row => row.stage_number === "1").filter(row => row.received_date === null).length >= 0);
    }, [record, text]);
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
        changeProjectStatusMutate({variables: {projectId: projectId, statusKey: "WORKING"}});
    }
    const handleArchiveProject = (projectId) => {
        changeProjectStatusMutate({variables: {projectId: projectId, statusKey: "ARCHIVE"}})
    }
    const onExpand = (value) => {
        expandable?.onExpand(value);
    }

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
            <Tooltip title={"Внести уточнения"}>
                <Dropdown
                    placement={"bottomLeft"}
                    trigger={['click']}
                    arrow={{
                        pointAtCenter: true,
                    }}
                    dropdownRender={() =>
                        (
                            <Card size={"small"}
                                  style={{width: 300, justifyContent: 'center', alignItems: 'center'}}>

                                <Divider style={{
                                    margin: 5,
                                    marginTop: 0,
                                    fontSize: 14
                                }}/>

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
                                <Divider style={{margin: 5, marginTop: 0, fontSize: 14}}/>
                                <Space direction="vertical" style={{width: "100%"}}>
                                    <TaskMenuItem onClick={() => console.log()}
                                                  isFullStages={record?.project_stages
                                                      .find(row => row.date_end && row.date_start)}/>
                                </Space>
                                <Divider style={{margin: 5, marginTop: 0, fontSize: 14}}/>
                                <Space direction="vertical" style={{width: "100%"}}>
                                    <ProjectContractMenuItem record={record}/>
                                </Space>
                            </Card>

                        )}
                    children={<Button type={"text"} icon={<MoreOutlined/>}/>}
                />

            </Tooltip>
            <Divider style={{margin: 5, marginLeft: 0, marginRight: 0}}/>

            <Space.Compact align="start" direction={"vertical"}>

                <Tooltip
                    title={getStatusApprovalTitle(isIrdFull, record.signed_file_id)}>
                    <StyledButtonGreen loading={changeProjectStatusLoading}

                                       disabled={!(isIrdFull && record.signed_file_id)}
                                       onClick={() => handleUpProject(record.id)}
                                       icon={<CheckSquareOutlined/>}/>
                </Tooltip>
                <Popconfirm
                    title={"Архивация заявки"}
                    description={"Вы уверены? это перенесёт заявку в архив!"}
                    onConfirm={() => handleArchiveProject(record.id)}
                    icon={
                        <DeleteOutlined/>
                    }
                >
                    <StyledButtonRed loading={changeProjectStatusLoading} style={{height: 32}} type={"text"}
                                     icon={<DeleteOutlined/>}/>
                </Popconfirm>


            </Space.Compact>
            <Divider style={{margin: 5, marginLeft: 0, marginRight: 0}}/>
            <Button type={"text"}
                    icon={(expandable?.expandedRowKeys === record.key) ? <UpSquareOutlined/> : <DownSquareOutlined/>}
                    onClick={() => onExpand(record.key)}/>
            <Modal
                key={record.id}
                open={editProjectModalStatus}
                onCancel={() => setEditProjectModalStatus(false)}
                width={"max-content"}
                footer={null}
            >
                <Space direction={"vertical"}>

                    <Space.Compact block>
                        {/*TODO: Надо спрашивать об сохранении изменений*/}
                        <Button style={{width: "50%"}}
                                disabled={page == "project"}
                                children={"Проект"}
                                onClick={() => setPage("project")} icon={page == "project" ? "" : <EyeOutlined/>}/>

                        <Button style={{width: "50%"}}
                                disabled={page == "stage"}
                                children={"Этапы"}
                                onClick={() => setPage("stage")} icon={page == "stage" ? "" : <EyeOutlined/>}/>
                        <Button style={{width: "50%"}}
                                disabled={page == "ird"}
                                children={"Ирд"}
                                onClick={() => setPage("ird")} icon={page == "ird" ? "" : <EyeOutlined/>}/>
                    </Space.Compact>


                    {
                        page === "project" ? (
                                <ProjectForm
                                    cardProps={{title: "Согласование КП"}}
                                    type={"kp"}
                                    onCompleted={() => onUpdated()}
                                    // disabledOptions={["status_id", "organization_customer", "date_create"]}
                                    requiredOptions={["name",
                                        "type_project_document",
                                        "organization_customer",
                                        "date_range",
                                        "price",
                                        "prepayment"]}
                                    project={record}

                                />
                            ) :
                            page === "stage" ? (
                                    <Space.Compact direction={"vertical"}>
                                        <StyledButtonGreen size={"small"} type={"text"} icon={<SaveOutlined/>}
                                                           onClick={() => console.log("ss")}
                                                           children={"Загрузить шаблонные этапы"}/>
                                        <StageToProjectForm cardProps={{title: "Уточнение заявки"}} project={record}/>
                                    </Space.Compact>
                                ) :
                                page === "ird" ? (
                                        <Space.Compact direction={"vertical"}>
                                            <StyledButtonGreen size={"small"} type={"text"} icon={<SaveOutlined/>}
                                                               onClick={() => console.log("ss")}
                                                               children={"Загрузить шаблонные этапы"}/>
                                            <IrdToProjectForm cardProps={{title: "Уточнение заявки"}} project={record}/>
                                        </Space.Compact>
                                    ) :
                                    <>Ошибка</>
                    }
                    <Divider style={{margin: 2}}/>
                </Space>

            </Modal>
        </>
    )
        ;
}
