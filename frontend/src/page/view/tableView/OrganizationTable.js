import React, {useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {Button, Descriptions, FloatButton, Form, Modal, notification, Space} from 'antd';
import {DELETE_ORGANIZATION_MUTATION} from '../../../graphql/mutationsOrganization';
import OrganizationForm from "../../form/basicForm/OrganizationForm";
import LoadingSpinnerStyles from "../../style/LoadingSpinnerStyles";
import TypeProjectForm from "../../form/simpleForm/TypeProjectForm";
import Search from "antd/es/input/Search";
import {PlusSquareOutlined} from "@ant-design/icons";
import {StyledTable} from "../../style/TableStyles";
import {StyledFormLarge} from "../../style/FormStyles";
import {StyledButtonGreen} from "../../style/ButtonStyles";
import {ORGANIZATIONS_QUERY} from "../../../graphql/queries";

const OrganizationTable = () => {
    // Состояния
    const [selectedOrganization, setSelectedOrganization] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [formSearch] = Form.useForm();
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    // Данные
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(50);

    const [currentSort, setCurrentSort] = useState({});

    const [sortColum, setSortColum] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    const [search, setSearch] = useState('');

    const {loading, error, data, refetch} = useQuery(ORGANIZATIONS_QUERY, {
        variables: {
            queryOptions: {page, limit, search, sortField: sortColum, sortOrder}
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
            window.location.reload();
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при удалении данных: ' + error.message);
            window.location.reload();
        }, update: (cache, {data: {deleteOrganization}}) => {
            const {organizations} = cache.readQuery({query: ORGANIZATIONS_QUERY});
            const updatedOrganization = organizations.filter(organization => organization.id !== deleteOrganization.id);
            cache.writeQuery({
                query: ORGANIZATIONS_QUERY, data: {contacts: updatedOrganization},
            });
        },
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
    if (!data) if (loading) return <LoadingSpinnerStyles/>;
    if (error) return `Ошибка! ${error.message}`;

    // Формат таблицы
    const columns = [

        {
        title: 'Тип',
        dataIndex: 'legal_form',
        key: 'legal_form',
        render: (legal_form) => legal_form ? legal_form.name : '',
    }, {
        title: 'Название организации', dataIndex: 'name', key: 'name',
        sorter: true, ellipsis: true,
    },  {
        title: 'Директор',
        dataIndex: 'director',
        key: 'director',
        render: (director) => {
            if (director) {
                return `${director.last_name} ${director.first_name} ${director.patronymic}`;
            } else {
                return '';
            }
        },
    },  {
        title: 'email', dataIndex: 'email', key: 'email',
        sorter: true, ellipsis: true,
    },  {
        title: 'номер телеофна', dataIndex: 'phone_number', key: 'phone_number',
        sorter: true, ellipsis: true,
            render: (phone_number) => phone_number ? "+7" + phone_number : '',
    },
        {
        title: 'Управление', key: 'edit', render: (text, record) => (<div>
                <Button onClick={() => handleEdit(record.id)}>Изменить</Button>
                <Button danger={true} onClick={() => handleDelete(record.id)}>Удалить</Button>
            </div>),
    },

    ];

    const onChange = (pagination, filters, sorter) => {

        if ((sorter.field !== undefined) && currentSort !== sorter) {
            setCurrentSort(sorter);
            if (sortColum !== sorter.field) {
                setSortColum(sorter.field);
                setSortOrder("asc");
            } else {
                setSortColum(sortColum);
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
        } else console.log("Фильтры сохранены");
    };

    return <>
        <StyledFormLarge form={formSearch} layout="horizontal">
            <Form.Item label="Поиск:" name="search">
                <Space>
                    <Search
                        placeholder="Найти..."
                        allowClear
                        enterButton="Найти"
                        onSearch={onSearch}
                    />
                    <StyledButtonGreen   style={{    marginBottom: 0}} onClick={() => handleAdd()}>Создать новую запись</StyledButtonGreen>
                </Space>
            </Form.Item>
        </StyledFormLarge>
        <StyledTable
            size={'small'}
            sticky={{
                offsetHeader: 0,
            }}
            loading={loading}
            dataSource={data.organizations.items.map((org, index) => ({...org, key: index}))}
            columns={columns}
            onChange={onChange}
            pagination={{
                total: data.organizations.count,
                current: page,
                pageSize: limit,
                onChange: (page, limit) => setPage(page),
                onShowSizeChange: (current, size) => {
                    setPage(1);
                    setLimit(size);
                },
                showSizeChanger: true,
                pageSizeOptions: ['50', '100', '200'],
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
                        <Descriptions.Item label="Юридический адрес">{record.address_legal} {record.office_number_legal}</Descriptions.Item>
                        <Descriptions.Item label="Почтовый адрес">{record.address_mail} {record.office_number_mail}</Descriptions.Item>
                        <Descriptions.Item label="Факс">{record.fax_number}</Descriptions.Item>
                        <Descriptions.Item label="ИНН">{record.INN}</Descriptions.Item>
                        <Descriptions.Item label="ОГРН">{record.OGRN}</Descriptions.Item>
                        <Descriptions.Item label="ОКПО">{record.OKPO}</Descriptions.Item>
                        <Descriptions.Item label="КПП">{record.KPP}</Descriptions.Item>
                        <Descriptions.Item label="БИК">{record.BIK}</Descriptions.Item>
                        <Descriptions.Item label="Расчетный счет">{record.payment_account}</Descriptions.Item>
                    </Descriptions>
                ),
            }}
        />
        <Modal
            open={editModalVisible}
            width={900}
            onCancel={() => setEditModalVisible(false)}
            footer={null}
            onClose={handleClose}
        >
            <OrganizationForm organization={selectedOrganization} onClose={handleClose}/>
        </Modal>
        <Modal
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
