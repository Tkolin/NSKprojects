import React, {useEffect, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {
    Col,
    Collapse,
    Descriptions,
    Divider,
    Form,
    Modal,
    notification,
    Row,
    Space,
    Table,
    Tooltip,
    Typography
} from 'antd';
import {PROJECTS_QUERY} from '../../../graphql/queries';
import Search from "antd/es/input/Search";
import StagesProjectFileDownload from "../../../components/script/fileDownloadScripts/StagesProjectFileDownload";
import ProjectFileDownload from "../../../components/script/fileDownloadScripts/ProjectFileDownload";
import IrdsProjectFileDownload from "../../../components/script/fileDownloadScripts/IrdsProjectFileDownload";
import Title from "antd/es/typography/Title";
import ActRenderingProjectDownload from "../../../components/script/fileDownloadScripts/ActRenderingProjectDownload";
import PaymentInvoiceProjectDownload
    from "../../../components/script/fileDownloadScripts/PaymentInvoiceProjectDownload";
import ProjectTasks from "../../modules/projectTasks/Index";
import TaskExecutorContractDownload from "../../../components/script/fileDownloadScripts/TaskExecutorContractDownload";
import {useNavigate} from "react-router-dom";
import ProjectForm from "../../modules/project/components/ProjectForm";
import StagesProjectForm from "../../modules/project/components/StagesProjectForm";
import IrdsProjectForm from "../../modules/project/components/IrdsProjectForm";
import {
    facilitiesToFullCode,
    rebuildProjectResultQuery,
    rebuildStagesResultQuery,
    rebuildIrdsResultQuery,
    rebuildStagesToQuery,
    rebuildIrdToQuery,
    rebuildProjectToQuery
} from '../../../components/script/rebuildData/ProjectRebuilderQuery';
import {StyledButtonGreen} from "../../../components/style/ButtonStyles";
import {
    UPDATE_IRDS_TO_PROJECT_MUTATION,
    UPDATE_PROJECT_MUTATION, UPDATE_STAGES_TO_PROJECT_MUTATION
} from "../../../graphql/mutationsProject";
import {StyledBlockBig, StyledBlockLarge, StyledBlockRegular} from "../../../components/style/BlockStyles";
import Link from "antd/es/typography/Link";
import dayjs from "dayjs";
import {DeleteOutlined, DownloadOutlined, EditOutlined} from "@ant-design/icons";

const {Text} = Typography;

const ProjectTable = () => {

    // Состояния
    const [formSearch] = Form.useForm();
    const [selectedProject, setSelectedProject] = useState(null);
    const [editModalStatus, setEditModalStatus] = useState(false);
    useEffect(() => {
        if(!editModalStatus)
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

    const {loading: loading, error: error, data: data, refetch: refetch} = useQuery(PROJECTS_QUERY, {
        variables: {
            queryOptions: {
                page,
                limit,
                search,
                sortField,
                sortOrder
            }
        },
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
            openNotification('topRight', 'error', `Ошибка при выполнении сооздания : ${error.message}`);
        },
    });

    const [mutateIrd] = useMutation(UPDATE_IRDS_TO_PROJECT_MUTATION, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Создание новой записи в таблице  выполнено успешно`);
            setEditModalStatus(null);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при выполнении сооздания ирд : ${error.message}`);
        },
    });

    const [mutateStage] = useMutation(UPDATE_STAGES_TO_PROJECT_MUTATION, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Создание новой записи в таблице  выполнено успешно`);
            setEditModalStatus(null);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при выполнении сооздания этапа : ${error.message}`);
        },
    });
    // Обработка загрузки и ошибок
    if (error) return `Ошибка! ${error.message}`;

    // Формат таблицы
    const columns = [
        {
            key: 'edit',
            width: "2%",
            render: (text, record) => (
                <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                        <Link type={"warning"}>
                            <EditOutlined
                                onClick={() => setEditModalStatus({
                                    status: "base",
                                    project: rebuildProjectResultQuery(record)
                                })}/>
                        </Link>
                    <Link type={"danger"}>
                            <DeleteOutlined/>
                        </Link>
                </Space.Compact>
            ),
        },
        {
            title: 'Основные данные',
            dataIndex: 'main_data',
            key: 'main_data',
            width: "50%",
            align: "left",
            render: (text, record) => (
                <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                    <Title level={5} style={{marginTop: 0}}>{record.name}</Title>
                    <Text>{record.number}</Text>
                    <Text>{record.type_project_document.name}</Text>
                    <ProjectFileDownload  style={{color: "green"}} text={"Скачать договор"} projectId={record.id}/>
                </Space.Compact>
            ),

        },
        {
            title: 'Данные о заказчике',
            dataIndex: 'customer_data',
            key: 'customer_data',
            width: "18%",
            align: "left",
            render: (text, record) => (
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
                    {record.delegations && record.delegations?.length > 0 ? (record.delegations.map(delegate => (
                            <Link style={{marginLeft: 8}}
                                  key={delegate.id}>{delegate?.last_name ?? ""} {delegate?.first_name ?? ""} {delegate?.patronymic ?? ""}
                            </Link>
                        )))
                        :
                        <Text>Представители отсутсвуют</Text>}
                </Space.Compact>
            ),
        },
        {
            title: 'Статус',
            dataIndex: 'status_data',
            key: 'status_data',
            width: "15%",
            align: "left",
            render: (text, record) => (
                <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                    <Text strong>Статус:</Text>
                    <Text>{record.status?.name}</Text>
                    <Text strong>Сроки:</Text>
                    {
                        record.date_signing ?
                            <Text>с {record.date_signing}</Text>
                            :
                            <Text type="danger">Не подписан</Text>
                    }
                    {
                        record.date_end ?
                            <Text>по {record.date_end}</Text>
                            :
                            <Text type="danger">Не задана дата окончания</Text>
                    }
                    <Text> </Text>
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
            dataIndex: 'price_data',
            key: 'price_data',
            width: "10%",
            align: "left",
            render: (text, record) => (
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
            const columnsStages = [{
                title:
                    <Space>
                        <Tooltip title={"График выполнения работ"}>
                            <Text style={{marginRight: 10}}>Список Этапов</Text>
                            <StagesProjectFileDownload  style={{color: "green"}} text={<DownloadOutlined/>} projectId={project.id}/>
                        </Tooltip>
                        <Link  type={"warning"}>
                            <EditOutlined
                                onClick={() => setEditModalStatus({
                                    status: "stages",
                                    stages: rebuildStagesResultQuery(project.project_stages),
                                    project: rebuildProjectResultQuery(project)
                                })}/>
                        </Link>
                    </Space>,
                children: [
                    {
                        title: '№',
                        dataIndex: 'number',
                        key: 'number',
                        align: "left",
                    },
                    {
                        title: 'Наименование этапа',
                        dataIndex: 'stage',
                        key: 'stage',
                        align: "left",
                        render: (text, record) => (
                            <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                                <Text>{record?.stage?.name}</Text>
                            </Space.Compact>
                        ),
                    },
                    {
                        title: 'Счёт на оплату',
                        dataIndex: 'payment',
                        key: 'payment',
                        align: "left",
                        render: (text, record) => (
                            <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                                {record.prepayment ?
                                    <PaymentInvoiceProjectDownload isPrepayment={true}
                                                                   projectId={record.id} type="acts"/>
                                    :
                                    <PaymentInvoiceProjectDownload stageNumber={record.number}
                                                                   projectId={project.id} type="acts"/>
                                }
                            </Space.Compact>
                        ),
                    },
                    {
                        title: 'Акт работ',
                        dataIndex: 'act',
                        key: 'act',
                        align: "left",
                        render: (text, record) => (
                            <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                                {record.prepayment ?
                                    ("-")
                                    :
                                    <ActRenderingProjectDownload stageNumber={record.number}
                                                                 projectId={project.id} type="acts"/>
                                }
                            </Space.Compact>
                        ),
                    },]
            }
            ];
            const columnsIrds = [{
                title:
                    <Space>
                        <Tooltip title={"Список ИРД"}>

                            <Text style={{marginRight: 10}}>Список ИРД</Text>
                            <IrdsProjectFileDownload style={{color: "green"}} text={<DownloadOutlined/>} projectId={project.id}/>
                        </Tooltip>
                        <Link  type={"warning"}>

                            <EditOutlined onClick={() => setEditModalStatus({
                                status: "irds",
                                irds: rebuildIrdsResultQuery(project.project_irds),
                                project: rebuildProjectResultQuery(project)
                            })}/>
                        </Link>
                    </Space>,
                children: [
                    {
                        width: '45%',

                        title: 'Основаня информация',
                        dataIndex: 'ird',
                        key: 'ird',
                        align: "left",
                        render: (text, record) => (
                            <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                                <Text strong>{record?.IRD?.name}</Text>
                            </Space.Compact>
                        ),
                    },
                    {
                        width: '40%',

                        title: 'Статус получения',
                        dataIndex: 'status_confirm',
                        key: 'status_confirm',
                        align: "left",
                        render: (text, record) => (
                            record.receivedDate ? (
                                    <Text strong>{record?.receivedDate}</Text>
                                )
                                :
                                <Text strong style={{color: "#ff4d4f"}}>Не получено</Text>
                        ),
                    },
                    {
                        width: '15%',

                        title: 'Файл',
                        dataIndex: 'ird_download',
                        key: 'ird_download',
                        align: "left",
                        render: (text, record) => (
                            <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                            </Space.Compact>
                        ),
                    }]
            }
            ];
            const columnsExecutors = [{
                title:
                    <Space>
                        <Tooltip title={'Список Исполнителей (В разработке)'}>

                            <Text style={{marginRight: 10}}>Список Исполнителей (В разработке)</Text>
                            <DownloadOutlined/>
                        </Tooltip>
                        {/*<IrdsProjectFileDownload text={<DownloadOutlined/>} projectId={project.id}/>*/}
                        <EditOutlined onClick={() => setEditModalStatus({
                            status: "tasks",
                            project: rebuildProjectResultQuery(project)
                        })}/>
                    </Space>,
                children: [
                    {
                        title: 'Исполнитель',
                        dataIndex: 'executor',
                        width: '45%',
                        key: 'executor',
                        align: "left",
                        render: (text, record) => (
                            <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                            </Space.Compact>
                        ),
                    },
                    {
                        title: 'Список задач',
                        dataIndex: 'tasks',
                        width: '40%',
                        key: 'tasks',
                        align: "left",
                        render: (text, record) => (
                            <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                            </Space.Compact>
                        ),
                    },
                    {
                        title: 'Договор',
                        dataIndex: 'contract',
                        width: '15%',
                        key: 'contract',
                        align: "left",
                        render: (text, record) => (
                            <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                            </Space.Compact>
                        ),
                    }]
            }
            ];
            return (
                <Space.Compact style={{width: "100%", margin: 0}}>
                    <Table
                        style={{
                            margin: 0,
                            width: "33%",
                            borderWidth: "1px",
                            borderStyle: "solid",
                            borderColor: "grey",
                        }}
                        size={"small"}
                        columns={columnsStages}
                        dataSource={project?.project_stages ? [{
                            number: 0,
                            type: "prepayment",
                            stage: {name: "Аванс"}
                        }, ...project?.project_stages] : [{}]}
                        pagination={false}
                    />
                    <Table
                        style={{
                            margin: 0,
                            width: "35%",
                            borderWidth: "1px",
                            borderStyle: "solid",
                            borderColor: "grey",
                        }}
                        size={"small"}
                        columns={columnsIrds}
                        dataSource={project.project_irds}
                        pagination={false}
                    />
                    <Table
                        style={{
                            margin: 0,
                            width: "33%",
                            borderWidth: "1px",
                            borderStyle: "solid",
                            borderColor: "grey",
                        }}
                        size={"small"}
                        columns={columnsExecutors}
                        dataSource={project.executors}
                        pagination={false}
                    />
                </Space.Compact>
            );
        }
    ;
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
        } else
            console.log("Фильтры сохранены");
    };
    return (
        <div>
            <Divider style={{marginTop: 0}}>
                <Title style={{marginTop: 0}} level={2}>Отчёты по Проектам</Title>
            </Divider>

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
                                <StyledButtonGreen onClick={() =>{
                                    mutateProject({variables: {data: rebuildProjectToQuery(editModalStatus?.project)}})}}>
                                    Сохранить
                                </StyledButtonGreen>
                            </div>
                        </StyledBlockRegular>

                    ) :
                    editModalStatus?.status === "irds" ? (
                            <StyledBlockLarge label={"Список ИРД"} >
                                <IrdsProjectForm
                                    actualIrds={editModalStatus?.irds}
                                    updateIrds={(value) => setEditModalStatus({...editModalStatus, irds: value})}
                                    project={editModalStatus?.project}
                                />
                                <Divider/>
                                <div style={{ width: "100%", textAlign: "center"}}>
                                    <StyledButtonGreen onClick={() =>
                                        mutateIrd({variables: {data: rebuildIrdToQuery(editModalStatus?.irds, editModalStatus?.project)}})}>
                                        Сохранить
                                    </StyledButtonGreen>
                                </div>
                            </StyledBlockLarge>) :
                        editModalStatus?.status === "stages" ? (
                                <StyledBlockLarge label={"Список этапов "} >
                                    <StagesProjectForm
                                        actualStages={editModalStatus?.stages}
                                        updateStages={(value) => setEditModalStatus({
                                            ...editModalStatus,
                                            stages: value
                                        })}
                                        project={editModalStatus?.project}
                                    />
                                    <Divider/>
                                    <div style={{ width: "100%", textAlign: "center"}}>
                                        <StyledButtonGreen onClick={() =>
                                            mutateStage({variables: {data: rebuildStagesToQuery(editModalStatus?.stages, editModalStatus?.project)}})}>
                                            Сохранить
                                        </StyledButtonGreen>
                                    </div>
                                </StyledBlockLarge>)
                            :
                            editModalStatus?.status === "tasks" ? (
                                    <StyledBlockLarge>
                                        <ProjectTasks
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
};

export default ProjectTable;
