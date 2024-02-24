import React, {useEffect, useState} from 'react';
import {
    Form, Input, Button, Select, InputNumber, Col, Row, notification, Modal, Space, Checkbox, AutoComplete
} from 'antd';
import {useMutation, useQuery} from '@apollo/client';
import {CURRENT_DELEGATE_QUERY, PROJECT_QUERY, TEMPLATE_IRDS_QUERY, TYPES_PROJECTS_QUERY} from '../../graphql/queries';
import {PROJECT_FORM_QUERY} from '../../graphql/queriesGroupData';
import {
    ADD_PROJECT_MUTATION, UPDATE_PROJECT_MUTATION,
} from '../../graphql/mutationsProject';
import {
    StyledFormBig, StyledFormItem, StyledFormRegular
} from '../style/FormStyles';
import {DatePicker} from "antd/lib";
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import OrganizationForm from "./OrganizationForm";
import moment from 'moment';
import ContactForm from "./ContactForm";
import {
    SEARCH_DELEGATES_OR_ORGANIZATION_QUERY,
    SEARCH_IRDS_QUERY,
    SEARCH_ORGANIZATIONS_QUERY,
    SEARCH_STAGES_QUERY,
    SEARCH_TEMPLATE_OR_TYPE_PROJECT_QUERY
} from "../../graphql/queriesSearch";
import {StyledBlockBig, StyledBlockLarge, StyledBlockRegular} from "../style/BlockStyles";
import {StyledButtonForm, StyledButtonGreen} from "../style/ButtonStyles";

const {Option} = Select;

const ProjectForm = ({project, onClose}) => {

    // Состояния
    const [form] = Form.useForm();
    const [formIRD] = Form.useForm();
    const [formContents] = Form.useForm();
    const [formStage] = Form.useForm();
    const [projectTypeDocument, setProjectTypeDocument] = useState(null);
    const [editingProject, setEditingProjcet] = useState(null);
    const [autoCompleteOrganization, setAutoCompleteOrganization] = useState({id: '', name: ''});

    const [typeProjectFormViewModalVisible, setTypeProjectFormViewModalVisible] = useState(false);
    const [irdFormViewModalVisible, setIrdFormViewModalVisible] = useState(false);
    const [stageFormViewModalVisible, setStageFormViewModalVisible] = useState(false);
    const [confirmTypeChangeModalVisible, setConfirmTypeChangeModalVisible] = useState(false);
    const [costumerFormViewModalVisible, setCostumerFormViewModalVisible] = useState(false);
    const [contactFormViewModalVisible, setContactFormViewModalVisible] = useState(false);
    const [facilityFormViewModalVisible, setFacilityFormViewModalVisible] = useState(false);
    const [viewListProjectStageModalVisible, setViewListProjectStageModalVisible] = useState(false);

    const [editingTypeProject, setEditingTypeProject] = useState(null);

    const [autoCompleteIrd, setAutoCompleteIrd] = useState('');
    const [autoCompleteStage, setAutoCompleteStage] = useState('');

    const [selectedTypeProject, setSelectedTypeProject] = useState(null);

    const handleAutoCompleteOrganization = (value, option) => {
        setAutoCompleteOrganization({id: option.key, name: value});
        console.log(autoCompleteOrganization.id);
    };

    const handleAutoCompleteIrdSelect = (value) => {
        if (value == 'CREATE_NEW') {
            setIrdFormViewModalVisible(true);
            setAutoCompleteIrd('');
        } else {
            setAutoCompleteIrd('');
        }
    };
    const handleAutoCompleteStageSelect = (value) => {
        if (value == 'CREATE_NEW') {
            setIrdFormViewModalVisible(true);
            setAutoCompleteIrd('');
        } else {
            setAutoCompleteIrd('');
        }
    };
    const handleAutoCompleteIrd = (value) => {
        setAutoCompleteIrd(value)
    };
    const handleAutoCompleteStage = (value) => {
        setAutoCompleteStage(value);
    };

    // Вызов модальных окон
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

    // Переключение типов документации
    const handleEditingTemplate = (value) => {
        setSelectedTypeProject(value);
    };

    const showConfirmTypeChangeModal = (value) => {
        setConfirmTypeChangeModalVisible(true);
    };

    const handleConfirmTypeChange = (confirm) => {
        if (confirm) {
            console.log('p,');
            setEditingTypeProject(selectedTypeProject);
        }
        setSelectedTypeProject(null);
        setConfirmTypeChangeModalVisible(false);
    };

    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message, placement,
        });
    };

    // Получение данных для выпадающих списков
    const [dataIrds, setDataIrds] = useState(null);
    const [dataStages, setDataStages] = useState(null);

    const {loading: loadingAll, error: errorAll, data: dataAll} = useQuery(PROJECT_FORM_QUERY);

    const {
        loading: loadingTemplate, error: errorTemplate, data: dataTemplate
    } = useQuery(SEARCH_TEMPLATE_OR_TYPE_PROJECT_QUERY, {
        variables: {typeProject: editingTypeProject},
        fetchPolicy: 'network-only',
        onCompleted: (data) => addIrdsAndStages(data),
    });
    const {loading: loadingIrds, error: errorIrds, refetch: refetchIrds} = useQuery(SEARCH_IRDS_QUERY, {
        variables: {search: autoCompleteIrd}, onCompleted: (data) => setDataIrds(data)
    });
    const {loading: loadingStages, error: errorStages, refetch: refetchStages} = useQuery(SEARCH_STAGES_QUERY, {
        variables: {search: autoCompleteStage}, onCompleted: (data) => setDataStages(data)
    });
    const {
        loading: loadingTypeProject, error: errorTypeProject, data: dataTypeProject
    } = useQuery(TYPES_PROJECTS_QUERY);

    const {
        loading: loadingDelegates, error: errorDelegates, data: dataDelegates
    } = useQuery(SEARCH_DELEGATES_OR_ORGANIZATION_QUERY, {
        variables: {searchOrganizationId: autoCompleteOrganization.id},
    });
    const {
        loading: loadingOrganizations, error: errorOrganizations, data: dataOrganizations
    } = useQuery(SEARCH_ORGANIZATIONS_QUERY, {
        variables: {searchOrganizations: autoCompleteOrganization.name},
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

    const addingIrds = (value) => {
        if (dataIrds && value) {
            console.log('addingIrds');

            const newIrds = value.templatesIrdsTypeProjects.map(a => ({
                id: a.ird ? a.ird.id : null, name: a.ird ? a.ird.name : null,
            }));

            refetchIrds({search: autoCompleteIrd}).then(({data}) => {
                const existingIrds = dataIrds.irdsTable ? dataIrds.irdsTable.irds : [];
                const updatedIrds = [...existingIrds, ...newIrds];
                setDataIrds({
                    ...dataIrds, irdsTable: {
                        ...dataIrds.irdsTable, irds: updatedIrds,
                    },
                });
            });
            console.log(dataIrds);
        }
    }

    const addingStages = (value) => {
        if (dataStages && value) {
            console.log('addingStages');


            const newStages = value.templatesStagesTypeProjects.map(a => ({
                id: a.stage ? a.stage.id : null, name: a.stage ? a.stage.name : null,
            }));

            refetchStages({search: autoCompleteStage}).then(({data}) => {
                const existingStages = dataStages.stagesTable ? dataStages.stagesTable.stages : [];
                const updatedStages = [...existingStages, ...newStages];
                setDataStages({
                    ...dataStages, stagesTable: {
                        ...dataStages.stagesTable, stages: updatedStages,
                    },
                });
            });
            console.log(dataStages);

        }
    }


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
            openNotification('topRight', 'error', 'Ошибка при обновлении данных: ' + error.message);
        }
    });

    // Обработчик отправки формы
    const handleSubmit = () => {
        //TODO: Прочитать 3 формы и вызвать 2 + 2 мутации


        if (editingProject) {
            updateProject({variables: {id: editingProject.id, ...form.getFieldsValue()}});
        } else {
            addProject({variables: form.getFieldsValue()});
        }
    };

    const loadTemplate = () => {
        if (dataTemplate) {
            const irds = dataTemplate && dataTemplate.templatesIrdsTypeProjects;

            const initialValuesIrds = irds && irds.map(data => ({
                ird_item: data.ird.id, stageNumber_item: data.stage_number, appNumber_item: data.application_to_project,
            }));

            formIRD.setFieldsValue({irdList: initialValuesIrds});

            const stages = dataTemplate && dataTemplate.templatesStagesTypeProjects;

            const initialValuesStages = stages && stages.map(data => ({
                stage_item: data.stage.id,
                percent_item: data.percentage,
            }));

            formStage.setFieldsValue({stageList: initialValuesStages});
        }
    };
    const addIrdsAndStages = (value) => {
        console.log('addIrdsAndStages');
        addingStages(value);
        addingIrds(value);
        console.log('loadTemplate');
        loadTemplate();
    }

    return (<>
        <StyledBlockLarge>
            <Row gutter={8} align="top">
                <Col span={8}>
                    <StyledBlockRegular label={'Проект'}>
                        <StyledFormRegular form={form} layout="vertical">
                            <StyledFormItem name="number" label="Номер проекта" rules={[{required: true}]}>
                                <Input/>
                            </StyledFormItem>
                            <StyledFormItem name="name" label="Наименование проекта" rules={[{required: true}]}>
                                <Input/>
                            </StyledFormItem>

                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <StyledFormItem name="organization_customer_id" label="Заказчик">
                                    <AutoComplete
                                        popupMatchSelectWidth={false}
                                        filterOption={false}
                                        options={dataOrganizations && dataOrganizations.organizationsTable && dataOrganizations.organizationsTable.organizations.map(organization => ({
                                            key: organization.id, value: organization.name, label: organization.name,
                                        }))}
                                        onChange={(value, option) => handleAutoCompleteOrganization(value, option)} // Передаем введенное значение
                                        onSelect={(value, option) => handleAutoCompleteOrganization(value, option)}
                                        placeholder="Начните ввод..."
                                    />
                                </StyledFormItem>
                                <StyledButtonForm style={{marginTop: 8}}
                                    onClick={() => setCostumerFormViewModalVisible(true)}>Создать
                                </StyledButtonForm>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <StyledFormItem name="delegate_id" label="Представитель компании">
                                    <Select
                                        popupMatchSelectWidth={false}
                                        style={{maxWidth: 249}}
                                        placeholder="По компаниям">
                                        {dataDelegates && dataDelegates.contactsTable && dataDelegates.contactsTable.contacts.map(delegate => (
                                            <Select.Option key={delegate.id}
                                                           value={delegate.id}>{delegate.last_name} {delegate.first_name} {delegate.patronymic}</Select.Option>))}
                                    </Select>
                                </StyledFormItem>

                                <StyledButtonGreen type={"dashed"} style={{marginTop: 8}}
                                                   onClick={() => setContactFormViewModalVisible(true)}>Создать</StyledButtonGreen>
                            </div>

                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <StyledFormItem name="type_project_document_id" label="Тип документа">
                                    <Select
                                        popupMatchSelectWidth={false}
                                        value={editingTypeProject}
                                        style={{minWidth: 122, maxWidth: 200}}
                                        onSelect={handleEditingTemplate}>
                                        {dataTypeProject && dataTypeProject.typeProjectsTable && dataTypeProject.typeProjectsTable.typeProjects.map(typeDocument => (
                                            <Option key={typeDocument.id}
                                                    value={typeDocument.id}>{typeDocument.name}</Option>))}
                                    </Select>
                                </StyledFormItem>
                                <StyledButtonGreen type={"dashed"}
                                                   style={{marginTop: 8}}
                                                   loading={loadingTemplate}
                                                   onClick={() =>         showConfirmTypeChangeModal(true)}>Сформировать</StyledButtonGreen>
                            </div>


                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <StyledFormItem name="facility_id" label="Объект">
                                    <Select
                                        popupMatchSelectWidth={false}
                                        style={{flex: 1}}
                                    >
                                        {dataAll && dataAll.facilitys && dataAll.facilitys.map(facility => (
                                            <Select.Option key={facility.id}
                                                           value={facility.id}>{facility.name}</Select.Option>))}
                                    </Select>
                                </StyledFormItem>
                                <StyledButtonGreen type={"dashed"} style={{marginTop: 8}}
                                                   onClick={() => setFacilityFormViewModalVisible(true)}>Создать</StyledButtonGreen>
                            </div>

                            <StyledFormItem name="date_signing" label="Дата подписания">
                                <DatePicker placeholder="Выберите дату"/>
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

                            <div style={{textAlign: 'center'}}>
                                <Space>
                                    <StyledButtonGreen type="dashed" onClick={handleSubmit}>
                                        Сохранить проект
                                    </StyledButtonGreen>
                                    <Button type="primary"
                                            onClick={() => setViewListProjectStageModalVisible(true)}>
                                        Список задач
                                    </Button>
                                </Space>
                            </div>
                        </StyledFormRegular>
                    </StyledBlockRegular>
                </Col>

                <Col span={16}>
                    <StyledBlockBig label={'Этапы'}>
                        <StyledFormBig form={formStage}>
                            <Form.List name="stageList">
                                {(fields, {add, remove}) => (<>
                                    {fields.map(({key, name, ...restField}) => (<Space
                                        key={key}
                                        style={{
                                            display: 'flex',
                                            marginBottom: 0,
                                            marginTop: 0
                                        }}
                                        align="baseline"
                                    >
                                        <Form.Item
                                            {...restField}
                                            style={{marginBottom: 0, display: 'flex'}}
                                            name={[name, 'stage_item']}
                                        >
                                            <Select
                                                style={{maxWidth: 260, minWidth: 260}}
                                                popupMatchSelectWidth={false}
                                                filterOption={false}
                                                onSearch={(value) => handleAutoCompleteStage(value)} // Передаем введенное значение
                                                onSelect={(value) => handleAutoCompleteStageSelect(value)}
                                                placeholder="Начните ввод..."
                                                allowClear
                                                showSearch
                                            >
                                                {dataStages && dataStages.stagesTable && dataStages.stagesTable.stages.map(stage => (
                                                    <Select.Option value={stage.id}>{stage.name}</Select.Option>))}
                                                {dataStages && dataStages.stagesTable && dataStages.stagesTable.stages && dataStages.stagesTable.stages.length === 0 && (
                                                    <Select.Option value="CREATE_NEW">Создать новый
                                                        этап?</Select.Option>)}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'date_start_item']}
                                            style={{marginBottom: 0, display: 'flex'}}
                                            rules={[{
                                                required: true, message: 'Missing last name',
                                            },]}
                                        >
                                            <DatePicker/>
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            style={{marginBottom: 0, display: 'flex'}}
                                            name={[name, 'date_end_item']}
                                            rules={[{
                                                required: true, message: 'Missing last name',
                                            },]}
                                        >
                                            <DatePicker/>
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            style={{marginBottom: 0, display: 'flex'}}
                                            name={[name, 'percent_item']}
                                            rules={[{
                                                required: true, message: 'Missing last name',
                                            },]}
                                        >
                                            <InputNumber/>
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)}/>
                                    </Space>))}
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block
                                                icon={<PlusOutlined/>}>
                                            Добавить элемент
                                        </Button>
                                    </Form.Item>
                                </>)}
                            </Form.List>
                        </StyledFormBig>

                    </StyledBlockBig>
                    <StyledBlockBig label={'ИРД'}>
                        <StyledFormBig form={formIRD} name="dynamic_form_nest_item" autoComplete="off">
                            <Form.List name="irdList">
                                {(fields, {add, remove}) => (<>
                                    {fields.map(({key, name, ...restField}) => (<Space
                                        key={key}
                                        style={{
                                            display: 'flex', marginBottom: 0, marginTop: 0
                                        }}
                                        align="baseline"
                                    >
                                        <Form.Item
                                            {...restField}
                                            style={{
                                                display: 'flex', marginBottom: 0, marginTop: 0
                                            }}
                                            name={[name, 'ird_item']}
                                        >
                                            <Select
                                                style={{maxWidth: 570, minWidth: 570, marginBottom: 0}}
                                                popupMatchSelectWidth={false}
                                                filterOption={false}
                                                placeholder="Начните ввод..."
                                                onSearch={(value) => handleAutoCompleteIrd(value)}
                                                onSelect={(value) => handleAutoCompleteIrdSelect(value)}
                                                allowClear
                                                showSearch
                                                loading={loadingIrds}
                                            >
                                                {dataIrds && dataIrds.irdsTable && dataIrds.irdsTable.irds && dataIrds.irdsTable.irds.map(ird => (
                                                    <Select.Option key={ird.id}
                                                                   value={ird.id}>
                                                        {ird.name}
                                                    </Select.Option>))}
                                                {dataIrds && dataIrds.irdsTable && dataIrds.irdsTable.irds && dataIrds.irdsTable.irds.length === 0 && (
                                                    <Select.Option value="CREATE_NEW">
                                                        Создать новый ИРД?
                                                    </Select.Option>)}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'isChecked']}
                                            valuePropName="dateComplite_item"
                                            style={{marginBottom: 0}}
                                        >
                                            <DatePicker
                                                status={"warning"}
                                                placeholder="Получено"/>
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
                        </StyledFormBig>
                    </StyledBlockBig>
                </Col>
            </Row>
        </StyledBlockLarge>
        <Modal
            open={contactFormViewModalVisible}
            onCancel={() => setContactFormViewModalVisible(false)}
            footer={null}
            onClose={handleContactFormView}
        >
            <ContactForm/>
        </Modal>
        {/* Заказчик */}
        <Modal
            open={costumerFormViewModalVisible}
            onCancel={() => setCostumerFormViewModalVisible(false)}
            footer={null}
            onClose={handleCostumerFormView}
        >
            <OrganizationForm/>

        </Modal>
        {/* Объект */}
        <Modal
            open={facilityFormViewModalVisible}
            onCancel={() => setFacilityFormViewModalVisible(false)}
            footer={null}
            onClose={handleFacilityFormView}
        >
            {/* Форма для добавления новых данных */}
            {/* ... */}
        </Modal>

        {/* Список задач (ВСЕХ) */}
        <Modal
            open={viewListProjectStageModalVisible}
            onCancel={() => setViewListProjectStageModalVisible(false)}
            footer={null}
            onClose={handleViewListProjectStage}
        >
        </Modal>
        <Modal
            open={confirmTypeChangeModalVisible}
            title="Подтверждение изменения типа документа"
            onCancel={() => handleConfirmTypeChange(false)}
            onOk={() => handleConfirmTypeChange(true)}
            okText="Да"
            cancelText="Отмена"
        >
            <p>Вы уверены, что хотите изменить выбранный тип документа?</p>
        </Modal>
    </>);
};

export default ProjectForm;
