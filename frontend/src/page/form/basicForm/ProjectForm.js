import React, {useEffect, useState} from 'react';
import {
    Form, Input, Select, InputNumber, notification, Modal, Space, Cascader, Button, Divider,
} from 'antd';
import {useMutation, useQuery} from '@apollo/client';
import {
    PROJECTS_QUERY,
    PROJECT_STATUSES_QUERY,
    TYPES_PROJECTS_QUERY,
    ORGANIZATIONS_SHORT_QUERY, CONTACTS_SHORT_QUERY, FACILITYS_QUERY, ORGANIZATIONS_QUERY
} from '../../../graphql/queries';
import {
    ADD_PROJECT_MUTATION, UPDATE_PROJECT_MUTATION,
} from '../../../graphql/mutationsProject';
import {
    StyledFormItem, StyledFormRegular
} from '../../style/FormStyles';
import {DatePicker} from "antd/lib";
import {EditOutlined, PlusOutlined} from '@ant-design/icons';
import OrganizationForm from "./OrganizationForm";
import moment from 'moment';
import ContactForm from "./ContactForm";
import {StyledButtonGreen} from "../../style/ButtonStyles";

import dayjs from "dayjs";
import {StyledFormItemSelectAndCreate, StyledFormItemSelectAndCreateWitchEdit} from "../../style/SelectStyles";
import organizationForm from "./OrganizationForm";
import LoadingSpinnerStyles from "../../style/LoadingSpinnerStyles";

const {Option} = Select;
const {SHOW_CHILD} = Cascader;

const ProjectForm = ({project, setProject, onClose, onSubmit}) => {
    const [editingProject, setEditingProject] = useState(null);
    // Заполнение формы данными контакта при его редактировании
    useEffect(() => {
        if (project) {
            console.log("Редачение");
            setEditingProject(project)
        }
    }, [project]);
    // Состояния
    const [form] = Form.useForm();
    const [selectedTypeProject, setSelectedTypeProject] = useState(null);
    const [cascaderFacility, setCascaderFacility] = useState(null);
    const [addContactModalVisibleMode, setAddContactModalVisibleMode] = useState(false);
    const [autoCompleteOrganization, setAutoCompleteOrganization] = useState('');
    const [selectedOrganization, setSelectedOrganization] = useState('')
    const [selectedOrganizationData, setSelectedOrganizationData] = useState('')
    const [autoCompleteTypeProjects, setAutoCompleteTypeProjects] = useState('');
    const [addOrganizationModalVisibleMode, setAddOrganizationModalVisibleMode] = useState(false);
    const [editOrganizationModalVisibleMode, setEditOrganizationModalVisibleMode] = useState(false);
    const [projectStatus, setProjectStatus] = useState({key: 4});
    const [projectNumber, setProjectNumber] = useState('');

    const handleCloseModalFormView = () => {
        setAddContactModalVisibleMode(false);
        setAddOrganizationModalVisibleMode(false);
        setEditOrganizationModalVisibleMode(false);
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
    const handleSelectedOrganization = (value, option) => {
        setSelectedOrganization(value);
        setSelectedOrganizationData(dataOrganizations?.organizations?.items?.find(org => org.id === value));
        console.log(dataOrganizations?.organizations?.items?.find(org => org.id === value));
    }
    // const handleDateEndChange = (value) => {
    //     setDateEnd(value);
    //     calculateDuration(dateSigning, value);
    // };

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
    // const addingOrganization = (value) => {
    //     if (dataOrganizations && value) {
    //         const newOrganizations = value.map(a => ({
    //             id: a?.stage?.id ?? null, name: a?.stage?.name ?? null,
    //         }));
    //         refetchOrganizations({search: autoCompleteStage}).then(({data}) => {
    //             const existingStages = dataStages?.stages?.items ?? [];
    //             const updatedStages = [...existingStages, ...newStages];
    //             setDataStages({
    //                 ...dataStages, stages: {
    //                     ...dataStages.stages, stages: updatedStages,
    //                 },
    //             });
    //         });
    //         loadTemplate();
    //     }
    // }
    const handleEditingTemplate = (value, option) => {
        setSelectedTypeProject(value);
        //TODO: Получать из туда суда типа дока до группы
        // setProjectNumber(createNumber);
        //
        // form.setFieldsValue({
        //     number: createNumber
        // });
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
    const {loading: loadingStatuses, error: errorStatuses, data: dataStatuses} =
        useQuery(PROJECT_STATUSES_QUERY, {
            onCompleted: () => !editingProject && setProjectStatus(3)
        });
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
        loading: loadingOrganizations, error: errorOrganizations, data: dataOrganizations, refetch: refetchOrganizations
    } = useQuery(ORGANIZATIONS_QUERY, {
        variables: {queryOptions: {limit: 10, page: 1, search: autoCompleteOrganization}}
    });

    // Мутации для добавления и обновления
    const [addProject] = useMutation(ADD_PROJECT_MUTATION, {
        refetchQueries: [{query: PROJECTS_QUERY}],
        onCompleted: (data) => {
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
            console.log("data.updateProject");
            if (setProject)
                setProject(data.updateProject);

            if (onSubmit) {
                onSubmit(true);
            }
            if (onClose) onClose();
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных: ' + error.message);
        }
    });
    // Заполнение формы данными контакта при его редактировании
    useEffect(() => {
        if (editingProject) {
            save(editingProject);
            setSelectedTypeProject(editingProject?.type_project_document?.id);
            setAutoCompleteTypeProjects(editingProject?.type_project_document?.id);
            setSelectedOrganization(editingProject?.organization_customer?.id);
            setAutoCompleteOrganization(editingProject?.organization_customer?.id)
            console.log(editingProject);
            form.setFieldsValue({
                ...editingProject,
                date_signing: editingProject.date_signing ? moment(editingProject.date_signing, 'YYYY-MM-DD') : null,
                date_end: editingProject.date_end ? moment(editingProject.date_end, 'YYYY-MM-DD') : null,
                date_completion: editingProject.date_completion ? moment(editingProject.date_completion, 'YYYY-MM-DD') : null,
                date_create: editingProject.date_create ? moment(editingProject.date_create, 'YYYY-MM-DD') : null,
                organization_customer_id: editingProject?.organization_customer?.id ?? null,
                delegates_id: editingProject?.delegations?.map(delegations => delegations.id),
                type_project_document_id: editingProject?.type_project_document?.id ?? null,
                //TODO: facility_id: тут ключ пара родитель-дочерний
                status_id: editingProject?.status?.id ?? null
            });

        }
    }, [editingProject, form]);

    const save = (data) => {setEditingProject(data);}

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
                        date_create: form.getFieldValue("date_create")?.toISOString() ?? null,
                        facilitys_id: form.getFieldValue('facilitys_id') ? form.getFieldValue('facilitys_id').map(pair => pair[1]) : null,
                        id: editingProject?.id,
                        organization_customer_id: selectedOrganization
                    }
                }
            });
        } else {
            addProject({
                variables: {
                    data: {
                        ...form.getFieldsValue(),
                        date_create: form.getFieldValue("date_create")?.toISOString() ?? null,

                        facilitys_id: form.getFieldValue('facilitys_id') ? form.getFieldValue('facilitys_id').map(pair => pair[1]) : null,
                        organization_customer_id: selectedOrganization,
                        status_id: 4
                    }
                }
            });
        }

    };
    const checkSelectDelegates = (value, option) => {
        console.log(value);
        console.log(option);
        console.log(form.getFieldValue('delegates_id'));
    }

    return (<>
        <StyledFormRegular form={form} layout="vertical">
            <Divider>:Данные:</Divider>
            <StyledFormItem name="number" label="Номер проекта" rules={[{required: true}]}>
                <Input defaultValue={projectNumber} value={projectNumber}></Input>
            </StyledFormItem>
            <StyledFormItem name="name" label="Наименование проекта" rules={[{required: true}]}>
                <Input/>
            </StyledFormItem>
            <StyledFormItemSelectAndCreateWitchEdit
                formName={"organization_customer_id"}
                formLabel={"Заказчик"}
                onSearch={handleAutoCompleteOrganizations}
                onSelect={handleSelectedOrganization}
                placeholder={"Начните ввод..."}
                loading={loadingOrganizations}
                items={dataOrganizations?.organizations?.items}
                firstBtnOnClick={setAddOrganizationModalVisibleMode}
                secondBtnOnClick={ setEditOrganizationModalVisibleMode}
                secondDisable={!selectedOrganization}
                formatOptionText={(row) => `${row.name}`}
            />
            <StyledFormItemSelectAndCreate
                formName={"delegates_id"}
                formLabel={"Представители компании"}
                onSelect={checkSelectDelegates}
                placeholder={"По компаниям"}
                loading={loadingDelegates}
                items={dataDelegates?.contacts?.items}
                firstBtnOnClick={setAddContactModalVisibleMode}
                formatOptionText={(row) => `${row.last_name} ${row.first_name} ${row.patronymic}`}
            />

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

            <StyledFormItem name="facilitys_id" label="Объект" style={{width: "100%"}}>
                <Cascader
                    style={{width: "100%"}}
                    disabled={!editingProject}
                    showCheckedStrategy={SHOW_CHILD}
                    popupMatchSelectWidth={false}
                    options={cascaderFacility}
                    multiple
                    expandTrigger="hover"
                    maxTagCount="responsive"
                />
            </StyledFormItem>

            <Space.Compact block style={{alignItems: 'flex-end'}}>
                {/*<StyledFormItem name="date_signing" label="Дата подписания">*/}
                {/*    <DatePicker placeholder="Выберите дату" disabled={!editingProject}*/}
                {/*                onChange={(value) => handleDateSigningChange(value)}/>*/}
                {/*</StyledFormItem>*/}
                <StyledFormItem name="duration" label="Срок (в днях)" style={{width: '50%'}}>
                    <InputNumber
                        formatter={(value) => `${value}`.replace(/[^0-9]/g, '')}
                        parser={(value) => `${value}`.replace(/[^0-9]/g, '')}
                        style={{width: '100%'}}
                        disabled={editingProject}
                        onChange={(value) => handleDurationChange(value)}
                    />

                </StyledFormItem>
                <StyledFormItem name="date_create" label="Дата создания договора" style={{width: '50%'}}>
                    <DatePicker placeholder="Выберите дату" style={{width: '100%'}}/>
                </StyledFormItem>
                {/*<StyledFormItem name="date_end" label="Дата окончания" >*/}
                {/*    <DatePicker minDate={dateSigning} disabled={!editingProject}*/}
                {/*                style={{width: '100%'}}*/}

                {/*                placeholder="Выберите дату" onChange={handleDateEndChange}/>*/}
                {/*</StyledFormItem>*/}

            </Space.Compact>
            <StyledFormItem name="status_id" label="Статус проекта">
                <Select loading={loadingStatuses} disabled={!editingProject} placeholder={"В разработке"}
                        value={projectStatus}>
                    {dataStatuses?.projectStatuses?.map(status => (
                        <Select.Option key={status.id}
                                       value={status.id}>{status.name}</Select.Option>))}
                </Select>
            </StyledFormItem>

            <StyledFormItem name="price" label="Стоимость">
                <InputNumber suffix={"₽"} width={"100%"}
                             formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
            open={addContactModalVisibleMode}
            onCancel={() => setAddContactModalVisibleMode(false)}
            footer={null}
            onClose={handleCloseModalFormView}
        >
            <ContactForm onClose={handleCloseModalFormView}/>
        </Modal>
        <Modal
            open={addOrganizationModalVisibleMode}
            onCancel={() => setAddOrganizationModalVisibleMode(false)}
            footer={null}
            onClose={handleCloseModalFormView}
        >
            <OrganizationForm onClose={handleCloseModalFormView} organization={null}/>
        </Modal>
        <Modal
            open={editOrganizationModalVisibleMode}
            onCancel={() => setEditOrganizationModalVisibleMode(false)}
            footer={null}
            onClose={handleCloseModalFormView}
        >
            <OrganizationForm onClose={handleCloseModalFormView} organization={selectedOrganizationData}/>
        </Modal>
    </>)
};

export default ProjectForm;
