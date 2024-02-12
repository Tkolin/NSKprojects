import React, {useEffect, useState} from 'react';
import {Form, Input, Button, Select, notification, Row, Col} from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import {
    ORGANIZATION_QUERY,
    ORGANIZATION_FORM_QUERY,
    UPDATE_ORGANIZATION_MUTATION,
    ADD_ORGANIZATION_MUTATION,
} from '../../graphql/queries';
import {StyledBigFormBlock, StyledBigForm, StyledFormItem} from '../style/FormStyles';
const OrganizationForm = ({ organization, onClose }) => {

    // Состояния
    const [editingOrganization, setEditingOrganization] = useState(null);
    const [form] = Form.useForm();
    const [api,contextHolder] = notification.useNotification();

    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };

    // Получение данных для выпадающих списков
    const { loading, error, data } = useQuery(ORGANIZATION_FORM_QUERY);

    // Заполнение формы данными контакта при его редактировании
    useEffect(() => {
        if (organization) {
            setEditingOrganization(organization);
            form.setFieldsValue(organization);
        }
    }, [organization, form]);

    // Мутации для добавления и обновления
    const [addOrganization] = useMutation(ADD_ORGANIZATION_MUTATION, {
        refetchQueries: [{ query: ORGANIZATION_QUERY }],
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно добавлены!');
            form.resetFields();
        },
        onError: () => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных.');
        }
    });

    const [updateOrganization] = useMutation(UPDATE_ORGANIZATION_MUTATION, {
        refetchQueries: [{ query: ORGANIZATION_QUERY }],
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно обновлены!');
            setEditingOrganization(null);
            onClose();
        },
        onError: () => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных.');
        }
    });

    // Обработчик отправки формы
    const handleSubmit = () => {
        if (editingOrganization) {
            updateOrganization({ variables: { id: editingOrganization.id, ...form.getFieldsValue() } });
        } else {
            addOrganization({ variables: form.getFieldsValue() });
        }
    };

    // Обработка загрузки и ошибок
    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    return (
        <StyledBigFormBlock>
            <StyledBigForm form={form} layout="vertical">
                {contextHolder}
                <Row gutter={8}>
                    <Col span={20}>
                        <StyledFormItem name="name" label="Наименование компании" rules={[{ required: true }]}>
                            <Input />
                        </StyledFormItem>
                    </Col>
                    <Col span={4}>
                        <StyledFormItem name="legal_form" label="Форма">
                            <Select>
                                {/* options */}
                            </Select>
                        </StyledFormItem>
                    </Col>
                </Row>
                <StyledFormItem name="full_name" label="Полное наименование компании" rules={[{ required: true }]}>
                    <Input />
                </StyledFormItem>
                <StyledFormItem name="director" label="Руководитель">
                    <Select>
                        {/* options */}
                    </Select>
                </StyledFormItem>
                <Row gutter={8}>
                    <Col span={20}>
                        <StyledFormItem name="address_legal" label="Юредический адрес" >
                            <Select>
                                {data && data.positionsNames && data.positionsNames.map(position => (
                                    <Select.Option key={position.id} value={position.id}>{position.name}</Select.Option>
                                ))}
                            </Select>
                        </StyledFormItem>
                        <StyledFormItem name="address_mail" label="Почтовый адрес" >
                            <Select>
                                {data && data.positionsNames && data.positionsNames.map(position => (
                                    <Select.Option key={position.id} value={position.id}>{position.name}</Select.Option>
                                ))}
                            </Select>
                        </StyledFormItem>
                    </Col>
                    <Col span={4}>
                        <StyledFormItem name="office_number_legal" label="Номер офиса" >
                            <Input />
                        </StyledFormItem>
                        <StyledFormItem name="office_number_mail" label="Номер офиса" >
                            <Input />
                        </StyledFormItem>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={12}>
                        <StyledFormItem name="index" label="---Индекс---">
                            <Input />
                        </StyledFormItem>
                        <StyledFormItem name="phone_number" label="Телефон">
                            <Input />
                        </StyledFormItem>
                        <StyledFormItem name="fax_number" label="Факс">
                            <Input />
                        </StyledFormItem>
                        <StyledFormItem name="email" label="e-mail">
                            <Input />
                        </StyledFormItem>
                    </Col>
                    <Col span={12}>
                        <StyledFormItem name="INN" label="ИНН">
                            <Input />
                        </StyledFormItem>
                        <StyledFormItem name="OGRN" label="ОГРН">
                            <Input />
                        </StyledFormItem>
                        <StyledFormItem name="OKPO" label="ОКПО">
                            <Input />
                        </StyledFormItem>
                        <StyledFormItem name="KPP" label="КПП">
                            <Input />
                        </StyledFormItem>
                    </Col>
                </Row>
                <StyledFormItem name="payment_account" label="Расчётынй счёт">
                    <Input />
                </StyledFormItem>
                <StyledFormItem>
                    <Button type="primary" onClick={handleSubmit}>
                        {editingOrganization ? "Сохранить изменения" : "Добавить контакт"}
                    </Button>
                </StyledFormItem>
            </StyledBigForm>
        </StyledBigFormBlock>

    );
};

export default OrganizationForm;
