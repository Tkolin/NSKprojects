import React, {useEffect, useState} from 'react';
import {
    Form, Input, Select, InputNumber, notification, Modal, Space, Cascader,
} from 'antd';
import {useMutation, useQuery} from '@apollo/client';
import {
    PROJECTS_QUERY,
    PROJECT_STATUSES_QUERY,
    TYPES_PROJECTS_QUERY,
    ORGANIZATIONS_SHORT_QUERY, CONTACTS_SHORT_QUERY, FACILITYS_QUERY
} from '../../../graphql/queries';
import {
    ADD_PROJECT_MUTATION, UPDATE_PROJECT_MUTATION,
} from '../../../graphql/mutationsProject';
import {
    StyledFormItem, StyledFormRegular
} from '../../style/FormStyles';
import {DatePicker} from "antd/lib";
import {PlusOutlined} from '@ant-design/icons';
import OrganizationForm from "./OrganizationForm";
import moment from 'moment';
import ContactForm from "./ContactForm";
import {StyledButtonGreen} from "../../style/ButtonStyles";

import dayjs from "dayjs";

const {Option} = Select;
const {SHOW_CHILD} = Cascader;

const ProjectForm = ({project, setProject, onClose, onSubmit}) => {
    const [editingProject, setEditingProject] = useState(null);
    // Заполнение формы данными контакта при его редактировании
    useEffect(() => {
        if(project){
            console.log("Редачение");
            setEditingProject(project)
        }
    }, [project]);
    // Состояния

    const [form] = Form.useForm();
    const [selectedTypeProject, setSelectedTypeProject] = useState(null);
    const [cascaderFacility, setCascaderFacility] = useState(null);
    const [contactFormViewModalVisible, setContactFormViewModalVisible] = useState(false);
    const [autoCompleteOrganization, setAutoCompleteOrganization] = useState('');
    const [selectedOrganization, setSelectedOrganization] = useState('')
    const [autoCompleteTypeProjects, setAutoCompleteTypeProjects] = useState('');
    const [costumerFormViewModalVisible, setCostumerFormViewModalVisible] = useState(false);
    const [projectNumber, setProjectNumber] = useState('');
    const handleContactFormView = () => {setContactFormViewModalVisible(false);};
    const handleCostumerFormView = () => {setCostumerFormViewModalVisible(false);};
    const handleAutoCompleteOrganizations = (value) => {setAutoCompleteOrganization(value)};
    const handleAutoCompleteTypeProjects = (value) => {setAutoCompleteTypeProjects(value)};

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
    const shortenString = (str) => {
        const words = str.split(' ');
        const filteredWords = words.filter(word => word.length > 1 && !word.includes('(') && !word.includes(')'));
        const abbreviation = filteredWords.map(word => word.charAt(0)).join('');
        return abbreviation.toUpperCase();
    };

    const handleEditingTemplate = (value, option) =>
    {
        const createNumber = shortenString(option.children);
        setSelectedTypeProject(value);
        setProjectNumber(createNumber);
        form.setFieldsValue({
            number: createNumber});
        console.log(shortenString(option.children));
    };

    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message, placement,
        });
    };

    // Получение данных для выпадающих списков
    const {loading: loadingFacility} = useQuery(FACILITYS_QUERY, {
        onCompleted: (data) => setCascaderFacility(sortFacilitysForCascader(data))
    });
    const {loading: loadingStatuses, error: errorStatuses, data: dataStatuses} = useQuery(PROJECT_STATUSES_QUERY);
    const {
        loading: loadingTypeProject, error: errorTypeProject, data: dataTypeProject
    } = useQuery(TYPES_PROJECTS_QUERY, {
        variables: {queryOptions: {limit: 10, page: 1, search: autoCompleteTypeProjects}}
    });

    const {
        loading: loadingDelegates, error: errorDelegates, data: dataDelegates
    } = useQuery(CONTACTS_SHORT_QUERY, {
        variables: {organizationId: selectedOrganization},
    });
    const {
        loading: loadingOrganizations, error: errorOrganizations, data: dataOrganizations
    } = useQuery(ORGANIZATIONS_SHORT_QUERY, {
        variables: {queryOptions: {limit: 10, page: 1, search: autoCompleteOrganization}}
    });

    // Мутации для добавления и обновления
    const [addProject] = useMutation(ADD_PROJECT_MUTATION, {
        refetchQueries: [{query: PROJECTS_QUERY}], onCompleted: (data) => {
            save(data);
            setProject(data.addProject);

            if (onSubmit) {
                onSubmit(true);
            }
            openNotification('topRight', 'success', 'Данные успешно добавлены!');
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных: ' + error.message);
        }
    });
    const [updateProject] = useMutation(UPDATE_PROJECT_MUTATION, {
        refetchQueries: [{query: PROJECTS_QUERY}], onCompleted: (data) => {
            openNotification('topRight', 'success', 'Данные успешно обновлены!');
            save(data);
            setProject(data.updateProject);

            if (onSubmit) {
                onSubmit(true);
            }
            if(onClose) onClose();
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных: ' + error.message);
        }
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
                organization_customer_id: editingProject?.organization_customer?.id ?? null,
                //TODO: delegate_id: тут масив ключей
                type_project_document_id: editingProject?.type_project_document?.id ?? null,
                //TODO: facility_id: тут ключ пара родитель-дочерний
                status_id: editingProject?.status?.id ?? null,
            });

        }
    }, [editingProject, form]);

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
                    data: {
                        ...form.getFieldsValue(),
                        facilitys_id: form.getFieldValue('facilitys_id') ? form.getFieldValue('facilitys_id').map(pair => pair[1]) : null,
                        id: editingProject?.id,
                        organization_customer_id: autoCompleteOrganization?.id
                    }
                }
            });
        } else {
            addProject({
                variables: {
                    data: {
                        ...form.getFieldsValue(),
                        facilitys_id: form.getFieldValue('facilitys_id') ? form.getFieldValue('facilitys_id').map(pair => pair[1]) : null,
                        organization_customer_id: selectedOrganization
                    }
                }
            });
        }

    };


    return (<>
        <StyledFormRegular form={form} layout="vertical">
            <StyledFormItem name="number"  label="Номер проекта" rules={[{required: true}]}>
                <Input     defaultValue={projectNumber}  value={projectNumber} ></Input>
            </StyledFormItem>
            <StyledFormItem name="name" label="Наименование проекта" rules={[{required: true}]}>
                <Input/>
            </StyledFormItem>
            <Space.Compact style={{width: "calc(100% + 32px)", alignItems: 'flex-end'}}>
                <StyledFormItem name="organization_customer_id" label="Заказчик"
                                style={{width: "calc(100% - 32px)" }}>

                <Select
                    style={{width: "calc(100% - 32px)"}}

                    popupMatchSelectWidth={false}
                        allowClear
                        showSearch
                        onSelect={(value) => setSelectedOrganization(value)}
                        filterOption={false}
                        loading={loadingOrganizations}
                        placeholder="Начните ввод..."
                        onSearch={(value) => handleAutoCompleteOrganizations(value)}
                    >
                        {dataOrganizations?.organizations?.items?.map(row => (
                            <Select.Option key={row.id}
                                           value={row.id}>{row.name}</Select.Option>))}
                    </Select>
                </StyledFormItem>
                <StyledButtonGreen style={{marginLeft: "-32px"}} icon={<PlusOutlined/>}
                                   onClick={() => setCostumerFormViewModalVisible(true)}/>
            </Space.Compact>
            <Space.Compact style={{width: "calc(100% + 32px)", alignItems: 'flex-end'}}>
                <StyledFormItem name="delegates_id"
                                label="Представитель компании"
                                style={{width: "calc(100% - 32px)" }}>
                    <Select
                        style={{width: "calc(100% - 32px)"}}
                        popupMatchSelectWidth={false}
                        allowClear
                        showSearch
                        mode="multiple"
                        filterOption={false}
                        placeholder="По компаниям"
                        loading={loadingDelegates}>
                        {dataDelegates?.contacts?.items?.map(row => (
                            <Select.Option key={row.id}
                                           value={row.id}>{row.last_name} {row.first_name} {row.patronymic}</Select.Option>))}
                    </Select>
                </StyledFormItem>
                <StyledButtonGreen style={{marginLeft: "-32px"}} type={"dashed"} icon={<PlusOutlined/>}
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
                    onSelect={(value, option) => handleEditingTemplate(value, option)}>
                    {dataTypeProject?.typeProjects?.items?.map(typeDocument => (
                        <Option key={typeDocument.id}
                                value={typeDocument.id}>{typeDocument.name}</Option>))}
                </Select>
            </StyledFormItem>
            <Space.Compact style={{width: "calc(100% + 32px)", alignItems: 'flex-end'}}>
                <StyledFormItem name="facilitys_id" label="Объект"
                                style={{width: "calc(100% - 32px)" }}>

                <Cascader
                    style={{width: "100%"}}

                    showCheckedStrategy={SHOW_CHILD}
                        popupMatchSelectWidth={false}
                            options={cascaderFacility}
                        multiple
                        expandTrigger="hover"
                        maxTagCount="responsive"
                    />
                </StyledFormItem>
            </Space.Compact>
            {/*<Space.Compact block style={{alignItems: 'flex-end'}}>*/}
            {/*    <StyledFormItem name="date_signing" label="Дата подписания">*/}
            {/*        <DatePicker placeholder="Выберите дату"*/}
            {/*                    onChange={(value) => handleDateSigningChange(value)}/>*/}
            {/*    </StyledFormItem>*/}
            {/*    <StyledFormItem name="duration" label="Срок" style={{width: '15%'}}>*/}
            {/*        <InputNumber*/}
            {/*            formatter={(value) => `${value}`.replace(/[^0-9]/g, '')}*/}
            {/*            parser={(value) => `${value}`.replace(/[^0-9]/g, '')}*/}
            {/*            style={{width: '100%'}}*/}
            {/*            onChange={(value) => handleDurationChange(value)}*/}
            {/*        />*/}
            {/*    </StyledFormItem>*/}
            {/*    <StyledFormItem name="date_end" label="Дата окончания">*/}
            {/*        <DatePicker minDate={dateSigning}*/}
            {/*                    style={{width: '100%'}}*/}

            {/*                    placeholder="Выберите дату" onChange={handleDateEndChange}/>*/}
            {/*    </StyledFormItem>*/}
            {/*</Space.Compact>*/}
            <StyledFormItem name="status_id" label="Статус проекта">
                <Select loading={loadingStatuses}>
                    {dataStatuses?.projectStatuses?.map(status => (
                        <Select.Option key={status.id}
                                       value={status.id}>{status.name}</Select.Option>))}
                </Select>
            </StyledFormItem>
            <StyledFormItem name="date_create" label="Дата создания договора">
                <DatePicker placeholder="Выберите дату"/>
            </StyledFormItem>
            <StyledFormItem name="price" label="Стоимость">
                <InputNumber
                    formatter={value => `${value}`.replace(/[^0-9]/g, '')}
                    parser={value => `${value}`.replace(/[^0-9]/g, '')}/>
            </StyledFormItem>
            <div style={{textAlign: 'center'}}>
                <Space>
                    <StyledButtonGreen style={{marginBottom: 0}} type="dashed" onClick={handleSubmit}>
                        Сохранить проект
                    </StyledButtonGreen>
                </Space>
            </div>

        </StyledFormRegular>

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
