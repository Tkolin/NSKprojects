// Ваш проект/frontend/src/components/ContactForm.js

import React, { useState } from 'react';
import {Form, Input, Button, Select, InputNumber, Col, Row, notification} from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import {
    PROJECT_QUERY,
    ADD_PROJECT_MUTATION,
    ADD_PROJECT_VIEW_DATA_QUERY
} from '../../graphql/queries';
import StyledFormBlock, { StyledForm, StyledFormItem, StyledButton } from '../style/FormStyles';
import {DatePicker} from "antd/lib"; // Импорт стилей

const { Option } = Select;

const ContactForm = () => {
    const [form] = Form.useForm();
    const [isNewFormVisible, setIsNewFormVisible] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };
    const [addProject] = useMutation(ADD_PROJECT_MUTATION, {
        refetchQueries: [{ query: PROJECT_QUERY }],
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно добавлены!');
            form.resetFields();
        },
        onError: () => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных.');
        }
    });
    const { loading, error, data } = useQuery( ADD_PROJECT_VIEW_DATA_QUERY);

    const handleSubmit = () => {
        addProject({ variables: form.getFieldsValue()  });
        form.resetFields();
    };
    const handleShowNewForm = () => {
        setIsNewFormVisible(true);
    };

    const handleHideNewForm = () => {
        setIsNewFormVisible(false);
    };
    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    return (
        <Row gutter={16}>
            <Col span={12}>
                <StyledFormBlock>
                    <StyledForm form={form} layout="vertical">
                        <StyledFormItem name="number" label="Номер проекта" rules={[{ required: true }]}>
                            <Input />
                        </StyledFormItem>
                        <StyledFormItem name="name" label="Наименование проекта" rules={[{ required: true }]}>
                            <Input />
                        </StyledFormItem>
                        <StyledFormItem name="organization_customer_id" label="Заказчик" rules={[{ required: true}]}>
                            <Row gutter={8}>
                                <Col flex="auto">
                                    <Select>
                                        {data && data.organizations && data.organizations.map(organization => (
                                            <Option key={organization.id} value={organization.id}>{organization.name}</Option>
                                        ))}
                                    </Select>
                                </Col>
                                <Col>
                                    {!isNewFormVisible && (
                                        <Button onClick={handleShowNewForm}>Создать</Button>
                                    )}
                                </Col>
                            </Row>
                        </StyledFormItem>
                        <StyledFormItem name="type_project_document_id" label="Тип документа" rules={[{ required: true }]}>
                            <Select>
                                {data && data.typeProjectDocuments && data.typeProjectDocuments.map(typeDock => (
                                    <Select.Option key={typeDock.id} value={typeDock.id}>{typeDock.name}</Select.Option>
                                ))}
                            </Select>
                        </StyledFormItem>
                        <StyledFormItem name="facility_id" label="Объект" rules={[{ required: true }]}>
                            <Row gutter={8}>
                                <Col flex="auto">
                                    <Select>
                                        {data && data.facilitys && data.facilitys.map(facility => (
                                            <Select.Option key={facility.id} value={facility.id}>{facility.name}</Select.Option>
                                        ))}
                                    </Select>
                                </Col>
                                <Col>
                                    <Button>Новый</Button>
                                </Col>
                            </Row>
                        </StyledFormItem>
                        <StyledFormItem name="date_signing" label="Дата подписания" rules={[{ required: true }]}>
                            <DatePicker />
                        </StyledFormItem>
                        <StyledFormItem name="IAD_id" label="ИАД" rules={[{ required: true }]}>
                            <Row gutter={8}>
                                <Col flex="auto">
                                    <Select>
                                        {data && data.organizationNames && data.organizationNames.map(position => (
                                            <Select.Option key={position.id} value={position.id}>{position.name}</Select.Option>
                                        ))}
                                    </Select>
                                </Col>
                                <Col>
                                    <Button>Новый</Button>
                                </Col>
                            </Row>
                        </StyledFormItem>
                        <StyledFormItem name="duration" label="Продолжительность" rules={[{ required: true }]}>
                            <InputNumber />
                        </StyledFormItem>
                        <StyledFormItem name="date_end" label="Дата окончания" rules={[{ required: true  }]}>
                            <DatePicker />
                        </StyledFormItem>
                        <StyledFormItem name="status_id" label="Статус проекта" rules={[{ required: true }]}>
                            <Select>
                                {data && data.projectStatuses && data.projectStatuses.map(status => (
                                    <Select.Option key={status.id} value={status.id}>{status.name}</Select.Option>
                                ))}
                            </Select>
                        </StyledFormItem>
                        <StyledFormItem name="date_completion" label="Дата фактического закрытия" rules={[{ required: true }]}>
                            <DatePicker />
                        </StyledFormItem>

                        <StyledFormItem>
                            <Button type="primary" onClick={handleSubmit}>
                                Add Contact
                            </Button>
                        </StyledFormItem>
                    </StyledForm>
                </StyledFormBlock>
            </Col>
            {/* Условный рендеринг для новой формы */}
            {isNewFormVisible && (
                <Col span={12}>
                    <StyledFormBlock>
                        <StyledForm form={form} layout="vertical">
                            {/* Форма для добавления новых данных */}
                            {/* ... */}
                            <StyledFormItem>
                                <Button type="primary" onClick={handleSubmit}>
                                    Добавить
                                </Button>
                                <Button onClick={handleHideNewForm}>Свернуть</Button>
                            </StyledFormItem>
                        </StyledForm>
                    </StyledFormBlock>
                </Col>
            )}

        </Row>

    );
};

export default ContactForm;
