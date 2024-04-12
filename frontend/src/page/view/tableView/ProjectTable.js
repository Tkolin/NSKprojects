import React, {useState} from 'react';
import {useQuery} from '@apollo/client';
import {Button, Collapse, Descriptions, Divider, Form, Modal, notification, Row, Space, Table, Typography} from 'antd';
import {PROJECTS_QUERY} from '../../../graphql/queries';
import ProjectForm from "../../form/basicForm/ProjectForm";
import LoadingSpinnerStyles from "../../style/LoadingSpinnerStyles";
import Search from "antd/es/input/Search";
import {StyledFormLarge} from "../../style/FormStyles";
import StagesProjectFileDownload from "../../script/StagesProjectFileDownload";
import ProjectFileDownload from "../../script/ProjectFileDownload";
import IrdsProjectFileDownload from "../../script/IrdsProjectFileDownload";
import Title from "antd/es/typography/Title";
import ActRenderingProjectDownload from "../../script/ActRenderingProjectDownload";
import PaymentInvoiceProjectDownload from "../../script/PaymentInvoiceProjectDownload";
import CreateNewProject from "../../form/composedForm/CreateNewProject";
import TaskExecutorContractDownload from "../../script/TaskExecutorContractDownload";
import {useNavigate} from "react-router-dom";
import TaskProjectForm from "../../form/aggregateComponent/projectForm/TaskProjectForm";

const {Text} = Typography;

const ProjectTable = () => {

    // Состояния
    const [formSearch] = Form.useForm();
    const [selectedProject, setSelectedProject] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
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
    // Обработчик событий
    const handleClose = () => {
        setEditModalVisible(false);
    };
    const handleEdit = (project) => {
        console.log(project);
        setSelectedProject(project);
        setEditModalVisible(true);
    };

    function addLeadingZeros(number, length) {
        return String(number).padStart(length, '0');
    }


    // Обработка загрузки и ошибок
    if (error) return `Ошибка! ${error.message}`;

    // Формат таблицы
    const columns = [
        {
            title: 'Номер',
            dataIndex: 'number',
            key: 'number',
            width: 100,
            sorter: true,
        },
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            sorter: true,
        },
        {
            title: 'Заказчик',
            dataIndex: 'organization_customer',
            key: 'organization_customer',
            render: (organization_customer) => organization_customer ?
                organization_customer.name : "",
        },
        {
            title: 'Представитель',
            dataIndex: 'delegations',
            key: 'delegations',
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
            render: (type_project_document) => type_project_document ?
                type_project_document.name : ""
        },
        {
            title: 'Объект',
            dataIndex: 'facilities',
            key: 'facilities',
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
            width: 100,
        },
        {
            title: 'Продолжительность',
            dataIndex: 'duration',
            key: 'duration',
            width: 100,

        },
        {
            title: 'Дата начала',
            dataIndex: 'date_end',
            key: 'date_end',
            width: 100,

        },
        {
            title: 'Дата окончания',
            dataIndex: 'date_end',
            key: 'date_end',
            width: 100,

        },
        {
            title: 'Стоимость',
            dataIndex: 'price',
            key: 'price',
            width: 160,
            render: (price) =>
                (price?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ₽')
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            width: 220,
            render: (status) => status ?
                status.name : ""
        },
        {
            title: 'Договор', key: 'btnContract', width: 80, align: 'center',
            render: (text, record) => (
                <>
                    <ProjectFileDownload projectId={record.id}/>
                </>
            ),
        }, {
            title: 'Список ИРД', key: 'btnIrd', width: 80, align: 'center',
            render: (text, record) => (
                <>
                    <IrdsProjectFileDownload projectId={record.id}/>
                </>
            ),
        }, {
            title: 'График этапов', key: 'btnStage', width: 80, align: 'center',
            render: (text, record) => (
                <>
                    <StagesProjectFileDownload projectId={record.id}/>
                </>
            ),
        },
        {
            title: 'Управление',
            key: 'edit',
            width: 110,
            render: (text, record) => (
                <Row>
                    <Typography.Link onClick={() => handleEdit(record)}>Изменить</Typography.Link>
                    <Typography.Link onClick={() => navigate(`/project/tasks/${record.id}`)}>Распределение задач</Typography.Link>
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
                    onChange: (page, limit) =>
                    {
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
                            <Descriptions layout={"vertical"} bordered size={"small"} style={{width: "550px"}}>
                                <Descriptions column={1}>
                                    <Text>Этапы</Text>
                                </Descriptions>
                                <Descriptions column={1}>
                                    <Text>Акты</Text>
                                </Descriptions>
                                <Descriptions column={1}>
                                    <Text>Счета</Text>
                                </Descriptions>
                                {record.project_stages.map(psid => (
                                    psid.stage.id !== 0 && (
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
                                    )
                                ))}
                            </Descriptions>
                            <Collapse style={{width: "550px", marginLeft: 10}}>
                                <Collapse.Panel header="Исполнители" key="all-persons">
                                    <Descriptions labelStyle={{height: 2333, margin:  0, padding: 0 }} layout={"vertical"} bordered size={"small"} column={2} style={{width: "100%"}}>
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
                                                <Descriptions title={"Исполнитель"}   column={1}>{executor.passport.lastname} {executor.passport.firstname} {executor.passport.patronymic}</Descriptions>
                                                <Descriptions title={"Договор"}  column={1}>
                                                    <TaskExecutorContractDownload executorId={executor.id} projectId={record.id} type="acts"/>
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
                key={selectedProject?.id}
                open={editModalVisible}
                onCancel={() => setEditModalVisible(false)}
                footer={null}
                onClose={handleClose}
                width={1300}
                style={{width: 1200}}
            >
                <CreateNewProject editProject={selectedProject} onClose={handleClose}/>
            </Modal>

        </div>
    )
};

export default ProjectTable;
