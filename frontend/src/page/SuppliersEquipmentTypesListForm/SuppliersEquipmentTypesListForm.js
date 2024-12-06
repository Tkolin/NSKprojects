import { PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Card, Checkbox, Divider, Form, Modal, Space } from "antd";
import React, { useContext, useState } from "react";

import { PARAMETERS_QUERY_COMPACT } from "../../graphql/queries/queriesCompact";

import { nanoid } from "nanoid";
import { EQUIPMENT_TYPE_QUERY } from "../../graphql/queries/queriesSingle";
import { NotificationContext } from "../../NotificationProvider";
import { ModalButton } from "../simplesForms/formComponents/ModalButtonComponent";
import ParameterForm from "../simplesForms/ParameterForm";
import EquipmentTypeItem from "./components/EquipmentTypeItem";

const EquipmentTypeParametersStructureForm = ({
  equipmentTypeId,
  onCompleted,
  ...cardProps
}) => {
  const { openNotification } = useContext(NotificationContext);

  // Первичные данные
  const [parameterModalStatus, setParameterModalStatus] = useState(null);
  const {
    loading: loadingParameters,
    error: errorParameters,
    data: dataParameters,
  } = useQuery(PARAMETERS_QUERY_COMPACT);
  const { loading, error, data } = useQuery(EQUIPMENT_TYPE_QUERY, {
    variables: { id: equipmentTypeId },
    onCompleted: (data) => {
      load(data.equipmentType);
    },
  });
  const [form] = Form.useForm();
  const [mutateSyncParametrs, { loading: loadingSync }] = useMutation(
    SUPPLIER_EQUIPMENT_TYPE_SYNC_MUTATION,
    {
      onCompleted: (data) => {
        openNotification("topRight", "success", `Параметры синхронизированы`);
        onCompleted && onCompleted(data.equipmentTypeSyncParameters);
      },
      onError: (error) => {
        openNotification(
          "topRight",
          "error",
          `Ошибка при синхронизации: ${error.message}`
        );
        return false;
      },
    }
  );

  const load = (data) => {
    console.log("load", {
      parametersList: Object.values(data.parameters).map((row) => row),
    });
    data &&
      data.parameters &&
      form.setFieldsValue({
        parametersList: Object.values(data.parameters).map((row) => ({
          parameter: { selected: row?.id, output: row?.name },
        })),
      });
  };
  const handleSave = () => {
    mutateSyncParametrs({
      variables: {
        equipmentTypeId: equipmentTypeId,
        parametersIds: form
          .getFieldValue("parametersList")
          .map((row) => row.parameter.selected),
      },
    });
  };

  return (
    <>
      <Card
        style={{ width: "100%", minWidth: "300px" }}
        {...cardProps}
        actions={[
          <ModalButton
            modalType={"green"}
            loading={loading || loadingSync}
            isMany={cardProps?.actions}
            loading={loading}
            onClick={() => form.submit()}
            children={`Обновить`}
          />,
          ...(cardProps?.actions ?? []),
        ]}
        children={
          <>
            <Form
              layout="vertical"
              onFinish={handleSave}
              form={form}
              loading={loading || loadingSync}
            >
              <Form.List name="parametersList">
                {(fields, { add, remove }) => (
                  <>
                    <Space.Compact
                      direction="vertical"
                      style={{ width: "100%", marginBottom: 10, marginTop: 0 }}
                    >
                      <Divider>Отображение</Divider>
                      <Checkbox
                        type={"primary"}
                        size={"small"}
                        disabled
                        // onClick={() => add()}
                        style={{ width: "100%" }}
                        icon={<PlusOutlined />}
                      >
                        Группировать параметры
                      </Checkbox>
                    </Space.Compact>
                    {fields.map(({ key, name, ...restField }, index) => (
                      <EquipmentTypeItem
                        {...restField}
                        setParameterModalStatus={setParameterModalStatus}
                        key={key}
                        index={index}
                        parameterItems={dataParameters?.parameters?.items}
                        removeItem={(value) => {
                          remove(value);
                        }}
                      />
                    ))}

                    <Space.Compact
                      direction="vertical"
                      style={{ width: "100%", marginBottom: 10, marginTop: 0 }}
                    >
                      <Button
                        type={"primary"}
                        size={"small"}
                        onClick={() => add()}
                        style={{ width: "100%" }}
                        icon={<PlusOutlined />}
                      >
                        Добавить параметр в характеристики
                      </Button>
                      <Button
                        type={"primary"}
                        size={"small"}
                        disabled
                        // onClick={() => add()}
                        style={{ width: "100%" }}
                        icon={<PlusOutlined />}
                      >
                        Добавить группу параметров
                      </Button>
                    </Space.Compact>
                  </>
                )}
              </Form.List>

              <Modal
                key={nanoid()}
                open={parameterModalStatus}
                onCancel={() => setParameterModalStatus(null)}
                footer={null}
                width={"max-content"}
                title={"Параметр"}
                children={
                  <ParameterForm
                    onCompleted={(value) => {
                      console.log("ParameterFormonCompleted value", value);
                      console.log(
                        "parameterModalStatus?.key",
                        parameterModalStatus?.key
                      );
                      const newRow = [...form.getFieldValue("parametersList")];
                      newRow[parameterModalStatus?.key] = {
                        parameter: {
                          selected: value.id,
                          output: value.name,
                        },
                      };
                      form.setFieldValue("parametersList", newRow);
                      form.validateFields(["parametersList"]);
                      setParameterModalStatus(null);
                    }}
                    initialObject={
                      parameterModalStatus?.ird_id
                        ? { id: parameterModalStatus?.ird_id }
                        : null
                    }
                  />
                }
              />
            </Form>
          </>
        }
      />
    </>
  );
};

export default EquipmentTypeParametersStructureForm;
