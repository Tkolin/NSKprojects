import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Col,
  Divider,
  Form,
  InputNumber,
  Row,
  Space,
  Tooltip,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import { PERSONS_QUERY_COMPACT } from "../../..//graphql/queries/queriesCompact";
import { NotificationContext } from "../../../NotificationProvider";
import { UPDATE_EMPLOYEES_TO_TASKS } from "../../../graphql/mutations/task";
import {
  StyledButtonGreen,
  StyledButtonRed,
} from "../../components/style/ButtonStyles";
import { CustomAutoComplete } from "../../components/style/SearchAutoCompleteStyles";

const PersonsByStagesCompactForm = ({
  tasks,
  projectId,
  stageNumber,
  onCompleted,
}) => {
  // Первичные данные
  const { openNotification } = useContext(NotificationContext);
  const [form] = Form.useForm();
  const [actualObject, setActualObject] = useState();
  useEffect(() => {
    console.log("tasks", tasks, "projectId", projectId);
    if (tasks) {
      // Получаем список уникальных исполнителей
      const uniqueExecutors = tasks
        .flatMap((task) => task.executors.map((executor) => executor.executor))
        .filter(
          (executor, index, self) =>
            index === self.findIndex((e) => e.id === executor.id)
        );

      form.setFieldsValue({
        executorsList: uniqueExecutors.map((row) => ({
          executor: {
            selected: row.id,
            output:
              row.passport.last_name +
              " " +
              row.passport.first_name +
              " " +
              row.passport.patronymic,
          },
        })),
      });

      console.log(
        "Unique Executors List:",
        uniqueExecutors.map((row) => ({
          executor: {
            selected: row.id,
            output:
              row.passport.last_name +
              " " +
              row.passport.first_name +
              " " +
              row.passport.patronymic,
          },
        }))
      );
    }
  }, [tasks]);

  const { loading: loadingPersons, data: dataPersons } = useQuery(
    PERSONS_QUERY_COMPACT
  );
  // Мутация
  const [mutate, { loading: loading }] = useMutation(
    UPDATE_EMPLOYEES_TO_TASKS,
    {
      onCompleted: (data) => {
        onCompleted && onCompleted();
      },
      onError: (error) => {
        openNotification(
          "topRight",
          "error",
          `Ошибка при выполнении мутации: ${error.message}`
        );
      },
    }
  );

  const updateForm = (data) => {
    if (data) {
      form.resetFields();
      form.setFieldsValue({
        ...data,
      });
    }
  };

  // Завершение
  const handleSubmit = () => {
    mutate({
      variables: {
        employeesIds: form
          .getFieldsValue()
          .executorsList.map((row) => row.executor.selected),
        tasksIds: tasks.map((row) => row.id),
        stage_number: stageNumber,
      },
    });
  };

  return (
    <div>
      <Form
        size={"small"}
        form={form}
        onChange={console.log(form.getFieldsValue())}
      >
        <Form.List name="executorsList">
          {(fields, { add, remove }) => (
            <>
              <strong>
                {" "}
                <Row gutter={0} style={{ marginBottom: 0 }}>
                  <Space.Compact style={{ width: "100%" }}>
                    <Col span={2}>№</Col>
                    <Col span={21}>ФИО исполнителя</Col>
                    <Col span={1}></Col>
                  </Space.Compact>
                </Row>
                <Divider style={{ margin: 4 }} />
              </strong>
              {fields.map(({ key, name, ...restField }, index) => (
                <Row key={index} gutter={0} style={{ marginBottom: 0 }}>
                  <Space.Compact style={{ width: "100%" }}>
                    <Col span={2}>
                      <Tooltip title="Номер">
                        <InputNumber
                          disabled={true}
                          style={{ width: "100%" }}
                          value={index + 1}
                          min={1}
                          max={25}
                        />
                      </Tooltip>
                    </Col>
                    <Col span={21}>
                      <Tooltip title="Наименование этапа">
                        <Form.Item name={[index, "executor"]}>
                          <CustomAutoComplete
                            size={"small"}
                            typeData="FIO"
                            style={{ width: "100%" }}
                            placeholder={"Выбор исполнителя..."}
                            data={dataPersons?.persons?.items.map((row) => ({
                              ...row.passport,
                              id: row.id,
                            }))}
                          />
                        </Form.Item>
                      </Tooltip>
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
                style={{ width: "100%", marginBottom: 10, marginTop: 10 }}
              >
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: "100%" }}
                  icon={<PlusOutlined />}
                >
                  Добавить исполнителя на этап
                </Button>
              </Space.Compact>
            </>
          )}
        </Form.List>
        <div style={{ width: "100%", textAlign: "center" }}>
          <StyledButtonGreen loading={loading} onClick={() => handleSubmit()}>
            Сохранить изменения
          </StyledButtonGreen>
        </div>
      </Form>
    </div>
  );
};

export default PersonsByStagesCompactForm;
