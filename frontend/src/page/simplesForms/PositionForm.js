import { Card, Form, Input, Skeleton } from "antd";
import React, { useContext, useEffect, useState } from "react";

import { useLazyQuery, useMutation } from "@apollo/client";
import {
  CREATE_POSITION_MUTATION,
  UPDATE_POSITION_MUTATION,
} from "../../graphql/mutations/position";
import { POSITIONS_QUERY_BY_ID } from "../../graphql/queries/queriesByID";
import { NotificationContext } from "../../NotificationProvider";
import { ModalButton } from "./formComponents/ModalButtonComponent";

const PositionForm = ({
  localObject,
  initialObject,
  onCompleted,
  cardProps,
}) => {
  // Первичные данные
  const { openNotification } = useContext(NotificationContext);
  const [form] = Form.useForm();
  const nameModel = "Должность";
  const [actualObject, setActualObject] = useState(
    localObject?.id ?? initialObject ?? null
  );
  const [loadContext, { loading, data }] = useLazyQuery(POSITIONS_QUERY_BY_ID, {
    variables: { id: initialObject?.id },
    onCompleted: (data) => {
      setActualObject(data?.positions?.items[0]);
      updateForm(data?.positions?.items[0]);
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
    actualObject ? UPDATE_POSITION_MUTATION : CREATE_POSITION_MUTATION,
    {
      onCompleted: (data) => {
        openNotification(
          "topRight",
          "success",
          `Мутация ${nameModel} выполнена успешно`
        );
        form.resetFields();
        onCompleted &&
          onCompleted(data?.createPosition || data?.updatePosition);
      },
      onError: (error) => {
        openNotification(
          "topRight",
          "error",
          `Ошибка при выполнении мутации ${nameModel}: ${error.message}`
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
    const formData = form.getFieldsValue();
    const data = {
      ...formData,
    };
    mutate({
      variables: { ...(actualObject ? { id: actualObject.id } : {}), data },
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
        <>
          {!loading ? (
            <Form form={form} onFinish={handleSubmit}>
              <Form.Item
                name="name"
                label="Наименование"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="okpd_code"
                label="ОКПД"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="okz_code"
                label="ОКЗ"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Form>
          ) : (
            <Skeleton active />
          )}
        </>
      }
    />
  );
};

export default PositionForm;
