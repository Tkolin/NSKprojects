import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Card, Col, Form, Modal, Row, Space, Tooltip } from "antd";
import React, { useContext, useState } from "react";
import { AutoCompleteFormItem } from "../components/CustomForm";

import { TS_CHAPTERS_QUERY } from "../..//graphql/queries/queriesCompact";
import { PROJECT_TS_SYNC_MUTATION } from "../../graphql/mutations/project";

import TextArea from "antd/es/input/TextArea";
import { NotificationContext } from "../../NotificationProvider";
import { StyledButtonRed } from "../components/style/ButtonStyles";
import { CustomAutoCompleteExtension } from "../components/style/SearchAutoCompleteStyles";
import { ModalButton } from "../simplesForms/formComponents/ModalButtonComponent";
import TechSpecForm from "../simplesForms/TechChapterForm";

const IrdToProjectForm = ({ onCompleted, ...cardProps }) => {
  const { openNotification } = useContext(NotificationContext);
  const project = { id: "1" };
  // Первичные данные
  const [form] = Form.useForm();
  const [irdModalStatus, setIrdModalStatus] = useState(null);

  const [mutateChapters, { loading: loadingMutation }] = useMutation(
    PROJECT_TS_SYNC_MUTATION,
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
          `Ошибка при выполнении создания раздел : ${error.message}`
        );
        return false;
      },
    }
  );
  const { loading: chaptersLoading, data: chaptersData } =
    useQuery(TS_CHAPTERS_QUERY);
  //   const load = () => {
  //     console.log(
  //       "project.project_ts_chapters",
  //       project.project_ts_chapters?.map((row) => ({
  //         ...row,
  //         received_date: row.received_date ? dayjs(row.received_date) : null,
  //         chapter: { selected: row?.chapter?.id, output: row?.chapter?.name },
  //       }))
  //     );
  //     project &&
  //       project.project_ts_chapters &&
  //       form.setFieldsValue({
  //         irdList:
  //           project.project_ts_chapters &&
  //           Object.values(project.project_ts_chapters)?.map((row) => ({
  //             ...row,
  //             received_date: row.received_date ? dayjs(row.received_date) : null,
  //             chapter: { selected: row?.chapter?.id, output: row?.chapter?.name },
  //           })),
  //       });
  //   };
  const handleSave = () => {
    console.log("form DATA", {
      projectId: project?.id ?? null,
      chapterIds: form
        .getFieldValue("irdList")
        .map((row) => row.chapter.selected),
    });
    mutateChapters({
      variables: {
        projectId: project?.id ?? null,
        chapterIds: form
          .getFieldValue("irdList")
          .map((row) => row.chapter.selected),
      },
    });
  };

  return (
    <>
      <Card
        style={{ width: 1200 }}
        {...cardProps}
        actions={[
          <ModalButton
            modalType={"green"}
            isMany={cardProps?.actions}
            loading={loadingMutation}
            onClick={() => form.submit()}
            children={project ? `Обновить` : `Создать`}
          />,
          ...(cardProps?.actions ?? []),
        ]}
        children={
          <>
            <Form layout="vertical" onFinish={handleSave} form={form}>
              <Form.List name="irdList">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }, index) => (
                      <Row key={index} gutter={0} style={{ marginBottom: 0 }}>
                        <Space.Compact style={{ width: "100%" }}>
                          <Col span={12}>
                            <Tooltip title="Наименование раздела">
                              <AutoCompleteFormItem
                                name={[index, "chapter"]}
                                rulesValidationRequired={true}
                                rulesValidationMessage={"Укажите раздел"}
                              >
                                <CustomAutoCompleteExtension
                                  style={{ marginBottom: 0, width: "100%" }}
                                  placeholder={"Выбор раздела..."}
                                  visibleMode={"CREATE_WHERE_NON_SELECTED"}
                                  loading={chaptersLoading}
                                  firstBtnOnClick={() =>
                                    setIrdModalStatus({
                                      mode: "add",
                                      key: index,
                                    })
                                  }
                                  data={
                                    chaptersData?.technicalSpecificationChapters
                                      ?.items
                                  }
                                />
                              </AutoCompleteFormItem>
                            </Tooltip>
                          </Col>
                          <Col span={11}>
                            <TextArea>Содержание раздела</TextArea>
                          </Col>
                          <Col span={1}>
                            <StyledButtonRed
                              icon={<CloseOutlined />}
                              onClick={() => remove && remove(index)}
                            />
                          </Col>
                        </Space.Compact>
                      </Row>
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
                        Добавить раздел к списку
                      </Button>
                    </Space.Compact>
                  </>
                )}
              </Form.List>

              <Modal
                key={irdModalStatus?.mode || irdModalStatus?.chapter_id || null}
                open={irdModalStatus}
                onCancel={() => setIrdModalStatus(null)}
                footer={null}
                width={"max-content"}
                title={"раздел"}
                children={
                  <TechSpecForm
                    onCompleted={(value) => {
                      const newRow = [...form.getFieldValue("irdList")];
                      newRow[irdModalStatus?.key] = {
                        chapter: {
                          selected: value.id,
                          output: value.name,
                        },
                      };
                      form.setFieldValue("irdList", newRow);
                      form.validateFields(["irdList"]);
                      setIrdModalStatus(null);
                    }}
                    initialObject={
                      irdModalStatus?.chapter_id
                        ? { id: irdModalStatus?.chapter_id }
                        : null
                    }
                  />
                }
              />
            </Form>
          </>
        }
      />
    </>
  );
};

export default IrdToProjectForm;
