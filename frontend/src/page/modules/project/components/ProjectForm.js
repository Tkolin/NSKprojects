import React, {useContext, useEffect, useState} from 'react';
import {
    Form, Input, Select, InputNumber, Space, Cascader, Collapse,
} from 'antd';
import {useQuery} from '@apollo/client';

import {DatePicker} from "antd/lib";
import dayjs from "dayjs";
import {StyledFormItemSelectAndCreate} from "../../../../components/style/SelectStyles";
import {NotificationContext} from "../../../../NotificationProvider";
import {
    CONTACTS_QUERY_COMPACT,
    ORGANIZATIONS_QUERY_COMPACT,
    PROJECT_STATUSES_QUERY_COMPACT,
    TYPES_PROJECTS_QUERY_COMPACT
} from "../../../../graphql/queriesCompact";

import {StyledFormItemAutoCompleteAndCreate} from "../../../../components/style/SearchAutoCompleteStyles";
import {EmptyFormItem} from "../../../../components/formComponents/EmptyFormItem";

import OrganizationModalForm from "../../../../components/modal/OrganizationModalForm";
import TypeProjectModalForm from "../../../../components/modal/TypeProjectModalForm";
import ContactModalForm from "../../../../components/modal/ContactModalForm";
import FacilitiesTreeComponent from "./FacilitiesTreeComponent";
import {Panel} from "reactflow";
import DateRangePickerComponent from "./DateRangePickerComponent";


const ProjectForm = ({onCompleted, onChange, updateProject, actualProject, confirmFormButton}) => {
    // Первичные данные
    const {openNotification} = useContext(NotificationContext);
    const [form] = Form.useForm();
    const [formLoad, setFormLoad] = useState(false);
    const handleChange = () => {
        if (!actualProject?.id)
            updateNumber();
        if (formLoad)
            updateProject({...compiletedFormToProjectInput()})
    }
    useEffect(() => {
        actualProject && console.log(actualProject);
    }, []);
    // Состояния
    const [delegatesModalStatus, setDelegatesModalStatus] = useState(null);
    const [organizationsModalStatus, setOrganizationsModalStatus] = useState(null);
    useEffect(() => {
        console.log("organizationsModalStatus", organizationsModalStatus);
    }, [organizationsModalStatus]);
    const [organizationsAutoComplete, setOrganizationsAutoComplete] = useState({options: [], selected: 0});
    const [typeProjectModalStatus, setTypeProjectModalStatus] = useState(null);
    const [typeProjectAutoComplete, setTypeProjectAutoComplete] = useState({options: [], selected: {}});
    useEffect(() => {
        form.setFieldValue("organization_customer_id", organizationsAutoComplete.selected);
        form.setFieldValue("type_project_document_id", typeProjectAutoComplete.selected);
        handleChange()
    }, [organizationsAutoComplete.selected, typeProjectAutoComplete.selected, form]);


    // Подгрузка при обновлении
    const load = () => {

        form.setFieldsValue({
            ...actualProject,
            id: actualProject?.id ?? null,
            date_signing: actualProject?.date_signing ? dayjs(actualProject?.date_signing) : null,
            date_end: actualProject?.date_end ? dayjs(actualProject?.date_end) : null,
            date_create: actualProject?.date_create ? dayjs(actualProject?.date_create) : null,
            date_completion: actualProject?.date_completion ? dayjs(actualProject?.date_completion) : null
        });
        setTypeProjectAutoComplete({...typeProjectAutoComplete, selected: actualProject?.type_project_document_id});
        setOrganizationsAutoComplete({...organizationsAutoComplete, selected: actualProject?.organization_customer_id});
    }
    useEffect(() => {
        load();
    }, [actualProject]);
    useEffect(() => {
        setFormLoad(true)
    }, []);

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
    const updateNumber = () => {
        const facilitiCode = (
            form.getFieldValue("facility_id")?.checkedObjects &&
            form.getFieldValue("facility_id")?.checkedObjects[0] &&
            form.getFieldValue("facility_id")?.checkedObjects[0]?.key) ?? "__-__-___-___";
        form.setFieldValue("number", (
            (dataTypeProject?.typeProjects?.items?.find(row => row.id === typeProjectAutoComplete?.selected)?.group?.name ?? "___") +
            "–" + (dayjs(form.getFieldValue("date_signing")).format("YY") ?? "___") +
            "–" + (organizationsAutoComplete?.selected ?? "___") +
            "–" + facilitiCode));
    }
    const compiletedFormToProjectInput = () => {
        const formValues = form.getFieldsValue();
        return {
            ...formValues,
            organization_customer_id: organizationsAutoComplete?.selected ?? null,
            type_project_document_id: typeProjectAutoComplete?.selected ?? null,
        }

    }
    if (errorStatuses || errorTypeProject || errorDelegates || errorOrganizations) return `Ошибка! ${errorStatuses?.message || errorTypeProject?.message || errorDelegates?.message || errorOrganizations?.message}`;

    return (<div>
        <Form onFinish={() => onCompleted && onCompleted()} form={form} onChange={() => {
            handleChange();
            setFormLoad(true);

        }} layout="vertical">
            <EmptyFormItem name={"id"}/>
            <Form.Item name="number" label="Номер проекта" rules={[{required: true}]}>
                <Input disabled={true}/>
            </Form.Item>
            <Form.Item name="name" label="Наименование проекта" rules={[{required: true}]}>
                <Input/>
            </Form.Item>
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
            <EmptyFormItem name={"type_project_document_id"}/>

            <StyledFormItemAutoCompleteAndCreate
                formName={"organization_customer_name"}
                formLabel={"Заказчик"}
                placeholder={"Начните ввод..."}
                loading={loadingOrganizations}
                firstBtnOnClick={() => {
                    setOrganizationsModalStatus("add");
                }}

                data={dataOrganizations?.organizations?.items}
                stateSearch={organizationsAutoComplete}
                setStateSearch={setOrganizationsAutoComplete}
            />
            <EmptyFormItem name={"organization_customer_id"}/>

            <StyledFormItemSelectAndCreate
                formName={"delegates_id"}
                formLabel={"Представители компании"}
                mode={'multiple'}
                placeholder={"Начните ввод..."}
                loading={loadingDelegates}
                firstBtnOnClick={() =>
                    setDelegatesModalStatus("add")}

                onSelect={() => handleChange()}
                items={dataDelegates?.contacts?.items}
                formatOptionText={(row) => `${row.last_name ?? ""} ${row.first_name ?? ""}  ${row.patronymic ?? ""}`}
                typeData={"FIO"}
            />
            <Collapse label={"Обьекты"}>
                <Collapse.Panel label={"Обьекты"}>
                    <Form.Item name="facility_id" label="Объект" style={{width: "100%"}}>
                        <FacilitiesTreeComponent
                            onChange={() => {
                                console.log("facility_id", form.getFieldValue("facility_id"));
                                handleChange()
                            }}
                        />
                    </Form.Item>
                </Collapse.Panel>
            </Collapse>
            <Form.Item name="date_range" label="Продолжительность">
                <DateRangePickerComponent onChange={() => handleChange()}/>
            </Form.Item>
            <Form.Item name="date_create" label="Дата создания договора" style={{width: '50%'}}>
                <DatePicker
                    onChange={() => handleChange()}
                    placeholder="Выберите дату" style={{width: '100%'}}/>
            </Form.Item>
            <Form.Item name="status_id" label="Статус проекта">
                <Select loading={loadingStatuses}
                    // disabled={!actualObject}
                        onChange={() => handleChange()}

                        placeholder={"В разработке"}>
                    {dataStatuses?.projectStatuses?.map(status => (
                        <Select.Option key={status.id}
                                       value={status.id}>{status.name}</Select.Option>))}
                </Select>
            </Form.Item>
            <Space.Compact style={{width: '100%'}}>
                <Form.Item name="price" style={{width: '100%'}} label="Стоимость">
                    <InputNumber suffix={"₽"} style={{width: '100%'}}
                                 formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                 parser={value => `${value}`.replace(/[^0-9]/g, '')}/>
                </Form.Item>
                <Form.Item name="prepayment" style={{width: '150px'}} label="Аванс">
                    <InputNumber suffix={"%"} style={{width: '100%'}}
                                 min={0} max={100}/>
                </Form.Item>
            </Space.Compact>

            {confirmFormButton}


        </Form>

        <ContactModalForm
            onClose={() => setDelegatesModalStatus(null)}
            mode={delegatesModalStatus}/>
        <OrganizationModalForm
            key={organizationsAutoComplete?.selected ?? 0}
            object={{id: organizationsAutoComplete?.selected}}
            onClose={() => setOrganizationsModalStatus(null)}
            mode={organizationsModalStatus}/>
        <TypeProjectModalForm
            key={typeProjectAutoComplete?.selected}
            object={{id: TypeProjectModalForm?.selected}}
            onClose={() => setTypeProjectModalStatus(null)}
            mode={typeProjectModalStatus}/>
    </div>)
};

export default ProjectForm;
