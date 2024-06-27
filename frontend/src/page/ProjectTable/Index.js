import React, {useEffect, useState, useMemo} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {
    Divider,
    Form,
    Modal,
    notification, Popconfirm, Row,
    Space,
    Table,
    Tooltip,
    Typography
} from 'antd';
import {PROJECTS_QUERY} from '../../graphql/queries';
import Search from "antd/es/input/Search";
import ProjectFileDownload from "../components/script/fileDownloadScripts/ProjectFileDownload";
import Title from "antd/es/typography/Title";
import ProjectTasks from "../DistributionTasksByProject/Index";
import {useNavigate} from "react-router-dom";
import ProjectForm from "../ProjectForm/Index";
import StageToProjectForm from "../StageToProjectForm/Index";
import IrdsProjectForm from "../IrdToProjectForm/Index";
import {
    facilitiesToFullCode,
    rebuildProjectResultQuery,
    rebuildStagesToQuery,
    rebuildIrdToQuery,
    rebuildProjectToQuery
} from '../components/script/rebuildData/ProjectRebuilderQuery';
import {StyledButtonGreen} from "../components/style/ButtonStyles";
import {
    CHANGE_TEMPLATE_TYPE_PROJECT,
    UPDATE_IRDS_TO_PROJECT_MUTATION,
    UPDATE_PROJECT_MUTATION, UPDATE_STAGES_TO_PROJECT_MUTATION
} from "../../graphql/mutationsProject";
import {StyledBlockLarge, StyledBlockRegular} from "../components/style/BlockStyles";
import Link from "antd/es/typography/Link";
import dayjs from "dayjs";
import {
    DeleteOutlined,
    EditOutlined, PushpinFilled, PushpinOutlined,
    ReconciliationOutlined,
} from "@ant-design/icons";
import './Styles.css'; // Импорт вашего CSS файла

import PersonsByStagesCompactForm from "./components/PersonsByStagesCompactForm";
import StatusLegend from "./components/StatusLegend";
import TableExecutors from "./components/TableExecutors";
import TableStages from "./components/TableStages";
import TableIrds from "./components/TableIrds";
// ARCHIVE
// DEVELOPMENT
// EXAMINATION
// COMPLETED
// CUSTOMER_APPROVAL
const {Text} = Typography;



const Index = () => {

        // Состояния
        const [formSearch] = Form.useForm();
        const [selectedProject, setSelectedProject] = useState(null);
        const [editModalStatus, setEditModalStatus] = useState(false);
        const [employeeToStageModalStatus, setEmployeeToStageModalStatus] = useState(false);
        const [projectTasksModalStatus, setProjectTasksModalStatus] = useState(false);
        useEffect(() => {
            if (!editModalStatus)
                refetch();
        }, [editModalStatus]);
        const navigate = useNavigate();
        const formatCurrency = (amount) => {
            return amount.toLocaleString('ru-RU', {style: 'currency', currency: 'RUB'});
        };

        // Данные
        const [page, setPage] = useState(1);
        const [limit, setLimit] = useState(10);
        const [expandedRowKeys, setExpandedRowKeys] = useState([]);

        const [currentSort, setCurrentSort] = useState({});

        const [sortField, setSortField] = useState('');
        const [sortOrder, setSortOrder] = useState('');

        const [search, setSearch] = useState('');
        const refetch = () => {
            refetchData();
        }
        const {loading: loading, error: error, data: data, refetch: refetchData} = useQuery(PROJECTS_QUERY, {
            variables: {
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

        // Функции уведомлений
        const openNotification = (placement, type, message) => {
            notification[type]({
                message: message,
                placement,
            });
        };

        // Мутация для удаления
        const onSearch = (value) => {
            setSearch(value);
        }


        const [mutateProject] = useMutation(UPDATE_PROJECT_MUTATION, {
            onCompleted: (data) => {
                openNotification('topRight', 'success', `Создание новой записи в таблице  выполнено успешно`);
                setEditModalStatus(null);
                refetch();
            },
            onError: (error) => {
                openNotification('topRight', 'error', `Ошибка при выполнении создания : ${error.message}`);
            },
        });

        const [mutateIrd] = useMutation(UPDATE_IRDS_TO_PROJECT_MUTATION, {
            onCompleted: (data) => {
                openNotification('topRight', 'success', `Создание новой записи в таблице  выполнено успешно`);
                setEditModalStatus(null);
            },
            onError: (error) => {
                openNotification('topRight', 'error', `Ошибка при выполнении создания ирд : ${error.message}`);
            },
        });

        const [mutateStage] = useMutation(UPDATE_STAGES_TO_PROJECT_MUTATION, {
            onCompleted: (data) => {
                openNotification('topRight', 'success', `Создание новой записи в таблице  выполнено успешно`);
                setEditModalStatus(null);
            },
            onError: (error) => {
                openNotification('topRight', 'error', `Ошибка при выполнении создания этапа : ${error.message}`);
            },
        });
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
        // Обработка загрузки и ошибок
        if (error) return `Ошибка! ${error.message}`;
        // Функции

        // Формат таблицы
        const columns = [
            {
                key: 'edit',
                width: "2%",
                render: (text, record) => (
                    <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                        <Link>
                            <Tooltip title={"Изменить данные проекта"}>

                                <EditOutlined
                                    onClick={() => setEditModalStatus({
                                        status: "base",
                                        project: rebuildProjectResultQuery(record)
                                    })}/>
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
                    "52%",
                align:
                    "left",
                render:
                    (text, record) => (
                        <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                            <Title level={5} style={{marginTop: 0}}>{record.name}</Title>
                            <Text>{record.number}</Text>
                            <Text>({record.type_project_document.code}) {record.type_project_document.name}</Text>
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
                    "18%",
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
                            <Text>{formatCurrency(record.price)} ₽</Text>
                            <Text strong>Аванс:</Text>
                            <Text>{record.prepayment}%
                                ({record.price && record.prepayment && formatCurrency(record.price / 100 * record.prepayment)} ₽)</Text>
                        </Space.Compact>
                    ),
            },

        ];
        const expandedRowRender = (project) => {
            return (
                <Space.Compact style={{width: "100%", margin: 0}}>
                    <TableStages  project={project} setEditModalStatus={setEditModalStatus}/>
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
                <Divider style={{marginTop: 0}}>
                    <Title style={{marginTop: 0}} level={2}>Отчёты по Проектам</Title>
                </Divider>
                <StatusLegend/>
                <Form form={formSearch} layout="horizontal">
                    <Form.Item label="Поиск:" name="search">
                        <Space>
                            <Search
                                placeholder="Найти..."
                                allowClear
                                enterButton="Найти"
                                onSearch={onSearch}
                            />
                        </Space>
                    </Form.Item>
                </Form>

                <Table
                    style={{border: "black"}}
                    rowClassName={(record) => 'my-ant-table-row-' + record?.status?.name_key?.toLowerCase() + ((record.id % 2 === 0) ? ' my-ant-table-row-danger' : ' my-ant-table-row-warning')}
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
                            expandedRowRender(record)
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

                    onClose={() => setProjectTasksModalStatus({
                        project_id: null,
                        mode: null,
                    })}
                >
                    <StyledBlockLarge label={"Создание задач"}>
                        <ProjectTasks onChange={() => refetch()}
                                      project={data?.projects?.items?.find(row => row.id === projectTasksModalStatus.project_id)}/>
                    </StyledBlockLarge>
                </Modal>
                {/*<Modal*/}
                {/*    key={employeeToStageModalStatus.projectId}*/}
                {/*    open={employeeToStageModalStatus?.mode}*/}
                {/*    onCancel={() => setEmployeeToStageModalStatus({*/}
                {/*        projectId: null,*/}
                {/*        tasks: null,*/}
                {/*        mode: null,*/}
                {/*        stageNumber: null*/}
                {/*    })}*/}
                {/*    footer={null}*/}
                {/*    width={500}*/}
                {/*    onClose={() => setEmployeeToStageModalStatus({*/}
                {/*        projectId: null,*/}
                {/*        tasks: null,*/}
                {/*        mode: null,*/}
                {/*        stageNumber: null*/}
                {/*    })}*/}
                {/*>*/}
                {/*    <StyledBlockRegular label={"Список исполнителей"}>*/}
                {/*        <PersonsByStagesCompactForm tasks={data?.projects?.find(row=>row.id === employeeToStageModalStatus.projectId).project_tasks}*/}
                {/*                                    stageNumber={employeeToStageModalStatus.stageNumber}*/}
                {/*                                    projectId={employeeToStageModalStatus.projectId}*/}
                {/*                                    onCompleted={()=>refetch()}/>*/}
                {/*    </StyledBlockRegular>*/}
                {/*</Modal>*/}
                <Modal
                    key={editModalStatus?.project?.id}
                    open={editModalStatus?.status}
                    onCancel={() => setEditModalStatus(null)}
                    footer={null}
                    width={1500}
                    onClose={() => setEditModalStatus(null)}
                >
                    {editModalStatus?.status === "base" ? (

                            <StyledBlockRegular>
                                <ProjectForm
                                    actualProject={editModalStatus?.project}
                                    updateProject={(value) => setEditModalStatus({
                                        ...editModalStatus,
                                        project: {...editModalStatus.project, ...value}
                                    })}/>
                                <div>
                                    <StyledButtonGreen onClick={() => {
                                        mutateProject({variables: {data: rebuildProjectToQuery(editModalStatus?.project)}})
                                    }}>
                                        Сохранить
                                    </StyledButtonGreen>
                                </div>
                            </StyledBlockRegular>

                        ) :
                        editModalStatus?.status === "irds" ? (
                                <StyledBlockLarge label={"Список ИРД"}>
                                    <IrdsProjectForm
                                        actualIrds={editModalStatus?.irds}
                                        updateIrds={(value) => setEditModalStatus({...editModalStatus, irds: value})}
                                        project={editModalStatus?.project}
                                    />
                                    <Divider/>

                                </StyledBlockLarge>) :
                            editModalStatus?.status === "stages" ? (
                                    <StyledBlockLarge label={"Список этапов "}>
                                        <StageToProjectForm
                                            actualStages={editModalStatus?.stages}
                                            updateStages={(value) => setEditModalStatus({
                                                ...editModalStatus,
                                                stages: value
                                            })}
                                            project={editModalStatus?.project}
                                        />
                                        <Divider/>
                                    </StyledBlockLarge>)
                                :
                                editModalStatus?.status === "tasks" ? (
                                        <StyledBlockLarge>
                                            <ProjectTasks
                                                onChange={() => refetch()}
                                                actualStages={editModalStatus?.stages}
                                                updateStages={(value) => setEditModalStatus({
                                                    ...editModalStatus,
                                                    stages: value
                                                })}
                                                project={editModalStatus?.project}
                                            />
                                            <div>
                                                <StyledButtonGreen onClick={() =>
                                                    mutateStage({variables: {data: rebuildStagesToQuery(editModalStatus?.stages, editModalStatus?.project)}})}>
                                                    Сохранить
                                                </StyledButtonGreen>
                                            </div>
                                        </StyledBlockLarge>)
                                    : null}
                </Modal>

            </div>
        )
    }
;

export default Index;
