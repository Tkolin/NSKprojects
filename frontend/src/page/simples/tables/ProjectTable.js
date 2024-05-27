import React, {useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {Collapse, Descriptions, Divider, Form, Modal, notification, Row, Space, Table, Typography} from 'antd';
import {PROJECTS_QUERY} from '../../../graphql/queries';
import Search from "antd/es/input/Search";
import {StyledFormLarge} from "../../../components/style/FormStyles";
import StagesProjectFileDownload from "../../../components/script/StagesProjectFileDownload";
import ProjectFileDownload from "../../../components/script/ProjectFileDownload";
import IrdsProjectFileDownload from "../../../components/script/IrdsProjectFileDownload";
import Title from "antd/es/typography/Title";
import ActRenderingProjectDownload from "../../../components/script/ActRenderingProjectDownload";
import PaymentInvoiceProjectDownload from "../../../components/script/PaymentInvoiceProjectDownload";
import Index from "../../modules/project/Index";
import TaskExecutorContractDownload from "../../../components/script/TaskExecutorContractDownload";
import {useNavigate} from "react-router-dom";
import ProjectForm from "../../modules/project/components/ProjectForm";
import StagesProjectForm from "../../modules/project/components/StagesProjectForm";
import IrdsProjectForm from "../../modules/project/components/IrdsProjectForm";
import dayjs from "dayjs";
import {StyledButtonGreen} from "../../../components/style/ButtonStyles";
import {
    ADD_PROJECT_MUTATION,
    UPDATE_IRDS_TO_PROJECT_MUTATION,
    UPDATE_PROJECT_MUTATION, UPDATE_STAGES_TO_PROJECT_MUTATION
} from "../../../graphql/mutationsProject";

const {Text} = Typography;

const ProjectTable = () => {

    // Состояния
    const [formSearch] = Form.useForm();
    const [selectedProject, setSelectedProject] = useState(null);
    const [editModalStatus, setEditModalStatus] = useState(false);
    const navigate = useNavigate();


    // Данные
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);

    const [currentSort, setCurrentSort] = useState({});

    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    const [search, setSearch] = useState('');

    const {loading, error, data, refetch} = useQuery(PROJECTS_QUERY, {
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

    function addLeadingZeros(number, length) {
        return String(number).padStart(length, '0');
    }

    const rebuildProjectResultQuery = (data) => {
        return {
            ...data,
            date_create: data?.date_create ? dayjs(data?.date_create) : null,
            date_end: data?.date_end ? dayjs(data?.date_end) : null,
            date_signing: data?.date_signing ? dayjs(data?.date_signing) : null,
            delegates_id: data?.delegations?.map(k => k?.id),
            facility_id: data?.facilities?.map(k => k?.id),
            organization_customer_id: data?.organization_customer?.id,
            organization_customer_name: data?.organization_customer?.name,
            status_id: data?.status?.id,
            type_project_document_id: data?.type_project_document?.id,
            type_project_document_name: data?.type_project_document?.name,
        };
    };
    const rebuildStagesResultQuery = (data) => {
        return data?.map((row, index) => ({
            ...row,
            date_range: [
                row?.date_start ? dayjs(row?.date_start) : null,
                row?.date_end ? dayjs(row?.date_end) : null],
            stage_number: index + 1,
            stage_id: row?.stage?.id,
            stage_name: row?.stage?.name
        }));
    };
    const rebuildProjectToQuery = (project) => {
        if (!project)
            return [];

        return {
            id: project?.id ?? null,
            number: project?.number,
            name: project?.name,
            organization_customer_id: project?.organization_customer_id,
            type_project_document_id: project?.type_project_document_id,
            date_signing: dayjs(project?.date_signing).format("YYYY-MM-DD"),
            duration: project?.duration,
            date_end: dayjs(project?.date_end).format("YYYY-MM-DD"),
            date_create: dayjs(project?.date_create).format("YYYY-MM-DD"),
            status_id: project?.status_id,
            date_completion: dayjs(project?.date_completion).format("YYYY-MM-DD"),
            price: project?.price,
            prepayment: project?.prepayment,
            facility_id: project?.facility_id?.map(row => row[3][0]),
            delegates_id: project?.delegates_id,
        };
    };
    const rebuildIrdsResultQuery = (data) => {
        return data?.map((row, index) => ({
            ...row,
            receivedDate: row.receivedDate ? dayjs(row.receivedDate?.[1]).format("YYYY-MM-DD") : null,
            ird_id: row?.IRD?.id,
            ird_name: row?.IRD?.name
        }));
    };
    const rebuildStagesToQuery = (data, projectId) => {
        if (!data)
            return [];
        const dataArray = Object.values(data);

        return dataArray?.map((row, index) => ({
            id: row?.id ?? null,
            project_id: projectId,
            date_start: row.date_range?.[0] ? dayjs(row.date_range?.[0]).format("YYYY-MM-DD") : null,
            date_end: row.date_range?.[1] ? dayjs(row.date_range?.[1]).format("YYYY-MM-DD") : null,
            duration: row?.duration ?? null,
            stage_id: row?.stage_id ?? null,
            stage_number: index + 1,
            price: row?.price ?? null,
            percent: row?.percent ?? null,
            progress: row?.progress ?? null,
            price_to_paid: row?.price_to_paid ?? null,
        }));
    };
    const rebuildIrdToQuery = (data, projectId) => {
        if (!data)
            return [];
        const dataArray = Object.values(data);

        return dataArray?.map((row, index) => ({
            id: row?.id ?? null,
            project_id: projectId,
            ird_id: row?.ird_id ?? null,
            stageNumber: row?.stageNumber ? parseInt(row?.stageNumber) : null,
            applicationProject: row?.applicationProject ? parseInt(row?.applicationProject) : null,
            receivedDate: row?.receivedDate ? dayjs(row?.receivedDate).format("YYYY-MM-DD") : null,
        }));
    };
    const [mutateProject] = useMutation(UPDATE_PROJECT_MUTATION, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Создание новой записи в таблице  выполнено успешно`);
            setEditModalStatus(null);
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
            title: 'Номер',
            dataIndex: 'number',
            key: 'number',
            width: 100,
            sorter: true, ellipsis: true,
        },
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            sorter: true, ellipsis: true,
        },
        {
            title: 'Заказчик',
            dataIndex: 'organization_customer',
            key: 'organization_customer',
            sorter: true, ellipsis: true,
            render: (organization_customer) => organization_customer ?
                organization_customer.name : "",
        },
        {
            title: 'Представитель',
            dataIndex: 'delegations',
            key: 'delegations',
            sorter: true, ellipsis: true,

            render: (delegations) => (
                delegations.map(delegate => (
                    <div key={delegate.id}>{delegate.last_name} {delegate.first_name} {delegate.patronymic}</div>
                ))
            )
        },
        {
            title: 'Тип документации',
            dataIndex: 'type_project_document',
            key: 'type_project_document',
            sorter: true, ellipsis: true,
            render: (type_project_document) => type_project_document ?
                type_project_document.name : ""
        },
        {
            title: 'Объект',
            dataIndex: 'facilities',
            key: 'facilities',
            sorter: true, ellipsis: true,
            render: (facilities) =>
                facilities?.map(f => (
                    <div key={f.id}>
                        {addLeadingZeros(f?.group_facility?.subselection_facility?.selection_facility?.code, 2)}.
                        {addLeadingZeros(f?.group_facility?.subselection_facility?.code, 2)}.
                        {addLeadingZeros(f?.group_facility?.code, 3)}.
                        {addLeadingZeros(f?.code, 3)}.
                        {f?.name}</div>
                ))
        },
        {
            title: 'Дата подписания',
            dataIndex: 'date_signing',
            key: 'date_signing',
            width: 100, sorter: true, ellipsis: true,
        },
        {
            title: 'Продолжительность',
            dataIndex: 'duration',
            key: 'duration',
            width: 100, sorter: true, ellipsis: true,
        },
        {
            title: 'Дата начала',
            dataIndex: 'date_end',
            key: 'date_end',
            width: 100, sorter: true, ellipsis: true,
        },
        {
            title: 'Дата окончания',
            dataIndex: 'date_end',
            key: 'date_end',
            width: 100, sorter: true, ellipsis: true,
        },
        {
            title: 'Стоимость',
            dataIndex: 'price',
            key: 'price',
            width: 160, sorter: true, ellipsis: true,
            render: (price) =>
                (price?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ₽')
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            width: 220, sorter: true, ellipsis: true,
            render: (status) => status ?
                status.name : ""
        },
        {
            title: 'Договор', key: 'btnContract', width: 80, align: 'center', sorter: true, ellipsis: true,
            render: (text, record) => (
                <>
                    <ProjectFileDownload projectId={record.id}/>
                </>
            ),
        }, {
            title: 'Список ИРД', key: 'btnIrd', width: 80, align: 'center', sorter: true, ellipsis: true,
            render: (text, record) => (
                <>
                    <IrdsProjectFileDownload projectId={record.id}/>
                </>
            ),
        }, {
            title: 'График этапов', key: 'btnStage', width: 80, align: 'center', sorter: true, ellipsis: true,
            render: (text, record) => (
                <>
                    <StagesProjectFileDownload projectId={record.id}/>
                </>
            ),
        },
        {
            title: 'Управление',
            key: 'edit',
            width: 110, sorter: true, ellipsis: true,
            render: (text, record) => (
                <Row>
                    <Typography.Link onClick={() => setEditModalStatus({
                        status: "base",
                        project: rebuildProjectResultQuery(record)
                    })}>Изменить
                        Проект</Typography.Link>
                    <Typography.Link onClick={() => setEditModalStatus({
                        status: "irds",
                        irds: rebuildIrdsResultQuery(record?.project_irds),
                        project: rebuildProjectResultQuery(record)
                    })}>Изменить
                        Список ИРД</Typography.Link>
                    <Typography.Link onClick={() => setEditModalStatus({
                        status: "stages",
                        stages: rebuildStagesResultQuery(record?.project_stages),
                        project: rebuildProjectResultQuery(record)
                    })}>Изменить
                        Список Этапов</Typography.Link>
                    <Typography.Link onClick={() => navigate(`/project/tasks/${record.id}`)}>Распределение
                        задач</Typography.Link>
                </Row>
            ),
        },
    ];
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

            <StyledFormLarge form={formSearch} layout="horizontal">
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
            </StyledFormLarge>
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
                        <Row>
                            <Descriptions layout={"vertical"} bordered size={"small"} style={{width: "600px"}}>
                                <Descriptions column={1}>
                                    <Text>Этапы</Text>
                                </Descriptions>
                                <Descriptions column={1}>
                                    <Text>Акты</Text>
                                </Descriptions>
                                <Descriptions column={1}>
                                    <Text>Счета</Text>
                                </Descriptions>
                                <>
                                    <Descriptions title={'Аванс'}
                                                  column={1}>
                                        <Text>Аванс</Text>
                                    </Descriptions>
                                    <Descriptions title={`Акт`} column={1}>
                                        <>X</>
                                    </Descriptions>
                                    <Descriptions title={`Счёт`} column={1}>
                                        <PaymentInvoiceProjectDownload isPrepayment={true}
                                                                       projectId={record.id} type="acts"/>
                                    </Descriptions>
                                </>
                                {record.project_stages.map(psid => (
                                    <>
                                        <Descriptions title={`Этап №${psid.number} (${psid.stage.name})`}
                                                      column={1}>
                                            <Text>Этап {psid.number} {psid.stage.name}</Text>
                                        </Descriptions>
                                        <Descriptions title={`Акт`} column={1}>
                                            <ActRenderingProjectDownload stageNumber={psid.number}
                                                                         projectId={record.id} type="acts"/>
                                        </Descriptions>
                                        <Descriptions title={`Счёт`} column={1}>
                                            <PaymentInvoiceProjectDownload stageNumber={psid.number}
                                                                           projectId={record.id} type="acts"/>
                                        </Descriptions>
                                    </>

                                ))}
                            </Descriptions>
                            <Collapse style={{width: "550px", marginLeft: 10}}>
                                <Collapse.Panel header="Исполнители" key="all-persons">
                                    <Descriptions labelStyle={{height: 2333, margin: 0, padding: 0}} layout={"vertical"}
                                                  bordered size={"small"} column={2} style={{width: "100%"}}>
                                        <Descriptions column={1}>
                                            <Text>Исполнитель</Text>
                                        </Descriptions>
                                        <Descriptions column={1}>
                                            <Text>Договор</Text>
                                        </Descriptions>
                                        {record.project_tasks?.reduce((acc, task) => {
                                            task.executors.forEach((executor) => {
                                                // Добавляем исполнителя в аккумулятор, если его еще нет
                                                if (!acc.some((e) => e.id === executor.executor.id)) {
                                                    acc.push(executor.executor);
                                                }
                                            });
                                            return acc;
                                        }, []).map((executor) => (
                                            <>
                                                <Descriptions title={"Исполнитель"}
                                                              column={1}>{executor.passport.lastname} {executor.passport.firstname} {executor.passport.patronymic}</Descriptions>
                                                <Descriptions title={"Договор"} column={1}>
                                                    <TaskExecutorContractDownload executorId={executor.id}
                                                                                  projectId={record.id} type="acts"/>
                                                </Descriptions>
                                            </>
                                        ))}
                                    </Descriptions>
                                </Collapse.Panel>
                            </Collapse>

                        </Row>
                    ),
                }}
            />
            <Modal
                key={editModalStatus?.project?.id}
                open={editModalStatus?.status}
                onCancel={() => setEditModalStatus(null)}
                footer={null}
                onClose={() => setEditModalStatus(null)}
                width={1840}
                style={{width: 1840}}
            >
                {editModalStatus?.status === "base" ? (
                        <>
                            <ProjectForm
                                actualProject={editModalStatus?.project}
                                updateProject={(value) => setEditModalStatus({...editModalStatus, project: value})}
                            />
                            <div>
                                <StyledButtonGreen onClick={() =>
                                    mutateProject({variables: {data: rebuildProjectToQuery(editModalStatus?.project)}})}>
                                    Сохранить
                                </StyledButtonGreen>
                            </div>
                        </>
                    ) :
                    editModalStatus?.status === "irds" ? (
                            <>
                                <IrdsProjectForm
                                    actualIrds={editModalStatus?.irds}
                                    updateIrds={(value) => setEditModalStatus({...editModalStatus, irds: value})}
                                    project={editModalStatus?.project}
                                />
                                <div>
                                    <StyledButtonGreen onClick={() =>
                                        mutateIrd({variables: {data: rebuildIrdToQuery(editModalStatus?.irds, editModalStatus?.project?.id)}})}>
                                        Сохранить
                                    </StyledButtonGreen>
                                </div>
                            </>) :
                        editModalStatus?.status === "stages" ? (
                                <>
                                    <StagesProjectForm
                                        actualStages={editModalStatus?.stages}
                                        updateStages={(value) => setEditModalStatus({...editModalStatus, stages: value})}
                                        project={editModalStatus?.project}
                                    />
                                    <div>
                                        <StyledButtonGreen onClick={() =>
                                            mutateStage({variables: {data: rebuildStagesToQuery(editModalStatus?.stages, editModalStatus?.project?.id)}})}>
                                            Сохранить
                                        </StyledButtonGreen>
                                    </div>
                                </>)
                            : null}
            </Modal>

        </div>
    )
};

export default ProjectTable;
