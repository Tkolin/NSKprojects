import React, {useState} from 'react';
import {useQuery} from '@apollo/client';
import {Button, Descriptions, Divider, Form, Modal, notification, Space, Table} from 'antd';
import {PROJECT_QUERY, PROJECT_TABLE_QUERY, PROJECTS_QUERY} from '../../../graphql/queries';
import ProjectForm from "../../form/basicForm/ProjectForm";
import LoadingSpinnerStyles from "../../style/LoadingSpinnerStyles";
import Search from "antd/es/input/Search";
import {StyledFormLarge} from "../../style/FormStyles";
import PersonContractFileDownload from "../../script/PersonContractFileDownload";
import StagesProjectFileDownload from "../../script/StagesProjectFileDownload";
import ProjectFileDownload from "../../script/ProjectFileDownload";
import IrdsProjectFileDownload from "../../script/IrdsProjectFileDownload";
import Title from "antd/es/typography/Title";
import ActRenderingProjectDownload from "../../script/ActRenderingProjectDownload";
import PaymentInvoiceProjectDownload from "../../script/PaymentInvoiceProjectDownload";

const ProjectTable = () => {

    // Состояния
    const [formSearch] = Form.useForm();
    const [selectedProject, setSelectedProject] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);

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
    const handleEdit = (contactId) => {
        const contact = data?.projects?.items?.find(contact => contact.id === contactId);
        setSelectedProject(contact);
        setEditModalVisible(true);
    };


    // Обработка загрузки и ошибок
    if (!data)
        if (loading) return <LoadingSpinnerStyles/>;
    if (error) return `Ошибка! ${error.message}`;

    // Формат таблицы
    const columns = [
        {
            title: 'Номер',
            dataIndex: 'number',
            key: 'number',

            sorter: true,
            ellipsis: true,
        },
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',

            sorter: true,
            ellipsis: true,
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
            dataIndex: 'delegate',
            key: 'delegate',
            render: (delegate) => delegate ?
                delegate.first_name + " " + delegate.last_name + " " + delegate.patronymic : "",
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
            dataIndex: 'facility',
            key: 'facility',
            render: (facility) => facility ?
                facility.name : ""

        },
        {
            title: 'Дата подписания',
            dataIndex: 'date_signing',
            key: 'date_signing',

            sorter: true,
            ellipsis: true,

        },
        {
            title: 'Продолжительность',
            dataIndex: 'duration',
            key: 'duration',

            sorter: true,
            ellipsis: true,
        },
        {
            title: 'Дата окончания',
            dataIndex: 'date_end',
            key: 'date_end',

            sorter: true,
            ellipsis: true,
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            render: (status) => status ?
                status.name : ""
        },
        {
            title: 'Дата фактического окончания',
            dataIndex: 'date_completion',
            key: 'date_completion',

            sorter: true,
            ellipsis: true,
        },
        {
            title: 'Договор', key: 'btnContract', width: 80, align: 'center',
            render: (text, record) => (
                <>
                    <ProjectFileDownload projectId={record.id}/>
                </>
            ),
        }, {
            title: 'Акт об работе', key: 'btnContract', width: 80, align: 'center',
            render: (text, record) => (
                <>
                    <ActRenderingProjectDownload projectId={record.id} stageNumber={1}/>
                </>
            ),
        }, {
            title: 'Счёт', key: 'btnContract', width: 80, align: 'center',
            render: (text, record) => (
                <>
                    <PaymentInvoiceProjectDownload projectId={record.id} stageNumber={2}/>
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
            render: (text, record) => (
                <Button size={"small"} onClick={() => handleEdit(record.id)}>Изменить</Button>
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
                <Title style={{marginTop: 0}} level={2}>Справочник Проекты</Title>
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
                    offsetHeader: 0,
                }}
                loading={loading}
                dataSource={data?.projects?.items?.map((org, index) => ({...org, key: index}))}
                columns={columns}
                onChange={onChange}
                pagination={{
                    total: data?.projects?.count,
                    current: page,
                    pageSize: limit,
                    onChange: (page, limit) => setPage(page) && setLimit(limit),
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
                        <>
                            <Descriptions>
                                <Descriptions.Item label="Акты и счета">
                                    <Text>Этапы: </Text>
                                    <ActRenderingProjectDownload projectId={record.id} stageNumber={1}/>
                                    <PaymentInvoiceProjectDownload projectId={record.id} stageNumber={2}/>
                                </Descriptions.Item>
                                <Descriptions.Item label="Акты и счета">
                                    <ActRenderingProjectDownload projectId={record.id} stageNumber={1}/>
                                    <PaymentInvoiceProjectDownload projectId={record.id} stageNumber={2}/>
                                </Descriptions.Item>

                            </Descriptions>
                        </>
                    ),
                }}
            />
            <Modal
                open={editModalVisible}
                onCancel={() => setEditModalVisible(false)}
                footer={null}
                onClose={handleClose}
            >
                <ProjectForm project={selectedProject} onClose={handleClose}/>
            </Modal>

        </div>
    )
};

export default ProjectTable;
