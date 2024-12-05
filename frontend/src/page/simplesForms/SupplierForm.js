import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Alert, Card, Form, Input, Skeleton } from "antd";
import React, { useContext, useEffect, useState } from "react";

import "react-dadata/dist/react-dadata.css";
import { SUPPLIER_QUERY_BY_ID } from "../../graphql/queries/queriesByID";
import {
  BIKS_QUERY_COMPACT,
  CONTACTS_QUERY_COMPACT,
  LEGAL_FORM_QUERY_COMPACT,
} from "../../graphql/queries/queriesCompact";
import { NotificationContext } from "../../NotificationProvider";
import "./style.css";

import {
  CREATE_SUPPLIER_MUTATION,
  UPDATE_SUPPLIER_MUTATION,
} from "../../graphql/mutations/supplier";
import { ModalButton } from "./formComponents/ModalButtonComponent";

const SupplierForm = ({
  localObject,
  initialObject,
  onCompleted,
  style,
  cardProps,
}) => {
  // Первичные данные
  const { openNotification } = useContext(NotificationContext);
  const [form] = Form.useForm();
  const TokenDADATA = process.env.REACT_APP_TOKEN_DADATAADDRESS;
  const [actualObject, setActualObject] = useState(
    localObject?.id ?? initialObject ?? null
  );
  const [loadContext, { loading, data }] = useLazyQuery(SUPPLIER_QUERY_BY_ID, {
    variables: { id: initialObject?.id ?? null },
    onCompleted: (data) => {
      setActualObject(data?.suppliers?.items[0]);
      updateForm(data?.suppliers?.items[0]);
    },
    onError: (error) => {
      openNotification(
        "topRight",
        "error",
        `Ошибка при загрузке данных: ${error.message}`
      );
    },
  });
  // Состояния
  const [contactModalStatus, setContactModalStatus] = useState(null);
  const [bikModalStatus, setBikModalStatus] = useState(null);
  const [address, setAddress] = useState({ legal: "", mail: "" });

  // Мутация
  const [mutate, { loading: loadingSave }] = useMutation(
    actualObject ? UPDATE_SUPPLIER_MUTATION : CREATE_SUPPLIER_MUTATION,
    {
      onCompleted: (data) => {
        openNotification(
          "topRight",
          "success",
          `Создание новой записи в таблице организаций выполнено успешно`
        );
        form.resetFields();
        setAddress({ legal: "", mail: "" });
        console.log(
          `Создание новой записи в таблице организаций выполнено успешно`,
          data?.updateSupplier || data?.createSupplier
        );
        onCompleted &&
          onCompleted(data?.updateSupplier || data?.createSupplier);
      },
      onError: (error) => {
        openNotification(
          "topRight",
          "error",
          `Ошибка при выполнении сооздания организации: ${error.message}`
        );
      },
    }
  );

  // Подгрузка при обновлении
  useEffect(() => {
    if (initialObject?.id) loadContext();
  }, [initialObject]);
  useEffect(() => {
    if (localObject) updateForm(localObject);
  }, [localObject]);
  const updateForm = (data) => {
    if (data) {
      form.resetFields();
      setAddress({ legal: "", mail: "" });
      form.setFieldsValue({
        ...data,
        bik: {
          selected: data?.bik?.id,
          output: (data?.bik?.BIK ?? "") + " " + (data?.bik?.name ?? ""),
        },
        legal_form_id: data?.legal_form?.id ?? null,
        director: {
          selected: data?.director?.id,
          output:
            (data?.director?.last_name ?? "") +
            " " +
            (data?.director?.first_name ?? "") +
            " " +
            (data?.director?.patronymic !== null
              ? data?.director?.patronymic
              : ""),
        },
      });
      setAddress({ legal: data.address_legal, mail: data.address_mail });
    }
  };

  // Получение данных для выпадающих списков
  const {
    loading: loadingContacts,
    error: errorContacts,
    data: dataContacts,
    refetch: refetchContacts,
  } = useQuery(CONTACTS_QUERY_COMPACT);
  const {
    loading: loadingLegalForm,
    error: errorLegalForm,
    data: dataLegalForm,
  } = useQuery(LEGAL_FORM_QUERY_COMPACT);
  const {
    loading: loadingBik,
    error: errorBik,
    data: dataBik,
  } = useQuery(BIKS_QUERY_COMPACT);

  const handleSubmit = () => {
    const formData = form.getFieldsValue();
    const data = {
      name: formData.name,
    };

    mutate({
      variables: {
        ...(actualObject ? { id: actualObject.id } : {}),
        data: data,
      },
    });
  };

  if (errorContacts || errorBik)
    return `Ошибка! ${errorContacts?.message || errorBik?.message}`;

  return (
    <Card
      style={{ minWidth: 300 }}
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
          {cardProps?.alert && <Alert {...cardProps.alert} />}
          <Form form={form} onFinish={handleSubmit}>
            {!loading ? (
              <>
                <Form.Item
                  name="name"
                  label={"Наименование компании"}
                  rules={[
                    {
                      required: true,
                      message: "Укажите наименование компании",
                    },
                  ]}
                  style={{ width: "90%" }}
                >
                  <Input
                    style={{ width: "100%)" }}
                    placeholder={"Наименование"}
                  />
                </Form.Item>
              </>
            ) : (
              <Skeleton active />
            )}
          </Form>
          {/* <Modal
            key={bikModalStatus?.mode || bikModalStatus?.bik_id || null}
            open={bikModalStatus}
            onCancel={() => setBikModalStatus(null)}
            footer={null}
            width={"max-content"}
            title={"Бик"}
            children={
              <BikForm
                onCompleted={(value) => {
                  form.setFieldValue("bik", {
                    selected: value?.id,
                    output: value?.name,
                  });
                  setBikModalStatus(null);
                  form.validateFields(["bik"]);
                }}
                initialObject={
                  bikModalStatus?.bik_id ? { id: bikModalStatus?.bik_id } : null
                }
              />
            }
          />
          <Modal
            key={
              contactModalStatus?.mode || contactModalStatus?.contact_id || null
            }
            open={contactModalStatus}
            onCancel={() => setContactModalStatus(null)}
            footer={null}
            width={"max-content"}
            children={
              <ContactForm
                cardProps={{ title: "Контакт" }}
                options={{ disabled: ["supplier"] }}
                onCompleted={(value) => {
                  refetchContacts();
                  console.log("onCompleted", value);
                  form.setFieldValue("director", {
                    selected: value?.id,
                    output:
                      value.last_name +
                      " " +
                      value.first_name +
                      " " +
                      (value?.patronymic ?? ""),
                  });
                  form.validateFields(["director"]);

                  setContactModalStatus(null);
                }}
                initialObject={
                  contactModalStatus?.contact_id
                    ? { id: contactModalStatus?.contact_id }
                    : null
                }
              /> */}
          {/* }
          /> */}
        </>
      }
    />
  );
};

export default SupplierForm;
