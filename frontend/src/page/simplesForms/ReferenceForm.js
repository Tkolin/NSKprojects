import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Button, Card, Divider, Form, Input, InputNumber, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useContext, useEffect, useState } from "react";
import {
  CREATE_REFERENCE_MUTATION,
  UPDATE_REFERENCE_MUTATION,
} from "../../graphql/mutationsReference";
import { REFERENCES_QUERY_BY_ID } from "../../graphql/queriesByID";
import { NotificationContext } from "../../NotificationProvider";
import LoadingSpinnerStyles from "../components/style/LoadingSpinnerStyles";
import { ModalButton } from "./formComponents/ModalButtonComponent";

const ReferenceForm = ({
  localObject,
  initialObject,
  onCompleted,
  cardProps,
}) => {
  // Первичные данные
  const { openNotification } = useContext(NotificationContext);
  const [form] = Form.useForm();
  const nameModel = "Этапы";
  const [actualObject, setActualObject] = useState(
    localObject?.id ?? initialObject ?? null
  );
  const [loadContext, { loading, data }] = useLazyQuery(
    REFERENCES_QUERY_BY_ID,
    {
      variables: { id: initialObject?.id },
      onCompleted: (data) => {
        setActualObject(data?.references?.items[0]);
        updateForm(data?.references?.items[0]);
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

  // Мутация
  const [mutate, { loading: loadingSave }] = useMutation(
    actualObject ? UPDATE_REFERENCE_MUTATION : CREATE_REFERENCE_MUTATION,
    {
      onCompleted: (data) => {
        openNotification(
          "topRight",
          "success",
          `Мутация ${nameModel} выполнена успешно`
        );
        form.resetFields();
        onCompleted && onCompleted(data?.createreference || data?.createPerson);
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
    mutate({
      variables: {
        ...(actualObject ? { id: actualObject.id } : {}),
        data: { ...form.getFieldsValue() },
      },
    });
  };
  if (loading || loadingSave) return <LoadingSpinnerStyles />;

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
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Наименование"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Описание/коментарий к справочнику"
            rules={[
              {
                required: true,
                message:
                  "Пожалуйста, введите описание/коментарий к справочнику",
              },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Введите описание/коментарий к справочнику"
            />
          </Form.Item>
          <Divider style={{margin: 0, marginBottom: 5}}>-</Divider>

          <Form.List name="content">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Space
                    key={index}
                    style={{ width: "100%" }}
                    direction="vertical"
                  >
                    <Space direction="horizontal"
 >
                      <Form.Item
                        {...restField}
                        name={[index,"name"]}
                        rules={[
                          {
                            required: true,
                            message: "Пожалуйста, введите наименование",
                          },
                        ]}
                      >
                        <Input placeholder="Введите название параметра (коэфецента)" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[index,"value"]}
                        rules={[
                          {
                            required: true,
                            message: "Пожалуйста, введите значение",
                          },
                        ]}
                      >
                        <InputNumber placeholder="Введите значение" />
                      </Form.Item>
                      <div style={{display: "flex", margin: "auto"}} >

                      <MinusCircleOutlined onClick={() => remove(index)} />
                      </div>

                    </Space>
                
                      <Form.Item {...restField} name={[index, "description"]} style={{width: "100%"}}>
                        <TextArea style={{width: "100%"}} placeholder="Добавьте описание/коментарий (при необходимости)" />
                      </Form.Item>
                    <Divider style={{margin: 0, marginBottom: 5}}>-</Divider>
                  </Space>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    style={{ width: "100%" }}
                  >
                    Добавить переменную
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      }
    />
  );
};

export default ReferenceForm;
