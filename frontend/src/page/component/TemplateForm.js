import React, {useEffect, useState} from 'react';
import {Form, Input, Button, Select, InputNumber, Col, Row, notification, Modal, Space, Checkbox} from 'antd';
import {useMutation, useQuery} from '@apollo/client';
import {CURRENT_DELEGATE_QUERY, PROJECT_QUERY, TEMPLATE_IRDS_QUERY} from '../../graphql/queries';
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
import LoadingSpinner from "./LoadingSpinner";

const {Option} = Select;

const TemplateForm = ({project, onClose}) => {

    // Состояния
    const [form] = Form.useForm();
    const [formIRD] = Form.useForm();
    const [formContents] = Form.useForm();
    const [formStage] = Form.useForm();
    const [costumerFormViewModalVisible, setCostumerFormViewModalVisible] = useState(false);
    const [contactFormViewModalVisible, setContactFormViewModalVisible] = useState(false);
    const [facilityFormViewModalVisible, setFacilityFormViewModalVisible] = useState(false);
    const [viewListProjectStageModalVisible, setViewListProjectStageModalVisible] = useState(false);
    const [projectTypeDocument, setProjectTypeDocument] = useState(null);
    const [editingProject, setEditingProjcet] = useState(null);
    const [listDelegations, setListDelegations] = useState(null);
    const [selectedOrganization, setSelectedOrganization] = useState(null);
    const [irdsList, setIrdsList] = useState([]);


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
        variables: { typeProject: projectTypeDocument },
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

    const loadTemplate = () => {
        const irds = data.templatesIrdsTypeProjects;
        const initialValuesIrds = irds.map(ird => ({
            ird_id: ird.id,
            isChecked: false,
        }));
        formIRD.setFieldsValue({ irds_to_project: initialValuesIrds });
        const stages = data.templatesStagesTypeProjects;
        const initialValuesStages = stages.map(ird => ({
            ird_id: ird.id,
            isChecked: false,
        }));
        formStage.setFieldsValue({ irds_to_project: initialValuesIrds });
        const contents = data.templatesContentsTypeProjects;
        const initialValuesContents = contents.map(ird => ({
            ird_id: ird.id,
            isChecked: false,
        }));
        formContents.setFieldsValue({ irds_to_project: initialValuesIrds });
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
                                <StyledFormBlock form={form} layout="vertical">
                                    <Row gutter={8} align={"bottom"}>
                                        <Col flex="auto">
                                            <StyledFormItem name="organization_customer_id" label="Тип документации">
                                               <Row>
                                                   <Col flex="auto">
                                                       <Select>
                                                           {data && data.typeDocuments && data.typeDocuments.map(typeDocument => (
                                                               <Option key={typeDocument.id}
                                                                       value={typeDocument.id}>{typeDocument.name}</Option>))}
                                                       </Select>
                                                   </Col>
                                <Col>
                                    <StyledButtonForm onClick={() => setProjectTypeDocument(true)}>Создать</StyledButtonForm>
                                </Col>
                          </Row>

                                            </StyledFormItem>
                                            <StyledButtonForm type="primary" onClick={() => setProjectTypeDocument(true)}>Сохранить настройки</StyledButtonForm>
                                        </Col>
                                    </Row>
                                </StyledFormBlock>
                                  <p>      Список этапов:</p>
                                <StyledFormBlock form={formStage} layout="vertical">
                                    <Form.List name="stages" >
                                        {(fields, {add, remove}) => (<>
                                            {fields.map(({key, name, ...restField}) => (<Space
                                                key={key}
                                                style={{
                                                    display: 'flex', marginBottom: 2,
                                                }}
                                                align="baseline"
                                            >
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'stage']}
                                                >
                                                    <Select>
                                                        {data && data.projectStages && data.projectStages.map(stage => (
                                                            <Select.Option key={stage.id}
                                                                           value={stage.id}>{stage.name}</Select.Option>))}
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'procent']}>
                                                    <InputNumber
                                                        size={"middle"}
                                                        min={1}
                                                        max={100}
                                                        style={{
                                                            width: 50
                                                        }}/>
                                                </Form.Item>
                                                <MinusCircleOutlined onClick={() => remove(name)}/>
                                            </Space>))}
                                            <Form.Item>
                                                <Button type="dashed" onClick={() => add()} block
                                                        icon={<PlusOutlined/>}>
                                                    Добавить список этапов
                                                </Button>
                                            </Form.Item>
                                        </>)}
                                    </Form.List>
                                </StyledFormBlock>
                        </Col>
                        <Col span={16}>
                            ИРД
                            <StyledBigFormBlock name="dynamic_form_nest_itemы" style={{ maxWidth: 600 }} autoComplete="off">
                                <Form.List name="users" >
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
                                            >
                                                <Select placeholder={"Наименование"}>
                                                    {data && data.projectStatuses && data.projectStatuses.map(status => (
                                                        <Select.Option key={status.id}
                                                                       value={status.id}>{status.name}</Select.Option>))}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'last']}
                                            >
                                                <InputNumber
                                                    size={"middle"}
                                                    min={1}
                                                    max={100}
                                                    style={{
                                                        width: 60
                                                    }}/>
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'last']}
                                            >
                                                <InputNumber
                                                    size={"middle"}
                                                    min={1}
                                                    max={100}
                                                    style={{
                                                        width: 60
                                                    }}/>
                                            </Form.Item>
                                            <MinusCircleOutlined onClick={() => remove(name)}/>
                                        </Space>))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block
                                                    icon={<PlusOutlined/>}>
                                                Добавить ИРД к шаблону
                                            </Button>
                                        </Form.Item>
                                    </>)}
                                </Form.List>
                            </StyledBigFormBlock>
                        </Col>
                        <Col></Col>
                    </Row>

                    {/*
            Модальные окна редактирования
            */}
                    {/* Тип документации */}
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

export default TemplateForm;
