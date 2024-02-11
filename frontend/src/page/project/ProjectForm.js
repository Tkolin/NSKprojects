import React, { useState } from 'react';
import {Form, Input, Button, Select, InputNumber, Col, Row, notification, Modal} from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import {
    PROJECT_QUERY,
    ADD_PROJECT_MUTATION,
    UPDATE_PROJECT_MUTATION,
    PROJECT_FORM_QUERY,
} from '../../graphql/queries';
import StyledFormBlock, { StyledForm, StyledFormItem } from '../style/FormStyles';
import {DatePicker} from "antd/lib";

const { Option } = Select;

const ProjectForm = ({project, onClose }) => {

    // Состояния
    const [form] = Form.useForm();
    const [costumerFormViewModalVisible, setCostumerFormViewModalVisible] = useState(false);
    const [facilityFormViewModalVisible, setFacilityFormViewModalVisible] = useState(false);
    const [iadFormViewModalVisible, setIadFormViewModalVisible] = useState(false);
    const [viewListProjectStageModalVisible, setViewListProjectStageModalVisible] = useState(false);
    const [editingProject, setEditingProjcet] = useState(null);
    const handleCostumerFormView = () => {setCostumerFormViewModalVisible(false);};
    const handleFacilityFormView = () => {setFacilityFormViewModalVisible(false);};
    const handleIadFormView = () => {setIadFormViewModalVisible(false);};
    const handleViewListProjectStage = () => {setViewListProjectStageModalVisible(false);};

    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };

    // Получение данных для выпадающих списков
    const { loading, error, data } = useQuery( PROJECT_FORM_QUERY);

    // Мутации для добавления и обновления
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
    const [updateProject] = useMutation(UPDATE_PROJECT_MUTATION, {
        refetchQueries: [{ query: PROJECT_QUERY }],
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно обновлены!');
            setEditingProjcet(null);
            onClose();
        },
        onError: () => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных.');
        }
    });
    // Обработчик отправки формы
    const handleSubmit = () => {
        if (editingProject) {
            updateProject({ variables: { id: editingProject.id, ...form.getFieldsValue() } });
        } else {
            addProject({ variables: form.getFieldsValue() });
        }
    };

    // Обработка загрузки и ошибок
    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    return (
        <div>
            <StyledFormBlock>
                <StyledForm form={form} layout="vertical">
                    <StyledFormItem name="number" label="Номер проекта" rules={[{ required: true }]}>
                        <Input />
                    </StyledFormItem>
                    <StyledFormItem name="name" label="Наименование проекта" rules={[{ required: true }]}>
                        <Input />
                    </StyledFormItem>
                    <StyledFormItem name="organization_customer_id" label="Заказчик" >
                        <Row gutter={8}>
                            <Col flex="auto">
                                <Select>
                                    {data && data.organizations && data.organizations.map(organization => (
                                        <Option key={organization.id} value={organization.id}>{organization.name}</Option>
                                    ))}
                                </Select>
                            </Col>
                            <Col>
                                <Button onClick={()=>setCostumerFormViewModalVisible(true)}>Создать</Button>
                            </Col>
                        </Row>
                    </StyledFormItem>
                    <StyledFormItem name="type_project_document_id" label="Тип документа">
                        <Select>
                            {data && data.typeProjectDocuments && data.typeProjectDocuments.map(typeDock => (
                                <Select.Option key={typeDock.id} value={typeDock.id}>{typeDock.name}</Select.Option>
                            ))}
                        </Select>
                    </StyledFormItem>
                    <StyledFormItem name="facility_id" label="Объект">
                        <Row gutter={8}>
                            <Col flex="auto">
                                <Select>
                                    {data && data.facilitys && data.facilitys.map(facility => (
                                        <Select.Option key={facility.id} value={facility.id}>{facility.name}</Select.Option>
                                    ))}
                                </Select>
                            </Col>
                            <Col>
                                 <Button onClick={()=>setFacilityFormViewModalVisible(true)}>Создать</Button>
                            </Col>
                        </Row>
                    </StyledFormItem>
                    <StyledFormItem name="date_signing" label="Дата подписания">
                        <DatePicker />
                    </StyledFormItem>
                    <StyledFormItem name="IAD_id" label="ИАД">
                        <Row gutter={8}>
                            <Col flex="auto">
                                <Select>
                                    {data && data.organizationNames && data.organizationNames.map(position => (
                                        <Select.Option key={position.id} value={position.id}>{position.name}</Select.Option>
                                    ))}
                                </Select>
                            </Col>
                            <Col>
                                    <Button onClick={()=>setIadFormViewModalVisible(true)}>Создать</Button>
                            </Col>
                        </Row>
                    </StyledFormItem>
                    <StyledFormItem name="duration" label="Продолжительность">
                        <InputNumber />
                    </StyledFormItem>
                    <StyledFormItem name="date_end" label="Дата окончания">
                        <DatePicker />
                    </StyledFormItem>
                    <StyledFormItem name="status_id" label="Статус проекта">
                        <Select>
                            {data && data.projectStatuses && data.projectStatuses.map(status => (
                                <Select.Option key={status.id} value={status.id}>{status.name}</Select.Option>
                            ))}
                        </Select>
                    </StyledFormItem>
                    <StyledFormItem name="date_completion" label="Дата фактического закрытия">
                        <DatePicker />
                    </StyledFormItem>

                    <StyledFormItem>
                        <Button type="primary" onClick={handleSubmit}>
                            Сохранить проект
                        </Button>
                        <Button type="primary" onClick={()=>setViewListProjectStageModalVisible(true)} >
                            Список задач
                        </Button>
                    </StyledFormItem>
                </StyledForm>
            </StyledFormBlock>

            {/*
            Модальные окна редактирования
            */}
            {/* Заказчик */}
            <Modal
                visible={costumerFormViewModalVisible}
                title="Организация"
                onCancel={() => setCostumerFormViewModalVisible(false)}
                footer={null}
                onClose={handleCostumerFormView}
            >
                <StyledFormBlock>
                    <StyledForm form={form} layout="vertical">
                        {/* Форма для добавления новых данных */}
                        {/* ... */}

                    </StyledForm>
                </StyledFormBlock>
            </Modal>
            {/* Объект */}
            <Modal
                visible={facilityFormViewModalVisible}
                title="Объект"
                onCancel={() => setFacilityFormViewModalVisible(false)}
                footer={null}
                onClose={handleFacilityFormView}
            >
                <StyledFormBlock>
                    <StyledForm form={form} layout="vertical">
                        {/* Форма для добавления новых данных */}
                        {/* ... */}

                    </StyledForm>
                </StyledFormBlock>
            </Modal>
            {/* Иад */}
            <Modal
                visible={iadFormViewModalVisible}
                title="Иад"
                onCancel={() => setIadFormViewModalVisible(false)}
                footer={null}
                onClose={handleIadFormView}
            >
                <StyledFormBlock>
                    <StyledForm form={form} layout="vertical">
                        {/* Форма для добавления новых данных */}
                        {/* ... */}

                    </StyledForm>
                </StyledFormBlock>
            </Modal>
            {/* Список задач */}
            <Modal
                visible={viewListProjectStageModalVisible}
                title="Список задач"
                onCancel={() => setViewListProjectStageModalVisible(false)}
                footer={null}
                onClose={handleViewListProjectStage}
            >
                <StyledFormBlock>
                    <StyledForm form={form} layout="vertical">
                        {/* Форма для добавления новых данных */}
                        {/* ... */}

                    </StyledForm>
                </StyledFormBlock>
            </Modal>
        </div>
);
};

export default ProjectForm;
