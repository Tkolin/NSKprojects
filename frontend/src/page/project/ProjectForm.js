import React, {useEffect, useState} from 'react';
import {Form, Input, Button, Select, InputNumber, Col, Row, notification, Modal, Space, Checkbox} from 'antd';
import {useMutation, useQuery} from '@apollo/client';
import {CURRENT_DELEGATE_QUERY, PROJECT_QUERY} from '../../graphql/queries';
import {PROJECT_FORM_QUERY} from '../../graphql/queriesGroupData';
import {
    ADD_PROJECT_MUTATION, UPDATE_PROJECT_MUTATION,
} from '../../graphql/mutationsProject';
import {
    StyledFormBlock,
    StyledForm,
    StyledFormItem,
    StyledBigFormBlock,
    StyledBigForm,
    StyledVeryBigFormBlock, StyledVeryBigForm, StyledButtonForm
} from '../style/FormStyles';
import {DatePicker} from "antd/lib";
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import OrganizationForm from "../organization/OrganizationForm";
import moment from 'moment';
import {keys, values} from "mobx";
import ContactForm from "../contact/ContactForm";
import {Cookies} from "react-cookie";
import LoadingSpinner from "../component/LoadingSpinner";

const {Option} = Select;

const ProjectForm = ({project, onClose}) => {

    // Состояния
    const [form] = Form.useForm();
    const [formIRD] = Form.useForm();
    const [formda] = Form.useForm();
    const [costumerFormViewModalVisible, setCostumerFormViewModalVisible] = useState(false);
    const [contactFormViewModalVisible, setContactFormViewModalVisible] = useState(false);
    const [facilityFormViewModalVisible, setFacilityFormViewModalVisible] = useState(false);
    const [viewListProjectStageModalVisible, setViewListProjectStageModalVisible] = useState(false);
    const [editingProject, setEditingProjcet] = useState(null);
    const [listDelegations, setListDelegations] = useState(null);
    const [selectedOrganization, setSelectedOrganization] = useState(null);

    const handleContactFormView = () => {
        setContactFormViewModalVisible(false);
    };
    const handleCostumerFormView = () => {
        setCostumerFormViewModalVisible(false);
    };
    const handleFacilityFormView = () => {
        setFacilityFormViewModalVisible(false);
    };
    const handleViewListProjectStage = () => {
        setViewListProjectStageModalVisible(false);
    };
    const handleOrganizationChange = (value) => {
        setSelectedOrganization(value);
        delegateFilterForOrganizations(value);
    };
    const delegateFilterForOrganizations = async (organizationId) => {
        try {
            //const { data } = await client.query({
            //     query: CURRENT_DELEGATE_QUERY,
            //     variables: { organizationId },
            // });
            setListDelegations(data.delegates);
        } catch (error) {
            console.error('Ошибка при выборке ответсвтеного лица:', error);
        }
    };
    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message, placement,
        });
    };

    // Получение данных для выпадающих списков
    const cookies = new Cookies();
    const accessToken = cookies.get('accessToken');
    const {loading, error, data} = useQuery(PROJECT_FORM_QUERY,{
        context: {
            headers: {
                Authorization: accessToken ? `Bearer ${accessToken}` : 'null',
            }
        }
    });

    // Заполнение формы данными контакта при его редактировании
    useEffect(() => {
        if (project) {
            setEditingProjcet(project);
            form.setFieldsValue({
                ...project,
                date_signing: project.date_signing ? moment(project.date_signing, 'YYYY-MM-DD') : null,
                date_end: project.date_end ? moment(project.date_end, 'YYYY-MM-DD') : null,
                date_completion: project.date_completion ? moment(project.date_completion, 'YYYY-MM-DD') : null,
                organization_customer_id: project.organization_customer ? project.organization_customer.id : null,
                delegate_id: project.delegate ? project.delegate.id : null,
                type_project_document_id: project.type_project_document ? project.type_project_document.id : null,
                facility_id: project.facility ? project.facility.id : null,
                status_id: project.status ? project.status.id : null,
            });
        }
    }, [project, form]);


    // Мутации для добавления и обновления
    const [addProject] = useMutation(ADD_PROJECT_MUTATION, {
        refetchQueries: [{query: PROJECT_QUERY}], onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно добавлены!');
            form.resetFields();
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных: ' + error.message);
        }
    });

    const [updateProject] = useMutation(UPDATE_PROJECT_MUTATION, {
        refetchQueries: [{query: PROJECT_QUERY}], onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно обновлены!');
            setEditingProjcet(null);
            onClose();
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных: '+ error.message);
        }
    });

    // Обработчик отправки формы
    const handleSubmit = () => {
        if (editingProject) {
            updateProject({variables: {id: editingProject.id, ...form.getFieldsValue()}});
        } else {
            addProject({variables: form.getFieldsValue()});
        }
    };

    // Обработка загрузки и ошибок
    if (loading) return <LoadingSpinner/>;
    if (error) return `Ошибка! ${error.message}`;

    return (
        <>
            <StyledVeryBigFormBlock>
                <StyledVeryBigForm layout="vertical">

                    <Row gutter={8}>
                        <Col span={8}>
                            Проект
                            <StyledForm form={form} layout="vertical">
                                <StyledFormItem name="number" label="Номер проекта" rules={[{required: true}]}>
                                    <Input/>
                                </StyledFormItem>
                                <StyledFormItem name="name" label="Наименование проекта" rules={[{required: true}]}>
                                    <Input/>
                                </StyledFormItem>

                                <Row gutter={8} align={"bottom"}>
                                    <Col flex="auto">
                                        <StyledFormItem name="organization_customer_id" label="Заказчик">
                                            <Select>
                                                {data && data.organizations && data.organizations.map(organization => (
                                                    <Option key={organization.id}
                                                            value={organization.id}>{organization.name}</Option>))}
                                            </Select>
                                        </StyledFormItem>
                                    </Col>
                                    <Col>
                                        <StyledButtonForm onClick={() => setCostumerFormViewModalVisible(true)}>Создать</StyledButtonForm>
                                    </Col>
                                </Row>
                                <Row gutter={8} align={"bottom"}>
                                    <Col flex="auto">
                                        <StyledFormItem name="delegate_id" label="Представитель компании">
                                            <Select>
                                                {data && data.contacts && data.contacts.map(data => (
                                                    <Select.Option key={data.id}
                                                                   value={data.id}>{data.last_name} {data.first_name} {data.patronymic}</Select.Option>))}
                                            </Select>
                                        </StyledFormItem>
                                    </Col>
                                    <Col>
                                        <StyledButtonForm onClick={() => setContactFormViewModalVisible(true)}>Создать</StyledButtonForm>
                                    </Col>
                                </Row>
                                <StyledFormItem name="type_project_document_id" label="Тип документа">
                                    <Select>
                                        {data && data.typeProjectDocuments && data.typeProjectDocuments.map(typeDock => (
                                            <Select.Option key={typeDock.id}
                                                           value={typeDock.id}>{typeDock.name}</Select.Option>))}
                                    </Select>
                                </StyledFormItem>

                                <Row gutter={8} align={"bottom"}>
                                    <Col flex="auto" >
                                        <StyledFormItem name="facility_id" label="Объект">
                                            <Select>
                                                {data && data.facilitys && data.facilitys.map(facility => (
                                                    <Select.Option key={facility.id}
                                                                   value={facility.id}>{facility.name}</Select.Option>))}
                                            </Select>
                                        </StyledFormItem>
                                    </Col>
                                    <Col>
                                        <StyledButtonForm onClick={() => setFacilityFormViewModalVisible(true)}>Создать</StyledButtonForm>
                                    </Col>
                                </Row>

                                <StyledFormItem name="date_signing" label="Дата подписания">
                                    <DatePicker/>
                                </StyledFormItem>
                                <StyledFormItem name="duration" label="Продолжительность">
                                    <InputNumber/>
                                </StyledFormItem>
                                <StyledFormItem name="date_end" label="Дата окончания">
                                    <DatePicker/>
                                </StyledFormItem>
                                <StyledFormItem name="status_id" label="Статус проекта">
                                    <Select>
                                        {data && data.projectStatuses && data.projectStatuses.map(status => (
                                            <Select.Option key={status.id}
                                                           value={status.id}>{status.name}</Select.Option>))}
                                    </Select>
                                </StyledFormItem>
                                <StyledFormItem name="date_completion" label="Дата фактического закрытия">
                                    <DatePicker/>
                                </StyledFormItem>

                                <StyledFormItem>
                                    <Button type="primary" onClick={handleSubmit}>
                                        Сохранить проект
                                    </Button>
                                    <Button type="primary" onClick={() => setViewListProjectStageModalVisible(true)}>
                                        Список задач
                                    </Button>
                                </StyledFormItem>
                            </StyledForm>
                        </Col>

                        <Col span={8}>
                            <StyledForm form={formIRD} layout="vertical">

                                <p>
                                    Список ИРД: (пример)
                                </p>

                                <p>
                                    выпадающий список названия | дата получения
                                </p>

                                <StyledFormBlock
                                    name="dynamic_form_nest_item"
                                    autoComplete="off"
                                >
                                    <Form.List name="users">
                                        {(fields, {add, remove}) => (<>
                                            {fields.map(({key, name, ...restField}) => (<Space
                                                key={key}
                                                style={{
                                                    display: 'flex', marginBottom: 8,
                                                }}
                                                align="baseline"
                                            >
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'first']}
                                                    rules={[{
                                                        required: true, message: 'Missing first name',
                                                    },]}
                                                >
                                                    <Select     dropdownMatchSelectWidth={false}  style={{ maxWidth: 250 }}>
                                                        {data && data.irds && data.irds.map(ird => (
                                                            <Select.Option key={ird.id}
                                                                           value={ird.id}>{ird.name}</Select.Option>))}
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'last']}
                                                    rules={[{
                                                        required: true, message: 'Missing last name',
                                                    },]}
                                                >
                                                    <Checkbox/>
                                                </Form.Item>
                                                <Form.Item>
                                                    <Button onClick={() => add()} block icon={<PlusOutlined/>}>
                                                    </Button>
                                                </Form.Item>
                                                <MinusCircleOutlined onClick={() => remove(name)}/>
                                            </Space>))}
                                            <Form.Item>
                                                <Button type="dashed" onClick={() => add()} block
                                                        icon={<PlusOutlined/>}>
                                                    Add field
                                                </Button>
                                            </Form.Item>
                                        </>)}
                                    </Form.List>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit">
                                            Submit
                                        </Button>
                                    </Form.Item>
                                </StyledFormBlock>
                            </StyledForm>
                        </Col>
                        <Col span={8}>
                            <p>
                                Список задач: (пример)
                            </p>

                            <p>
                                выпадающий список глав | исполнитель | подробней
                            </p>

                            <StyledFormBlock
                                name="dynamic_form_nest_item"
                                style={{
                                    maxWidth: 600,
                                }}
                                autoComplete="off"
                            >
                                <Form.List name="users">
                                    {(fields, {add, remove}) => (<>
                                        {fields.map(({key, name, ...restField}) => (<Space
                                            key={key}
                                            style={{
                                                display: 'flex', marginBottom: 8,
                                            }}
                                            align="baseline"
                                        >
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'first']}
                                                rules={[{
                                                    required: true, message: 'Missing first name',
                                                },]}
                                            >
                                                <Select>
                                                    {data && data.projectStatuses && data.projectStatuses.map(status => (
                                                        <Select.Option key={status.id}
                                                                       value={status.id}>{status.name}</Select.Option>))}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'last']}
                                                rules={[{
                                                    required: true, message: 'Missing last name',
                                                },]}
                                            >
                                                <Select>
                                                    {data && data.projectStatuses && data.projectStatuses.map(status => (
                                                        <Select.Option key={status.id}
                                                                       value={status.id}>{status.name}</Select.Option>))}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item>
                                                <Button onClick={() => add()} block icon={<PlusOutlined/>}>
                                                </Button>
                                            </Form.Item>
                                            <MinusCircleOutlined onClick={() => remove(name)}/>
                                        </Space>))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block
                                                    icon={<PlusOutlined/>}>
                                                Add field
                                            </Button>
                                        </Form.Item>
                                    </>)}
                                </Form.List>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                </Form.Item>
                            </StyledFormBlock>
                        </Col>
                    </Row>
                    {/*
            Модальные окна редактирования
            */}
                    {/* Делигат */}
                    <Modal
                        visible={contactFormViewModalVisible}
                        title="Организация"
                        onCancel={() => setContactFormViewModalVisible(false)}
                        footer={null}
                        onClose={handleContactFormView}
                    >
                        <StyledFormBlock>
                            <StyledForm form={form} layout="vertical">
                                <ContactForm/>

                            </StyledForm>
                        </StyledFormBlock>
                    </Modal>
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
                                <OrganizationForm/>

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

                    {/* Список задач (ВСЕХ) */}
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
                </StyledVeryBigForm>
            </StyledVeryBigFormBlock>

            </>
            );
            };

            export default ProjectForm;
