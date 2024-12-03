import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Alert, Card, Form, Input, Modal, Skeleton, Space } from "antd";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import {
  CREATE_EQUIPMENT_TYPE_MUTATION,
  UPDATE_EQUIPMENT_TYPE_MUTATION,
} from "../../graphql/mutations/equipment";
import {
  EQUIPMENT_GROUPS_QUERY_COMPACT,
  EQUIPMENT_TYPES_ACTIVITY_QUERY_COMPACT,
} from "../../graphql/queries/queriesCompact";
import { EQUIPMENT_TYPE_QUERY } from "../../graphql/queries/queriesSingle";
import { NotificationContext } from "../../NotificationProvider";
import { AutoCompleteFormItem } from "../components/CustomForm";
import { CustomAutoCompleteAndCreateWitchEdit } from "../components/style/SearchAutoCompleteStyles";
import EquipmentTypeActivirtyForm from "./EquipmentTypeActivirtyForm.js";
import EquipmentTypeGroupForm from "./EquipmentTypeGroupForm.js";
import { ModalButton } from "./formComponents/ModalButtonComponent";

const EquipmentTypeForm = ({
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
  const [loadContext, { loading, data }] = useLazyQuery(EQUIPMENT_TYPE_QUERY, {
    variables: { id: initialObject?.id },
    onCompleted: (data) => {
      setActualObject(data?.equipmentType);
      updateForm(data?.equipmentType);
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
  const [groupModalStatus, setGroupModalStatus] = useState(null);
  const [typeActivityModalStatus, setTypeActivityModalStatus] = useState(null);
  useEffect(() => {
    console.log("groupModalStatus", groupModalStatus);
  }, [groupModalStatus]);
  useEffect(() => {
    console.log("typeActivityModalStatus", typeActivityModalStatus);
  }, [typeActivityModalStatus]);
  // Мутация
  const [mutate, { loading: loadingSave }] = useMutation(
    actualObject
      ? UPDATE_EQUIPMENT_TYPE_MUTATION
      : CREATE_EQUIPMENT_TYPE_MUTATION,
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
    actualObject
      ? UPDATE_EQUIPMENT_TYPE_MUTATION
      : CREATE_EQUIPMENT_TYPE_MUTATION
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
        group: {
          selected: data?.group?.id,
          output: data?.group?.name,
        },
        type_activity: {
          selected: data?.type_activity?.id,
          output: data?.type_activity?.name,
        },
        birth_day: data?.birth_day ? dayjs(data.birth_day) : null,
      });
    }
  };

  // Получение данных для выпадающих списков
  const {
    loading: loadingEquipmentGroups,
    error: errorEquipmentGroups,
    data: dataEquipmentGroups,
  } = useQuery(EQUIPMENT_GROUPS_QUERY_COMPACT);
  const {
    loading: loadingEquipmentActivity,
    error: errorEquipmentActivity,
    data: dataEquipmentActivity,
  } = useQuery(EQUIPMENT_TYPES_ACTIVITY_QUERY_COMPACT);

  const handleSubmit = (cold = false) => {
    const formData = form.getFieldsValue();
    const data = {
      name: formData.name,
      group_id: formData?.group?.selected ?? null,
      type_activity_id: formData?.type_activity?.selected ?? null,
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
  if (errorEquipmentGroups || errorEquipmentActivity)
    return `Ошибка! ${
      errorEquipmentGroups?.message || errorEquipmentActivity?.message
    }`;

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
                <AutoCompleteFormItem
                  name={"group"}
                  label={"Группа техники"}
                  style={{ width: "100%" }}
                  rulesValidationRequired={true}
                  rulesValidationMessage={"Пожалуйста, укажите группа техники"}
                >
                  <CustomAutoCompleteAndCreateWitchEdit
                    loading={loadingEquipmentGroups}
                    data={dataEquipmentGroups?.equipmentGroups?.items}
                    onChange={(value) => form.setFieldValue("group", value)}
                    placeholder="Выберите группу"
                    firstBtnOnClick={() => {
                      handleSubmit(true);
                      setGroupModalStatus({
                        group_id: form.getFieldValue("group")?.selected,
                        mode: "add",
                      });
                    }}
                    secondBtnOnClick={() => {
                      handleSubmit(true);
                      form.getFieldValue("group")?.selected &&
                        setGroupModalStatus({
                          group_id: form.getFieldValue("group")?.selected,
                          mode: "edit",
                        });
                    }}
                  />
                </AutoCompleteFormItem>
                <AutoCompleteFormItem
                  name={"type_activity"}
                  label={"Сфера применения"}
                  style={{ width: "100%" }}
                  rulesValidationRequired={true}
                  rulesValidationMessage={
                    "Пожалуйста, укажите сферу применения"
                  }
                >
                  <CustomAutoCompleteAndCreateWitchEdit
                    loading={loadingEquipmentActivity}
                    data={dataEquipmentActivity?.equipmentTypeActivitys?.items}
                    onChange={(value) =>
                      form.setFieldValue("type_activity", value)
                    }
                    placeholder="Выберите единицу измерения"
                    firstBtnOnClick={() => {
                      handleSubmit(true);
                      setTypeActivityModalStatus({
                        type_activity_id:
                          form.getFieldValue("type_activity")?.selected,
                        mode: "add",
                      });
                    }}
                    secondBtnOnClick={() => {
                      handleSubmit(true);
                      form.getFieldValue("type_activity")?.selected &&
                        setTypeActivityModalStatus({
                          type_activity_id:
                            form.getFieldValue("type_activity")?.selected,
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
            key={groupModalStatus?.mode || groupModalStatus?.group_id || null}
            open={groupModalStatus}
            onCancel={() => setGroupModalStatus(null)}
            footer={null}
            width={"max-content"}
            children={
              <Space
                style={{ justifyContent: "center", width: "100%" }}
                children={
                  <EquipmentTypeGroupForm
                    cardProps={{ title: "Еденица измерения" }}
                    onCompleted={(value) => {
                      form.setFieldValue("group", {
                        selected: value?.id,
                        output: value.name,
                      });
                      form.validateFields(["group"]);
                      setGroupModalStatus(null);
                    }}
                    initialObject={
                      groupModalStatus?.group_id
                        ? { id: groupModalStatus?.group_id }
                        : null
                    }
                  />
                }
              />
            }
          />
          <Modal
            key={
              typeActivityModalStatus?.mode ||
              typeActivityModalStatus?.type_activity_id ||
              null
            }
            open={typeActivityModalStatus}
            onCancel={() => setGroupModalStatus(null)}
            footer={null}
            width={"max-content"}
            children={
              <Space
                style={{ justifyContent: "center", width: "100%" }}
                children={
                  <EquipmentTypeActivirtyForm
                    cardProps={{ title: "Еденица измерения" }}
                    onCompleted={(value) => {
                      form.setFieldValue("type_activity", {
                        selected: value?.id,
                        output: value.name,
                      });
                      form.validateFields(["type_activity"]);
                      setTypeActivityModalStatus(null);
                    }}
                    initialObject={
                      typeActivityModalStatus?.type_activity_id
                        ? { id: typeActivityModalStatus?.type_activity_id }
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

export default EquipmentTypeForm;
