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

import {CustomAutoCompleteAndCreate} from "../../../../components/style/SearchAutoCompleteStyles";
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
            updateProject(form.getFieldsValue())
    }
    useEffect(() => {
        actualProject && console.log(actualProject);
    }, []);
    // Состояния
    const [delegatesModalStatus, setDelegatesModalStatus] = useState(null);
    const [organizationsModalStatus, setOrganizationsModalStatus] = useState(null);
    const [typeProjectModalStatus, setTypeProjectModalStatus] = useState(null);
    // Подгрузка при обновлении
    const load = () => {
        console.log("load", actualProject);
        form.setFieldsValue({
            ...actualProject,
            id: actualProject?.id ?? null,
            date_signing: actualProject?.date_signing ? dayjs(actualProject?.date_signing) : null,
            date_end: actualProject?.date_end ? dayjs(actualProject?.date_end) : null,
            date_create: actualProject?.date_create ? dayjs(actualProject?.date_create) : null,
            date_completion: actualProject?.date_completion ? dayjs(actualProject?.date_completion) : null,
        });
    }
    useEffect(() => {
        if(!formLoad)
            load();
    }, [actualProject]);
    useEffect(() => {
        setFormLoad(true)
        form.setFieldValue("status_id",1)
    }, []);  
    useEffect(() => {
        console.log("newForm",form.getFieldsValue())
    }, [form]);

    // Получение данных для выпадающих списков
    const {loading: loadingStatuses, error: errorStatuses, data: dataStatuses} =
        useQuery(PROJECT_STATUSES_QUERY_COMPACT,);
    const {
        loading: loadingTypeProject, error: errorTypeProject, data: dataTypeProject
    } = useQuery(TYPES_PROJECTS_QUERY_COMPACT, {onCompleted:()=>updateNumber()});

    const {
        loading: loadingDelegates, error: errorDelegates, data: dataDelegates
    } = useQuery(CONTACTS_QUERY_COMPACT);
    const {
        loading: loadingOrganizations, error: errorOrganizations, data: dataOrganizations, refetch: refetchOrganizations
    } = useQuery(ORGANIZATIONS_QUERY_COMPACT);

    // Логика формы
    const updateNumber = () => {
        console.log("actualProject?.id", actualProject?.id);
        if(actualProject?.id && actualProject?.id > -1)
        {
            return;
        }
        const facilitiCode = (
            form.getFieldValue("facility_id")?.checkedObjects &&
            form.getFieldValue("facility_id")?.checkedObjects[0] &&
            form.getFieldValue("facility_id")?.checkedObjects[0]?.key) ?? "__-__-___-___";
        form.setFieldValue("number", (
            (dataTypeProject?.typeProjects?.items?.find(row => row.id === form.getFieldValue("type_project_document")?.selected)?.group?.name ?? "___") +
            "–" +  "24" +
            "–" + (form.getFieldValue("organization_customer")?.selected ?? "___") +
            "–" + facilitiCode));
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
            <Form.Item name="type_project_document" label="Тип документа" rules={[{required: true}]}>
                <CustomAutoCompleteAndCreate
                    placeholder={"Начните ввод..."}
                    loading={loadingTypeProject}
                    onChange={()=>handleChange()}
                    firstBtnOnClick={() => setTypeProjectModalStatus("add")}
                    data={dataTypeProject?.typeProjects?.items}
                 />
            </Form.Item>

            <Form.Item  name="organization_customer" label="Заказчик" rules={[{required: true}]}>
                <CustomAutoCompleteAndCreate
                    placeholder={"Начните ввод..."}
                    loading={loadingOrganizations}
                    onChange={()=>handleChange()}
                    firstBtnOnClick={() => {
                        setOrganizationsModalStatus("add");
                    }}
                    data={dataOrganizations?.organizations?.items}
                />
            </Form.Item>


            <StyledFormItemSelectAndCreate
                formName={"delegates_id"}
                formLabel={"Представители компании"}
                mode={'multiple'}
                placeholder={"Начните ввод..."}
                loading={loadingDelegates}
                firstBtnOnClick={() =>
                    setDelegatesModalStatus("add")}
                rules={[{required: true}]}
                onSelect={() => handleChange()}
                items={dataDelegates?.contacts?.items}
                formatOptionText={(row) => `${row.last_name ?? ""} ${row.first_name ?? ""}  ${row.patronymic ?? ""}`}
                typeData={"FIO"}
            />
            <Form.Item label={"Обьекты"} rules={[{required: true}]}>
                <Collapse size={"small"}>
                    <Collapse.Panel header={"Обьекты"}>
                        <Form.Item name="facility_id" style={{width: "100%"}}>
                            <FacilitiesTreeComponent
                                onChange={() => {
                                    handleChange()
                                }}
                            />
                        </Form.Item>
                    </Collapse.Panel>
                </Collapse>
            </Form.Item>
            <Form.Item name="date_range" label="Продолжительность">
                <DateRangePickerComponent onChange={() => handleChange()}/>
            </Form.Item>
            <Form.Item name="date_create" label="Дата создания договора" style={{width: '50%'}}>
                <DatePicker
                    onChange={() => handleChange()}
                    placeholder="Выберите дату" style={{width: '100%'}}/>
            </Form.Item>
            <Form.Item name="status_id" label="Статус проекта" >
                <Select loading={loadingStatuses}
                    // disabled={!actualObject}
                        onChange={() => handleChange()}
                        disabled={true}
                        placeholder={"В разработке"}>
                    {dataStatuses?.projectStatuses?.map(status => (
                        <Select.Option key={status.id}
                                       value={status.id}>{status.name}</Select.Option>))}
                </Select>
            </Form.Item>
            <Space.Compact style={{width: '100%'}}>
                <Form.Item name="price" style={{width: '100%'}} label="Стоимость" status_id>
                    <InputNumber suffix={"₽"} style={{width: '100%'}}
                                 formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                 parser={value => `${value}`.replace(/[^0-9]/g, '')}/>
                </Form.Item>
                <Form.Item name="prepayment" style={{width: '150px'}} label="Аванс" rules={[{required: true}]}>
                    <InputNumber suffix={"%"} style={{width: '100%'}}
                                 min={0} max={100}/>
                </Form.Item>
            </Space.Compact>

            {
                confirmFormButton
            }


        </Form>

        <ContactModalForm
            onClose={() => setDelegatesModalStatus(null)}
            mode={delegatesModalStatus}/>
        <OrganizationModalForm
             object={{id: form.getFieldValue("organization_customer")?.selected}}
            onClose={() => setOrganizationsModalStatus(null)}
            mode={organizationsModalStatus}/>
        <TypeProjectModalForm
             object={{id: TypeProjectModalForm?.selected}}
            onClose={() => setTypeProjectModalStatus(null)}
            mode={typeProjectModalStatus}/>
    </div>)
};

export default ProjectForm;
