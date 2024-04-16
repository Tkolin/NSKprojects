import React, {useEffect, useState} from 'react';
import {
    Form, Input, Select, InputNumber, notification, Modal, Space, Cascader, Button, Divider,
} from 'antd';
import {useMutation, useQuery} from '@apollo/client';
import {
    PROJECTS_QUERY,
    PROJECT_STATUSES_QUERY,
    TYPES_PROJECTS_QUERY,
    CONTACTS_SHORT_QUERY, FACILITYS_QUERY, ORGANIZATIONS_QUERY
} from '../../../graphql/queries';
import {
    ADD_PROJECT_MUTATION, UPDATE_PROJECT_MUTATION,
} from '../../../graphql/mutationsProject';
import {
    StyledFormItem, StyledFormRegular
} from '../../style/FormStyles';
import {DatePicker} from "antd/lib";
import OrganizationForm from "./OrganizationForm";
import moment from 'moment';
import ContactForm from "./ContactForm";
import {StyledButtonGreen} from "../../style/ButtonStyles";
import dayjs from "dayjs";
import {StyledFormItemSelectAndCreate, StyledFormItemSelectAndCreateWitchEdit} from "../../style/SelectStyles";

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
    const [dateCreate, setDateCreate] = useState(null);
    const [facilitysList, setFacilitysList] = useState(null);
    const [editOrganizationModalVisibleMode, setEditOrganizationModalVisibleMode] = useState(false);
    const [projectStatus, setProjectStatus] = useState({key: 4});
    const [projectNumber, setProjectNumber] = useState({typeDocument: 'xxx', year: 'xx', organizationId: 'xx', selectFacilitiCode: 'xx', subSelectFaciliiCode: 'xx',
    groupFacilitiCode: 'xxx', facilitiCode: 'xxx'});
    const handleCloseModalFormView = () => {
        setAddContactModalVisibleMode(false);
        setAddOrganizationModalVisibleMode(false);
        setEditOrganizationModalVisibleMode(false);
    };
    const getNumberString = () => {
        return projectNumber.typeDocument + "–" + projectNumber.year + "–" + projectNumber.organizationId+"–"+  projectNumber.selectFacilitiCode+"–" +projectNumber.subSelectFaciliiCode+"–"+
            projectNumber.groupFacilitiCode+"–"+projectNumber.facilitiCode;

    }
    useEffect(() => {

        const facilitysId = form.getFieldValue('facilitys_id');
        setProjectNumber({
            ...projectNumber,
            typeDocument: dataTypeProject?.typeProjects?.items?.find(d=>d.id === form.getFieldValue('type_project_document_id'))?.group?.name,
            year: form.getFieldValue('date_create')?.$y?.toString()?.slice(-2),
            organizationId: addLeadingZeros(form.getFieldValue('organization_customer_id'),3),
            selectFacilitiCode: facilitysId?.[0]?.[0] != null ? addLeadingZeros(facilitysId[0][0], 2) : null,
            subSelectFaciliiCode: facilitysId?.[0]?.[1] != null ? addLeadingZeros(facilitysId[0][1], 2) : null,
            groupFacilitiCode: facilitysId?.[0]?.[2] != null ? addLeadingZeros(facilitysId[0][2], 3) : null,
            facilitiCode: facilitysId?.[0]?.[3] != null ? addLeadingZeros(facilitysId[0][3], 3) : null,
        })
    }, [form.getFieldValue('facilitys_id'), form,form.getFieldValue,form.getFieldValue('organization_customer_id'), selectedTypeProject, form.getFieldValue('date_create'), dateCreate, facilitysList]);
    function addLeadingZeros(number, length) {
        return String(number).padStart(length, '0');
    }
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
    }


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

    const handleEditingTemplate = (value, option) => {
        setSelectedTypeProject(value);
        //TODO: Получать из туда суда типа дока до группы
        // setProjectNumber(createNumber);
        //
        // form.setFieldsValue({
        //     number: createNumber
        // });
    };

    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message, placement,
        });
    };

    // Получение данных для выпадающих списков
    const {loading: loadingFacility} = useQuery(FACILITYS_QUERY, {
        onCompleted: (data) => setCascaderFacility(sortFacilitysForCascader(data.facilities))
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

            const facilitys_id =  editingProject?.facilities?.map(facility => [
                facility?.group_facility?.subselection_facility?.selection_facility?.code ?? null,
                facility?.group_facility?.subselection_facility?.code ?? null,
                facility?.group_facility?.code ?? null,
                facility?.code ?? null
            ]);
            form.setFieldsValue({
                ...editingProject,
                date_signing: editingProject.date_signing ? moment(editingProject.date_signing, 'YYYY-MM-DD') : null,
                date_end: editingProject.date_end ? moment(editingProject.date_end, 'YYYY-MM-DD') : null,
                date_completion: editingProject.date_completion ? moment(editingProject.date_completion, 'YYYY-MM-DD') : null,
                date_create: editingProject.date_create ? moment(editingProject.date_create, 'YYYY-MM-DD') : null,
                organization_customer_id: editingProject?.organization_customer?.id ?? null,
                delegates_id: editingProject?.delegations?.map(delegations => delegations.id),
                type_project_document_id: editingProject?.type_project_document?.id ?? null,
                facilitys_id: facilitys_id,
                status_id: editingProject?.status?.id ?? null
            });
        }
    }, [editingProject, form]);

    const save = (data) => {setEditingProject(data);}


    const sortFacilitysForCascader = (facilities) => {
        return facilities.map(facility => {
            const subselectionFacilities = facility.subselection_facility.map(subFacility => {
                const groupFacilities = subFacility.group_facility.map(groupFacility => {
                    const facilities = groupFacility.facilities.map(facility => ({
                        key: facility.id,
                        label: facility.name,
                        value: facility.code
                    }));

                    return {
                        key: groupFacility.id,
                        label: groupFacility.name,
                        value: groupFacility.code,
                        children: facilities
                    };
                });

                return {
                    key: subFacility.id,
                    label: subFacility.name,
                    value: subFacility.code,
                    children: groupFacilities
                };
            });

            return {
                key: facility.id,
                label: facility.name,
                value: facility.code,
                children: subselectionFacilities
            };
        });
    };
    // Обработчик отправки формы
    const handleSubmit = () => {
        const currentDate = new Date();

        if (editingProject) {
            updateProject({
                variables: {
                    data: {
                        ...form.getFieldsValue(),
                        number: editingProject.number,
                        date_create: form.getFieldValue("date_create")?.toISOString() ?? currentDate.toISOString(),
                        facilitys_id: facilitysList?.map(cascad => cascad[3].key) ?? null,
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
                        number: getNumberString(),
                        date_create: form.getFieldValue("date_create")?.toISOString() ?? currentDate.toISOString(),
                        facilitys_id: facilitysList?.map(cascad => cascad[3].key) ?? null,
                        organization_customer_id: selectedOrganization,
                        status_id: 4
                    }
                }
            });
        }
    };
    return (<>
        <StyledFormRegular form={form} layout="vertical">
            <Divider>:Данные:</Divider>
            <StyledFormItem name="number" label="Номер проекта" rules={[{required: true}]} >
                <div>
                    {project?.number ?
                        (<Input defaultValue={project?.number} value={project?.number}/>) :
                        (<Input defaultValue={getNumberString()} value={getNumberString()}/>)
                    }
                </div>
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
                mode={'multiple'}
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
                    value={selectedTypeProject?.id}
                    loading={loadingTypeProject}
                    placeholder="Начните ввод..."
                    onSearch={(value) => handleAutoCompleteTypeProjects(value)}
                    onSelect={(value, option) => handleEditingTemplate(value, option)}>
                    {dataTypeProject?.typeProjects?.items?.map(typeDocument => (
                        <Option key={typeDocument.id}
                                value={typeDocument?.id}>{typeDocument.name}</Option>))}
                </Select>
            </StyledFormItem>

            <StyledFormItem name="facilitys_id" label="Объект" style={{width: "100%"}}>
                <Cascader
                    style={{width: "100%"}}
                    showCheckedStrategy={SHOW_CHILD}
                    popupMatchSelectWidth={false}
                    options={cascaderFacility}
                    multiple
                    onChange={(value, selectedOptions) => setFacilitysList(selectedOptions)}
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
                <StyledFormItem name="date_create" label="Дата создания договора" style={{width: '50%'}} >
                    <DatePicker placeholder="Выберите дату" style={{width: '100%'}} onChange={(value) => setDateCreate(value)}/>
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

            <StyledFormItem name="price"  style={{width: '100%'}} label="Стоимость">
                <InputNumber suffix={"₽"} style={{width: '100%'}}
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
