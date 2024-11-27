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
import IrdItem from "./components/IrdItem";

import { NotificationContext } from "../../NotificationProvider";
import { ModalButton } from "../simplesForms/formComponents/ModalButtonComponent";
import IrdForm from "../simplesForms/IrdForm";
import TemplatesIrdsForm from "../simplesForms/TemplatesIrdsForm";

const IrdToProjectForm = ({ project, onCompleted, ...cardProps }) => {
  const { openNotification } = useContext(NotificationContext);

  // Первичные данные
  const [form] = Form.useForm();
  const [irdModalStatus, setIrdModalStatus] = useState(null);
  const [templateModalStatus, setTemplateModalStatus] = useState(null);

  const [mutateIrd, { loading: loading }] = useMutation(
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
      "project.project_irds",
      project.project_irds?.map((row) => ({
        ...row,
        received_date: row.received_date ? dayjs(row.received_date) : null,
        ird: { selected: row?.ird?.id, output: row?.ird?.name },
      }))
    );
    project &&
      project.project_irds &&
      form.setFieldsValue({
        irdList:
          project.project_irds &&
          Object.values(project.project_irds)?.map((row) => ({
            ...row,
            received_date: row.received_date ? dayjs(row.received_date) : null,
            ird: { selected: row?.ird?.id, output: row?.ird?.name },
          })),
      });
  };
  const handleSave = () => {
    console.log(
      "form DATA",
      form.getFieldValue("irdList").map((row) => ({
        project_id: project?.id ?? null,
        ird_id: row?.ird?.selected ?? null,
        stage_number: row?.stageNumber ? parseInt(row?.stage_number) : null,
        application_project: row?.application_project
          ? parseInt(row?.application_project)
          : null,
        received_date: row?.received_date
          ? dayjs(row?.received_date).format("YYYY-MM-DD")
          : null,
      }))
    );
    mutateIrd({
      variables: {
        data: form.getFieldValue("irdList").map((row) => ({
          project_id: project?.id ?? null,
          ird_id: row?.ird?.selected ?? null,
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
    project.project_irds && load();
  }, [project]);

  const {
    loading: loadingIrds,
    error: errorIrds,
    data: dataIrds,
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
              <Form.List name="irdList">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }, index) => (
                      <IrdItem
                        {...restField}
                        setIrdModalStatus={setIrdModalStatus}
                        key={key}
                        index={index}
                        irdData={dataIrds?.irds?.items}
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
                key={irdModalStatus?.mode || irdModalStatus?.ird_id || null}
                open={irdModalStatus}
                onCancel={() => setIrdModalStatus(null)}
                footer={null}
                width={"max-content"}
                title={"ИРД"}
                children={
                  <IrdForm
                    onCompleted={(value) => {
                      const newRow = [...form.getFieldValue("irdList")];
                      newRow[irdModalStatus?.key] = {
                        ird: {
                          selected: value.id,
                          output: value.name,
                        },
                      };
                      form.setFieldValue("irdList", newRow);
                      form.validateFields(["irdList"]);
                      setIrdModalStatus(null);
                    }}
                    initialObject={
                      irdModalStatus?.ird_id
                        ? { id: irdModalStatus?.ird_id }
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
              <TemplatesIrdsForm
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

export default IrdToProjectForm;
