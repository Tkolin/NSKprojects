import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  Alert,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Skeleton,
  Space,
} from "antd";
import { nanoid } from "nanoid";
import React, { useContext, useEffect, useState } from "react";
import { NotificationContext } from "../../NotificationProvider";

import {
  CREATE_PARAMETER_MUTATION,
  UPDATE_PARAMETER_MUTATION,
} from "../../graphql/mutations/parameter";
import {
  PARAMETER_GROUPS_QUERY_COMPACT,
  UNITS_QUERY_COMPACT,
} from "../../graphql/queries/queriesCompact";
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
  const [parameterGroupModalStatus, setParameterGroupModalStatus] =
    useState(null);
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
        onCompleted &&
          onCompleted(data?.createParameter || data?.updateParameter);
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
    console.log("initialObject", initialObject);
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
        parameterGroup: {
          selected: data?.group?.id,
          output: data?.group?.name,
        },
      });
    }
  };

  // Получение данных для выпадающих списков
  const {
    loading: loadingUnits,
    error: errorUnits,
    data: dataUnits,
  } = useQuery(UNITS_QUERY_COMPACT);
  const {
    loading: loadingParameterGroups,
    error: errorParameterGroups,
    data: dataParameterGroups,
  } = useQuery(PARAMETER_GROUPS_QUERY_COMPACT);

  const handleSubmit = (cold = false) => {
    const formData = form.getFieldsValue();
    const data = {
      name: formData.name,
      min: formData.min,
      max: formData.max,
      unit_id: formData?.unit?.selected ?? null,
      group_id: formData?.parameterGroup?.selected ?? null,
    };
    if (cold) {
      return;
      // coldMutate({
      //   variables: {
      //     ...(actualObject ? { id: actualObject.id } : {}),
      //     data,
      //   },
      // });
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
      style={{ minWidth: "300px", width: "max-content" }}
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
            // labelCol={{ span: 12 }}
            labelAlign="left"
            // wrapperCol={{ span: 12 }}
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
                  <InputNumber />
                </Form.Item>
                <Form.Item
                  name="max"
                  label="Максимальное значение для параметра"
                  rules={[
                    { required: false, message: "Пожалуйста, заполните поле" },
                  ]}
                >
                  <InputNumber />
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
                    data={dataUnits?.units?.items}
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
                </AutoCompleteFormItem>
                <AutoCompleteFormItem
                  name={"parameterGroup"}
                  label={"Группа параметров"}
                  style={{ width: "100%" }}

                  // rulesValidationRequired={true}
                  // rulesValidationMessage={'Пожалуйста, укажите организацию'}
                >
                  <CustomAutoCompleteAndCreateWitchEdit
                    loading={loadingParameterGroups}
                    data={dataParameterGroups?.parameterGroups?.items}
                    onChange={(value) =>
                      form.setFieldValue("parameterGroup", value)
                    }
                    placeholder="Выберите группу параметров"
                    firstBtnOnClick={() => {
                      handleSubmit(true);
                      setParameterGroupModalStatus({
                        parameterGroup_id:
                          form.getFieldValue("parameterGroup")?.selected,
                        mode: "add",
                      });
                    }}
                    secondBtnOnClick={() => {
                      handleSubmit(true);
                      form.getFieldValue("parameterGroup")?.selected &&
                        setParameterGroupModalStatus({
                          parameterGroup_id:
                            form.getFieldValue("parameterGroup")?.selected,
                          mode: "edit",
                        });
                    }}
                  />
                </AutoCompleteFormItem>
              </>
            ) : (
              <Skeleton active />
            )}
          </Form>

          <Modal
            key={[nanoid(), unitModalStatus?.unit_id]}
            open={unitModalStatus}
            onCancel={() => setUnitModalStatus(null)}
            footer={null}
            width={"max-content"}
            children={
              <Space
                style={{ justifyContent: "center", width: "100%" }}
                children={
                  <UnitForm
                    cardProps={{ title: "Группа параметров" }}
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
          <Modal
            key={[nanoid(), parameterGroupModalStatus?.parameterGroup_id]}
            open={parameterGroupModalStatus}
            onCancel={() => setParameterGroupModalStatus(null)}
            footer={null}
            width={"max-content"}
            children={
              <Space
                style={{ justifyContent: "center", width: "100%" }}
                children={
                  <UnitForm
                    cardProps={{ title: "Группа параметров" }}
                    onCompleted={(value) => {
                      form.setFieldValue("parameterGroup", {
                        selected: value?.id,
                        output: value.name,
                      });
                      form.validateFields(["parameterGroup"]);
                      setParameterGroupModalStatus(null);
                    }}
                    initialObject={
                      parameterGroupModalStatus?.parameterGroup_id
                        ? { id: parameterGroupModalStatus?.parameterGroup_id }
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
