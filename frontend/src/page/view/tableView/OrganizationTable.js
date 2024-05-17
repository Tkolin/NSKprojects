import React, {useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {Button, Descriptions, Divider, FloatButton, Form, Modal, notification, Space, Table} from 'antd';
import {DELETE_ORGANIZATION_MUTATION} from '../../../graphql/mutationsOrganization';
import OrganizationForm from "../../form/modelsForms/OrganizationForm";
import LoadingSpinnerStyles from "../../style/LoadingSpinnerStyles";
import TypeProjectForm from "../../form/modelsForms/TypeProjectForm";
import Search from "antd/es/input/Search";
import {PlusSquareOutlined} from "@ant-design/icons";
import StyledLinkManagingDataTable, {StyledTable} from "../../style/TableStyles";
import {StyledFormLarge} from "../../style/FormStyles";
import {StyledButtonGreen} from "../../style/ButtonStyles";
import {ORGANIZATIONS_QUERY} from "../../../graphql/queries";
import Title from "antd/es/typography/Title";

const OrganizationTable = () => {
    // Состояния
    const [selectedOrganization, setSelectedOrganization] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [formSearch] = Form.useForm();
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    // Данные
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [currentSort, setCurrentSort] = useState({});

    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    const [search, setSearch] = useState('');

    const {loading, error, data, refetch} = useQuery(ORGANIZATIONS_QUERY, {
        variables: {
            queryOptions: {page, limit, search, sortField, sortOrder}
        }, fetchPolicy: 'network-only',
    });

    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message, placement,
        });
    };

    // Мутация для удаления
    const [deleteOrganization] = useMutation(DELETE_ORGANIZATION_MUTATION, {
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно удалены!');
            refetch();
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при удалении данных: ' + error.message);
            refetch();
        }
    });

    // Обработчик событий
    const handleClose = () => {
        refetch();
        setEditModalVisible(false);
        setAddModalVisible(false);
    };
    const handleEdit = (organizationId) => {
        const organization = data.organizations.items.find(organization => organization.id === organizationId);
        setSelectedOrganization(organization);
        setEditModalVisible(true);
    };
    const handleAdd = () => {
        setAddModalVisible(true);
    };
    const handleDelete = (organizationId) => {
        deleteOrganization({variables: {id: organizationId}});
    };
    const onSearch = (value) => {
        setSearch(value);
    }
    // Обработка загрузки и ошибок
    if (error) return `Ошибка! ${error.message}`;

    // Формат таблицы
    const columns = [

        {
            title: 'Тип',
            dataIndex: 'legal_form',
            key: 'legal_form', width: 60,             ellipsis: true,

            render: (legal_form) => legal_form ? legal_form.name : '',
        }, {
            title: 'Название организации', dataIndex: 'name', key: 'name',
            sorter: true, ellipsis: true,
        }, {
            title: 'Директор',
            dataIndex: 'director',
            key: 'director',             ellipsis: true,

            render: (director) => {
                if (director) {
                    return `${director.last_name ?? ""} ${director.first_name ?? ""} ${director.patronymic ?? ""}`;
                } else {
                    return '';
                }
            },
        }, {
            title: 'email', dataIndex: 'email', key: 'email', width: 200,
            sorter: true,  ellipsis: true,
        }, {
            title: 'номер телефона', dataIndex: 'phone_number', key: 'phone_number', width: 200,
            sorter: true,  ellipsis: true,
        },
        {
            title: 'Управление', key: 'edit', width: 100, render: (text, record) => (
                <StyledLinkManagingDataTable
                    title={"Удаление организации"}
                    description={"Вы уверены, что нужно удалить эту организацию?"}
                    handleEdit={() => handleEdit(record.id)}
                    handleDelete={() => handleDelete(record.id)}
                />
            )
        },
    ];

    const onChange = (sorter) => {
        setSortField(sorter?.field ?? "");
        setSortOrder(sorter?.order === 'descend' ? 'desc' : sorter?.order === 'ascend' ? 'asc' : '');
    };

    return <>
        <StyledFormLarge form={formSearch} layout="horizontal">
            <Divider style={{marginTop: 0}}>
                <Title style={{marginTop: 0}} level={2}>Справочник Организаций</Title>
            </Divider>
            <Form.Item label="Поиск:" name="search">
                <Space>
                    <Search
                        placeholder="Найти..."
                        allowClear
                        enterButton="Найти"
                        onSearch={onSearch}
                    />
                    <StyledButtonGreen style={{marginBottom: 0}} onClick={() => handleAdd()}>Создать новую
                        запись</StyledButtonGreen>
                </Space>
            </Form.Item>
        </StyledFormLarge>
        <Table
            size={'small'}
            sticky={{
                offsetHeader: '64px',
            }}
            loading={loading}
            dataSource={data?.organizations?.items?.map((org, index) => ({...org, key: index}))}
            columns={columns}
            onChange={(pagination, filters, sorter, extra) => onChange(sorter)}
            pagination={{
                total: data?.organizations?.count,
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
                pageSizeOptions: ['10', '50', '100', '200'],
            }}

            expandable={{
                expandedRowKeys,
                onExpand: (expanded, record) => {
                    const keys = expanded ? [record.key] : [];
                    setExpandedRowKeys(keys);
                },
                expandedRowRender: (record) => (
                    <Descriptions column={1}>
                        <Descriptions.Item label="Полное наименование">{record.full_name}</Descriptions.Item>
                        <Descriptions.Item
                            label="Юридический адрес">{record.address_legal} {record.office_number_legal}</Descriptions.Item>
                        <Descriptions.Item
                            label="Почтовый адрес">{record.address_mail} {record.office_number_mail}</Descriptions.Item>
                        <Descriptions.Item label="Факс">{record.fax_number}</Descriptions.Item>
                        <Descriptions.Item label="ИНН">{record.INN}</Descriptions.Item>
                        <Descriptions.Item label="ОГРН">{record.OGRN}</Descriptions.Item>
                        <Descriptions.Item label="ОКПО">{record.OKPO}</Descriptions.Item>
                        <Descriptions.Item label="КПП">{record.KPP}</Descriptions.Item>
                        <Descriptions.Item label="БИК">{record?.bik?.BIK} - {record?.bik?.name}</Descriptions.Item>
                        <Descriptions.Item label="Расчетный счет">{record.payment_account}</Descriptions.Item>
                    </Descriptions>
                ),
            }}
        />
        <Modal
            key={selectedOrganization?.id}
            open={editModalVisible}
            width={900}
            onCancel={() => setEditModalVisible(false)}
            footer={null}
            onClose={handleClose}
        >
            <OrganizationForm organization={selectedOrganization} onClose={handleClose}/>
        </Modal>
        <Modal
            key={selectedOrganization?.id}
            open={addModalVisible}
            width={900}
            onCancel={() => setAddModalVisible(false)}
            footer={null}
            onClose={handleClose}
        >
            <OrganizationForm contact={null} onClose={handleClose}/>
        </Modal>
    </>;
};

export default OrganizationTable;
