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
    AutoComplete, Cascader,
} from 'antd';
import {useMutation, useQuery} from '@apollo/client';
import {PROJECT_QUERY, TYPES_PROJECTS_QUERY} from '../../graphql/queries';
import {PROJECT_FORM_QUERY} from '../../graphql/queriesGroupData';
import {
    ADD_PROJECT_MUTATION, UPDATE_PROJECT_MUTATION,
} from '../../graphql/mutationsProject';
import {
    StyledFormItem, StyledFormRegular
} from '../style/FormStyles';
import {DatePicker} from "antd/lib";
import {PlusOutlined} from '@ant-design/icons';
import OrganizationForm from "./OrganizationForm";
import moment from 'moment';
import ContactForm from "./ContactForm";
import {
    SEARCH_DELEGATES_OR_ORGANIZATION_QUERY,
    SEARCH_ORGANIZATIONS_QUERY,
} from "../../graphql/queriesSearch";
import {StyledBlockBig, StyledBlockLarge, StyledBlockRegular} from "../style/BlockStyles";
import {StyledButtonGreen} from "../style/ButtonStyles";
import IrdsProjectForm from "../component/IrdsProjectForm";
import StagesProjectForm from "../component/StagesProjectForm";
import dayjs from "dayjs";

const {Option} = Select;

const ProjectForm = ({project, onClose}) => {

    // Состояния
    const [form] = Form.useForm();
    const [editingProject, setEditingProjcet] = useState(null);
    const [autoCompleteOrganization, setAutoCompleteOrganization] = useState({id: '', name: ''});

    const [costumerFormViewModalVisible, setCostumerFormViewModalVisible] = useState(false);
    const [contactFormViewModalVisible, setContactFormViewModalVisible] = useState(false);
    const [facilityFormViewModalVisible, setFacilityFormViewModalVisible] = useState(false);
    const [viewListProjectStageModalVisible, setViewListProjectStageModalVisible] = useState(false);
    const [selectedTypeProject, setSelectedTypeProject] = useState(null);

    const [triggerSaveStages, setTriggerSaveStages] = useState(false);
    const [triggerTotalToPayStages, setTriggertriggerTotalToPayStages] = useState(0);
/*    const [triggerSaveIrds, setTriggerSaveIrds] = useState(false);
    const [triggerSaveTasks, setTriggerSaveTasks] = useState(false)*/
    const [cascaderFacility, setCascaderFacility] = useState(null);


    const handleEditingPrice = (value) => {
        if (!isNaN(value)) {
            setTriggertriggerTotalToPayStages(+value); // Преобразуйте строку в число с помощью унарного плюса
        }
    };

    const handleAutoCompleteOrganization = (value, option) => {
        setAutoCompleteOrganization({id: option.key, name: value});
    };

    // Подсчёт даты
    const [dateSigning, setDateSigning] = useState(null);
    const [duration, setDuration] = useState(null);
    const [dateEnd, setDateEnd] = useState(null);

    const handleDateSigningChange = (value) => {
        console.log(value);
        setDateSigning(value);
        calculateEndDate(value, duration);
    };

    const handleDurationChange = (value) => {
        if (!isNaN(value)) {
            setDuration(value);
            calculateEndDate(dateSigning, value);
        }
    };

    const handleDateEndChange = (value) => {
        setDateEnd(value);
        calculateDuration(dateSigning, value);
    };

    const calculateEndDate = (dateSigning, duration) => {
        if (dateSigning && duration) {
            const endDate = dayjs(dateSigning).add(duration, 'day');
            form.setFieldsValue({date_end: endDate});
            setDateEnd(endDate);
        }
    };

    const calculateDuration = (dateSigning, dateEnd) => {
        if (dateSigning && dateEnd) {
            const duration = dayjs(dateEnd).diff(dateSigning, 'days');
            form.setFieldsValue({duration: duration});
            setDuration(duration);
        }
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

    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message, placement,
        });
    };


    // Получение данных для выпадающих списков
    const {loading: loadingAll, error: errorAll, data: dataAll} = useQuery(PROJECT_FORM_QUERY, {
        onCompleted: (data) => setCascaderFacility(sortFacilitysForCascader(data))
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
    // Мутации для добавления и обновления
    const [addProject] = useMutation(ADD_PROJECT_MUTATION, {
        refetchQueries: [{query: PROJECT_QUERY}],
        onCompleted: (data) => {
            openNotification('topRight', 'success', 'Данные успешно добавлены!');
            setEditingProjcet(data);
/*            setTriggerSaveStages(true);
            setTriggerSaveTasks(true);
            setTriggerSaveIrds(true);*/
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

    const sortFacilitysForCascader = (data) => {
        // Группируем facilitys по type_facility
        const groupedFacilitys = data.facilitys.reduce((acc, facility) => {
            const {id, name, type_facility} = facility;
            const {id: typeId, name: typeName} = type_facility;

            if (!acc[typeId]) {
                acc[typeId] = {value: typeId, label: typeName, children: []};
            }
            acc[typeId].children.push({value: id, label: name});

            return acc;
        }, {});

        // Преобразуем объект в массив и сортируем по названию type_facility
        const sortedOptions = Object.values(groupedFacilitys).sort((a, b) => {
            return a.label.localeCompare(b.label);
        });

        return sortedOptions;
    };

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
    };

    if(errorAll || errorAll || errorTypeProject || errorDelegates|| errorOrganizations)
        return <>Ошибка загрузки данных</>
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
                                        loading={loadingOrganizations}
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
                                        placeholder="По компаниям"
                                        loading={loadingDelegates}>
                                        {dataDelegates && dataDelegates.contactsTable && dataDelegates.contactsTable.contacts.map(delegate => (
                                            <Select.Option key={delegate.id}
                                                           value={delegate.id}>{delegate.last_name} {delegate.first_name} {delegate.patronymic}</Select.Option>))}
                                    </Select>
                                </StyledFormItem>
                                <StyledButtonGreen type={"dashed"} icon={<PlusOutlined/>}
                                                   onClick={() => setContactFormViewModalVisible(true)}/>

                            </Space.Compact>

                            <StyledFormItem name="type_project_document_id" label="Тип документа"
                            >
                                <Select
                                    popupMatchSelectWidth={false}
                                    value={selectedTypeProject}
                                    loading={loadingTypeProject}
                                    onSelect={handleEditingTemplate}>
                                    {dataTypeProject && dataTypeProject.typeProjectsTable && dataTypeProject.typeProjectsTable.typeProjects.map(typeDocument => (
                                        <Option key={typeDocument.id}
                                                value={typeDocument.id}>{typeDocument.name}</Option>))}
                                </Select>
                            </StyledFormItem>

                            <Space.Compact block style={{alignItems: 'flex-end'}}>
                                <StyledFormItem name="facility_id" label="Объект"
                                                style={{
                                                    width: '90%',
                                                }}>
                                    <Cascader
                                        style={{width: '100%'}}
                                        options={cascaderFacility}
                                        multiple
                                        expandTrigger="hover" // Или "click"

                                        maxTagCount="responsive"
                                    />

                                </StyledFormItem>
                                <StyledButtonGreen type={"dashed"} icon={<PlusOutlined/>}
                                                   onClick={() => setFacilityFormViewModalVisible(true)}/>
                            </Space.Compact>
                            <Space.Compact block style={{alignItems: 'flex-end'}}>
                            <StyledFormItem name="date_signing" label="Дата подписания">
                                <DatePicker placeholder="Выберите дату"
                                            onChange={(value) => handleDateSigningChange(value)}/>
                            </StyledFormItem>
                            <StyledFormItem name="duration" label="Срок" style={{width: '15%'}}>
                                <InputNumber
                                    formatter={(value) => `${value}`.replace(/[^0-9]/g, '')}
                                    parser={(value) => `${value}`.replace(/[^0-9]/g, '')}
                                    style={{width: '100%'}}
                                    // Удаляем все символы, кроме цифр
                                    onChange={(value) => handleDurationChange(value)}
                                />
                            </StyledFormItem>
                            <StyledFormItem name="date_end" label="Дата окончания">
                                <DatePicker minDate={dateSigning}
                                            style={{width: '100%'}}

                                            placeholder="Выберите дату" onChange={handleDateEndChange}/>
                            </StyledFormItem>
                            </Space.Compact>
                            <StyledFormItem name="status_id" label="Статус проекта">
                                <Select loading={loadingAll}>
                                    {dataAll && dataAll.projectStatuses && dataAll.projectStatuses.map(status => (
                                        <Select.Option key={status.id}
                                                       value={status.id}>{status.name}</Select.Option>))}
                                </Select>
                            </StyledFormItem>
                            <StyledFormItem name="price" label="Стоимость">
                                <InputNumber
                                    formatter={value => `${value}`.replace(/[^0-9]/g, '')}
                                    parser={value => `${value}`.replace(/[^0-9]/g, '')} // Удаляем все символы, кроме цифр

                                    onChange={(value) => handleEditingPrice(value)}/>
                            </StyledFormItem>
                            <div style={{textAlign: 'center'}}>
                                <Space>
                                    <StyledButtonGreen style={{marginBottom: 0}} type="dashed" onClick={handleSubmit}>
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
                        <StagesProjectForm totalToPay={triggerTotalToPayStages}
                                           dateStart={dateSigning}
                                           dateEnd={dateEnd}
                                           triggerMethod={triggerSaveStages}
                                           setTriggerMethod={setTriggerSaveStages}
                                           typeProjectId={selectedTypeProject}
                                           projectId={editingProject && editingProject.id}/>
                    </StyledBlockBig>
                    <StyledBlockBig label={'ИРД'}>
                        <IrdsProjectForm triggerMethod={triggerSaveStages} setTriggerMethod={setTriggerSaveStages}
                                         typeProjectId={selectedTypeProject}
                                         projectId={editingProject && editingProject.id}/>
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
        </Modal>        {/* Список задач (ВСЕХ) */}
    </>);
};

export default ProjectForm;
