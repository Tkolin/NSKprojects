import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Card, Form, Input } from "antd";
import React, { useContext, useEffect, useState } from "react";
import {
  ADD_TYPE_PROJECTS_MUTATION,
  UPDATE_TYPE_PROJECTS_MUTATION,
} from "../../graphql/mutations/typeProject";
import { TYPES_PROJECTS_QUERY_BY_ID } from "../../graphql/queries/queriesByID";
import { GROUP_TYPE_PROJECTS_QUERY_COMPACT } from "../../graphql/queries/queriesCompact";
import { NotificationContext } from "../../NotificationProvider";
import { AutoCompleteFormItem } from "../components/CustomForm";
import { CustomAutoComplete } from "../components/style/SearchAutoCompleteStyles";
import { ModalButton } from "./formComponents/ModalButtonComponent";

const TypeProjectForm = ({
  localObject,
  initialObject,
  onCompleted,
  cardProps,
}) => {
  // Получение данных для выпадающих списков
  const {
    loading: loadingGroup,
    error: errorGroup,
    data: dataGroup,
  } = useQuery(GROUP_TYPE_PROJECTS_QUERY_COMPACT);
  const [loadContext, { loading, data }] = useLazyQuery(
    TYPES_PROJECTS_QUERY_BY_ID,
    {
      variables: { id: initialObject?.id },
      onCompleted: (data) => {
        setActualObject(data?.typeProjects?.items[0]);
        updateForm(data?.typeProjects?.items[0]);
      },
      onError: (error) => {
        openNotification(
          "topRight",
          "error",
          `Ошибка при загрузке данных: ${error.message}`
        );
      },
    }
  );
  const [actualObject, setActualObject] = useState(
    localObject?.id ?? initialObject ?? null
  );

  // Первичные данные
  const { openNotification } = useContext(NotificationContext);
  const [form] = Form.useForm();

  //Доп
  const [groupIdSelected, setGroupIdSelected] = useState(null);
  useEffect(() => {
    if (groupIdSelected && dataGroup?.groupTypeProjects) {
      const group = dataGroup?.groupTypeProjects?.find(
        (row) => row.id === groupIdSelected
      );
      if (group) {
        const formData = form.getFieldsValue();
        const updatedFields = {};
        if (!formData.name) {
          updatedFields.name = group.name + " - ";
        }
        if (!formData.code) {
          updatedFields.code = group.code + "-";
        }
        form.setFieldsValue(updatedFields);
      }
    }
  }, [groupIdSelected, dataGroup]);

  // Состояния

  // Мутация
  const [mutate, { loading: loadingSave }] = useMutation(
    actualObject && actualObject?.id
      ? UPDATE_TYPE_PROJECTS_MUTATION
      : ADD_TYPE_PROJECTS_MUTATION,
    {
      onCompleted: (data) => {
        openNotification("topRight", "success", `Мутация  выполнена успешно`);
        form.resetFields();
        onCompleted &&
          onCompleted(data?.createTypeProject || data?.updateTypeProject);
      },
      onError: (error) => {
        openNotification(
          "topRight",
          "error",
          `Ошибка при выполнении мутации: ${error.message}`
        );
      },
    }
  );

  // Подгрузка при обновлении
  useEffect(() => {
    if (initialObject?.id) loadContext();
  }, [initialObject]);
  useEffect(() => {
    console.log("localObject", localObject);
    if (localObject) updateForm(localObject);
  }, [localObject]);

  const updateForm = (data) => {
    if (data) {
      form.resetFields();
      form.setFieldsValue({
        ...data,
        group: { selected: data?.group?.id, output: data?.group?.name },
      });
    }
  };

  // Завершение
  const handleSubmit = () => {
    const data = form.getFieldsValue();
    mutate({
      variables: {
        ...(actualObject ? { id: actualObject?.id } : {}),
        data: {
          name: data?.name,
          group_id: data?.group.selected,
          code: data?.code,
        },
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
          children={actualObject?.id ? `Обновить` : `Создать`}
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
          <Form.Item name="code" label="код" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <AutoCompleteFormItem
            rulesValidationMessage={"Укажите группу"}
            rulesValidationRequired={true}
            name="group"
            label="Группа"
          >
            <CustomAutoComplete
              disabled={true}
              typeData={"CODENAME"}
              onSelect={(value) => setGroupIdSelected(value.id)}
              data={dataGroup?.groupTypeProjects}
            />
          </AutoCompleteFormItem>
        </Form>
      }
    />
  );
};

export default TypeProjectForm;
