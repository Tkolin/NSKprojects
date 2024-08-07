import {
    Button, Card, Col,
    Divider,
    Dropdown,
    Modal,
    notification,
    Popconfirm,
    Row,
    Space,
    Tooltip,
} from "antd";
import React, {useState} from "react";
import {useMutation} from "@apollo/client";
import {CHANGE_TEMPLATE_TYPE_PROJECT} from "../../../../graphql/mutationsProject";
import {
    DeleteOutlined, DownloadOutlined, DownSquareOutlined,
    EditOutlined, MoreOutlined,
    PlusOutlined,
    PushpinFilled,
    PushpinOutlined,
    ReconciliationOutlined, UploadOutlined, UpSquareOutlined
} from "@ant-design/icons";
import ProjectTasks from "../../../ProjectTasksStructureForm";
import ProjectForm from "../../../ProjectForm";
import LinkToDownload from "../../../components/script/LinkToDownload";
import ProjectFileDownload from "../../../components/script/fileDownloadScripts/ProjectFileDownload";
import {UploadFileProjectContractSigned} from "../../../components/UploadFile";


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

const ProjectContractMenuItem = ({record, onUpdated}) => {
    const maxNumberRecord = record?.project_contract_history?.reduce((max, current) => {
        return (current.number > (max?.number || 0)) ? current : max;
    }, null);

    const fileId = maxNumberRecord ? maxNumberRecord.file_id : null;
 
    return (record?.contract_file_id ? (
                <>
                    <LinkToDownload fileId={record.contract_file_id} {...buttonProps}>Скачать (подписан)
 
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


const ColumnMenuToolRender = ({record, text, options, expandable}) => {

    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };
    const [editProjectModalStatus, setEditProjectModalStatus] = useState(false);
    const [editTasksModalStatus, setEditTasksModalStatus] = useState(false);

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
    const onExpand = (value) => {
        expandable?.onExpand(value);
    }

    return (
        <>
 
            <Space.Compact align="start" direction={"vertical"}>
 
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
 
                    children={<Button type={"text"} style={{height: 56}} icon={<MoreOutlined/>}/>}
                />
                <Button style={{height: 56}} type={"text"}
                        icon={(expandable.expandedRowKeys === record.key) ? <UpSquareOutlined/> : <DownSquareOutlined/>}
 
                        onClick={() => onExpand(record.key)}/>
            </Space.Compact>
            <Modal
                key={"task" + record.id}
                open={editTasksModalStatus}
                onCancel={() => setEditTasksModalStatus(false)}
                footer={null}
                width={1400}
                title={"Создание задач"}
            >
                <ProjectTasks
                    project={record}/>
            </Modal>
            <Modal
                key={"project" + record.id}
                open={editProjectModalStatus}
                onCancel={() => setEditProjectModalStatus(false)}
                footer={null}
                width={600}
                title={"Изменение данных о проекте"}>
                <ProjectForm style={{width: '500px'}} project={record}/>
            </Modal>
        </>
    );
}
export default ColumnMenuToolRender;