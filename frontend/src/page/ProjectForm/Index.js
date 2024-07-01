import React, {useContext, useEffect, useState} from 'react';
import {
    Form, Input, Select, InputNumber, Space, Collapse, Button,
} from 'antd';
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';

import {DatePicker} from "antd/lib";
import dayjs from "dayjs";
import {NotificationContext} from "../../NotificationProvider";
import {
    CONTACTS_QUERY_COMPACT, GROUP_TYPE_PROJECTS_QUERY_COMPACT,
    ORGANIZATIONS_QUERY_COMPACT, PROJECT_COUNT_BY_ORGANIZATION,
    PROJECT_STATUSES_QUERY_COMPACT,
    TYPES_PROJECTS_QUERY_COMPACT
} from "../../graphql/queriesCompact";

import {CustomAutoCompleteAndCreate} from "../components/style/SearchAutoCompleteStyles";
import {EmptyFormItem} from "../components/formComponents/EmptyFormItem";

import OrganizationModalForm from "../components/modal/OrganizationModalForm";
import TypeProjectModalForm from "../components/modal/TypeProjectModalForm";
import ContactModalForm from "../components/modal/ContactModalForm";
import FacilitiesTreeComponent from "./components/FacilitiesTreeComponent";
import DateRangePickerComponent from "../components/DateRangePickerComponent";
import {StyledButtonGreen} from "../components/style/ButtonStyles";
import {PlusOutlined} from "@ant-design/icons";
import {nanoid} from "nanoid";
import {ADD_PROJECT_MUTATION, UPDATE_PROJECT_MUTATION} from "../../graphql/mutationsProject";
import {rebuildProjectToQuery} from "../components/script/rebuildData/ProjectRebuilderQuery";
import {CustomDatePicker} from "../components/FormattingDateElementComponent";


const Index = ({onCompleted, project}) => {
        // Получение данных для выпадающих списков
        const {loading: loadingStatuses, error: errorStatuses, data: dataStatuses} =
            useQuery(PROJECT_STATUSES_QUERY_COMPACT,);

        const [loadCount, {}] = useLazyQuery(PROJECT_COUNT_BY_ORGANIZATION, {
            onCompleted: (data) => {
                setCountProjectByOrg(data?.countProjectByOrganizations?.items[0].count_project + 1);
            },
            onError: (error) => {
                openNotification('topRight', 'error', `1 Ошибка при загрузке данных: ${error.message}`);
            },
        });
        const {
            loading: loadingTypeProject, error: errorTypeProject, data: dataTypeProject,
            refetch: refetchTypeProject
        } = useQuery(TYPES_PROJECTS_QUERY_COMPACT, {
            onCompleted: (data) => {
                setDataTypes(data?.typeProjects?.items);
                updateNumber();
            }
        });
        const {
            loading: loadingGroupProject, error: errorGroupProject, data: dataGroupProject,
            refetch: refetchGroupProject
        } = useQuery(GROUP_TYPE_PROJECTS_QUERY_COMPACT, {onCompleted: () => updateNumber()});

        const {
            loading: loadingDelegates, error: errorDelegates, data: dataDelegates
        } = useQuery(CONTACTS_QUERY_COMPACT);
        const {
            loading: loadingOrganizations, error: errorOrganizations, data: dataOrganizations, refetch: refetchOrganizations
        } = useQuery(ORGANIZATIONS_QUERY_COMPACT);

        // Состояния
        const [delegatesModalStatus, setDelegatesModalStatus] = useState(null);
        const [organizationsModalStatus, setOrganizationsModalStatus] = useState(null);
        const [typeProjectModalStatus, setTypeProjectModalStatus] = useState(null);

        const {openNotification} = useContext(NotificationContext);
        const [form] = Form.useForm();
        const [formLoad, setFormLoad] = useState(false);
        const [selectedGroupTypeProject, setSelectedGroupTypeProject] = useState(false);
        const [dataTypesOutput, setDataTypesOutput] = useState([]);

        const [countProjectByOrg, setCountProjectByOrg] = useState();
        const [dataTypes, setDataTypes] = useState();

        useEffect(() => {
            if (dataTypes && selectedGroupTypeProject)
                setDataTypesOutput(dataTypes?.filter(row => row?.group?.id === selectedGroupTypeProject));
        }, [dataTypes, selectedGroupTypeProject]);



        // Подгрузка при обновлении
        const load = () => {
            form.setFieldsValue({
                ...project,
                id: project?.id ?? null,
                date_signing: project?.date_signing ? dayjs(project?.date_signing) : null,
                date_end: project?.date_end ? dayjs(project?.date_end) : null,
                date_create: project?.date_create ? dayjs(project?.date_create) : null,
                date_completion: project?.date_completion ? dayjs(project?.date_completion) : null,
            });
            setSelectedGroupTypeProject(project?.type_project_document?.group?.id);
        }

        useEffect(() => {
            project && load();
        }, [project]);
        useEffect(() => {
            setFormLoad(true)
            form.setFieldValue("status_id", 1)
        }, []);
        useEffect(() => {
            console.log("countProjectByOrg", countProjectByOrg);
            handleChange();
        }, [countProjectByOrg]);


        // Логика формы
        const [mutateProject] = useMutation(project?.id ? UPDATE_PROJECT_MUTATION : ADD_PROJECT_MUTATION, {
            onCompleted: (data) => {
                openNotification('topRight', 'success', `Создание новой записи в таблице  выполнено успешно`);
                onCompleted && onCompleted(data?.createProject || data?.updateProject);
                },
            onError: (error) => {
                openNotification('topRight', 'error', `Ошибка при выполнении сооздания : ${error.message}`);
            },
        });
        const handleChange = () => {
            if (!project?.id)
                updateNumber();
        }
        const handleSave = () => {
            mutateProject({variables: {data: rebuildProjectToQuery(form.getFieldsValue())}});
        }
        const updateNumber = () => {
            const orgCostumer = form.getFieldValue("organization_customer")?.selected;
            orgCostumer && loadCount({variables: {organizationId: orgCostumer}});
            if (project?.id && project?.id > -1) {
                return;
            }
            const facilitiCode = (
                form.getFieldValue("facility_id")?.checkedObjects &&
                form.getFieldValue("facility_id")?.checkedObjects[0] &&
                form.getFieldValue("facility_id")?.checkedObjects[0]?.key) ?? "__-__-___-___";
            form.setFieldValue("number", (
                (dataGroupProject?.groupTypeProjects?.find(row => row.id === selectedGroupTypeProject)?.code ?? "___") +
                "–" + "24" +
                "–" + (countProjectByOrg ? countProjectByOrg?.toString()?.padStart(2, '0') : "__") +
                "–" + (form.getFieldValue("organization_customer")?.selected?.padStart(3, '0') ?? "___") +
                "–" + facilitiCode));
        }

        if (errorStatuses || errorTypeProject || errorDelegates || errorOrganizations) return `Ошибка! ${errorStatuses?.message || errorTypeProject?.message || errorDelegates?.message || errorOrganizations?.message}`;

        return (<div>
            <Form form={form} onChange={() => {
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
                <Form.Item name="group_type_project_document_id" label="Тип документа" rules={[{required: true}]}>
                    <Select
                        status={form.getFieldValue("group_type_project_document_id") ? "" : "warning"}
                        disabled={project?.id}
                        loading={loadingGroupProject}
                        onSelect={() => handleChange()}

                        onChange={(value) => {
                            handleChange();
                            setSelectedGroupTypeProject(value);
                            form.setFieldValue("type_project_document_id", null);
                        }}>
                        {dataGroupProject?.groupTypeProjects?.map(row => (
                            <Select.Option key={row.id}
                                           value={row.id}>{row.code ?? ""} - {row.name ?? ""}</Select.Option>))}
                    </Select>
                </Form.Item>
                <Space.Compact style={{width: "100%"}}>
                    <Form.Item
                        style={{width: "calc(100% - 32px)"}}
                        name="type_project_document_id" label="Подтип документа" rules={[{required: true}]}>
                        <Select
                            style={{width: "100%"}}
                            status={form.getFieldValue("type_project_document_id") ? "" : "warning"}
                            loading={loadingTypeProject}
                            disabled={project?.id}
                            placeholder={"Сначала выберите тип документа"}
                            onChange={(value) => {
                                console.log(value);
                                handleChange();
                            }}
                            onSelect={() => handleChange()}
                        >
                            {dataTypesOutput?.map(row => (
                                <Select.Option key={row.id} value={row.id}>
                                    {row.code ?? ""} - {row.name ?? ""}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <div>
                        <StyledButtonGreen
                            style={{
                                marginTop: 30,
                            }}
                            disabled={!selectedGroupTypeProject}
                            type={"dashed"}
                            icon={<PlusOutlined/>}
                            onClick={() => {
                                const group = dataGroupProject?.groupTypeProjects?.find(
                                    row => row.id === selectedGroupTypeProject);
                                setTypeProjectModalStatus({
                                    object:
                                        {
                                            code: group?.code + "-",
                                            name: group?.name + " - ",
                                            group: group
                                        }, mode: "edit"
                                })
                            }}
                        />
                    </div>

                </Space.Compact>


                <Form.Item name="organization_customer" label="Заказчик" rules={[{required: true}]}>
                    <CustomAutoCompleteAndCreate
                        onChange={() => handleChange()}
                        firstBtnOnClick={() => {
                            setOrganizationsModalStatus("add");
                        }}
                        data={dataOrganizations?.organizations?.items}
                    />
                </Form.Item>


                {/*<StyledFormItemSelectAndCreate*/}
                {/*    formName={"delegates_id"}*/}
                {/*    formLabel={"Представители компании"}*/}
                {/*    mode={'multiple'}*/}
                {/*    placeholder={"Начните ввод..."}*/}
                {/*    loading={loadingDelegates}*/}
                {/*    firstBtnOnClick={() =>*/}
                {/*        setDelegatesModalStatus("add")}*/}
                {/*    rules={[{required: true}]}*/}
                {/*    onSelect={() => handleChange()}*/}
                {/*    items={dataDelegates?.contacts?.items}*/}
                {/*    formatOptionText={(row) => `${row.last_name ?? ""} ${row.first_name ?? ""}  ${row.patronymic ?? ""}`}*/}
                {/*    typeData={"FIO"}*/}
                {/*/>*/}
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
                    <CustomDatePicker
                        onChange={() => handleChange()}
                        placeholder="Выберите дату" style={{width: '100%'}}/>
                </Form.Item>
                <Form.Item name="status_id" label="Статус проекта">
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

                <StyledButtonGreen onClick={() => handleSave()}>Сохранить</StyledButtonGreen>


            </Form>

            <ContactModalForm
                onClose={() => setDelegatesModalStatus(null)}
                mode={delegatesModalStatus}/>
            <OrganizationModalForm
                object={{id: form.getFieldValue("organization_customer")?.selected}}
                onClose={() => setOrganizationsModalStatus(null)}
                mode={organizationsModalStatus}/>
            <TypeProjectModalForm
                key={nanoid()}
                project={typeProjectModalStatus?.object}
                onClose={() => setTypeProjectModalStatus(null)}
                onCompleted={(value) => {
                    refetchTypeProject();
                    setDataTypes([...dataTypes, value]);
                    form.setFieldValue("type_project_document_id", value.id);
                    setTypeProjectModalStatus(null);
                    handleChange();
                }}
                mode={typeProjectModalStatus?.mode}/>
        </div>)
    }
;

export default Index;
