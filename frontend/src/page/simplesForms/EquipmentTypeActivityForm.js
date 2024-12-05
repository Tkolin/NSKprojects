import { useLazyQuery, useMutation } from "@apollo/client";
import { Card, Form, Input, Space } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { NotificationContext } from "../../NotificationProvider";

import {
  CREATE_EQUIPMENT_TYPE_ACTIVITY_MUTATION,
  UPDATE_EQUIPMENT_TYPE_ACTIVITY_MUTATION,
} from "../../graphql/mutations/equipmentTypeActivity";
import { EQUIPMENT_TYPE_QUERY } from "../../graphql/queries/queriesSingle";
import { ModalButton } from "./formComponents/ModalButtonComponent";

const EquipmentTypeActivityForm = ({
  localObject,
  initialObject,
  onCompleted,
  cardProps,
}) => {
  // Первичные данные
  const { openNotification } = useContext(NotificationContext);
  const [form] = Form.useForm();
  const [actualObject, setActualObject] = useState(
    localObject?.id ?? initialObject ?? null
  );
  const [loadContext, { loading, data }] = useLazyQuery(EQUIPMENT_TYPE_QUERY, {
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
    actualObject
      ? UPDATE_EQUIPMENT_TYPE_ACTIVITY_MUTATION
      : CREATE_EQUIPMENT_TYPE_ACTIVITY_MUTATION,
    {
      onCompleted: (data) => {
        openNotification("topRight", "success", `Тип создана`);
        form.resetFields();
        onCompleted &&
          onCompleted(
            data?.updateEquipmentTypeActivity ||
              data?.createEquipmentTypeActivity
          );
      },
      onError: (error) => {
        openNotification(
          "topRight",
          "error",
          `Ошибка при создании типа: ${error.message}`
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
          </Space.Compact>
        </Form>
      }
    />
  );
};

export default EquipmentTypeActivityForm;
