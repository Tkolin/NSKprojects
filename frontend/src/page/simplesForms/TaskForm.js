import { useLazyQuery, useMutation } from "@apollo/client";
import { Card, Form, Input, Space } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { NotificationContext } from "../../NotificationProvider";
import {
  ADD_TASK_MUTATION,
  UPDATE_TASK_MUTATION,
} from "../../graphql/mutations/task";
import { TASKS_QUERY_BY_ID } from "../../graphql/queries/queriesByID";
import { StyledButtonGreen } from "../components/style/ButtonStyles";
import { ModalButton } from "./formComponents/ModalButtonComponent";

const TaskForm = ({ localObject, initialObject, onCompleted, cardProps }) => {
  // Первичные данные
  const { openNotification } = useContext(NotificationContext);
  const [form] = Form.useForm();
  const [actualObject, setActualObject] = useState(
    localObject?.id ?? initialObject ?? null
  );
  const [loadContext, { loading, data }] = useLazyQuery(TASKS_QUERY_BY_ID, {
    variables: { id: initialObject?.id },
    onCompleted: (data) => {
      setActualObject(data?.tasks?.items[0]);
      updateForm(data?.tasks?.items[0]);
    },
    onError: (error) => {
      openNotification(
        "topRight",
        "error",
        `Ошибка при загрузке данных: ${error.message}`
      );
    },
  });

  // Мутация
  const [mutate, { loading: loadingSave }] = useMutation(
    actualObject ? UPDATE_TASK_MUTATION : ADD_TASK_MUTATION,
    {
      onCompleted: (data) => {
        openNotification("topRight", "success", `Задача создана`);
        form.resetFields();
        onCompleted && onCompleted(data?.updateTask || data?.createTask);
      },
      onError: (error) => {
        openNotification(
          "topRight",
          "error",
          `Ошибка при создании задачи: ${error.message}`
        );
      },
    }
  );

  // Подгрузка при обновлении
  useEffect(() => {
    if (initialObject?.id) loadContext();
  }, [initialObject]);
  useEffect(() => {
    if (localObject?.id) updateForm(localObject);
  }, [localObject]);
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
        ...(actualObject ? { id: actualObject.id } : {}),
        data: { ...form.getFieldsValue() },
      },
    });
  };

  return (
    <Card
      style={{ width: 400 }}
      {...cardProps}
      actions={[
        <ModalButton
          modalType={"green"}
          isMany={cardProps?.actions}
          loading={loadingSave}
          onClick={() => form.submit()}
          children={actualObject ? `Обновить` : `Создать`}
        />,
        ...(cardProps?.actions ?? []),
      ]}
      children={
        <Form form={form} onFinish={handleSubmit} layout="horizontal">
          <Space.Compact style={{ width: "100%" }}>
            <Form.Item
              style={{ width: "100%" }}
              name="name"
              label="Наименование"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <StyledButtonGreen
              loading={loading}
              type="primary"
              onClick={handleSubmit}
            >
              {actualObject ? `Обновить` : `Создать`}
            </StyledButtonGreen>
          </Space.Compact>
        </Form>
      }
    />
  );
};

export default TaskForm;
