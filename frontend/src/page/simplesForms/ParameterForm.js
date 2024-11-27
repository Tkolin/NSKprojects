import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Alert, Card, Form, Input, Modal, Skeleton, Space } from "antd";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { NotificationContext } from "../../NotificationProvider";
import {
  CREATE_PARAMETER_MUTATION,
  UPDATE_PARAMETER_MUTATION,
} from "../../graphql/mutations/equipments";
import { PARAMETERS_QUERY_COMPACT } from "../../graphql/queries/queriesCompact";
import { PARAMETER_QUERY } from "../../graphql/queries/queriesSingle";
import { AutoCompleteFormItem } from "../components/CustomForm";
import { CustomAutoCompleteAndCreateWitchEdit } from "../components/style/SearchAutoCompleteStyles";
import UnitForm from "./UnitForm";
import { ModalButton } from "./formComponents/ModalButtonComponent";

const ParameterForm = ({
  localObject,
  initialObject,
  options,
  onCompleted,
  cardProps,
}) => {
  // Первичные данные
  const { openNotification } = useContext(NotificationContext);
  const [form] = Form.useForm();
  const [actualObject, setActualObject] = useState(
    localObject?.id ?? initialObject ?? null
  );
  const [loadContext, { loading, data }] = useLazyQuery(PARAMETER_QUERY, {
    variables: { id: initialObject?.id },
    onCompleted: (data) => {
      setActualObject(data?.parameter);
      updateForm(data?.parameter);
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
  const [unitModalStatus, setUnitModalStatus] = useState(null);
  useEffect(() => {
    console.log("unitModalStatus", unitModalStatus);
  }, [unitModalStatus]);
  // Мутация
  const [mutate, { loading: loadingSave }] = useMutation(
    actualObject ? UPDATE_PARAMETER_MUTATION : CREATE_PARAMETER_MUTATION,
    {
      onCompleted: (data) => {
        openNotification("topRight", "success", `Новый параметр создан`);
        form.resetFields();
        onCompleted && onCompleted(data?.createContact || data?.updateContact);
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
  const [coldMutate, { loading: loadingSaveCold }] = useMutation(
    actualObject ? UPDATE_PARAMETER_MUTATION : CREATE_PARAMETER_MUTATION
  );

  // Подгрузка при обновлении
  useEffect(() => {
    if (initialObject?.id) loadContext();
  }, [initialObject]);
  useEffect(() => {
    if (localObject) updateForm(localObject);
  }, [localObject]);

  const updateForm = (data) => {
    console.log("updateForm Contact", data);
    if (data) {
      console.log(actualObject);
      form.resetFields();
      form.setFieldsValue({
        ...data,
        unit: {
          selected: data?.unit?.id,
          output: data?.unit?.name,
        },
        birth_day: data?.birth_day ? dayjs(data.birth_day) : null,
      });
    }
  };

  // Получение данных для выпадающих списков
  const {
    loading: loadingUnits,
    error: errorUnits,
    data: dataUnits,
  } = useQuery(PARAMETERS_QUERY_COMPACT);

  const handleSubmit = (cold = false) => {
    const formData = form.getFieldsValue();
    const data = {
      last_name: formData.last_name,
      first_name: formData.first_name,
      patronymic: formData.patronymic,
      work_phone: formData.work_phone,
      mobile_phone: formData.mobile_phone,
      email: formData.email,
      work_email: formData.work_email,
      birth_day: formData.birth_day
        ? dayjs(formData.birth_day).format("YYYY-MM-DD")
        : null,
      unit_id: formData?.unit?.selected ?? null,
      position_id: formData?.position?.selected ?? null,
    };
    if (cold) {
      coldMutate({
        variables: {
          ...(actualObject ? { id: actualObject.id } : {}),
          data,
        },
      });
    } else {
      mutate({
        variables: {
          ...(actualObject ? { id: actualObject.id } : {}),
          data,
        },
      });
    }
  };
  if (errorUnits) return `Ошибка! ${errorUnits?.message}`;

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
          {cardProps?.alert && <Alert {...cardProps.alert} />}
          <Form
            onChange={() => console.log("change", form.getFieldsValue())}
            form={form}
            onFinish={() => handleSubmit(false)}
            labelCol={{ span: 8 }}
            labelAlign="left"
            wrapperCol={{ span: 16 }}
          >
            {!loading ? (
              <>
                <Form.Item
                  name="name"
                  label="Наименование"
                  rules={[
                    {
                      required: true,
                      message: "Пожалуйста, укажите наименование переменной",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="min"
                  label="Минимальное значение для параметра"
                  rules={[
                    { required: false, message: "Пожалуйста, заполните поле" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="max"
                  label="Максимальное значение для параметра"
                  rules={[
                    { required: false, message: "Пожалуйста, заполните поле" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <AutoCompleteFormItem
                  name={"unit"}
                  label={"Ед. измерения"}
                  style={{ width: "100%" }}

                  // rulesValidationRequired={true}
                  // rulesValidationMessage={'Пожалуйста, укажите организацию'}
                >
                  <CustomAutoCompleteAndCreateWitchEdit
                    loading={loadingUnits}
                    data={dataUnits?.parametrs?.items}
                    onChange={(value) => form.setFieldValue("unit", value)}
                    placeholder="Выберите единицу измерения"
                    firstBtnOnClick={() => {
                      handleSubmit(true);
                      setUnitModalStatus({
                        unit_id: form.getFieldValue("unit")?.selected,
                        mode: "add",
                      });
                    }}
                    secondBtnOnClick={() => {
                      handleSubmit(true);
                      form.getFieldValue("unit")?.selected &&
                        setUnitModalStatus({
                          unit_id: form.getFieldValue("unit")?.selected,
                          mode: "edit",
                        });
                    }}
                  />
                </AutoCompleteFormItem>{" "}
              </>
            ) : (
              <Skeleton active />
            )}
          </Form>

          <Modal
            key={unitModalStatus?.mode || unitModalStatus?.unit_id || null}
            open={unitModalStatus}
            onCancel={() => setUnitModalStatus(null)}
            footer={null}
            width={"max-content"}
            children={
              <Space
                style={{ justifyContent: "center", width: "100%" }}
                children={
                  <UnitForm
                    cardProps={{ title: "Еденица измерения" }}
                    onCompleted={(value) => {
                      form.setFieldValue("unit", {
                        selected: value?.id,
                        output: value.name,
                      });
                      form.validateFields(["unit"]);
                      setUnitModalStatus(null);
                    }}
                    initialObject={
                      unitModalStatus?.unit_id
                        ? { id: unitModalStatus?.unit_id }
                        : null
                    }
                  />
                }
              />
            }
          />
        </>
      }
    />
  );
};

export default ParameterForm;
