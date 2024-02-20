import React, {useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {Button, Modal, notification, Table} from 'antd';
import {CONTACTS_TABLE_QUERY, ORGANIZATION_QUERY, ORGANIZATIONS_TABLE_QUERY} from '../../graphql/queries';
import {DELETE_ORGANIZATION_MUTATION} from '../../graphql/mutationsOrganization';
import OrganizationForm from "./OrganizationForm";
import LoadingSpinner from "../component/LoadingSpinner";

const OrganizationList = () => {
    // Состояния
    const [selectedOrganization, setSelectedOrganization] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);

    // Данные
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [currentSort, setCurrentSort] = useState({});

    const [sortColum, setSortColum] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    const [search, setSearch] = useState('');

    const { loading, error, data } = useQuery(ORGANIZATIONS_TABLE_QUERY, {
        variables: {
            page,
            limit,
            search,
            sortField: sortColum,
            sortOrder,
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
    const [deleteOrganization] = useMutation(DELETE_ORGANIZATION_MUTATION, {
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно удалены!');
            window.location.reload();
        },
        onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при удалении данных: ' + error.message);
            window.location.reload();
        },
        update: (cache, { data: { deleteOrganization } }) => {
            const { organizations } = cache.readQuery({ query: ORGANIZATION_QUERY });
            const updatedOrganization = organizations.filter(organization => organization.id !== deleteOrganization.id);
            cache.writeQuery({
                query: ORGANIZATION_QUERY,
                data: { contacts: updatedOrganization },
            });
        },
    });

    // Обработчик событий
    const handleClose = () => {setEditModalVisible(false);};
    const handleEdit = (organizationId) => {
        const organization = data.organizationsTable.organizations.find(organization => organization.id === organizationId);
        setSelectedOrganization(organization);
        setEditModalVisible(true);
    };
    const handleDelete = (organizationId) => {
        deleteOrganization({ variables: { id: organizationId}});
    };
    const onSearch = (value) =>{
        setSearch(value);
    }
    // Обработка загрузки и ошибок
    if(!data)
        if (loading) return <LoadingSpinner/>;
    if (error) return `Ошибка! ${error.message}`;

    // Формат таблицы
    const columns = [
        {
            title: 'Тип',
            dataIndex: 'legal_form',
            key: 'legal_form',
            render: (legal_form) => legal_form ? legal_form.name : '',
        },
        {
            title: 'Название организации',
            dataIndex: 'name',
            key: 'name',

            sorter: true,
            ellipsis: true,
        },
        {
            title: 'Полное название',
            dataIndex: 'full_name',
            key: 'full_name',

            sorter: true,
            ellipsis: true,
        },
        {
            title: 'Директор',
            dataIndex: 'director',
            key: 'director',
            render: (director) => director ?
                director.last_name +" "+ director.first_name : "",
        },
        {
            title: 'ИНН',
            dataIndex: 'INN',
            key: 'INN',

            sorter: true,
            ellipsis: true,
        },
        {
            title: 'ОГРН',
            dataIndex: 'OGRN',
            key: 'OGRN',

            sorter: true,
            ellipsis: true,
        },
        {
            title: 'ОКПО',
            dataIndex: 'OKPO',
            key: 'OKPO',

            sorter: true,
            ellipsis: true,
        },
        {
            title: 'КПП',
            dataIndex: 'KPP',
            key: 'KPP',

            sorter: true,
            ellipsis: true,
        },
        {
            title: 'bik',
            dataIndex: 'BIK',
            key: 'BIK',
            render: (BIK) =>BIK ? BIK.Bik : null,
        },
        {
            title: 'payment_account',
            dataIndex: 'payment_account',
            key: 'payment_account',

            sorter: true,
            ellipsis: true,
        },
        {
            title: 'Управление',
            key: 'edit',
            render: (text, record) => (
                <div>
                    <Button onClick={() => handleEdit(record.id)}>Изменить</Button>
                    <Button danger={true} onClick={() => handleDelete(record.id)}>Удалить</Button>
                </div>
            ),
        },

    ];

    const onChange = (pagination, filters, sorter) => {

        if((sorter.field !== undefined) && currentSort !== sorter){
            setCurrentSort(sorter);
            if (sortColum !== sorter.field) {
                setSortColum(sorter.field);
                setSortOrder("asc");
            }
            else {
                setSortColum(sortColum);
                switch (sortOrder){
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
        }else
            console.log("Фильтры сохранены");
    };

    return<>
        <Table
            loading={loading}
            dataSource={data.organizationsTable.organizations}
            columns={columns}
            onChange={onChange}
            pagination={{
                total: data.organizationsTable.count,
                current: page,
                limit,
                onChange: (page, limit) => setPage(page),
                onShowSizeChange: (current, size) => {
                    setPage(1);
                    setLimit(size);
                },
            }}
            expandable={{
                expandedRowRender: (record) => (
                    <>
                        <p>
                            e-mail: {record.email}
                        </p>
                        <p>
                            юр. адрес: {record.address_legal}
                        </p>
                        <p>
                            Номер офиса: {record.office_number_legal}
                        </p>
                        <p>
                            Фактический адрес: {record.address_mail}
                        </p>
                        <p>
                            Номер офиса: {record.office_number_mail}
                        </p>
                        <p>
                            Номер телефона: {record.phone_number}
                        </p>
                        <p>
                            Номер факса: {record.fax_number}
                        </p>

                    </>
                ),
            }}
        />
    <Modal
        visible={editModalVisible}
        title="Изменить контакт"
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        onClose={handleClose}
    >
        <OrganizationForm organization={selectedOrganization} onClose={handleClose}/>
    </Modal>
    </>;
};

 export default OrganizationList;
