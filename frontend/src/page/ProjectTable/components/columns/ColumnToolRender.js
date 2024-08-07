import {Modal, notification, Popconfirm, Row, Space, Tooltip, Typography} from "antd";
import React, {useState} from "react";
import {useMutation} from "@apollo/client";
import {CHANGE_TEMPLATE_TYPE_PROJECT} from "../../../../graphql/mutationsProject";
import Link from "antd/es/typography/Link";
import {DeleteOutlined, EditOutlined, PushpinFilled, PushpinOutlined, ReconciliationOutlined} from "@ant-design/icons";
import ProjectTasks from "../../../ProjectTasksStructureForm";
import ProjectForm from "../../../ProjectForm";

export const ColumnToolRender = ({record, text}) => {
    const {Text} = Typography;

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
    const createTemplate = (projectId, typeProjectId) => {
        if (projectId && typeProjectId)
            mutateChangeTemplate({variables: {typeProject: typeProjectId, newTemplate: projectId}});
    }
    return (
        <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
            <Link>
                <Tooltip title={"Изменить данные проекта"}>
                    <EditOutlined
                        onClick={() => {
                            setEditProjectModalStatus(true)
                            setEditTasksModalStatus(false)
                        }}/>
                </Tooltip>

            </Link>
            <Link type={"secondary"}>
                <Tooltip title={"Удаление недоступно (администратор)"}>

                    <DeleteOutlined/>
                </Tooltip>
            </Link>
            <div>
                {!(record.project_stages.find(row => {
                    return (row.date_end && row.date_start)
                })) ? (
                    <Link type={"danger"}>
                        <Tooltip title={"Недостаточно данных об этапах, для создания задач"}>
                            <ReconciliationOutlined/>
                        </Tooltip>
                    </Link>
                ) : (
                    <Link>
                        <Tooltip title={"Создать задачи"}>
                            <ReconciliationOutlined onClick={() => {
                                setEditTasksModalStatus(true)
                                setEditProjectModalStatus(false)

                            }}/>
                        </Tooltip>
                    </Link>
                )}
            </div>
            <div>
                {record.id === record?.type_project_document?.template_project_id ?
                    (
                        <Row style={{margin: 'auto'}}>
                            <Tooltip title={"Является шаблоном"}>
                                <Link type={"secondary"}>
                                    <PushpinFilled/>
                                </Link>
                            </Tooltip>
                        </Row>)
                    :
                    <Row style={{margin: 'auto'}}>
                        <Tooltip title={"Установить как шаблон"}>
                            <Popconfirm
                                title={"Создание шаблона на основе этого проекта"}
                                description={"Вы уверены? это изменит существующий шаблон!"}
                                onConfirm={() => createTemplate(record.id, record?.type_project_document?.id)}
                                icon={
                                    <Text type={"danger"}>
                                        <PushpinOutlined/>
                                    </Text>
                                }
                            >
                                <Link>
                                    <PushpinOutlined/>
                                </Link>
                            </Popconfirm>
                        </Tooltip>

                    </Row>

                }
            </div>
            {/*<Modal*/}
            {/*    key={record.id}*/}
            {/*    open={editTasksModalStatus}*/}
            {/*    onCancel={(value) =>*/}
            {/*        setEditTasksModalStatus(false)*/}
            {/*    }*/}
            {/*    footer={null}*/}
            {/*    width={1400}*/}
            {/*    title={"Создание задач"}>*/}
            {/*    <ProjectTasks project={record}/>*/}
            {/*</Modal>*/}
            <Modal
                key={"task"+record.id}
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
                key={"project"+record.id}
                open={editProjectModalStatus}
                onCancel={() => setEditProjectModalStatus(false)}
                footer={null}
                width={600}
                title={"Изменение данных о проекте"}
            >
                <ProjectForm style={{width: '500px'}} project={record}/>
            </Modal>
            {/*<Modal*/}
            {/*    key={"project"+record.id}*/}
            {/*    open={editProjectModalStatus}*/}
            {/*    onCancel={() => setEditProjectModalStatus(false)}*/}
            {/*    footer={null}*/}
            {/*    title={"Изменение данных о проекте"}*/}
            {/*    width={600}*/}
            {/* >*/}
            {/*    <ProjectForm style={{width: '500px'}} project={record}/>*/}

            {/*</Modal>*/}
        </Space.Compact>
    )
}