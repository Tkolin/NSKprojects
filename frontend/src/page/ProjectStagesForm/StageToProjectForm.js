import { useMutation } from "@apollo/client";
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

import { PlusOutlined } from "@ant-design/icons";
import {
    PROJECT_STAGE_SYNC_MUTATION,
    SET_STAGE_TEMPLATE_TO_PROJECT_MUTATION,
} from "../../graphql/mutationsProject";
import { NotificationContext } from "../../NotificationProvider";
import { ModalButton } from "../simplesForms/formComponents/ModalButtonComponent";
import StageForm from "../simplesForms/StageForm";
import TemplatesStageForm from "../simplesForms/TemplatesStageForm";
import StageItem from "./components/StageItem";
import StagesListFooter from "./components/StagesListFooter";
import StagesListHeader from "./components/StagesListHeader";

const StageToProjectForm = ({ onCompleted, project, cardProps }) => {
  // Первичные данные

  const [form] = Form.useForm();

  // Внешняя логика
  const [totalToPercent, setTotalToPercent] = useState(0);
  const [templateModalStatus, setTemplateModalStatus] = useState(false);
  const [totalToDuration, setTotalToDuration] = useState(0);
  const [stageModalStatus, setStageModalStatus] = useState(null);
  const { openNotification } = useContext(NotificationContext);

  const [mutateStage, { loading: loading }] = useMutation(
    PROJECT_STAGE_SYNC_MUTATION,
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
          `Ошибка при выполнении создания этапа : ${error.message}`
        );
      },
    }
  );
  const load = () => {
    form.setFieldValue(
      "stageList",
      project.project_stages.map((row) => ({
        stage: { selected: row?.stage?.id, output: row?.stage?.name },
        duration: row.duration,
        offset: row.offset,
        percent: row.percent,
      }))
    );
  };

  useEffect(() => {
    project && load();
  }, [project, project.project_stages]);

  const handleChange = () => {
    handleFooterUpdate();
  };
  const handleFooterUpdate = () => {
    const stageList = form.getFieldValue("stageList");
    if (Array.isArray(stageList)) {
      const totalDuration = stageList.reduce((acc, item) => {
        const duration = parseInt(item?.duration_item) || 0;
        return acc + duration;
      }, 0);
      setTotalToDuration(totalDuration);
    }
    if (Array.isArray(stageList)) {
      const totalProcent = stageList.reduce((acc, item) => {
        const procent = item?.percent ?? 0;
        return acc + procent;
      }, 0);
      setTotalToPercent(totalProcent);
    }
  };
  const moveItem = (index, newIndex) => {
    const stageList = form.getFieldValue("stageList");
    if (newIndex < 0 || newIndex >= stageList.length) return;
    const [movedItem] = stageList.splice(index, 1);
    stageList.splice(newIndex, 0, movedItem);
    form.setFieldsValue({ stageList });
    handleChange();
  };
  const handleSave = () => {
    let i = 1;
    const data = form.getFieldsValue()?.stageList?.map((row) => ({
      project_id: project.id,
      stage_id: row.stage.selected,
      number: i++,
      percent: row.percent,
      duration: row.duration,
      offset: row.offset,
    }));

    mutateStage({ variables: { data: data } });
  };
  const [mutateTemplate, { loading: loadingResult }] = useMutation(
    SET_STAGE_TEMPLATE_TO_PROJECT_MUTATION,
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
        style={{ width: 1400 }}
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
                    Выбрать этапы из проекта
                  </Button>
                </Space>
              </Col>
              <Col span={6}>
                <Alert
                  message={
                    <>
                      Функции загрузки шаблонов этапов:
                      <ul>
                        <li>
                          Загрузить заданный шаблон - загружает список этапов,
                          из указанного как шаблон проекта
                        </li>
                        <li>
                          Выбрать этапы из проекта - необходимо выбрать проект,
                          который будет взят за шаблон
                        </li>
                      </ul>
                    </>
                  }
                />
              </Col>
            </Row>
            <Form
              layout="vertical"
              onFinish={handleSave}
              onChange={() => {
                handleChange();
              }}
              form={form}
            >
              <Form.List name="stageList">
                {(fields, { add, remove }) => (
                  <>
                    <StagesListHeader />
                    {fields.map(({ key, name, ...restField }, index) => (
                      <StageItem
                        index={index}
                        moveItem={moveItem}
                        setStageModalStatus={setStageModalStatus}
                        removeItem={(value) => {
                          remove(value);
                          handleChange();
                        }}
                        onChange={() => {
                          handleChange();
                        }}
                        project={{
                          price: project?.price,
                          prepayment: project?.prepayment,
                          duration: project.duration,
                        }}
                        restField={restField}
                      />
                    ))}
                    <StagesListFooter
                      project={project}
                      totalToDuration={totalToDuration}
                      totalToPercent={totalToPercent}
                      freeCol={
                        <Button
                          type="primary"
                          size={"small"}
                          onClick={() => add()}
                          style={{ width: "100%" }}
                          icon={<PlusOutlined />}
                        >
                          Добавить этап к списку
                        </Button>
                      }
                    />
                  </>
                )}
              </Form.List>
            </Form>
            <Modal
              key={stageModalStatus?.mode || stageModalStatus?.stage_id || null}
              open={stageModalStatus}
              onCancel={() => setStageModalStatus(null)}
              footer={null}
              width={"max-content"}
              children={
                <StageForm
                  cardProps={{ title: "Этап" }}
                  onCompleted={(value) => {
                    const newRow = [...form.getFieldValue("stageList")];
                    newRow[stageModalStatus?.key] = {
                      stage: {
                        selected: value.id,
                        output: value.name,
                      },
                    };
                    form.setFieldValue("stageList", newRow);
                    setStageModalStatus(null);
                  }}
                  initialObject={
                    stageModalStatus?.stage_id
                      ? { id: stageModalStatus?.stage_id }
                      : null
                  }
                />
              }
            />
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
              <TemplatesStageForm
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

export default StageToProjectForm;
