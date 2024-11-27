import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Col, Form, Input, Row } from "antd";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { PERMISSIONS_QUERY_COMPACT } from "../../..//graphql/queries/queriesCompact";
import {
  ADD_CONTACT_MUTATION,
  UPDATE_CONTACT_MUTATION,
} from "../../../graphql/mutations/contact";
import { NotificationContext } from "../../../NotificationProvider";

import { CONTACTS_QUERY_BY_ID } from "../../../graphql/queries/queriesByID";
import LoadingSpinnerStyles from "../../components/style/LoadingSpinnerStyles";

import PermissionsTreeComponent from "./components/PermissionsTreeComponent";

const Index = ({ localObject, initialObject, onCompleted }) => {
  // Первичные данные
  const { openNotification } = useContext(NotificationContext);
  const [form] = Form.useForm();
  const [actualObject, setActualObject] = useState(
    localObject?.id ?? initialObject ?? null
  );
  const [loadContext, { loading, data }] = useLazyQuery(CONTACTS_QUERY_BY_ID, {
    variables: { id: initialObject?.id },
    onCompleted: (data) => {
      setActualObject(data?.users?.items[0]);
      updateForm(data?.users?.items[0]);
    },
    onError: (error) => {
      openNotification(
        "topRight",
        "error",
        `Ошибка при загрузке данных: ${error.message}`
      );
    },
  });

  //   // Состояния
  //    const [organizationModalStatus, setOrganizationModalStatus] = useState(null);
  //     useEffect(() => {
  //         console.log("organizationModalStatus",organizationModalStatus);
  //     }, [organizationModalStatus]);
  // Мутация
  const [mutate, { loading: loadingSave }] = useMutation(
    actualObject ? UPDATE_CONTACT_MUTATION : ADD_CONTACT_MUTATION,
    {
      onCompleted: (data) => {
        openNotification(
          "topRight",
          "success",
          `Создание новой записи в таблице контакт выполнено успешно`
        );
        form.resetFields();
        onCompleted && onCompleted(data?.createContact || data?.updateContact);
      },
      onError: (error) => {
        openNotification(
          "topRight",
          "error",
          `Ошибка при выполнении сооздания контакта: ${error.message}`
        );
      },
    }
  );

  // Подгрузка при обновлении
  useEffect(() => {
    if (initialObject?.id) loadContext();
  }, [initialObject]);
  useEffect(() => {
    if (actualObject?.id) updateForm(actualObject);
  }, [actualObject]);
  const updateForm = (data) => {
    if (data) {
      form.resetFields();
      form.setFieldsValue({
        ...data,
        position: {
          selected: data?.position?.id,
          output: data?.position?.name,
        },
        organization: {
          selected: data?.organization?.id,
          output: data?.organization?.name,
        },
        birth_day: data?.birth_day ? moment(data.birth_day) : null,
      });
    }
  };

  // Получение данных для выпадающих списков
  const {
    loading: loadingPermission,
    error: errorPermission,
    data: dataPermission,
  } = useQuery(PERMISSIONS_QUERY_COMPACT);

  const handleSubmit = () => {
    const formData = form.getFieldsValue();
    mutate({
      variables: {
        ...(actualObject ? { id: actualObject.id } : {}),
        ...formData,
        organization_id: formData?.organization?.selected ?? null,
        position_id: formData?.position?.selected ?? null,
      },
    });
  };
  if (loading || loadingSave) return <LoadingSpinnerStyles />;

  return (
    <div>
      <Form
        onChange={() => console.log("change", form.getFieldsValue())}
        form={form}
        onFinish={handleSubmit}
      >
        <Row gutter={5}>
          <Col span={8}>
            <Form.Item
              name="name"
              label="Наименование"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, заполните наименование",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Описание"
              rules={[
                { required: true, message: "Пожалуйста, заполните описание" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={16}>
            <PermissionsTreeComponent
              value={dataPermission?.permissions?.items}
            />
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default Index;
