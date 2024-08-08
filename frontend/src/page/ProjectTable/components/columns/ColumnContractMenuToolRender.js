import {
    Button, Card, Col, DatePicker,
    Divider, Dropdown,
    Modal,
    Popconfirm, Row,
    Space,
    Tooltip
} from "antd";
import React, {useContext, useEffect, useState} from "react";
import {useMutation} from "@apollo/client";
import {CHANGE_STATUS_PROJECT, CHANGE_TEMPLATE_TYPE_PROJECT} from "../../../../graphql/mutationsProject";
import {
    CheckSquareOutlined,
    DeleteOutlined,
    DownloadOutlined, DownSquareOutlined,
    EditOutlined,
    EyeOutlined,
    MoreOutlined, PlusOutlined, PushpinFilled, PushpinOutlined, SaveOutlined,
    UploadOutlined, UpSquareOutlined,
} from "@ant-design/icons";
import ProjectForm from "../../../ProjectForm";

import {StyledButtonGreen, StyledButtonRed} from "../../../components/style/ButtonStyles";
import {NotificationContext} from "../../../../NotificationProvider";
import StageToProjectForm from "../../../ProjectStagesForm";
import IrdToProjectForm from "../../../ProjectIrdsForm";
import LinkToDownload from "../../../components/script/LinkToDownload";
import ProjectFileDownload from "../../../components/script/fileDownloadScripts/ProjectFileDownload";
import {UploadFileProjectContractSigned} from "../../../components/UploadFile";
// import DistributionTasksByProject from "../../../ProjectTasksStructureForm";
import dayjs from "dayjs";
import StagesProjectFileDownload from "../../../components/script/fileDownloadScripts/StagesProjectFileDownload";
import IrdsProjectFileDownload from "../../../components/script/fileDownloadScripts/IrdsProjectFileDownload";
// import CombinedProjectTasksForms from "../../../CombinedProjectTasksForms";

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
const getStatusApprovalTitle = (isIrdFull, signed) => {
    if (isIrdFull && signed)
        return "Договор полностью согласован, замечаний нет, приступить к работе?"
    return ((isIrdFull ? "Ирд полученно" : "Не всё ирд было полученно; ") + (signed ? "\n Договор подписан" : "\n Договор не подписан"));

}

const ProjectContractMenuItem = ({record, onUpdated}) => {
    const maxNumberRecord = record?.project_contract_history?.reduce((max, current) => {
        return (current.number > (max?.number || 0)) ? current : max;
    }, null);

    const fileId = maxNumberRecord ? maxNumberRecord.file_id : null;
    return (record?.contract_file_id ? (
                <>
                    <LinkToDownload fileId={record.contract_file_id} {...buttonProps}>Скачать (подписан)
                        от {record.date_signing}</LinkToDownload>
                    <StagesProjectFileDownload style={{color: "green"}} text={
                        <Button {...buttonProps} icon={<DownloadOutlined/>}>Скачать график работ</Button>}
                                               projectId={record.id}/>
                    <IrdsProjectFileDownload style={{color: "green"}} text={
                        <Button {...buttonProps} icon={<DownloadOutlined/>}>Скачать перечень ИРД</Button>}
                                             projectId={record.id}/>
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
                                <Divider style={{margin: 5, marginTop: 0, fontSize: 14}}/>
                                <LinkToDownload
                                    fileId={fileId}
                                    icon={<DownloadOutlined/>}
                                    {...buttonProps}>Скачать
                                    последний вариант</LinkToDownload>
                                <StagesProjectFileDownload style={{color: "green"}} text={
                                    <Button {...buttonProps} icon={<DownloadOutlined/>}>Скачать график работ</Button>}
                                                           projectId={record.id}/>
                                <IrdsProjectFileDownload style={{color: "green"}} text={
                                    <Button {...buttonProps} icon={<DownloadOutlined/>}>Скачать перечень ИРД</Button>}
                                                         projectId={record.id}/>
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
const ColumnContractMenuToolRender = ({record, text, onUpdated, expandable}) => {
    const {openNotification} = useContext(NotificationContext);
    const [editProjectModalStatus, setEditProjectModalStatus] = useState(null);
    // const [taskProjectModalStatus, setTaskProjectModalStatus] = useState(false);
    const [page, setPage] = useState("project");
    const [isIrdFull, setIsIrdFull] = useState(false);
    const [selectedDateStartWork, setSelectedDateStartWork] = useState(null);
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
        if (selectedDateStartWork)
            changeProjectStatusMutate({
                variables: {
                    projectId: projectId,
                    statusKey: "WORKING",
                    dateStart: dayjs(selectedDateStartWork).format("YYYY-MM-DD")
                }
            });
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
                                {/*<Space direction="vertical" style={{width: "100%"}}>*/}
                                {/*    <Button onClick={() => setTaskProjectModalStatus(true)}*/}
                                {/*            {...buttonProps}*/}
                                {/*            icon={<ReconciliationOutlined/>}*/}
                                {/*            // disabled={!record?.project_stages*/}
                                {/*            //     .find(row => row.date_end && row.date_start)}*/}
                                {/*    >Распределение задач</Button>*/}

                                {/*</Space>*/}
                                {/*<Divider style={{margin: 5, marginTop: 0, fontSize: 14}}/>*/}

                                <Divider style={{margin: 5, marginTop: 0, fontSize: 14}}/>
                                <Space direction="vertical" style={{width: "100%"}}>
                                    <ProjectContractMenuItem record={record} onUpdated={onUpdated}/>
                                </Space>
                            </Card>

                        )}
                    children={<Button type={"text"} icon={<MoreOutlined/>}/>}
                />

            </Tooltip>
            <Divider style={{margin: 5, marginLeft: 0, marginRight: 0}}/>

            <Space.Compact align="start" direction={"vertical"}>

                <Popconfirm
                    title={"Принятие проекта в работу"}

                    description={<Space direction={"vertical"}>
                        {getStatusApprovalTitle(isIrdFull, record.contract_file_id)}
                        {(isIrdFull && record.contract_file_id) && <DatePicker value={selectedDateStartWork} onChange={(date) => setSelectedDateStartWork(date)}/>}</Space>}
                    onConfirm={() => handleUpProject(record.id)}
                    okButtonProps={{disabled: !selectedDateStartWork && (isIrdFull && record.contract_file_id)}}

                >
                    {!(isIrdFull && record.contract_file_id) ?
                    <Button type={"dashed"} icon={<CheckSquareOutlined/>}/>
                        :
                    <StyledButtonGreen loading={changeProjectStatusLoading}
                                       icon={<CheckSquareOutlined/>}/>}
                </Popconfirm>

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
            {/*<Modal*/}
            {/*    key={record.id}*/}
            {/*    open={taskProjectModalStatus}*/}
            {/*    onCancel={() => setTaskProjectModalStatus(false)}*/}
            {/*    width={"max-content"}*/}
            {/*    footer={null}*/}
            {/*>*/}
            {/*    <CombinedProjectTasksForms project={record}/>*/}

            {/*</Modal>*/}
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
                                disabled={page === "project"}
                                children={"Проект"}
                                onClick={() => setPage("project")} icon={page === "project" ? "" : <EyeOutlined/>}/>

                        <Button style={{width: "50%"}}
                                disabled={page === "stage"}
                                children={"Этапы"}
                                onClick={() => setPage("stage")} icon={page === "stage" ? "" : <EyeOutlined/>}/>
                        <Button style={{width: "50%"}}
                                disabled={page === "ird"}
                                children={"Ирд"}
                                onClick={() => setPage("ird")} icon={page === "ird" ? "" : <EyeOutlined/>}/>
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
                                                           children={"Загрузить шаблонные этапы"}/>
                                        <StageToProjectForm cardProps={{title: "Уточнение заявки"}} project={record}/>
                                    </Space.Compact>
                                ) :
                                page === "ird" ? (
                                        <Space.Compact direction={"vertical"}>
                                            <StyledButtonGreen size={"small"} type={"text"} icon={<SaveOutlined/>}
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
export default ColumnContractMenuToolRender;