import {Card, Col, Divider, Form, Modal, notification, Popconfirm, Row, Space, Table, Tooltip, Typography} from "antd";
import Title from "antd/es/typography/Title";
import Search from "antd/es/input/Search";
import {StyledBlockLarge, StyledBlockRegular} from "../../components/style/BlockStyles";
import ProjectTasks from "../../DistributionTasksByProject/Index";
import ProjectForm from "../../ProjectForm/Index";
import IrdsProjectForm from "../../IrdToProjectForm/Index";
import StageToProjectForm from "../../StageToProjectForm/Index";
import React, {useEffect, useState} from "react";
import Link from "antd/es/typography/Link";
import {DeleteOutlined, EditOutlined, PushpinFilled, PushpinOutlined, ReconciliationOutlined} from "@ant-design/icons";
import {
    facilitiesToFullCode,
    rebuildProjectResultQuery
} from "../../components/script/rebuildData/ProjectRebuilderQuery";
import ProjectFileDownload from "../../components/script/fileDownloadScripts/ProjectFileDownload";
import dayjs from "dayjs";
import TableStages from "./TableStages";
import TableIrds from "./TableIrds";
import TableExecutors from "./TableExecutors";
import {useNavigate} from "react-router-dom";
import {useMutation, useQuery} from "@apollo/client";
import {CHANGE_TEMPLATE_TYPE_PROJECT} from "../../../graphql/mutationsProject";
import {PROJECTS_QUERY} from "../../../graphql/queries";
import {nanoid} from "nanoid";

const {Text} = Typography;

const ProjectTableComponent = ({projectStatuses, search}) => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [editModalStatus, setEditModalStatus] = useState({});
    useEffect(() => {
        console.log("editModalStatus", editModalStatus);
    }, [editModalStatus]);
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
    const formatCurrency = (amount) => {
        return amount.toLocaleString('ru-RU', {style: 'currency', currency: 'RUB'});
    };
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
    const columnProgress = (status) => {
        switch (status) {
            case 'APPROVAL_KP':
                return (
                    <Space direction="vertical">
                        <Text>Проверка писем</Text>
                        <Text>Либо ждём ответа, либо составляем письмо</Text>
                        <Text>Дата последнего письма</Text>
                        <Text type="warning">если мы не ответили</Text>
                        <Text type="danger">если с последнего письма больше Х дней</Text>
                    </Space>
                );
            case 'APPROVAL_AGREEMENT':
                return (
                    <Space direction="vertical">
                        <Text>(если все данные верны)</Text>
                        <Text>Этапы - галочка</Text>
                        <Text>Ирд - галочка</Text>
                        <Text type="warning">если данные не заполнены</Text>
                        <Text type="danger">если данные не верны</Text>
                    </Space>
                );
            case 'WAITING_SOURCE':
                return (
                    <Space direction="vertical">
                        <Text>(Кол-во полученного ирд)</Text>
                        <Text>Ирд - кол-во / дата последнего</Text>
                        <Link>Кнопка приступить к работе</Link>
                        <Text type="warning">если ирд получено</Text>
                        <Text type="danger">если срок получения ирд превысил х дней</Text>
                    </Space>
                );
            case 'WORKING':
                return (
                    <Space direction="vertical">
                        <Text>Этап - в работе</Text>
                        <Text>Задачи - в работе</Text>
                        <Text type="warning"> - </Text>
                        <Text type="danger"> - </Text>
                    </Space>
                );
            default:
                return null;
        }
    }


    const columns = [{
        title: 'Прогресс',
        dataIndex: 'progress',
        key: 'progress',
        width: "10%",
        align: "left",
        render: (text, record) => columnProgress(record?.status?.name_key),
    },
        {
            key: 'edit',
            width: "2%",
            render: (text, record) => (
                <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                    <Link>
                        <Tooltip title={"Изменить данные проекта"}>
                            <EditOutlined
                                onClick={() => {
                                    setEditModalStatus({
                                        type: "project",
                                        project: record
                                    })
                                    console.log("dsa");
                                }}/>
                        </Tooltip>

                    </Link>
                    <Link type={"secondary"}>
                        <Tooltip title={"Удаление недоступно (администратор)"}>

                            <DeleteOutlined/>
                        </Tooltip>
                    </Link>
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
                                    setProjectTasksModalStatus({
                                        project_id: record.id,
                                        mode: "create",
                                    })
                                }}/>
                            </Tooltip>
                        </Link>

                    )}
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


                </Space.Compact>
            ),
        },

        {
            title: 'Основные данные',
            dataIndex:
                'main_data',
            key:
                'main_data',
            width:
                "48%",
            align:
                "left",
            render:
                (text, record) => (
                    <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                        <Title level={5} style={{marginTop: 0}}>{record.name}</Title>
                        <Text>{record.number}</Text>
                        <Text>({record.type_project_document?.code ?? ""}) {record.type_project_document?.name ?? ""}</Text>
                        <ProjectFileDownload text={"Скачать договор"} projectId={record.id}/>
                    </Space.Compact>
                ),

        },
        {
            title: 'Данные о заказчике',
            dataIndex:
                'customer_data',
            key:
                'customer_data',
            width:
                "15%",
            align:
                "left",
            render:
                (text, record) => (
                    <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                        {record.organization_customer ?
                            <Title level={5} style={{marginTop: 0}}>{record.organization_customer?.name ?? "?"}</Title>
                            :
                            <Title level={5} style={{marginTop: 0, color: '#ff4d4f'}}>Организация не указана</Title>
                        }
                        <Text strong>Объекты:</Text>
                        {record.facilities && record.facilities?.length > 0 ? (record.facilities?.map(row => (
                                <Tooltip placement={"leftBottom"} title={
                                    `${row?.group_facility?.subselection_facility?.selection_facility.name}, ` +
                                    `${row?.group_facility?.subselection_facility?.name}, ` +
                                    `${row?.group_facility?.name}, ` +
                                    `${row?.name}.`
                                }>
                                    < Text style={{marginLeft: 8, color: '#1677ff'}} key={row.id}>
                                        {facilitiesToFullCode(row)}
                                    </Text>
                                </Tooltip>
                            )))
                            :
                            <Text type="danger">Объекты отсутствуют
                            </Text>
                        }
                        <Text strong>Представители:</Text>
                        {record.delegations && record.delegations?.length > 0 ? (record?.delegations?.map(delegate => (
                                <Link style={{marginLeft: 8}}
                                      key={delegate.id}>{delegate?.last_name ?? ""} {delegate?.first_name ?? ""} {delegate?.patronymic ?? ""}
                                </Link>
                            )))
                            :
                            <Text>Представители отсутствуют</Text>}
                    </Space.Compact>
                ),
        },
        {
            title: 'Статус',
            dataIndex:
                'status_data',
            key:
                'status_data',
            width:
                "15%",
            align:
                "left",
            render:
                (text, record) => (
                    <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                        <Text strong>Статус:</Text>
                        <Text>{record.status?.name}</Text>
                        <Text strong>Сроки:</Text>
                        {
                            record.date_signing ?
                                <Text>с {dayjs(record?.date_signing).format("DD.MM.YYYY")}</Text>
                                :
                                <Text type="danger">Не подписан</Text>
                        }
                        {
                            record.date_end ?
                                <Text>по {dayjs(record?.date_end).format("DD.MM.YYYY")}</Text>
                                :
                                <Text type="danger">Не задана дата окончания</Text>
                        }
                        {
                            record.date_end && record.date_signing ?
                                (
                                    <Text>{dayjs(record.date_end).diff(dayjs(record.date_signing), 'day')} (дней)</Text>) : null
                        }
                    </Space.Compact>
                ),
        },
        {
            title: 'Стоимость',
            dataIndex:
                'price_data',
            key:
                'price_data',
            width:
                "10%",
            align:
                "left",
            render:
                (text, record) => (
                    <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                        <Text strong>Полная стоимость:</Text>
                        <Text>{record.price ? formatCurrency(record.price) : ""} ₽</Text>
                        <Text strong>Аванс:</Text>
                        <Text>{record.prepayment}%
                            ({record.price && record.prepayment && formatCurrency(record.price / 100 * record.prepayment)} ₽)</Text>
                    </Space.Compact>
                ),
        },

    ];
    const expandedRowRender = (project) => {
        return (
            <Space.Compact direction={"horizontal"}>

                        <TableStages project={project} setEditModalStatus={setEditModalStatus}/>


                        <TableIrds project={project} setEditModalStatus={setEditModalStatus}/>


                        <TableExecutors project={project} setEditModalStatus={setEditModalStatus}/>


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
                columns={columns}
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