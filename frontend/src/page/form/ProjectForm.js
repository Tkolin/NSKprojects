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
    AutoComplete,
    Cascader,
    Carousel
} from 'antd';
import {useMutation, useQuery} from '@apollo/client';
import {PROJECT_QUERY, TYPES_PROJECTS_QUERY} from '../../graphql/queries';
import {PROJECT_FORM_QUERY} from '../../graphql/queriesGroupData';
import {
    ADD_PROJECT_MUTATION, UPDATE_IRDS_TO_PROJECT_MUTATION, UPDATE_PROJECT_MUTATION, UPDATE_STAGES_TO_PROJECT_MUTATION,
} from '../../graphql/mutationsProject';
import {
    StyledFormBig, StyledFormItem, StyledFormRegular
} from '../style/FormStyles';
import {DatePicker} from "antd/lib";
import {MinusCircleOutlined, PlusOutlined, SwapOutlined} from '@ant-design/icons';
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
import {UPDATE_STAGES_TEMPLATE_MUTATION} from "../../graphql/mutationsTemplate";
import TasksProjectExecutorTable from "../component/TasksProjectExecutorTable";
import IrdsProjectForm from "../component/IrdsProjectForm";
import StagesProjectForm from "../component/StagesProjectForm";

const {Option} = Select;
const {RangePicker} = DatePicker;
const ProjectForm = ({project, onClose}) => {

    // Состояния
    const [form] = Form.useForm();
    const [formTasks] = Form.useForm();
    const [formContents] = Form.useForm();
    const [formStage] = Form.useForm();
    const [projectTypeDocument, setProjectTypeDocument] = useState(null);
    const [editingProject, setEditingProjcet] = useState(null);
    const [autoCompleteOrganization, setAutoCompleteOrganization] = useState({id: '', name: ''});

    const [typeProjectFormViewModalVisible, setTypeProjectFormViewModalVisible] = useState(false);

    const [stageFormViewModalVisible, setStageFormViewModalVisible] = useState(false);
    const [confirmTypeChangeModalVisible, setConfirmTypeChangeModalVisible] = useState(false);
    const [costumerFormViewModalVisible, setCostumerFormViewModalVisible] = useState(false);
    const [contactFormViewModalVisible, setContactFormViewModalVisible] = useState(false);
    const [facilityFormViewModalVisible, setFacilityFormViewModalVisible] = useState(false);
    const [viewListProjectStageModalVisible, setViewListProjectStageModalVisible] = useState(false);

    const [editingTypeProject, setEditingTypeProject] = useState(null);


    const [autoCompleteStage, setAutoCompleteStage] = useState('');

    const [selectedTypeProject, setSelectedTypeProject] = useState(null);

    const handleAutoCompleteOrganization = (value, option) => {
        setAutoCompleteOrganization({id: option.key, name: value});
        console.log(autoCompleteOrganization.id);
    };


    const handleAutoCompleteStageSelect = (value) => {
        if (value == 'CREATE_NEW') {
            setIrdFormViewModalVisible(true);
            setAutoCompleteIrd('');
        } else {
            setAutoCompleteIrd('');
        }
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
            setEditingTypeProject(selectedTypeProject);
        }
        setConfirmTypeChangeModalVisible(false);
    };

    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message, placement,
        });
    };

    // Получение данных для выпадающих списков
    const [dataStages, setDataStages] = useState(null);

    const {loading: loadingAll, error: errorAll, data: dataAll} = useQuery(PROJECT_FORM_QUERY);

    const {
        loading: loadingTemplate, error: errorTemplate, data: dataTemplate
    } = useQuery(SEARCH_TEMPLATE_OR_TYPE_PROJECT_QUERY, {
        variables: {typeProject: editingTypeProject},
        fetchPolicy: 'network-only',
        onCompleted: (data) => addIrdsAndStages(data),
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


    const [updateStagesToProject] = useMutation(UPDATE_STAGES_TO_PROJECT_MUTATION, {
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

        if (editingProject) {
            updateProject({
                variables: {
                    id: editingProject.id, ...form.getFieldsValue(),
                    organization_customer_id: autoCompleteOrganization.id
                }
            });
        } else {
            addProject({variables: {...form.getFieldsValue(), organization_customer_id: autoCompleteOrganization.id}});
        }
        //TODO: Прочитать 3 формы и вызвать 2 + 2 мутации


    };

    const loadTemplate = () => {
        if (dataTemplate) {


            const stages = dataTemplate && dataTemplate.templatesStagesTypeProjects;

            const initialValuesStages = stages && stages.map(data => ({
                stage_item: data.stage.id,
                percent_item: data.percentage,
            }));

            formStage.setFieldsValue({stageList: initialValuesStages});
        }
    };
    const addIrdsAndStages = (value) => {
        addingStages(value);
        addingIrds(value);
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
                            <Space.Compact block style={{alignItems: 'flex-end'}}>
                                <StyledFormItem name="organization_customer_id" label="Заказчик"
                                                style={{
                                                    width: '90%',
                                                }}>

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
                                <StyledButtonGreen icon={<PlusOutlined/>}
                                                   onClick={() => setCostumerFormViewModalVisible(true)}/>


                            </Space.Compact>
                            <Space.Compact block style={{alignItems: 'flex-end'}}>
                                <StyledFormItem name="delegate_id"
                                                label="Представитель компании"
                                                style={{
                                                    width: '90%',
                                                }}>
                                    <Select
                                        popupMatchSelectWidth={false}
                                        placeholder="По компаниям">
                                        {dataDelegates && dataDelegates.contactsTable && dataDelegates.contactsTable.contacts.map(delegate => (
                                            <Select.Option key={delegate.id}
                                                           value={delegate.id}>{delegate.last_name} {delegate.first_name} {delegate.patronymic}</Select.Option>))}
                                    </Select>
                                </StyledFormItem>
                                <StyledButtonGreen type={"dashed"} icon={<PlusOutlined/>}
                                                   onClick={() => setContactFormViewModalVisible(true)}/>

                            </Space.Compact>
                            <Space.Compact block style={{alignItems: 'flex-end'}}>
                                <StyledFormItem name="type_project_document_id" label="Тип документа"
                                                style={{
                                                    width: '90%',
                                                }}>
                                    <Select
                                        popupMatchSelectWidth={false}
                                        value={selectedTypeProject}
                                        onSelect={handleEditingTemplate}>
                                        {dataTypeProject && dataTypeProject.typeProjectsTable && dataTypeProject.typeProjectsTable.typeProjects.map(typeDocument => (
                                            <Option key={typeDocument.id}
                                                    value={typeDocument.id}>{typeDocument.name}</Option>))}
                                    </Select>
                                </StyledFormItem>
                                <StyledButtonGreen type={"dashed"} icon={<SwapOutlined/>}
                                                   loading={loadingTemplate}
                                                   onClick={() => showConfirmTypeChangeModal(true)}/>
                            </Space.Compact>
                            <Space.Compact block style={{alignItems: 'flex-end'}}>
                                <StyledFormItem name="facility_id" label="Объект"
                                                style={{
                                                    width: '90%',
                                                }}>

                                    <Select
                                        popupMatchSelectWidth={false}>
                                        {dataAll && dataAll.facilitys && dataAll.facilitys.map(facility => (
                                            <Select.Option key={facility.id}
                                                           value={facility.id}>{facility.name}</Select.Option>))}
                                    </Select>
                                </StyledFormItem>
                                <StyledButtonGreen type={"dashed"} icon={<PlusOutlined/>}
                                                   onClick={() => setFacilityFormViewModalVisible(true)}/>


                            </Space.Compact>

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
                    <StyledBlockBig label={'Генерация договоров с исполнителем'}>
                        <StagesProjectForm />
                    </StyledBlockBig>


                    <StyledBlockBig label={'Генерация договоров с исполнителем'}>
                        <IrdsProjectForm />
                    </StyledBlockBig>


                    <StyledBlockBig label={'Генерация договоров с исполнителем'}>
                        <TasksProjectExecutorTable typeProjectId={selectedTypeProject}/>
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
