import { Alert, Card, Form, InputNumber, Typography } from "antd";
import React, { useContext, useEffect, useState } from "react";

import { useMutation, useQuery } from "@apollo/client";
import FormItem from "antd/es/form/FormItem";
import { PERSONS_QUERY_COMPACT } from "../..//graphql/queries/queriesCompact";
import { CustomAutoComplete } from "../components/style/SearchAutoCompleteStyles";

import Link from "antd/es/typography/Link";
import { PROJECT_TASKS_DETAIL_UPDATE } from "../../graphql/mutations/project";
import { NotificationContext } from "../../NotificationProvider";
import { ModalButton } from "../simplesForms/formComponents/ModalButtonComponent";

const { Text } = Typography;

const TaskProjectForm = ({
  taskToProject,
  mainTaskToProject,
  onCompleted,
  onChange,
  disabled,
  limitDuration,
  cardProps,
  durationLock,
}) => {
  const permissions = JSON.parse(localStorage.getItem("userPermissions")).map(
    (row) => row.name_key
  );
  // Состояния
  const [form] = Form.useForm();
  const { openNotification } = useContext(NotificationContext);
  const [localDisabled, setLocalDisabled] = useState();
  const [limitTimes, setLimitTimes] = useState({ offset: 0, duration: 0 });
  const checkDisabled = () => {
    if (mainTaskToProject) setLocalDisabled(true);
    else setLocalDisabled(disabled);
  };
  useEffect(() => {
    checkDisabled();
  }, [disabled, mainTaskToProject]);

  // TODO: Вынести при необходимости
  const {
    loading: loadingDelegates,
    error: errorDelegates,
    data: personsList,
  } = useQuery(PERSONS_QUERY_COMPACT);

  const [updateProjectTasks, { loading: loadingMutationSecond }] = useMutation(
    PROJECT_TASKS_DETAIL_UPDATE,
    {
      onCompleted: (data) => {
        if (onChange) {
          onChange();
        }
        openNotification(
          "topRight",
          "success",
          `Создание новой записи выполнено успешно`
        );
        onCompleted && onCompleted();
      },
      onError: (error) => {
        openNotification(
          "topRight",
          "error",
          `Ошибка при выполнении создания: ${error.message}`
        );
      },
    }
  );

  useEffect(() => {
    console.log(
      "personsList",
      personsList?.persons?.items.map((row) => ({
        id: row.id,
        first_name: row.passport.first_name,
        last_name: row.passport.last_name,
        patronymic: row.passport.patronymic,
      }))
    );
  }, [personsList]);
  useEffect(() => {
    console.log("=_-+new setting task: ", taskToProject);
    if (taskToProject) {
      checkDisabled();
      form.resetFields();
      form.setFieldsValue({
        duration: taskToProject.duration ?? null,
        work_hours: taskToProject.work_hours ?? null,
        offset: taskToProject.offset ?? null,
        price: taskToProject.price,
        executor: taskToProject?.executor
          ? {
              selected: taskToProject?.executor?.id,
              output:
                (taskToProject?.executor?.passport?.last_name ?? " ") +
                " " +
                (taskToProject?.executor?.passport?.first_name ?? " ") +
                " " +
                (taskToProject?.executor?.passport?.patronymic ?? " "),
            }
          : null,
        description: taskToProject.description,
      });
    }
  }, [taskToProject]);
  const handleComplete = () => {
    console.log("taskToProject", taskToProject);
    const formData = form.getFieldsValue();
    updateProjectTasks({
      variables: {
        data: {
          id: taskToProject.id,
          description: taskToProject.description,
          executor_id: formData?.executor?.selected ?? null,
          price: formData.price,
          offset: formData.offset,
          duration: formData.duration,
          work_hours: formData.work_hours,
        },
      },
    });
  };
  if (!taskToProject || loadingDelegates)
    return <Alert message="Выберите задачу" type="info" showIcon />;
  return (
    <Card
      style={{ width: "100%" }}
      {...cardProps}
      actions={[
        <ModalButton
          modalType={"green"}
          isMany={cardProps?.actions}
          loading={loadingMutationSecond}
          onClick={() => form.submit()}
          children={`Сохранить`}
        />,
        ...(cardProps?.actions ?? []),
      ]}
      children={
        <>
          {mainTaskToProject && (
            <Alert
              style={{ marginBottom: 10 }}
              message={
                <Text>
                  У главной задачи уже установлен исполнитель!
                  {localDisabled ? (
                    <Link onClick={() => setLocalDisabled(false)}>
                      {" "}
                      хотите переназначить эту подзадачу? <br /> (нажмите для
                      изменения)
                    </Link>
                  ) : (
                    <Text strong> идёт изменение</Text>
                  )}
                </Text>
              }
              type="warning"
              showIcon
            />
          )}
          <Form
            form={form}
            onFinish={handleComplete}
            labelAlign="left"
            disabled={localDisabled}
          >
            <Alert
              message={
                durationLock
                  ? "Смещение относительно начала проекта"
                  : "Смещение относительно начала этапа: (Продолжительность: " +
                    limitDuration +
                    ")"
              }
              style={{ marginBottom: "25px" }}
            />
            <FormItem name={"offset"} label={"Смещение"}>
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                disabled={durationLock}
                max={
                  taskToProject.project_task_inherited_id
                    ? limitDuration - limitTimes?.duration
                    : 999
                }
                onChange={(value) =>
                  setLimitTimes({ ...limitTimes, offset: value })
                }
                placeholder={"Продолжительность задачи"}
              />
            </FormItem>
            <FormItem name={"duration"} label={"Продолжительность"}>
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                disabled={durationLock}
                max={
                  taskToProject.project_task_inherited_id
                    ? limitDuration - limitTimes?.offset
                    : 999
                }
                onChange={(value) =>
                  setLimitTimes({ ...limitTimes, duration: value })
                }
                placeholder={"Продолжительность задачи"}
              />
            </FormItem>
            <FormItem name={"work_hours"} label={"Трудо-часы (Факт)"}>
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                max={9000}
                placeholder={"Кол-во затраченного времени"}
              />
            </FormItem>
            {permissions.includes("read-project-payments") && (
              <Form.Item
                name="price"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ width: "100%" }}
                label="Стоимость"
              >
                <InputNumber
                  suffix={"₽"}
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => `${value}`.replace(/[^0-9]/g, "")}
                />
              </Form.Item>
            )}
            <Form.Item label={"Исполнитель"} name={"executor"}>
              <CustomAutoComplete
                typeData={"FIO"}
                style={{ width: "100%", maxWidth: "100%" }}
                data={personsList?.persons?.items.map((row) => ({
                  id: row.id,
                  first_name: row.passport.first_name,
                  last_name: row.passport.last_name,
                  patronymic: row.passport.patronymic,
                }))}
                onChange={() => console.log("1 CustomAutoComplete")}
              />
            </Form.Item>
          </Form>
        </>
      }
    />
  );
};

export default TaskProjectForm;
