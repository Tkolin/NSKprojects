import React, {useContext, useEffect, useState} from 'react';
import {
    Form, Input, Select, InputNumber, notification, Modal, Space, Cascader, Button, Divider,
} from 'antd';
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
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
import {NotificationContext} from "../../../NotificationProvider";
import {ADD_CONTACT_MUTATION, UPDATE_CONTACT_MUTATION} from "../../../graphql/mutationsContact";
import {
    CONTACTS_QUERY_COMPACT,
    ORGANIZATIONS_QUERY_COMPACT,
    POSITIONS_QUERY_COMPACT, PROJECT_STATUSES_QUERY_COMPACT,
    TYPES_PROJECTS_QUERY_COMPACT
} from "../../../graphql/queriesCompact";
import {
    ORGANIZATIONS_QUERY_BY_ID,
    PROJECT_STATUSES_QUERY_BY_ID,
    PROJECTS_QUERY_BY_ID
} from "../../../graphql/queriesByID";
import {ADD_ORGANIZATION_MUTATION, UPDATE_ORGANIZATION_MUTATION} from "../../../graphql/mutationsOrganization";
import LoadingSpinnerStyles from "../../style/LoadingSpinnerStyles";
import {StyledFormItemAutoCompleteAndCreate} from "../../style/SearchAutoCompleteStyles";
import {StyledBlockBig, StyledBlockRegular} from "../../style/BlockStyles";
import FacilitiesCascader from "./component/FacilitiesCascader";

const {Option} = Select;
const {SHOW_CHILD} = Cascader;

const ProjectForm = ({initialObject, onCompleted}) => {
    // Первичные данные
    const {openNotification} = useContext(NotificationContext);
    const [form] = Form.useForm();
    const nameModel = 'Проект';
    const [actualObject, setActualObject] = useState(initialObject ?? null);
    const [loadContext, {loading, data}] = useLazyQuery(PROJECTS_QUERY_BY_ID, {
        variables: {id: initialObject?.id ?? null},
        onCompleted: (data) => {
            setActualObject(data?.projects?.items[0]);
            updateForm(data?.projects?.items[0]);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при загрузке данных: ${error.message}`);
        },
    });
    // Состояния
    const [delegatesModalStatus, setDelegatesModalStatus] = useState(null);
    const [delegatesAutoComplete, setDelegatesAutoComplete] = useState({options: [], selected: {}});
    const [organizationsModalStatus, setOrganizationsModalStatus] = useState(null);
    const [organizationsAutoComplete, setOrganizationsAutoComplete] = useState({options: [], selected: {}});
    const [typeProjectModalStatus, setTypeProjectModalStatus] = useState(null);
    const [typeProjectAutoComplete, setTypeProjectAutoComplete] = useState({options: [], selected: {}});


    // Мутация
    const [mutate] = useMutation(actualObject ? UPDATE_PROJECT_MUTATION : ADD_PROJECT_MUTATION, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Создание новой записи в таблице ${nameModel} выполнено успешно`);
            form.resetFields();
            onCompleted && onCompleted(data);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при выполнении сооздания ${nameModel}: ${error.message}`);
        },
    });
    // Подгрузка при обновлении
    useEffect(() => {
        console.log("initialObject", initialObject);
        if (initialObject?.id) {
            loadContext();
        }
    }, [initialObject]);
    const updateForm = (data) => {
        if (data) {
            form.resetFields();

            const facilitys_id = actualObject?.facilities?.map(facility => [
                facility?.group_facility?.subselection_facility?.selection_facility?.code ?? null,
                facility?.group_facility?.subselection_facility?.code ?? null,
                facility?.group_facility?.code ?? null,
                facility?.code ?? null
            ]);

            form.setFieldsValue({
                ...data,
                date_signing: data.date_signing ? moment(data.date_signing, 'YYYY-MM-DD') : null,
                date_end: data.date_end ? moment(data.date_end, 'YYYY-MM-DD') : null,
                date_completion: data.date_completion ? moment(data.date_completion, 'YYYY-MM-DD') : null,
                date_create: data.date_create ? moment(data.date_create, 'YYYY-MM-DD') : null,
                organization_customer_id: data?.organization_customer?.id ?? null,
                delegates_id: data?.delegations?.map(delegations => delegations.id),
                type_project_document_id: data?.type_project_document?.id ?? null,
                facilitys_id: facilitys_id,
                status_id: data?.status?.id ?? null
            });

            setDelegatesAutoComplete({selected: data.delegate.id});
            setOrganizationsAutoComplete({selected: data.organization.id});
            setTypeProjectAutoComplete({selected: data.typeProject.id});

        }
    };

    // Получение данных для выпадающих списков
    const {loading: loadingStatuses, error: errorStatuses, data: dataStatuses} =
        useQuery(PROJECT_STATUSES_QUERY_COMPACT,);
    const {
        loading: loadingTypeProject, error: errorTypeProject, data: dataTypeProject
    } = useQuery(TYPES_PROJECTS_QUERY_COMPACT);

    const {
        loading: loadingDelegates, error: errorDelegates, data: dataDelegates
    } = useQuery(CONTACTS_QUERY_COMPACT);
    const {
        loading: loadingOrganizations, error: errorOrganizations, data: dataOrganizations, refetch: refetchOrganizations
    } = useQuery(ORGANIZATIONS_QUERY_COMPACT);

    // Логика формы

    useEffect(() => {
        form.setFieldValue("number", 0)
        const facilitiCode = form.getFieldValue("facility_id")?.[0];
        console.log(form.getFieldValue("facilitys_id") +
                    form.getFieldValue.typeDocument +
                    "–" + form.getFieldValue("date_signing") +
                    "–" + organizationsAutoComplete.selected +
                    "–" + facilitiCode?.[0] +
                    "–" + facilitiCode?.[0] +
                    "–" + facilitiCode?.[0] +
                    "–" + facilitiCode?.[0]);
    }, [form.getFieldValue("facility_id"), form.getFieldValue("date_signing"), organizationsAutoComplete.selected]);

    const handleSubmit = () => {
        console.log(form.getFieldsValue(),
            delegatesAutoComplete.selected,
            organizationsAutoComplete.selected,
            typeProjectAutoComplete.selected);
        const facilitiCode = form.getFieldValue("facility_id")?.[0];
        console.log(form.getFieldValue("facilitys_id") +
            form.getFieldValue.typeDocument +
            "–" + form.getFieldValue("date_signing") +
            "–" + organizationsAutoComplete.selected +
            "–" + facilitiCode?.[0] +
            "–" + facilitiCode?.[1] +
            "–" + facilitiCode?.[2] +
            "–" + facilitiCode?.[3]);
        // mutate({
        //     variables: {
        //         data: {
        //             ...form.getFieldsValue(),
        //             //number: editingProject.number,
        //             //date_create: form.getFieldValue("date_create")?.toISOString() ?? currentDate.toISOString(),
        //             //facilitys_id: facilitysList?.map(cascad => cascad[3].key) ?? null,
        //             //id: editingProject?.id,
        //             //organization_customer_id: selectedOrganization
        //         }
        //     }
        // });
    };

    if (loading) return <LoadingSpinnerStyles/>
    if (errorStatuses || errorTypeProject || errorDelegates || errorOrganizations) return `Ошибка! ${errorStatuses?.message || errorTypeProject?.message || errorDelegates?.message || errorOrganizations?.message}`;

    return (<StyledBlockRegular label={"Проект"}>
        <StyledFormRegular form={form} layout="vertical">
            <StyledFormItem name="number" label="Номер проекта" rules={[{required: true}]}>
                <Input disabled={true}/>
            </StyledFormItem>
            <StyledFormItem name="name" label="Наименование проекта" rules={[{required: true}]}>
                <Input/>
            </StyledFormItem>
            <StyledFormItemAutoCompleteAndCreate
                formName={"type_project_document_name"}
                formLabel={"Тип документа"}
                placeholder={"Начните ввод..."}
                loading={loadingTypeProject}
                firstBtnOnClick={() => setTypeProjectModalStatus("add")}

                data={dataTypeProject?.typeProjects?.items}
                stateSearch={typeProjectAutoComplete}
                setStateSearch={setTypeProjectAutoComplete}
            />
            <StyledFormItemAutoCompleteAndCreate
                formName={"organization_customer_name"}
                formLabel={"Заказчик"}
                placeholder={"Начните ввод..."}
                loading={loadingOrganizations}
                firstBtnOnClick={() => setOrganizationsModalStatus("add")}

                data={dataOrganizations?.organizations?.items}
                stateSearch={organizationsAutoComplete}
                setStateSearch={setOrganizationsAutoComplete}
            />
            <StyledFormItemAutoCompleteAndCreate
                formName={"delegates_name"}
                formLabel={"Представители компании"}
                mode={'multiple'}
                placeholder={"Начните ввод..."}
                loading={loadingDelegates}
                firstBtnOnClick={() => setDelegatesModalStatus("add")}

                data={dataDelegates?.contacts?.items}
                stateSearch={delegatesAutoComplete}
                setStateSearch={setDelegatesAutoComplete}

                typeData={"FIO"}
            />
            <Form.Item name="facilitys_id" label="Объект" style={{width: "100%"}}>
                <FacilitiesCascader/>
            </Form.Item>

            <Space.Compact block style={{alignItems: 'flex-end'}}>
                <StyledFormItem name="date_signing" label="Дата подписания">
                    <DatePicker placeholder="Выберите дату"/>
                </StyledFormItem>
                <StyledFormItem name="duration" label="Срок (в днях)" style={{width: '50%'}}>
                    <InputNumber
                        formatter={(value) => `${value}`.replace(/[^0-9]/g, '')}
                        parser={(value) => `${value}`.replace(/[^0-9]/g, '')}
                        style={{width: '100%'}}
                        disabled={actualObject}
                    />

                </StyledFormItem>

                <StyledFormItem name="date_end" label="Дата окончания">
                    <DatePicker minDate={form.getFieldValue("date_signing")}
                                style={{width: '100%'}}
                                placeholder="Выберите дату"/>
                </StyledFormItem>
            </Space.Compact>
            <StyledFormItem name="date_create" label="Дата создания договора" style={{width: '50%'}}>
                <DatePicker placeholder="Выберите дату" style={{width: '100%'}}/>
            </StyledFormItem>
            <StyledFormItem name="status_id" label="Статус проекта">
                <Select loading={loadingStatuses}
                    // disabled={!actualObject}
                        placeholder={"В разработке"}>
                    {dataStatuses?.projectStatuses?.map(status => (
                        <Select.Option key={status.id}
                                       value={status.id}>{status.name}</Select.Option>))}
                </Select>
            </StyledFormItem>
            <Space.Compact style={{width: '100%'}}>
                <StyledFormItem name="price" style={{width: '100%'}} label="Стоимость">
                    <InputNumber suffix={"₽"} style={{width: '100%'}}
                                 formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                 parser={value => `${value}`.replace(/[^0-9]/g, '')}/>
                </StyledFormItem>
                <StyledFormItem name="prepayment" style={{width: '150px'}} label="Аванс">
                    <InputNumber suffix={"%"} style={{width: '100%'}}
                                 min={0} max={100}/>
                </StyledFormItem>
            </Space.Compact>

            <div style={{textAlign: 'center'}}>
                <Space>
                    <StyledButtonGreen style={{marginBottom: 0}} type="dashed" onClick={handleSubmit}>
                        Сохранить проект
                    </StyledButtonGreen>
                </Space>
            </div>

        </StyledFormRegular>

        {/*<Modal*/}
        {/*    open={addContactModalVisibleMode}*/}
        {/*    onCancel={() => setAddContactModalVisibleMode(false)}*/}
        {/*    footer={null}*/}
        {/*    onClose={handleCloseModalFormView}*/}
        {/*>*/}
        {/*    <ContactForm onClose={handleCloseModalFormView}/>*/}
        {/*</Modal>*/}
        {/*<Modal*/}
        {/*    open={addOrganizationModalVisibleMode}*/}
        {/*    onCancel={() => setAddOrganizationModalVisibleMode(false)}*/}
        {/*    footer={null}*/}
        {/*    onClose={handleCloseModalFormView}*/}
        {/*>*/}
        {/*    <OrganizationForm onClose={handleCloseModalFormView} organization={null}/>*/}
        {/*</Modal>*/}
        {/*<Modal*/}
        {/*    open={editOrganizationModalVisibleMode}*/}
        {/*    onCancel={() => setEditOrganizationModalVisibleMode(false)}*/}
        {/*    footer={null}*/}
        {/*    onClose={handleCloseModalFormView}*/}
        {/*>*/}
        {/*    <OrganizationForm onClose={handleCloseModalFormView} organization={selectedOrganizationData}/>*/}
        {/*</Modal>*/}
    </StyledBlockRegular>)
};

export default ProjectForm;
