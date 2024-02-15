import React, {useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {Button, Modal, notification, Table} from 'antd';
import {ORGANIZATION_QUERY} from '../../graphql/queries';
import {DELETE_ORGANIZATION_MUTATION} from '../../graphql/mutationsOrganization';
import OrganizationForm from "./OrganizationForm";

const OrganizationList = () => {

    // Состояния
    const { loading, error, data } = useQuery(ORGANIZATION_QUERY);
    const [selectedOrganization, setSelectedOrganization] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);

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
        console.log("ИД "+ organizationId);
        const organization = data.organizations.find(organization => organization.id === organizationId);
        setSelectedOrganization(organization);
        setEditModalVisible(true);
    };
    const handleDelete = (organizationId) => {
        deleteOrganization({ variables: { id: organizationId}});
    };

    // Обработка загрузки и ошибок
    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

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
        },
        {
            title: 'Полное название',
            dataIndex: 'full_name',
            key: 'full_name',
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
        },
        {
            title: 'ОГРН',
            dataIndex: 'OGRN',
            key: 'OGRN',
        },
        {
            title: 'ОКПО',
            dataIndex: 'OKPO',
            key: 'OKPO',
        },
        {
            title: 'КПП',
            dataIndex: 'KPP',
            key: 'KPP',
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
    return<> <Table dataSource={data.organizations} columns={columns}
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
                  }}/>
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
