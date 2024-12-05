import { PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Popconfirm,
  Row,
  Space,
} from "antd";
import React, { useContext, useEffect, useState } from "react";

import dayjs from "dayjs";
import {
  PROJECT_IRDS_SYNC_MUTATION,
  SET_IRD_TEMPLATE_TO_PROJECT_MUTATION,
} from "../../graphql/mutations/project";
import { IRDS_QUERY_COMPACT } from "../../graphql/queries/queriesCompact";
import SupplierEquipmentTypesItem from "./components/SupplierEquipmentTypesItem";

import { NotificationContext } from "../../NotificationProvider";
import { ModalButton } from "../simplesForms/formComponents/ModalButtonComponent";
import SupplierEquipmentTypesForm from "../simplesForms/SupplierEquipmentTypesForm";
import TemplatesSupplierEquipmentTypessForm from "../simplesForms/TemplatesSupplierEquipmentTypessForm";

const SupplierEquipmentTypesListForm = ({
  project,
  onCompleted,
  ...cardProps
}) => {
  const { openNotification } = useContext(NotificationContext);

  // Первичные данные
  const [form] = Form.useForm();
  const [
    supplierEquipmentTypesModalStatus,
    setSupplierEquipmentTypesModalStatus,
  ] = useState(null);
  const [templateModalStatus, setTemplateModalStatus] = useState(null);

  const [mutateSupplierEquipmentTypes, { loading: loading }] = useMutation(
    PROJECT_IRDS_SYNC_MUTATION,
    {
      onCompleted: (data) => {
        openNotification(
          "topRight",
          "success",
          `Создание новой записи в таблице  выполнено успешно`
        );
        onCompleted && onCompleted();
      },
      onError: (error) => {
        openNotification(
          "topRight",
          "error",
          `Ошибка при выполнении создания ирд : ${error.message}`
        );
        return false;
      },
    }
  );

  const load = () => {
    console.log(
      "project.project_supplierEquipmentTypess",
      project.project_supplierEquipmentTypess?.map((row) => ({
        ...row,
        received_date: row.received_date ? dayjs(row.received_date) : null,
        supplierEquipmentTypes: {
          selected: row?.supplierEquipmentTypes?.id,
          output: row?.supplierEquipmentTypes?.name,
        },
      }))
    );
    project &&
      project.project_supplierEquipmentTypess &&
      form.setFieldsValue({
        supplierEquipmentTypesList:
          project.project_supplierEquipmentTypess &&
          Object.values(project.project_supplierEquipmentTypess)?.map(
            (row) => ({
              ...row,
              received_date: row.received_date
                ? dayjs(row.received_date)
                : null,
              supplierEquipmentTypes: {
                selected: row?.supplierEquipmentTypes?.id,
                output: row?.supplierEquipmentTypes?.name,
              },
            })
          ),
      });
  };
  const handleSave = () => {
    console.log(
      "form DATA",
      form.getFieldValue("supplierEquipmentTypesList").map((row) => ({
        project_id: project?.id ?? null,
        supplierEquipmentTypes_id:
          row?.supplierEquipmentTypes?.selected ?? null,
        stage_number: row?.stageNumber ? parseInt(row?.stage_number) : null,
        application_project: row?.application_project
          ? parseInt(row?.application_project)
          : null,
        received_date: row?.received_date
          ? dayjs(row?.received_date).format("YYYY-MM-DD")
          : null,
      }))
    );
    mutateSupplierEquipmentTypes({
      variables: {
        data: form.getFieldValue("supplierEquipmentTypesList").map((row) => ({
          project_id: project?.id ?? null,
          supplierEquipmentTypes_id:
            row?.supplierEquipmentTypes?.selected ?? null,
          stage_number: row?.stage_number ? parseInt(row?.stage_number) : null,
          application_project: row?.application_project
            ? parseInt(row?.application_project)
            : null,
          received_date: row?.received_date
            ? dayjs(row?.received_date).format("YYYY-MM-DD")
            : null,
        })),
      },
    });
  };
  useEffect(() => {
    project.project_supplierEquipmentTypess && load();
  }, [project]);

  const {
    loading: loadingSupplierEquipmentTypess,
    error: errorSupplierEquipmentTypess,
    data: dataSupplierEquipmentTypess,
  } = useQuery(IRDS_QUERY_COMPACT);
  const [mutateTemplate, { loading: loadingResult }] = useMutation(
    SET_IRD_TEMPLATE_TO_PROJECT_MUTATION,
    {
      onCompleted: (data) => {
        console.log(`Ответ: `, data);
        onCompleted && onCompleted();
      },
      onError: (error) => {
        console.log(`Ошибка: `, error.message);
      },
    }
  );

  return (
    <>
      <Card
        style={{ width: 1200 }}
        {...cardProps}
        actions={[
          <ModalButton
            modalType={"green"}
            isMany={cardProps?.actions}
            loading={loading}
            onClick={() => form.submit()}
            children={project ? `Обновить` : `Создать`}
          />,
          ...(cardProps?.actions ?? []),
        ]}
        children={
          <>
            <Row>
              <Col span={6}>
                <Space direction={"vertical"} style={{ width: "100%" }}>
                  <Popconfirm
                    disabled={
                      !project.type_project_document?.template_project_id
                    }
                    okButtonProps={{
                      disabled:
                        !project.type_project_document?.template_project_id,
                      onClick: () =>
                        mutateTemplate({
                          variables: {
                            projectId: project.id,
                            templateProjectId:
                              project.type_project_document
                                ?.template_project_id,
                          },
                        }),
                    }}
                  >
                    <Button
                      disabled={
                        !project.type_project_document?.template_project_id
                      }
                      style={{ width: "100%" }}
                    >
                      Загрузить заданный шаблон
                    </Button>
                  </Popconfirm>

                  <Button
                    style={{ width: "100%" }}
                    onClick={() => setTemplateModalStatus(true)}
                  >
                    Выбрать ИРД из проекта
                  </Button>
                </Space>
              </Col>
              <Col span={6}>
                <Alert
                  message={
                    <>
                      Функции загрузки шаблонов ИРД:
                      <ul>
                        <li>
                          Загрузить заданный шаблон - загружает список ИРД, из
                          указанного как шаблон проекта
                        </li>
                        <li>
                          Выбрать ИРД из проекта - необходимо выбрать проект,
                          который будет взят за шаблон
                        </li>
                      </ul>
                    </>
                  }
                />
              </Col>
            </Row>

            <Form layout="vertical" onFinish={handleSave} form={form}>
              <Form.List name="supplierEquipmentTypesList">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }, index) => (
                      <SupplierEquipmentTypesItem
                        {...restField}
                        setSupplierEquipmentTypesModalStatus={
                          setSupplierEquipmentTypesModalStatus
                        }
                        key={key}
                        index={index}
                        supplierEquipmentTypesData={
                          dataSupplierEquipmentTypess?.supplierEquipmentTypess
                            ?.items
                        }
                        removeItem={(value) => {
                          remove(value);
                        }}
                      />
                    ))}

                    <Space.Compact
                      style={{ width: "100%", marginBottom: 10, marginTop: 0 }}
                    >
                      <Button
                        type={"primary"}
                        size={"small"}
                        onClick={() => add()}
                        style={{ width: "100%" }}
                        icon={<PlusOutlined />}
                      >
                        Добавить ИРД к списку
                      </Button>
                    </Space.Compact>
                  </>
                )}
              </Form.List>

              <Modal
                key={
                  supplierEquipmentTypesModalStatus?.mode ||
                  supplierEquipmentTypesModalStatus?.supplierEquipmentTypes_id ||
                  null
                }
                open={supplierEquipmentTypesModalStatus}
                onCancel={() => setSupplierEquipmentTypesModalStatus(null)}
                footer={null}
                width={"max-content"}
                title={"ИРД"}
                children={
                  <SupplierEquipmentTypesForm
                    onCompleted={(value) => {
                      const newRow = [
                        ...form.getFieldValue("supplierEquipmentTypesList"),
                      ];
                      newRow[supplierEquipmentTypesModalStatus?.key] = {
                        supplierEquipmentTypes: {
                          selected: value.id,
                          output: value.name,
                        },
                      };
                      form.setFieldValue("supplierEquipmentTypesList", newRow);
                      form.validateFields(["supplierEquipmentTypesList"]);
                      setSupplierEquipmentTypesModalStatus(null);
                    }}
                    initialObject={
                      supplierEquipmentTypesModalStatus?.supplierEquipmentTypes_id
                        ? {
                            id: supplierEquipmentTypesModalStatus?.supplierEquipmentTypes_id,
                          }
                        : null
                    }
                  />
                }
              />
            </Form>
          </>
        }
      />
      <Modal
        key={project.id + "temp_stage"}
        open={templateModalStatus}
        onCancel={() => setTemplateModalStatus(null)}
        footer={null}
        width={"max-content"}
        children={
          <Space
            style={{ justifyContent: "center", width: "100%" }}
            children={
              <TemplatesSupplierEquipmentTypessForm
                project={project}
                onCompleted={() => {
                  onCompleted();
                  setTemplateModalStatus(null);
                }}
              />
            }
          />
        }
      />
    </>
  );
};

export default SupplierEquipmentTypesListForm;
