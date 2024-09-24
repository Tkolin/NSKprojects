import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Card, Form, Input, Modal, Select, Space, Tooltip } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useContext, useEffect, useState } from "react";
import {
    CREATE_TECH_CHAPTER_MUTATION,
    UPDATE_TECH_CHAPTER_MUTATION,
} from "../../graphql/mutationsReference";
import { REFERENCES_QUERY_COMPACT } from "../../graphql/queriesCompact";
import { NotificationContext } from "../../NotificationProvider";
import { AutoCompleteFormItem } from "../components/CustomForm";
import { CustomAutoCompleteExtension } from "../components/style/SearchAutoCompleteStyles";
import { ModalButton } from "./formComponents/ModalButtonComponent";

const { Option } = Select;

// Предполагается, что AutoCompleteFormItem и CustomAutoCompleteExtension корректно работают
// и обеспечивают функциональность выбора справочника

const TechSpecForm = ({
  localObject,
  initialObject,
  actualObject,
  onCompleted,
  cardProps,
}) => {
  const { openNotification } = useContext(NotificationContext);
  const [form] = Form.useForm();
  const [counterParament, setCounterParament] = useState(0);
  const [tableDataMap, setTableDataMap] = useState({}); // Хранит таблицы для переменных
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentVariableIndex, setCurrentVariableIndex] = useState(null);
  const [currentTableData, setCurrentTableData] = useState([]);
  const [referenceModalStatus, setReferenceModalStatus] = useState(false);
  const [tableForm] = Form.useForm();

  // Получение данных справочников через GraphQL-запрос
  const {
    loading: loadingReferences,
    error: errorReferences,
    data: dataReferences,
  } = useQuery(REFERENCES_QUERY_COMPACT);

  // Функция для удаления некорректных переменных из содержимого
  const sanitizeContent = (content) => {
    // Регулярное выражение для поиска переменных с менее чем 7 подчеркиваниями
    const invalidVariableRegex = /\b\d_{1,6}\b/g;
    // Удаляем такие переменные из текста
    return content.replace(invalidVariableRegex, "");
  };
  const [mutate, { loading: loadingSave }] = useMutation(
    actualObject ? UPDATE_TECH_CHAPTER_MUTATION : CREATE_TECH_CHAPTER_MUTATION,
    {
      onCompleted: (data) => {
        openNotification("topRight", "success", `Мутация  выполнена успешно`);
        form.resetFields();
        onCompleted && onCompleted(data?.createreference || data?.createPerson);
      },
      onError: (error) => {
        openNotification("topRight", "error", `Ошибка при выполнении мутации`);
      },
    }
  );
  const addAtribute = () => {
    const contentText = form.getFieldValue("content") || "";
    const newVariable = `${counterParament}_______`;
    const updatedContent = contentText.endsWith(" ")
      ? contentText + newVariable + " "
      : contentText + " " + newVariable + " ";
    form.setFieldsValue({ content: updatedContent });
    setCounterParament(counterParament + 1);

    openNotification(
      "top",
      "info",
      `Добавлен атрибут в содержимое: ${newVariable}`
    );
    handleContentChange({ target: { value: updatedContent } }); // Обновляем переменные
  };

  const handleContentChange = (event) => {
    let contentText = event.target.value || "";

    // Удаляем переменные с менее чем 7 подчеркиваниями
    contentText = sanitizeContent(contentText);

    // Обновляем содержимое формы после удаления некорректных переменных
    form.setFieldsValue({ content: contentText });

    // Извлекаем корректные переменные из текста
    const variableRegex = /\b\d+_{7,}/g;
    const variables_in_content = contentText.match(variableRegex) || [];

    // Убираем дубликаты
    const uniqueVariables = [...new Set(variables_in_content)];

    // Получаем текущие переменные из формы
    const currentVariables = form.getFieldValue("variables_in_content") || [];

    // Создаем объект для сохранения выбранных типов и имен
    const variableMap = {};
    currentVariables.forEach((variable) => {
      variableMap[variable.variableName] = {
        type: variable.type,
        name: variable.variableName,
      };
    });

    // Обновляем список переменных в форме, сохраняя выбранные типы и имена
    const newVariables = uniqueVariables.map((variableName) => ({
      variableName: variableName,
      type: variableMap[variableName]?.type || undefined,
      // Добавляем поле reference_key, если тип 'reference'
      reference_key: variableMap[variableName]?.reference_key || undefined,
    }));

    form.setFieldsValue({
      variables_in_content: newVariables,
    });

    openNotification(
      "top",
      "info",
      `Обновлен список переменных: ${uniqueVariables.join(", ")}`
    );
  };

  // Функция открытия модального окна для ввода таблицы
  const showModal = (index) => {
    setCurrentVariableIndex(index);
    const existingTableData = tableDataMap[index] || [];
    setCurrentTableData(existingTableData);
    tableForm.setFieldsValue({ table: existingTableData });
    setIsModalVisible(true);
  };

  // Функция закрытия модального окна
  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentVariableIndex(null);
    setCurrentTableData([]);
    tableForm.resetFields();
  };

  // Функция сохранения таблицы
  const handleSaveTable = () => {
    tableForm
      .validateFields()
      .then((values) => {
        const updatedTableData = values.table || [];
        setTableDataMap((prev) => ({
          ...prev,
          [currentVariableIndex]: updatedTableData,
        }));
        openNotification(
          "top",
          "success",
          `Таблица для переменной ${currentVariableIndex} сохранена`
        );
        handleCancel();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  // Колонки для таблицы в модальном окне
  const columns = [
    {
      title: "Ключ",
      dataIndex: "key",
      key: "key",
      rules: [{ required: true, message: "Пожалуйста, введите ключ" }],
    },
    {
      title: "Значение",
      dataIndex: "value",
      key: "value",
      rules: [{ required: true, message: "Пожалуйста, введите значение" }],
    },
    {
      title: "Действие",
      key: "action",
      render: (_, record, index) => (
        <MinusCircleOutlined
          onClick={() => {
            const table = tableForm.getFieldValue("table") || [];
            table.splice(index, 1);
            tableForm.setFieldsValue({ table });
          }}
        />
      ),
    },
  ];
  const processReferenceKeys = (data) => {
    if (data.variables_in_content && Array.isArray(data.variables_in_content)) {
      data.variables_in_content = data.variables_in_content.map((variable) => {
        if (
          variable.type === "reference" &&
          variable.reference_key &&
          typeof variable.reference_key.selected !== "undefined"
        ) {
          return {
            ...variable,
            reference_key: variable.reference_key.selected,
          };
        }
        return variable;
      });
    }
    return data;
  };

  // Инициализация формы с начальными данными, если они есть
  useEffect(() => {
    if (initialObject) {
      form.setFieldsValue(initialObject);
      // Обновляем счетчик параметров на основе существующих переменных
      const existingVariables =
        initialObject.content.match(/\b\d+_{7,}/g) || [];
      if (existingVariables.length > 0) {
        const maxNumber = Math.max(
          ...existingVariables.map((v) => parseInt(v))
        );
        setCounterParament(maxNumber + 1);
      }
    }
  }, [initialObject, form]);

  // Функция обработки отправки формы
  const onFinish = (values) => {
    const { name, content, variables_in_content } = values;

    // Создаём объект данных
    const data = {
      name,
      content,
      variables_in_content,
    };

    // Обрабатываем reference_key
    const processedData = processReferenceKeys(data);

    // Формируем массив переменных с таблицами, если необходимо
    const processedVariables = processedData.variables_in_content?.map(
      (variable, index) => {
        const table = tableDataMap[index] || [];
        return {
          key: variable.variableName,
          name: variable.variableName || "", // Имя, введенное пользователем
          type: variable.type,
          table: variable.type === "list" ? table : undefined,
          reference_key:
            variable.type === "reference" ? variable.reference_key : undefined,
        };
      }
    );

    const result = 
      {
        name: processedData.name,
        content: processedData.content,
        variables_in_content: processedVariables,
      };

    // Выводим результат (можно отправить на сервер или использовать по необходимости)
    mutate({ variables: { data: result } });
    openNotification("top", "success", "Данные успешно сохранены");

    // Вызываем коллбэк, если он передан
    if (onCompleted) {
      onCompleted(result);
    }
  };

  return (
    <Card
      style={{ width: 800 }}
      {...cardProps}
      actions={[
        <ModalButton
          modalType={"green"}
          isMany={cardProps?.actions}
          loading={false}
          onClick={() => form.submit()}
          children={localObject ? `Обновить` : `Создать`}
        />,
        ...(cardProps?.actions ?? []),
      ]}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Наименование"
          rules={[
            { required: true, message: "Пожалуйста, введите наименование" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="content"
          label="Содержание"
          rules={[
            { required: true, message: "Пожалуйста, введите содержание" },
          ]}
        >
          <TextArea onChange={handleContentChange} rows={4} />
        </Form.Item>
        <Button type="dashed" onClick={addAtribute} icon={<PlusOutlined />}>
          Добавить данные от заказчика
        </Button>

        {/* Отображаем список переменных */}
        <Form.List name="variables_in_content">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "variableName"]}
                    rules={[
                      {
                        required: true,
                        message: "Пожалуйста, введите имя переменной",
                      },
                    ]}
                  >
                    <Input placeholder={`Имя переменной ${index + 1}`} />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "type"]}
                    rules={[
                      { required: true, message: "Пожалуйста, выберите тип" },
                    ]}
                  >
                    <Select placeholder="Выберите тип">
                      <Option value="text">Текст</Option>
                      <Option value="number">Число</Option>
                      <Option value="reference">Значение из справочника</Option>
                    </Select>
                  </Form.Item>

                  {/* Отображение поля выбора справочника, если тип 'reference' */}
                  <Form.Item
                    shouldUpdate={(prevValues, curValues) =>
                      prevValues.variables_in_content?.[name]?.type !==
                      curValues.variables_in_content?.[name]?.type
                    }
                  >
                    {() => {
                      const type = form.getFieldValue([
                        "variables_in_content",
                        name,
                        "type",
                      ]);
                      if (type === "reference") {
                        return (
                          <Tooltip title="Наименование справочника">
                            <AutoCompleteFormItem
                              rulesValidationRequired={true}
                              rulesValidationMessage={
                                "Выбор справочника обязателен"
                              }
                              name={[name, "reference_key"]}
                            >
                              <CustomAutoCompleteExtension
                                firstBtnOnClick={() =>
                                  setReferenceModalStatus({
                                    mode: "add",
                                    key: index,
                                  })
                                }
                                style={{ width: "100%" }}
                                placeholder={"Выбор справочника..."}
                                loading={loadingReferences}
                                data={dataReferences?.references?.items}
                              />
                            </AutoCompleteFormItem>
                          </Tooltip>
                        );
                      }
                      return null;
                    }}
                  </Form.Item>

                  <MinusCircleOutlined
                    onClick={() => {
                      remove(name);
                      // Удаляем таблицу, если она была
                      setTableDataMap((prev) => {
                        const newMap = { ...prev };
                        delete newMap[index];
                        return newMap;
                      });
                    }}
                  />
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

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Сохранить
          </Button>
        </Form.Item>
      </Form>

      {/* Модальное окно для ввода таблицы */}
      <Modal
        title={`Заполнить список значений для переменной ${
          currentVariableIndex !== null ? currentVariableIndex + 1 : ""
        }`}
        visible={isModalVisible}
        onOk={handleSaveTable}
        onCancel={handleCancel}
        okText="Сохранить"
        cancelText="Отмена"
        width={600}
      >
        <Form form={tableForm} layout="vertical">
          <Form.List name="table">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }, idx) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "key"]}
                      fieldKey={[fieldKey, "key"]}
                      rules={[
                        { required: true, message: "Пожалуйста, введите ключ" },
                      ]}
                    >
                      <Input placeholder="Ключ" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "value"]}
                      fieldKey={[fieldKey, "value"]}
                      rules={[
                        {
                          required: true,
                          message: "Пожалуйста, введите значение",
                        },
                      ]}
                    >
                      <Input placeholder="Значение" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    style={{ width: "100%" }}
                  >
                    Добавить строку
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      {/* Модальное окно для выбора справочника (если требуется) */}
      {referenceModalStatus && (
        <Modal
          title="Выбор справочника"
          visible={referenceModalStatus}
          onOk={() => setReferenceModalStatus(false)}
          onCancel={() => setReferenceModalStatus(false)}
          footer={[
            <Button key="close" onClick={() => setReferenceModalStatus(false)}>
              Закрыть
            </Button>,
          ]}
        >
          {/* Здесь можно разместить дополнительные компоненты или логику для выбора справочника */}
          <p>Функционал выбора справочника пока не реализован.</p>
        </Modal>
      )}
    </Card>
  );
};

export default TechSpecForm;
