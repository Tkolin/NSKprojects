import React, {useEffect, useState} from 'react';
import {
    Form,
    Input,
    Button,
    Select,
    InputNumber,
    Col,
    Row,
    notification,
    Modal,
    Space,
    Checkbox,
    AutoComplete
} from 'antd';
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
import OrganizationForm from "./OrganizationForm";
import moment from 'moment';
import {keys, values} from "mobx";
import ContactForm from "./ContactForm";
import {Cookies} from "react-cookie";
import LoadingSpinner from "../component/LoadingSpinner";
import {
    SEARCH_DELEGATES_OR_ORGANIZATION_QUERY, SEARCH_ORGANIZATIONS_QUERY,
    SEARCH_TEMPLATE_OR_TYPE_PROJECT_QUERY
} from "../../graphql/queriesSearch";

const {Option} = Select;

const ProjectForm = ({project, onClose}) => {

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
    const [autoCompleteOrganization, setAutoCompleteOrganization] = useState({ id: '', name: '' });

    const handleAutoCompleteOrganization = (value, option) => {
        setAutoCompleteOrganization({ id: option.key, name: value });
        console.log(autoCompleteOrganization.id);
    };


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
    const { loading: loadingAll, error: errorAll,data:  dataAll} = useQuery(PROJECT_FORM_QUERY);

    const { loading: loadingTemplate, error: errorTemplate, data: dataTemplate} = useQuery(SEARCH_TEMPLATE_OR_TYPE_PROJECT_QUERY,{
        variables: { typeProject: projectTypeDocument },
    });
    const { loading: loadingDelegates, error: errorDelegates, data: dataDelegates} = useQuery(SEARCH_DELEGATES_OR_ORGANIZATION_QUERY,{
        variables: { searchOrganizationId: autoCompleteOrganization.id },
    });
    const { loading: loadingOrganizations, error: errorOrganizations, data: dataOrganizations } = useQuery(SEARCH_ORGANIZATIONS_QUERY, {
        variables: { searchOrganizations: autoCompleteOrganization.name },
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
        const irds = dataTemplate && dataTemplate.templatesIrdsTypeProjects;
        const initialValuesIrds = irds && irds.map(ird => ({
            ird_id: ird.id,
            isChecked: false,
        }));
        formIRD.setFieldsValue({ irds_to_project: initialValuesIrds });

        const stages = dataTemplate && dataTemplate.templatesStagesTypeProjects;
        const initialValuesStages = stages && stages.map(stage => ({
            stage_id: stage.id,

        }));
        formStage.setFieldsValue({ stages_to_project: initialValuesStages });

        const contents = dataTemplate && dataTemplate.templatesContentsTypeProjects;
        const initialValuesContents = contents && contents.map(ird => ({
            ird_id: ird.id,

        }));
        formContents.setFieldsValue({ contents_to_project: initialValuesContents });
    };

    return (
        <>
            <StyledVeryBigFormBlock>
                <StyledVeryBigForm layout="vertical">
                    <Row gutter={8}>
                        <Col span={8}>
                            Компонент для проекта
                            <StyledFormBlock form={form} layout="vertical">
                                <StyledFormItem name="number" label="Номер проекта" rules={[{required: true}]}>
                                    <Input/>
                                </StyledFormItem>
                                <StyledFormItem name="name" label="Наименование проекта" rules={[{required: true}]}>
                                    <Input/>
                                </StyledFormItem>

                                <Row gutter={8} align={"bottom"}>
                                    <Col flex="auto">
                                        <StyledFormItem name="organization_customer_id" label="Заказчик">
                                            <AutoComplete
                                                dropdownMatchSelectWidth={false}
                                                filterOption = {false}
                                                options={dataOrganizations &&  dataOrganizations.organizationsTable && dataOrganizations.organizationsTable.organizations.map(organization => ({
                                                    key: organization.id,
                                                    value: organization.name,
                                                    label: organization.name,
                                                }))}
                                                onChange={(value, option)=>handleAutoCompleteOrganization(value, option)} // Передаем введенное значение
                                                onSelect={(value, option)=>handleAutoCompleteOrganization(value, option)}
                                                placeholder="Начните ввод..."
                                            />
                                        </StyledFormItem>
                                    </Col>
                                    <Col>
                                        <StyledButtonForm onClick={() => setCostumerFormViewModalVisible(true)}>Создать</StyledButtonForm>
                                    </Col>
                                </Row>
                                <Row gutter={4} align={"bottom"}>
                                    <Col flex="auto">
                                        <StyledFormItem name="delegate_id" label="Представитель компании">
                                            <Select
                                                style={{ maxWidth: 249 }}
                                                placeholder="По компаниям">
                                                {dataDelegates && dataDelegates.contactsTable  && dataDelegates.contactsTable.contacts.map(delegate => (
                                                    <Select.Option key={delegate.id}
                                                                   value={delegate.id}>{delegate.last_name} {delegate.first_name} {delegate.patronymic}</Select.Option>))}
                                            </Select>
                                        </StyledFormItem>
                                    </Col>
                                    <Col>
                                        <StyledButtonForm onClick={() => setContactFormViewModalVisible(true)}>Создать</StyledButtonForm>
                                    </Col>
                                </Row>
                                <Row gutter={4} align={"bottom"}>
                                    <Col flex="auto">
                                        <StyledFormItem name="type_project_document_id" label="Тип документа">
                                            <Select
                                                dropdownMatchSelectWidth={false}
                                                style={{ maxWidth: 200 }}
                                                onChange={(value)=>setProjectTypeDocument(value)}
                                                placeholder="Выберите тип документа">
                                                {dataAll &&  dataAll.typeProjectDocuments && dataAll.typeProjectDocuments.map(typeDock => (
                                                    <Select.Option key={typeDock.id}
                                                                   value={typeDock.id}>{typeDock.name}</Select.Option>))}
                                            </Select>
                                        </StyledFormItem>
                                    </Col>
                                    <Col>
                                        <StyledButtonForm  style={{ maxWidth: 250 }} onClick={() => loadTemplate()}>Сформировать</StyledButtonForm>
                                    </Col>
                                </Row>


                                <Row gutter={4} align={"bottom"}>
                                    <Col flex="auto" >
                                        <StyledFormItem name="facility_id" label="Объект">
                                            <Select
                                                style={{ maxWidth: 249 }}
                                            >
                                                {dataAll &&  dataAll.facilitys && dataAll.facilitys.map(facility => (
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
                                    <DatePicker               placeholder="Выберите дату"/>
                                </StyledFormItem>
                                <StyledFormItem name="duration" label="Продолжительность">
                                    <InputNumber/>
                                </StyledFormItem>
                                <StyledFormItem name="date_end" label="Дата окончания">
                                    <DatePicker placeholder="Выберите дату"/>
                                </StyledFormItem>
                                <StyledFormItem name="status_id" label="Статус проекта">
                                    <Select>
                                        {dataAll && dataAll.projectStatuses && dataAll.projectStatuses.map(status => (
                                            <Select.Option key={status.id}
                                                           value={status.id}>{status.name}</Select.Option>))}
                                    </Select>
                                </StyledFormItem>
                                <StyledFormItem name="date_completion" label="Дата фактического закрытия">
                                    <DatePicker placeholder="Выберите дату"/>
                                </StyledFormItem>

                                <StyledFormItem>
                                    <Button type="primary" onClick={handleSubmit}>
                                        Сохранить проект
                                    </Button>
                                    <Button type="primary" onClick={() => setViewListProjectStageModalVisible(true)}>
                                        Список задач
                                    </Button>
                                </StyledFormItem>
                            </StyledFormBlock>
                        </Col>
                        <Col span={8}>
                            Компонент для этапов
                            <StyledFormBlock form={formStage} style={{ maxWidth: 600 }} autoComplete="off">
                                <Form.List name="stages_to_project" >
                                    {(fields, {add, remove}) => (<>
                                        {fields.map(({key, name, ...restField}) => (<Space
                                            key={key}
                                            style={{
                                                display: 'flex'
                                            }}
                                            align="baseline">
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'stage_id']}
                                                rules={[{
                                                    required: true, message: 'Missing first name',
                                                },]}
                                            >
                                                <Select>
                                                    {dataAll && dataAll.stages && dataAll.stages.map(stage => (
                                                        <Select.Option key={stage.id}
                                                                       value={stage.id}>{stage.name}</Select.Option>))}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'date_start']}
                                                rules={[{
                                                    required: true, message: 'Missing last name',
                                                },]}
                                            >
                                                <DatePicker/>
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'date_end']}
                                                rules={[{
                                                    required: true, message: 'Missing last name',
                                                },]}
                                            >
                                                <DatePicker/>
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
                            </StyledFormBlock>
                            Компонент для ИРД
                            <StyledFormBlock form={formIRD} name="dynamic_form_nest_item" autoComplete="off">
                                <Form.List name="irds_to_project">
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map(({ key, name, ...restField }) => (
                                                <Space
                                                    key={key}
                                                    style={{ display: 'flex', marginBottom: 0, marginTop: 0 }}
                                                    align="baseline"
                                                >
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'ird_id']}
                                                        rules={[{ required: true, message: 'Missing IRD ID' }]}
                                                        style={{ marginBottom: 0, display: 'flex' }}
                                                    >

                                                        <Select dropdownMatchSelectWidth={false} style={{ maxWidth: 250, minWidth: 300}}>
                                                            {dataAll && dataAll.irds  && dataAll.irds .map(ird => (
                                                                <Select.Option key={ird.id}
                                                                               value={ird.id}>{ird.name}</Select.Option>))}
                                                        </Select>
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'isChecked']}
                                                        valuePropName="checked"
                                                        style={{ marginBottom: 0 }}
                                                    >
                                                        <Checkbox />
                                                    </Form.Item>
                                                    <MinusCircleOutlined onClick={() => remove(name)} />
                                                </Space>
                                            ))}
                                            <Form.Item>
                                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                    Add field
                                                </Button>
                                            </Form.Item>
                                        </>
                                    )}
                                </Form.List>
                            </StyledFormBlock>
                        </Col>
                        <Col span={8}>
                            Содержание проекта
                            <StyledFormBlock name="dynamic_form_nest_item" style={{ maxWidth: 600 }} autoComplete="off">
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
                                                    required: true,
                                                },]}
                                            >
                                                <Select>
                                                    {dataAll && dataAll.projectStatuses && dataAll.projectStatuses.map(status => (
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
                                                    {dataAll && dataAll.projectStatuses && dataAll.projectStatuses.map(status => (
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
