import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Alert, Card, Form, Input, Skeleton, Space } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { NotificationContext } from "../../../NotificationProvider";
import {
  CREATE_ROLE_MUTATION,
  UPDATE_ROLE_MUTATION,
} from "../../../graphql/mutations/user";
import { ROLE_QUERY_BY_ID } from "../../../graphql/queries/queriesByID";
import { PERMISSIONS_QUERY_COMPACT } from "../../../graphql/queries/queriesCompact";
import { ModalButton } from "../formComponents/ModalButtonComponent";
import MyCheckboxList from "./components/MyCheckboxList";

const RoleForm = ({
  localObject,
  initialObject,
  onCompleted,
  style,
  cardProps,
}) => {
  const { openNotification } = useContext(NotificationContext);
  const [form] = Form.useForm();
  const [actualObject, setActualObject] = useState(
    localObject?.name_key ?? initialObject ?? null
  );
  const [chekedAndPremissions, setChekedAndPremissions] = useState([]);

  const [loadContext, { loading, data }] = useLazyQuery(ROLE_QUERY_BY_ID, {
    variables: { id: initialObject?.name_key ?? null },
    onCompleted: (data) => {
      setActualObject(data?.role);
      updateForm(data?.role);
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
    actualObject ? UPDATE_ROLE_MUTATION : CREATE_ROLE_MUTATION,
    {
      onCompleted: (data) => {
        openNotification(
          "topRight",
          "success",
          "Создание/обновление роли выполнено успешно"
        );
        onCompleted && onCompleted(data?.updateRole || data?.createRole);
      },
      onError: (error) => {
        openNotification(
          "topRight",
          "error",
          `Ошибка при сохранении: ${error.message}`
        );
      },
    }
  );

  const {
    loading: loadingPermissions,
    error: errorPermissions,
    data: dataPermissions,
  } = useQuery(PERMISSIONS_QUERY_COMPACT);

  useEffect(() => {
    if (initialObject?.name_key) loadContext();
  }, [initialObject]);

  useEffect(() => {
    if (localObject) updateForm(localObject);
  }, [localObject]);

  const updateForm = (roleData) => {
    if (!roleData) return;
    console.log("roleData", roleData);
    form.setFieldsValue({
      name: roleData.name,
      permission_keys: roleData?.permissions?.map((row) => row.name_key) || [],
    });
    console.log("result set");
  };

  const handleSubmit = () => {
    // form.getFieldsValue() вернёт все поля, включая permissions
    const formData = form.getFieldsValue();

    // Сохраняем как вам нужно:
    mutate({
      variables: {
        ...(actualObject ? { name_key: actualObject.name_key } : {}),
        data: {
          name: formData.name,
          // И массив ключей permission
          permission_keys: formData.permission_keys || [],
        },
      },
    });
  };

  if (errorPermissions) return `Ошибка! ${errorPermissions?.message}`;

  return (
    <Card
      style={{ width: 900 }}
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
    >
      {cardProps?.alert && <Alert {...cardProps.alert} />}
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        {!loading ? (
          <Space direction="vertical" style={{ width: "100%" }}>
            <Form.Item
              name="name"
              label="Наименование роли"
              rules={[{ required: true, message: "Укажите наименование роли" }]}
            >
              <Input placeholder="Наименование" />
            </Form.Item>

            <Form.Item
              // Здесь храним выбранные ключи
              name="permission_keys"
              label="Выберите разрешения"
              // Говорим форме, что "value" и "onChange" нашего компонента
              // будет соответствовать "name='permissions'"
              valuePropName="value"
              trigger="onChange"
            >
              <MyCheckboxList
                dataSource={dataPermissions?.permissions?.items}
                // не передаём тут value/onChange — Form сам передаст
              />
            </Form.Item>
          </Space>
        ) : (
          <Skeleton active />
        )}
      </Form>
    </Card>
  );
};

export default RoleForm;
