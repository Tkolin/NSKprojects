import React, {useContext, useEffect, useState} from 'react';
import {
    Form, Input, InputNumber, Space, Collapse, Divider, Button, Modal, Card,
} from 'antd';
import {useMutation, useQuery} from '@apollo/client';

import dayjs from "dayjs";
import {NotificationContext} from "../../NotificationProvider";
import {
    CONTACTS_QUERY_COMPACT, GROUP_TYPE_PROJECTS_QUERY_COMPACT,
    ORGANIZATIONS_QUERY_COMPACT, PROJECT_COUNT_BY_ORGANIZATION,
    PROJECT_STATUSES_QUERY_COMPACT,
    TYPES_PROJECTS_QUERY_COMPACT
} from "../../graphql/queriesCompact";

import {CustomAutoComplete, CustomAutoCompleteAndCreate} from "../components/style/SearchAutoCompleteStyles";

import FacilitiesTreeComponent from "./components/FacilitiesTreeComponent";
import DateRangePickerComponent from "../components/DateRangePickerComponent";
import {ADD_PROJECT_MUTATION, UPDATE_PROJECT_MUTATION} from "../../graphql/mutationsProject";
import {rebuildProjectResultQuery} from "../components/script/rebuildData/ProjectRebuilderQuery";
import {CustomDatePicker} from "../components/FormattingDateElementComponent";
import ContactForm from "../simplesForms/ContactForm";
import OrganizationForm from "../simplesForms/OrganizationForm";
import {ModalButton} from "../simplesForms/formComponents/ModalButtonComponent";
import {AutoCompleteFormItem} from "../components/CustomForm";
import {nanoid} from "nanoid";
import TypeProjectForm from "../simplesForms/TypeProjectForm";

//TODO: Перевести в TS
// _sKey1
// name
// type_project_document
// organization_customer
// facility_id
// date_range
// date_create
// status_id
// price
// prepayment
//
//
//
//


const ProjectForm = ({
                         onCompleted, project, type, requiredOptions = ["name",
            "type_project_document",
            "organization_customer",
            "facility_id",
            "date_range",
            "date_create",
            "status_id",
            "price",
            "prepayment"
        ],
                         disabledOptions = [], options, cardProps
                     }) => {
        // Получение данных для выпадающих списков
        const {loading: loadingStatuses, error: errorStatuses, data: dataStatuses} =
            useQuery(PROJECT_STATUSES_QUERY_COMPACT);

        const {
            loading: loadingTypeProject, error: errorTypeProject, data: dataTypeProject,
            refetch: refetchTypeProject
        } = useQuery(TYPES_PROJECTS_QUERY_COMPACT);
        const {
            loading: loadingGroupProject, error: errorGroupProject, data: dataGroupProject,
            refetch: refetchGroupProject
        } = useQuery(GROUP_TYPE_PROJECTS_QUERY_COMPACT);//, {onCompleted: () => updateNumber()});
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

        const [dataTypesOutput, setDataTypesOutput] = useState([]);

        const [selectedOrganizationId, setSelectedOrganizationId] = useState();
        useEffect(() => {
            console.log("selectedOrganizationId", selectedOrganizationId);
        }, [selectedOrganizationId]);
        const {
            data: projectCountByOrg,
            loading: loadProjectCountByOrg,
            error: errorProjectCountByOrg
        } = useQuery(PROJECT_COUNT_BY_ORGANIZATION, {variables: {organizationId: selectedOrganizationId}});

        const [selectedGroupTypeProject, setSelectedGroupTypeProject] = useState(false);
        useEffect(() => {
            console.log("selectedGroupTypeProject", selectedGroupTypeProject);
            !(project.id) && form.setFieldValue("type_project_document", null);
            if (dataTypeProject?.typeProjects?.items && selectedGroupTypeProject && !loadingTypeProject) {
                setDataTypesOutput(dataTypeProject?.typeProjects?.items?.filter(row => row?.group?.id === selectedGroupTypeProject));
            }
        }, [dataTypeProject, selectedGroupTypeProject]);


        const load = () => {
            form.setFieldsValue({
                ...project,
                ...rebuildProjectResultQuery(project),
                id: project?.id ?? null,
                date_signing: project?.date_signing ? dayjs(project?.date_signing) : null,
                date_end: project?.date_end ? dayjs(project?.date_end) : null,
                date_create: project?.date_create ? dayjs(project?.date_create) : null,
                date_completion: project?.date_completion ? dayjs(project?.date_completion) : null,

            });
            setSelectedOrganizationId(project?.organization_customer?.id);
            setSelectedGroupTypeProject(project?.type_project_document?.group?.id);
        }

        useEffect(() => {
            project && load();
        }, [project]);

        // Логика формы
        const [mutateProject, {loading: loading}] = useMutation(project?.id ? UPDATE_PROJECT_MUTATION : ADD_PROJECT_MUTATION, {
            onCompleted: (data) => {
                openNotification('topRight', 'success', `Создание новой записи в таблице  выполнено успешно`);
                onCompleted && (onCompleted(data?.createProject || data?.updateProject) || onCompleted());
            },
            onError: (error) => {
                openNotification('topRight', 'error', `Ошибка при выполнении сооздания : ${error.message}`);
            },
        });

        const handleSave = () => {
            const number = createNumber();
            if (!type && number)
                return;

            const facility_id = form.getFieldValue("facility_id")?.checkedObjects?.map(row => row?.value[0] ?? null) ??
                project.facility_id;
            const date_range = form.getFieldValue("date_range");
            const date_signing = form.getFieldValue("date_signing");
            const date_completion = form.getFieldValue("date_completion");
            const data = {
                number,
                name: form.getFieldValue("name"),
                organization_customer_id: form.getFieldValue("organization_customer")?.selected,
                type_project_document_id: form.getFieldValue("type_project_document")?.selected,
                date_signing: date_range?.dateStart ? dayjs(date_range?.dateStart).format("YYYY-MM-DD") : null,
                duration: date_range?.duration,
                date_end: date_range?.dateEnd ? dayjs(date_range?.dateEnd).format("YYYY-MM-DD") : null,
                date_create: date_signing ? dayjs(date_signing).format("YYYY-MM-DD") : null,
                status_id: form.getFieldValue("status_id")?.selected,
                date_completion: date_completion ? dayjs(date_completion).format("YYYY-MM-DD") : null,
                price: form.getFieldValue("price"),
                prepayment: form.getFieldValue("prepayment"),
                delegates_id: null,
                facility_id
            }


            mutateProject({
                variables: {
                    ...(project.id ? {id: project.id} : {}),
                    data
                }
            });
        }
        const createNumber = () => {
            if (type && (project?.id && project?.id > -1))
                return project.number;

            const facilitiCode = (
                form.getFieldValue("facility_id")?.checkedObjects &&
                form.getFieldValue("facility_id")?.checkedObjects[0] &&
                form.getFieldValue("facility_id")?.checkedObjects[0]?.key) ?? "__-__-___-___";
            const result = (
                (dataGroupProject?.groupTypeProjects?.find(row => row.id === selectedGroupTypeProject)?.code ?? "___") +
                "–" + "24" +
                "–" + (projectCountByOrg.countProjectByOrganizations ? projectCountByOrg.countProjectByOrganizations.toString()?.padStart(2, '0') : "__") +
                "–" + (form.getFieldValue("organization_customer")?.selected?.padStart(3, '0') ?? "___") +
                "–" + facilitiCode);
            if (result.includes("_"))
                return null;
            return result;
        }
        const handleChangeCustomer = (value) => {
            if (!value?.selected)
                return;
            setSelectedOrganizationId(value.selected);
        }
        if (errorStatuses || errorTypeProject || errorDelegates || errorOrganizations) return `Ошибка! ${errorStatuses?.message || errorTypeProject?.message || errorDelegates?.message || errorOrganizations?.message}`;

        return (
            <Card style={{width: 400}}
                  {...cardProps}
                  actions={[
                      <ModalButton
                          modalType={"green"}
                          isMany={cardProps?.actions}
                          loading={loadProjectCountByOrg || loading}
                          onClick={() => form.submit()}
                          children={project ? `Обновить` : `Создать`}/>
                      , ...cardProps?.actions ?? []
                  ]}
                  children={<>
                      <Form form={form} onFinish={handleSave} layout="vertical">

                          <Form.Item name="name" label="Наименование проекта"
                                     style={disabledOptions?.includes("name") ? {display: "none"} : {}}
                                     rules={[{required: true, message: "Укажите имя"}]}>
                              <Input disabled={disabledOptions?.includes("name")}/>
                          </Form.Item>
                          <AutoCompleteFormItem
                              style={disabledOptions?.includes("type_project_document") ? {display: "none"} : {}}
                              rulesValidationRequired={requiredOptions?.includes("type_project_document")}
                              rulesValidationMessage={"Укажите тип документации"}
                              name="group_type_project_document" label="Тип документа">
                              <CustomAutoComplete
                                  disabled={disabledOptions?.includes("type_project_document")}
                                  loading={loadingGroupProject}
                                  typeData={"CODENAME"}
                                  data={dataGroupProject?.groupTypeProjects}
                                  onClear={() => {
                                      setSelectedGroupTypeProject(null);
                                      form.setFieldValue("type_project_document", null)
                                  }}
                                  onSelect={(value) => {
                                      setSelectedGroupTypeProject(value.id);
                                      form.setFieldValue("type_project_document", null)
                                  }}
                              />
                          </AutoCompleteFormItem>
                          <AutoCompleteFormItem
                              style={disabledOptions?.includes("type_project_document") ? {display: "none"} : {}}
                              rulesValidationRequired={requiredOptions?.includes("type_project_document")}
                              rulesValidationMessage={"Укажите подтип документации"}
                              name="type_project_document" label="Подтип документа">
                              <CustomAutoCompleteAndCreate
                                  loading={loadingTypeProject}
                                  disabled={!selectedGroupTypeProject}
                                  placeholder={"Сначала выберите тип документа"}
                                  typeData={"CODENAME"}
                                  data={dataTypesOutput}
                                  firstBtnOnClick={() => {
                                      const group = dataGroupProject?.groupTypeProjects?.find(
                                          row => row.id === selectedGroupTypeProject);
                                      setTypeProjectModalStatus({
                                          object:
                                              {
                                                  code: group?.code + "-",
                                                  name: group?.name + " - ",
                                                  group: group
                                              },
                                          mode: "add"
                                      })
                                  }}
                              />
                          </AutoCompleteFormItem>
                          <AutoCompleteFormItem name="organization_customer" label="Заказчик"
                                                style={disabledOptions?.includes("organization_customer") ? {display: "none"} : {}}
                                                rulesValidationRequired={requiredOptions?.includes("organization_customer")}
                                                rulesValidationMessage={"Укажите организацию заказчика"}>
                              <CustomAutoCompleteAndCreate
                                  onChange={(value) => handleChangeCustomer(value)}
                                  loading={loadingOrganizations}
                                  disabled={disabledOptions?.includes("organization_customer")}
                                  firstBtnOnClick={() => {
                                      setOrganizationsModalStatus("add");
                                  }}
                                  data={dataOrganizations?.organizations?.items}
                              />
                          </AutoCompleteFormItem>
                          <Form.Item label={"Обьекты"}
                                     style={disabledOptions?.includes("facility_id") ? {display: "none"} : {}}>
                              <Collapse size={"small"}>
                                  <Collapse.Panel header={"Обьекты"}>
                                      <Form.Item name="facility_id" style={{width: "100%"}}
                                                 rules={[{
                                                     required: requiredOptions?.includes("facility_id"),
                                                     message: "Укажите обьект проектирования"
                                                 }]}
                                      >
                                          <FacilitiesTreeComponent
                                              disabled={disabledOptions?.includes("facility_id")}/>
                                      </Form.Item>
                                  </Collapse.Panel>
                              </Collapse>
                          </Form.Item>
                          <Form.Item name="date_range"
                                     style={disabledOptions?.includes("date_range") ? {display: "none"} : {}}
                                     rules={[{
                                         required: requiredOptions?.includes("date_range"),
                                         message: "Укажите продолжительность"
                                     }]}
                                     label="Продолжительность">
                              <DateRangePickerComponent
                                  disabled={disabledOptions?.includes("date_range")}/>
                          </Form.Item>
                          <Form.Item name="date_create" label="Дата создания договора"
                                     style={disabledOptions?.includes("date_create") ? {display: "none"} : {}}
                                     rules={[{
                                         required: requiredOptions?.includes("date_create"),
                                         message: "Укажите дату создания"
                                     }]}>
                              <CustomDatePicker
                                  placeholder="Выберите дату" style={{width: '100%'}}
                                  disabled={disabledOptions?.includes("date_create")}/>
                          </Form.Item>
                          <Form.Item name="status_id" label="Статус проекта"
                                     style={disabledOptions?.includes("status_id") ? {display: "none"} : {}}
                                     rules={[{
                                         required: requiredOptions?.includes("status_id"),
                                         message: "Укажите статус"
                                     }]}>
                              <CustomAutoComplete
                                  loading={loadingStatuses}
                                  disabled={disabledOptions?.includes("status_id")}
                                  data={dataStatuses?.projectStatuses}
                                  placeholder={"Выберите статус проекта..."}
                              />
                          </Form.Item>
                          <Space.Compact style={{width: '100%'}}>
                              <Form.Item name="price"
                                         style={{
                                             ...((disabledOptions?.includes("price") && disabledOptions?.includes("prepayment")) ? {display: "none"} : {}),
                                             width: '100%'
                                         }}
                                         label="Стоимость"

                                         rules={[{
                                             required: requiredOptions?.includes("price"),
                                             message: "Укажите стоимость"
                                         }]}>
                                  <InputNumber suffix={"₽"} style={{width: '100%'}}
                                               disabled={disabledOptions?.includes("price")}
                                               formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                               parser={value => `${value}`.replace(/[^0-9]/g, '')}/>
                              </Form.Item>
                              <Form.Item name="prepayment"
                                         style={{
                                             ...((disabledOptions?.includes("price") && disabledOptions?.includes("prepayment")) ? {display: "none"} : {}),
                                             width: "75px"
                                         }}
                                         label="Аванс"
                                         rules={[{
                                             required: requiredOptions?.includes("prepayment"),
                                             message: "Укажите аванс"
                                         }]}>
                                  <InputNumber suffix={"%"} style={{width: '100%'}}
                                               disabled={disabledOptions?.includes("prepayment")}
                                               min={0} max={100}/>
                              </Form.Item>
                          </Space.Compact>
                      </Form>

                      <Modal
                          key={delegatesModalStatus?.mode || delegatesModalStatus?.organization_id || null}
                          open={delegatesModalStatus}
                          onCancel={() => setDelegatesModalStatus(null)}
                          footer={null}
                          width={"max-content"}
                          children={
                              <ContactForm
                                  cardProps={"Контакт"}
                                  onCompleted={() =>
                                      setDelegatesModalStatus(null)}
                                  initialObject={delegatesModalStatus?.organization_id ? {id: delegatesModalStatus?.organization_id} : null}
                              />
                          }
                      />
                      <Modal
                          key={organizationsModalStatus?.mode || organizationsModalStatus?.organization_id || null}
                          open={organizationsModalStatus}
                          onCancel={() => setOrganizationsModalStatus(null)}
                          footer={null}
                          width={"max-content"}
                          children={
                              <OrganizationForm
                                  cardProps={{title: "Организация"}}
                                  onCompleted={(value) => {
                                      refetchOrganizations();
                                      form.setFieldValue("organization_customer", {selected: value.id, output: value.name});
                                      setOrganizationsModalStatus(null);
                                      setSelectedOrganizationId(value.id);
                                  }}
                                  initialObject={organizationsModalStatus?.organization_id ? {id: organizationsModalStatus?.organization_id} : null}
                              />
                          }
                      />
                      <Modal
                          key={nanoid()}
                          open={typeProjectModalStatus?.mode}
                          onCancel={() => setTypeProjectModalStatus(null)}
                          footer={null}
                          width={"max-content"}
                          children={
                              typeProjectModalStatus &&
                              <TypeProjectForm
                                  cardProps={{title: "Организация"}}
                                  onCompleted={(value) => {
                                      form.setFieldValue("type_project_document", {
                                          output: value.code + " - " + value.name,
                                          selected: value.id
                                      })
                                      setTypeProjectModalStatus(null)
                                  }}
                                  localObject={typeProjectModalStatus?.object}
                              />
                          }
                      />

                  </>
                  }/>)
    }
;

export default ProjectForm;
