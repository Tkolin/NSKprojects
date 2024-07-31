import {Modal, notification, Space, Table, Typography} from "antd";


import IrdsProjectForm from "../../IrdToProjectForm";
import StageToProjectForm from "../../StageToProjectForm";
import React, {useEffect, useState} from "react";
import TableStages from "./components/TableStages";
import TableIrds from "./components/TableIrds";
import TableExecutors from "./components/TableExecutors";
import {useNavigate} from "react-router-dom";
import {useQuery} from "@apollo/client";
import {PROJECTS_QUERY} from "../../../graphql/queries";
import {nanoid} from "nanoid";
import GetColumns from "./ColumnsManager";

const {Text} = Typography;

const ProjectTableComponent = ({projectStatuses, mode, search, options, state}) => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');


    const [expandedRowKeys, setExpandedRowKeys] = useState();
    const [currentSort, setCurrentSort] = useState({});
    const [column, setColumn] = useState();
     const onExpand = (value) => {
          setExpandedRowKeys((expandedRowKeys === value) ?  null : value);
    }
    useEffect(() => {
        setColumn(
            GetColumns({
                options,
                permissions: "all",
                expandable: {
                    onExpand: (value) => onExpand(value),
                    expandedRowKeys: expandedRowKeys,
                },
                onUpdated: () => refetch()
            }))

    }, [options, expandedRowKeys]);
    useEffect(() => {
        refetch();
    }, [state]);
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };

    const ExpandedRowRenderComponent = ({project}) => {
        const [editModalStatus, setEditModalStatus] = useState();

        return (
            <>
                <Space.Compact direction={"horizontal"}>
                    <TableStages data-permission={"read-project-stage"} project={project}
                                 setEditModalStatus={() => setEditModalStatus("stages")}/>
                    <TableIrds data-permission={"read-project-ird"} project={project}
                               setEditModalStatus={() => setEditModalStatus("irds")}/>
                    <TableExecutors data-permission={"read-project-task-executor"}
                                    project={project}
                                    setEditModalStatus={() => setEditModalStatus("executor")}/>
                </Space.Compact>

                <Modal
                    key={nanoid()}
                    open={editModalStatus}
                    onCancel={() => setEditModalStatus(null)}
                    footer={null}
                    title={getNameModalView(editModalStatus)}
 
                    width={"max-content"}
 
                    onClose={() => setEditModalStatus(null)}
                >
                    {renderEditModalContent({
                        project: project,
                        model: editModalStatus,
                        onCompleted: () => setEditModalStatus(null)
                    })}
                </Modal>
            </>
        )
    }
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
    const renderEditModalContent = ({project, model, onCompleted}) => {
        const commonProps = {
            onCompleted: () => onCompleted(),
            project: project,
        };

        switch (model) {
            case 'irds':
                return <IrdsProjectForm {...commonProps} />;
            case 'stages':
                return <StageToProjectForm {...commonProps} />;
            default:
                return null;
        }
    };


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
                dataSource={data?.projects?.items?.map((row) => ({...row, key: row.id}))}
                columns={column}
                bordered

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
                    expandedRowKeys: expandedRowKeys ? [expandedRowKeys] : [],
                    showExpandColumn: false,
                    expandedRowRender: (record) => (
                        <Space block style={{padding: 2, width: "100%"}}>
                            <ExpandedRowRenderComponent project={record}/>
                        </Space>
                    ),
                }}
            />
        </div>
    );
}


export default ProjectTableComponent;