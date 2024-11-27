import { Card, Form, Input, Skeleton } from "antd";
import React, { useContext, useEffect, useState } from "react";

import { useLazyQuery, useMutation } from "@apollo/client";
import {
  ADD_BIK_MUTATION,
  UPDATE_BIK_MUTATION,
} from "../../graphql/mutations/bik";
import { BIKS_QUERY_BY_ID } from "../../graphql/queries/queriesByID";
import { NotificationContext } from "../../NotificationProvider";
import { ModalButton } from "./formComponents/ModalButtonComponent";

const BikForm = ({ localObject, initialObject, onCompleted, cardProps }) => {
  // Первичные данные
  const { openNotification } = useContext(NotificationContext);
  const [form] = Form.useForm();
  const nameModel = "БИК";
  const [actualObject, setActualObject] = useState(
    localObject?.id ?? initialObject ?? null
  );
  const [loadContext, { loading, data }] = useLazyQuery(BIKS_QUERY_BY_ID, {
    variables: { id: initialObject?.id },
    onCompleted: (data) => {
      setActualObject(data?.biks?.items[0]);
      updateForm(data?.biks?.items[0]);
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
    actualObject ? UPDATE_BIK_MUTATION : ADD_BIK_MUTATION,
    {
      onCompleted: (data) => {
        openNotification(
          "topRight",
          "success",
          `Мутация ${nameModel} выполнена успешно`
        );
        form.resetFields();
        onCompleted && onCompleted(data?.createBik || data?.updateBik);
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
      BIK: formData.BIK,
      name: formData.name,
      correspondent_account: formData.correspondent_account,
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
              <Form.Item name="BIK" label="Бик" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item
                name="name"
                label="Наименование"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="correspondent_account"
                label="Корреспондентский счёт"
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

export default BikForm;
