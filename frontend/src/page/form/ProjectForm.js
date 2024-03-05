import React, {useEffect, useState} from 'react';
import {
    Form, Input, Button, Select, InputNumber, Col, Row, notification, Modal, Space, AutoComplete, Cascader,
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
    SEARCH_DELEGATES_OR_ORGANIZATION_QUERY, SEARCH_ORGANIZATIONS_QUERY,
} from "../../graphql/queriesSearch";
import {StyledBlockBig, StyledBlockLarge, StyledBlockRegular} from "../style/BlockStyles";
import {StyledButtonGreen} from "../style/ButtonStyles";
import IrdsProjectForm from "../component/IrdsProjectForm";
import StagesProjectForm from "../component/StagesProjectForm";
import dayjs from "dayjs";

const {Option} = Select;

const ProjectForm = ({ project, setProject, onClose, onSubmit}) => {
    const [ editingProject, setEditingProject] = useState(null);

    // Состояния
    const [form] = Form.useForm();
    const [editingPrice, setEditingPrice] = useState(0);


    const [selectedTypeProject, setSelectedTypeProject] = useState(null);

    const [cascaderFacility, setCascaderFacility] = useState(null);
    const [contactFormViewModalVisible, setContactFormViewModalVisible] = useState(false);

    const [autoCompleteOrganization, setAutoCompleteOrganization] = useState('');
    const [selectedOrganization, setSelectedOrganization] = useState('')
    const [autoCompleteContacts, setAutoCompleteContacts] = useState('');
    const [autoCompleteTypeProjects, setAutoCompleteTypeProjects] = useState('');
    const [costumerFormViewModalVisible, setCostumerFormViewModalVisible] = useState(false);
    const [facilityFormViewModalVisible, setFacilityFormViewModalVisible] = useState(false);

    const handleContactFormView = () => {
        setContactFormViewModalVisible(false);
    };
    const handleCostumerFormView = () => {
        setCostumerFormViewModalVisible(false);
    };
    const handleFacilityFormView = () => {
        setFacilityFormViewModalVisible(false);
    };
    const handleAutoCompleteContacts = (value) => {
        setAutoCompleteContacts(value)
    };
    const handleAutoCompleteOrganizations = (value) => {
        setAutoCompleteOrganization(value)
    };
    const handleAutoCompleteTypeProjects = (value) => {
        setAutoCompleteTypeProjects(value)
    };

    // Подсчёт даты
    const [dateSigning, setDateSigning] = useState(null);
    const [duration, setDuration] = useState(null);
    const [dateEnd, setDateEnd] = useState(null);
    const handleDateSigningChange = (value) => {
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
        variables: {searchOrganizationId: selectedOrganization},
    });
    const {
        loading: loadingOrganizations, error: errorOrganizations, data: dataOrganizations
    } = useQuery(SEARCH_ORGANIZATIONS_QUERY, {
        variables: {searchOrganizations: autoCompleteOrganization},
    });

    // Заполнение формы данными контакта при его редактировании
    useEffect(() => {
        if (editingProject) {
            save(editingProject);
            form.setFieldsValue({
                ...editingProject,
                date_signing: editingProject.date_signing ? moment(editingProject.date_signing, 'YYYY-MM-DD') : null,
                date_end: editingProject.date_end ? moment(editingProject.date_end, 'YYYY-MM-DD') : null,
                date_completion: editingProject.date_completion ? moment(editingProject.date_completion, 'YYYY-MM-DD') : null,
                organization_customer_id: editingProject.organization_customer ? editingProject.organization_customer.id : null,
                delegate_id: editingProject.delegate ? editingProject.delegate.id : null,
                type_project_document_id: editingProject.type_project_document ? editingProject.type_project_document.id : null,
                facility_id: editingProject.facility ? editingProject.facility.id : null,
                status_id: editingProject.status ? editingProject.status.id : null,
            });

        }
    }, [editingProject, form]);
    // Мутации для добавления и обновления
    const [addProject] = useMutation(ADD_PROJECT_MUTATION, {
        refetchQueries: [{query: PROJECT_QUERY}], onCompleted: (data) => {
            save(data);
            setProject(data);
            openNotification('topRight', 'success', 'Данные успешно добавлены!');
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных: ' + error.message);
        }
    });
    const [updateProject] = useMutation(UPDATE_PROJECT_MUTATION, {
        refetchQueries: [{query: PROJECT_QUERY}], onCompleted: (data) => {
            openNotification('topRight', 'success', 'Данные успешно обновлены!');
            save(data);
            setProject(data);
            onClose();
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных: ' + error.message);
        }
    });
    const save = (data) => {
        setEditingProject(data);
    }

    const sortFacilitysForCascader = (data) => {
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
            addProject({variables: {...form.getFieldsValue(), organization_customer_id: selectedOrganization}});
        }
        if(onSubmit){
            onSubmit(true);
        }
    };

    if (errorAll || errorAll || errorTypeProject || errorDelegates || errorOrganizations) return <>Ошибка загрузки
        данных</>
    return (<>
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
                                    <Select
                                        popupMatchSelectWidth={false}
                                        allowClear
                                        showSearch
                                        onSelect={(value) => setSelectedOrganization(value)}
                                        filterOption={false}
                                        loading={loadingOrganizations}
                                        placeholder="Начните ввод..."
                                        onSearch={(value) => handleAutoCompleteOrganizations(value)}

                                    >

                                    {dataOrganizations && dataOrganizations.organizationsTable && dataOrganizations.organizationsTable.organizations.map(organization => (
                                    <Select.Option key={organization.id}
                                                     value={organization.id}>{organization.name}</Select.Option>))}
                                </Select>
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
                                        allowClear
                                        showSearch
                                        mode="multiple"
                                        filterOption={false}
                                        placeholder="По компаниям"
                                        onSearch={(value) => handleAutoCompleteContacts(value)}
                                        loading={loadingDelegates}>
                                        {dataDelegates && dataDelegates.contactsTable && dataDelegates.contactsTable.contacts.map(delegate => (
                                            <Select.Option key={delegate.id}
                                                           value={delegate.id}>{delegate.last_name} {delegate.first_name} {delegate.patronymic}</Select.Option>))}
                                    </Select>
                                </StyledFormItem>
                                <StyledButtonGreen type={"dashed"} icon={<PlusOutlined/>}
                                                   onClick={() => setContactFormViewModalVisible(true)}/>

                            </Space.Compact>
                            <StyledFormItem name="type_project_document_id" label="Тип документа">
                                <Select
                                    popupMatchSelectWidth={false}
                                    allowClear
                                    showSearch
                                    filterOption={false}

                                    value={selectedTypeProject}
                                    loading={loadingTypeProject}
                                    placeholder="Начните ввод..."
                                    onSearch={(value) => handleAutoCompleteTypeProjects(value)}
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
                                        popupMatchSelectWidth={false}
                                        style={{width: '100%'}}
                                        options={cascaderFacility}
                                        multiple
                                        expandTrigger="hover"
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
                                    parser={value => `${value}`.replace(/[^0-9]/g, '')}
                                    onChange={(value) => setEditingPrice(value)}/>
                            </StyledFormItem>
                            <div style={{textAlign: 'center'}}>
                                <Space>
                                    <StyledButtonGreen style={{marginBottom: 0}} type="dashed" onClick={handleSubmit}>
                                        Сохранить проект
                                    </StyledButtonGreen>
                                </Space>
                            </div>

                        </StyledFormRegular>
                    </StyledBlockRegular>
        <Modal
            open={contactFormViewModalVisible}
            onCancel={() => setContactFormViewModalVisible(false)}
            footer={null}
            onClose={handleContactFormView}
        >
            <ContactForm/>
        </Modal>
        <Modal
            open={costumerFormViewModalVisible}
            onCancel={() => setCostumerFormViewModalVisible(false)}
            footer={null}
            onClose={handleCostumerFormView}
        >
            <OrganizationForm/>
        </Modal>
        </>)
};

export default ProjectForm;
