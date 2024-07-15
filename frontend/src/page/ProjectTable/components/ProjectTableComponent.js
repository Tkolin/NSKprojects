import {Modal, notification, Space, Table, Typography} from "antd";

import ProjectTasks from "../../DistributionTasksByProject";
import ProjectForm from "../../ProjectForm";
import IrdsProjectForm from "../../IrdToProjectForm";
import StageToProjectForm from "../../StageToProjectForm";
import React, {useEffect, useState} from "react";
import TableStages from "./TableStages";
import TableIrds from "./TableIrds";
import TableExecutors from "./TableExecutors";
import {useNavigate} from "react-router-dom";
import {useMutation, useQuery} from "@apollo/client";
import {CHANGE_TEMPLATE_TYPE_PROJECT} from "../../../graphql/mutationsProject";
import {PROJECTS_QUERY} from "../../../graphql/queries";
import {nanoid} from "nanoid";
import {GetFullColumns} from "./TableColumn";

const {Text} = Typography;

const ProjectTableComponent = ({projectStatuses, search}) => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [editModalStatus, setEditModalStatus] = useState({});

    const [projectTasksModalStatus, setProjectTasksModalStatus] = useState(false);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [currentSort, setCurrentSort] = useState({});

    const navigate = useNavigate();

    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };


    // Мутация для удаления

    const {loading: loading, error: error, data: data, refetch: refetch} = useQuery(PROJECTS_QUERY, {
        variables: {
            projectStatuses: projectStatuses,
            queryOptions: {
                page,
                limit,
                search,
                sortField,
                sortOrder
            }
        },
        fetchPolicy: "cache-and-network",
        onCompleted: (data) => {
            console.log("queri IPA", data);
        }
    });
    const [mutateChangeTemplate] = useMutation(CHANGE_TEMPLATE_TYPE_PROJECT, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Шаблон изменён`);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при изменении шаблона : ${error.message}`);
        },
    });
    useEffect(() => {
        if (!editModalStatus)
            refetch();
    }, [editModalStatus]);

    const createTemplate = (projectId, typeProjectId) => {
        if (projectId && typeProjectId)
            mutateChangeTemplate({variables: {typeProject: typeProjectId, newTemplate: projectId}});
    }
    const getNameModalView = (type) => {
        switch (type) {
            case 'project':
                return "Данные проекта";
            case 'irds':
                return "Список ИРД";
            case 'stages':
                return "Список этапов";
            case 'tasks':
                return "Список задач";
            default:
                return null;
        }
    }
// Таблица




    const expandedRowRender = (project) => {
        return (
            <Space.Compact direction={"horizontal"}>
                <TableStages data-permission={"read-project-stage"} project={project}
                             setEditModalStatus={setEditModalStatus}/>
                <TableIrds data-permission={"read-project-ird"} project={project}
                           setEditModalStatus={setEditModalStatus}/>
                <TableExecutors data-permission={"read-project-task-executor"}
                                //onUpdated={refetch()}
                                project={project}
                                setEditModalStatus={setEditModalStatus}/>
            </Space.Compact>

        )
    }

    const onChange = (pagination, filters, sorter) => {
        if ((sorter.field !== undefined) && currentSort !== sorter) {
            setCurrentSort(sorter);
            if (sortField !== sorter.field) {
                setSortField(sorter.field);
                setSortOrder("asc");
            } else {
                setSortField(sortField);
                switch (sortOrder) {
                    case ("asc"):
                        setSortOrder("desc");
                        break;
                    case ("desc"):
                        setSortOrder("");
                        break;
                    case (""):
                        setSortOrder("asc");
                        break;
                }
            }
        }
    };


    return (
        <div>
            <Table
                style={{border: "black"}}
                rowClassName={(record) => 'my-ant-table-row-' + record?.status?.name_key?.toLowerCase()
                    //+ ((record.id % 2 === 0) ? ' my-ant-table-row-danger' : ' my-ant-table-row-warning')
                }
                size={'small'}
                sticky={{
                    offsetHeader: '64px',
                }}
                loading={loading}
                dataSource={data?.projects?.items?.map((org, index) => ({...org, key: index}))}
                columns={GetFullColumns("all",setEditModalStatus,setProjectTasksModalStatus, createTemplate)}
                onChange={onChange}
                pagination={{
                    total: data?.projects?.count,
                    current: page,
                    pageSize: limit,
                    onChange: (page, limit) => {
                        setPage(page);
                        setLimit(limit)
                    },
                    onShowSizeChange: (current, size) => {
                        setPage(1);
                        setLimit(size);
                    },
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100'],
                }}
                expandable={{
                    expandedRowKeys,
                    onExpand: (expanded, record) => {
                        const keys = expanded ? [record.key] : [];
                        setExpandedRowKeys(keys);
                    },
                    expandedRowRender: (record) => (
                        <div style={{padding: 2}}>
                            {expandedRowRender(record)}
                        </div>
                    ),
                }}
            />
            <Modal
                key={projectTasksModalStatus?.project?.id}
                open={projectTasksModalStatus?.mode}
                onCancel={() => setProjectTasksModalStatus({
                    project_id: null,
                    mode: null,
                })}
                footer={null}
                width={1400}
                title={"Создание задач"}
                onClose={() => setProjectTasksModalStatus({
                    project_id: null,
                    mode: null,
                })}
            >
                <ProjectTasks onChange={() => refetch()}
                              project={data?.projects?.items?.find(row => row.id === projectTasksModalStatus.project_id)}/>
            </Modal>
            <Modal
                key={nanoid()}
                open={editModalStatus?.type}
                onCancel={() => setEditModalStatus(null)}
                footer={null}
                title={getNameModalView(editModalStatus?.type)}
                width={editModalStatus?.type === "project" ? 500 : 1300}
                onClose={() => setEditModalStatus(null)}
            >
                {renderEditModalContent(editModalStatus, refetch, setEditModalStatus)}
            </Modal>

        </div>
    );
}
const renderEditModalContent = (editModalStatus, refetch, setEditModalStatus) => {
    const commonProps = {
        onCompleted: () => {
            refetch();
            setEditModalStatus(null);
        },
        project: editModalStatus?.project,
    };

    switch (editModalStatus?.type) {
        case 'project':
            return <ProjectForm style={{width: '500px'}} {...commonProps} />;
        case 'irds':
            return <IrdsProjectForm {...commonProps} />;
        case 'stages':
            return <StageToProjectForm {...commonProps} />;
        case 'tasks':
            return <ProjectTasks {...commonProps} />;
        default:
            return null;
    }
};

export default ProjectTableComponent;