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
import {StyledButtonGreen} from "../components/style/ButtonStyles";
import {ADD_PROJECT_MUTATION, UPDATE_PROJECT_MUTATION} from "../../graphql/mutationsProject";
import {rebuildProjectResultQuery} from "../components/script/rebuildData/ProjectRebuilderQuery";
import {CustomDatePicker} from "../components/FormattingDateElementComponent";
import ContactForm from "../simplesForms/ContactForm";
import OrganizationForm from "../simplesForms/OrganizationForm";
import {ModalButton} from "../simplesForms/formComponents/ModalButtonComponent";

 const ProjectForm = ({onCompleted, project, type, requiredOptions = ["group_type_project_document"], options, cardProps}) => {
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
            !(project.id) && form.setFieldValue("type_project_document", null);
            if (dataTypeProject?.typeProjects?.items && selectedGroupTypeProject && !loadingTypeProject) {
                console.log("dataTypeProject", dataTypeProject);
                setDataTypesOutput(dataTypeProject?.typeProjects?.items?.filter(row => row?.group?.id === selectedGroupTypeProject));
            }
        }, [dataTypeProject, selectedGroupTypeProject]);

        const [isRequest, setIsRequest] = useState(false);
        const [isKp, setIsKp] = useState(false);
        useEffect(() => {
            if (project?.id) {

                (type === "request") && setIsRequest(true);
                (type === "requestUp") && setIsRequest(true) && setIsKp(true);
            }
        }, [type, project]);
        // Подгрузка при обновлении


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
            if (!isRequest && number)
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
            //TODO: Продумать
            if (isRequest) {
                if (!(data.name && data.status_id && data.organization_customer_id)) {
                    openNotification('topRight', 'error', `Ошибка при выполнении создания`);
                    return;
                }
            }
            if (isKp) {
                if (!(data.type_project_document_id)) {
                    openNotification('topRight', 'error', `Ошибка при выполнении создания`);
                    return;
                }
            }
            mutateProject({
                variables: {
                    ...(project.id ? {id: project.id} : {}),
                    data
                }
            });
        }
        const createNumber = () => {
            if (isRequest && (project?.id && project?.id > -1)) {
                return project.number;
            }
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
                          disabled={errorProjectCountByOrg}
                          isMany={cardProps?.actions}
                          loading={loadProjectCountByOrg || loading}
                          onClick={()=>form.submit()}
                          children={project ? `Обновить` : `Создать`}/>
                      , ...cardProps?.actions ?? []
                  ]}
                  children={<>
                      <Form form={form} onFinish={handleSave} layout="vertical">

                          <Form.Item name="name" label="Наименование проекта"
                                     rules={[{required: true}]}>
                              <Input/>
                          </Form.Item>
                          <Form.Item name="group_type_project_document" label="Тип документа" rules={[{required: requiredOptions?.includes("group_type_project_document")}]}>
                              <CustomAutoComplete
                                  disabled={!isRequest}
                                  loading={loadingGroupProject}
                                  typeData={"CODENAME"}
                                  data={dataGroupProject?.groupTypeProjects}
                                  onSelect={(value) => setSelectedGroupTypeProject(value.id)}


                              />
                          </Form.Item>
                          <Form.Item name="type_project_document" label="Подтип документа">
                              <CustomAutoCompleteAndCreate
                                  loading={loadingTypeProject}
                                  disabled={!isRequest}
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
                                              }, mode: "edit"
                                      })
                                  }}
                              />
                          </Form.Item>
                          <Form.Item name="organization_customer" label="Заказчик"
                                     rules={[{required: true, message: 'Please confirm your username!'}]}>
                              <CustomAutoCompleteAndCreate
                                  onChange={(value) => handleChangeCustomer(value)}
                                  loading={loadingOrganizations}
                                  firstBtnOnClick={() => {
                                      setOrganizationsModalStatus("add");
                                  }}
                                  data={dataOrganizations?.organizations?.items}
                              />
                          </Form.Item>
                          <Form.Item label={"Обьекты"} rules={[{required: true}]}>
                              <Collapse size={"small"}>
                                  <Collapse.Panel header={"Обьекты"}>
                                      <Form.Item name="facility_id" style={{width: "100%"}}>
                                          <FacilitiesTreeComponent/>
                                      </Form.Item>
                                  </Collapse.Panel>
                              </Collapse>
                          </Form.Item>
                          <Form.Item name="date_range" label="Продолжительность">
                              <DateRangePickerComponent/>
                          </Form.Item>
                          <Form.Item name="date_create" label="Дата создания договора" style={{width: '50%'}}>
                              <CustomDatePicker
                                  placeholder="Выберите дату" style={{width: '100%'}}/>
                          </Form.Item>
                          <Form.Item name="status_id" label="Статус проекта" rules={[{required: true}]}>
                              <CustomAutoComplete
                                  loading={loadingStatuses}
                                  disabled={isRequest}
                                  data={dataStatuses?.projectStatuses}
                                  placeholder={"Выберите статус проекта..."}
                              />
                          </Form.Item>
                          <Space.Compact style={{width: '100%'}}>
                              <Form.Item name="price" style={{width: '100%'}} label="Стоимость">
                                  <InputNumber suffix={"₽"} style={{width: '100%'}}
                                               formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                               parser={value => `${value}`.replace(/[^0-9]/g, '')}/>
                              </Form.Item>
                              <Form.Item name="prepayment" style={{width: '150px'}} label="Аванс"
                                         rules={[{required: true}]}>
                                  <InputNumber suffix={"%"} style={{width: '100%'}}
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

                  </>
                  }/>)
    }
;

export default ProjectForm;
