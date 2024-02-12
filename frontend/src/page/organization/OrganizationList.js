import React from 'react';
import {useQuery} from '@apollo/client';
import { Table } from 'antd';
import { ORGANIZATION_QUERY} from '../../graphql/queries';

const OrganizationList = () => {
    const { loading, error, data } = useQuery(ORGANIZATION_QUERY);

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

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
            render: (full_name) => full_name ? full_name : '',
        },
        {
            title: 'юр. адресс',
            dataIndex: 'address_legal',
            key: 'address_legal',
            render: (address_legal) => address_legal ? address_legal.name : '',
        },
        {
            title: 'Номер офиса',
            dataIndex: 'office_number_legal',
            key: 'office_number_legal',
        },
        {
            title: 'Фактический адресс',
            dataIndex: 'address_mail',
            key: 'address_mail',
            render: (address_mail) => address_mail ? address_mail.name : '',
        },
        {
            title: 'Номер офиса',
            dataIndex: 'office_number_mail',
            key: 'office_number_mail',
        },
        {
            title: 'Номер телефона',
            dataIndex: 'phone_number',
            key: 'phone_number',
        },
        {
            title: 'Номер факса',
            dataIndex: 'fax_number',
            key: 'fax_number',
        },
        {
            title: 'E-mail',
            dataIndex: 'email',
            key: 'email',
        },
    ];


    return <Table dataSource={data.organizations} columns={columns}
                  expandable={{
        expandedRowRender: (record) => (
            <>
                <p>
                    расчётный счёт: {record.payment_account && record.payment_account.name}
                </p>
                <p>
                    бик: {record.bik}

                </p>
                <p>
                    кпп: {record.kpp}
                </p>
                <p>
                    окпо: {record.okpo}
                </p>
                <p>
                    огрн: {record.ogrn}
                </p>
                <p>
                    инн: {record.inn}
                </p>
                <p>
                   e-mail: {record.email}
                </p>
            </>
        ),
                  }}/>;
};

export default OrganizationList;
