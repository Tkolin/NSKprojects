import { useMutation, useQuery } from "@apollo/client";
import { Card, Form, Input } from "antd";
import React, { useContext } from "react";

import { SET_NEW_LEADER } from "../graphql/mutations/projectSecondaryAtribute";
import { PERSONS_SHORT_QUERY } from "./../graphql/queries/all";
import { NotificationContext } from "./../NotificationProvider";
import { ModalButton } from "./simplesForms/formComponents/ModalButtonComponent";

const ProjectLeaderForm = ({ cardProps, project, onCompleted }) => {
  // Первичные данные
  const { openNotification } = useContext(NotificationContext);
  const [form] = Form.useForm();
  const nameModel = "ИРД";
  // Данные
  const { data: personsData, loading: personsLoading } =
    useQuery(PERSONS_SHORT_QUERY);
  // Мутация
  const [mutate, { loading: loadingSave }] = useMutation(SET_NEW_LEADER, {
    onCompleted: (data) => {
      openNotification(
        "topRight",
        "success",
        `Мутация ${nameModel} выполнена успешно`
      );
      form.resetFields();
      onCompleted && onCompleted(data?.updateIrd || data?.createIrd);
    },
    onError: (error) => {
      openNotification(
        "topRight",
        "error",
        `Ошибка при выполнении мутации ${nameModel}: ${error.message}`
      );
    },
  });

  // Завершение
  const handleSubmit = () => {
    mutate({
      variables: {
        data: { name: form.getFieldValue("leader")?.selected },
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
          children={`Обновить`}
        />,
        ...(cardProps?.actions ?? []),
      ]}
      children={
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Наименование"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      }
    />
  );
};

export default ProjectLeaderForm;
