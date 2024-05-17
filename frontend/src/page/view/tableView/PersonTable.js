import React, {useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {
    Col,
    Descriptions,
    Divider,
    Form,
    Modal,
    notification,
    Row,
    Space,
    Table,
} from 'antd';
import {PERSONS_QUERY} from '../../../graphql/queries';
import {DELETE_PERSON_MUTATION} from '../../../graphql/mutationsPerson';
import PersonForm from "../../form/modelsForms/PersonForm";
import Search from "antd/es/input/Search";
import {StyledFormLarge} from "../../style/FormStyles";
import {StyledButtonGreen} from "../../style/ButtonStyles";
import PersonContractFileDownload from "../../script/PersonContractFileDownload";
import Title from "antd/es/typography/Title";
import {format} from "date-fns";
import StyledLinkManagingDataTable from "../../style/TableStyles";

const PersonTable = () => {

    // Состояния
    const [formSearch] = Form.useForm();
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);

    // Данные
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [currentSort, setCurrentSort] = useState({});

    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    const [search, setSearch] = useState('');

    const {loading: loading, error: error, data: data, refetch: refetchTable} = useQuery(PERSONS_QUERY, {
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
    const [deletePerson] = useMutation(DELETE_PERSON_MUTATION, {
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно удалены!');
            refetchTable();
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при удалении данных: ' + error.message);
            refetchTable();
        },

    });

    // Обработчик событий
    const handleClose = () => {
        refetchTable();
        setEditModalVisible(false);
        setAddModalVisible(false);
    };
    const handleEdit = (personId) => {
        const person = data.persons.items.find(person => person.id === personId);
        setSelectedPerson(person);
        setEditModalVisible(true);
    };
    const handleAdd = () => {
        setAddModalVisible(true);
    };
    const handleDelete = (personId) => {
        deletePerson({variables: {id: personId}});
    };

    const onSearch = (value) => {
        setSearch(value);
    }

    // Обработка загрузки и ошибок
    if (error) return `Ошибка! ${error.message}`;
    const formatDate = (date) => {
        return format(new Date(date), 'dd.MM.yyyy');
    };
    // Формат таблицы
    const columns = [{
            title: 'ФИО',
            dataIndex: 'passport',
            key: 'fio_name',
            render: (passport) => passport ? `${passport.lastname}  ${passport.firstname} ${passport.patronymic}  ` : "",
        }, {
            title: 'Личный тел.', dataIndex: 'phone_number', key: 'phone_number',
            sorter: true, ellipsis: true,
        }, {
            title: 'Личный e-mail', dataIndex: 'email', key: 'email',

            sorter: true, ellipsis: true,
        }, {
            title: 'e-mail СибНИПИ', dataIndex: 'email_sibnipi', key: 'email_sibnipi',

            sorter: true, ellipsis: true,
        }, {
            title: 'Дата рождения',
            dataIndex: 'passport',
            key: 'birth_day',
            render: (passport) => passport?.birth_date ? formatDate(passport?.birth_date) : null,

        }, {
            title: 'Договор', key: 'btnContract', width: 80, align: 'center',
            render: (text, record) => (
                <PersonContractFileDownload personId={record.id}/>
            ),
        }, {
            title: 'Управление', key: 'edit', width: 100, render: (text, record) => (
                <StyledLinkManagingDataTable
                    title={"Удаление подрядчика"}
                    description={"Вы уверены, что нужно удалить этого подрядчика?"}
                    handleEdit={() => handleEdit(record.id)}
                    handleDelete={() => handleDelete(record.id)}
                />
            ),
        },]
    ;
    const onChange = (sorter) => {
        setSortField(sorter?.field ?? "");
        setSortOrder(sorter?.order === 'descend' ? 'desc' : sorter?.order === 'ascend' ? 'asc' : '');
    };
    return (<div>
        <StyledFormLarge form={formSearch} layout="horizontal">
            <Divider style={{marginTop: 0}}>
                <Title style={{marginTop: 0}} level={2}>Справочник Подрядчиков</Title>
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
            dataSource={data?.persons?.items?.map((person, index) => ({...person, key: index}))}
            columns={columns}
            onChange={(pagination, filters, sorter, extra) => onChange(sorter)}
            pagination={{
                total: data?.persons?.count,
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
                pageSizeOptions: ['10', '50', '100'],
            }}
            expandable={{
                expandedRowKeys,
                onExpand: (expanded, record) => {
                    const keys = expanded ? [record.key] : [];
                    setExpandedRowKeys(keys);
                },
                expandedRowRender: (record) => (<>
                        <Row style={{width: "100%"}}>
                            <Col span={7}>
                                <Descriptions bordered size={"small"} column={1} title="Паспортные данные:">
                                    <Descriptions.Item
                                        label="Серия и номер">{record?.passport?.serial} №{record?.passport?.number}</Descriptions.Item>
                                    <Descriptions.Item
                                        label="Адрес проживания">{record?.passport?.address_residential}</Descriptions.Item>
                                    <Descriptions.Item
                                        label="Адрес регистрации">{record?.passport?.address_registration}</Descriptions.Item>
                                    <Descriptions.Item
                                        label="Дата и место выдачи">{record?.passport?.date ? formatDate(record?.passport?.date) : ""} - {record?.passport?.passport_place_issue?.name}</Descriptions.Item>
                                </Descriptions>
                            </Col>
                            <Col span={17}>
                                <Descriptions bordered size={"small"} column={2} title="Реквизиты:">
                                    <Descriptions.Item
                                        label="Расчётный счёт">{record?.payment_account}</Descriptions.Item>
                                    <Descriptions.Item label="Банк>">{record?.bank?.name}</Descriptions.Item>
                                    <Descriptions.Item
                                        label="Бик">{record?.bik?.BIK} - {record?.bik?.name}</Descriptions.Item>

                                    <Descriptions.Item label="Инн">{record?.INN}</Descriptions.Item>
                                    <Descriptions.Item label="Снилс">{record?.SHILS}</Descriptions.Item>

                                </Descriptions>
                            </Col>
                        </Row>
                    </>
                ),
            }}
        />
        <Modal
            key={selectedPerson?.id}
            open={editModalVisible}
            width={900}
            onCancel={() => setEditModalVisible(false)}
            footer={null}
            onClose={handleClose}
        >
            <PersonForm person={selectedPerson} onClose={handleClose}/>
        </Modal>
        <Modal
            open={addModalVisible}
            width={900}
            onCancel={() => setAddModalVisible(false)}
            footer={null}
            onClose={handleClose}
        >
            <PersonForm contact={null} onClose={handleClose}/>
        </Modal>
    </div>);
};
export default PersonTable;
