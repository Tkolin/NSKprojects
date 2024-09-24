import {
    Alert,
    Button,
    Col,
    Divider,
    Input,
    InputNumber,
    message,
    Row,
    Select,
    Switch,
} from "antd";
import React, { useState } from "react";

const { TextArea } = Input;
const { Option } = Select;

const dataEntries = [  {
    name: "Наименование '",
    content: "2_______ 3_______ месторождения известняков",
    variables: [
      {
        key: "2_______",
        name: "Вид строительства",
        type: "references",
        values: [
          { key: "1", name: "Техническое перевооружение", value: 1 },
          { key: "2", name: "Новое строительство", value: 2  },
          { key: "3", name: "Реконструкция", value: 3  },
        ],
      },
      {
        key: "3_______",
        name: "Название месторождения",
        type: "text",
        value: "fadfad",
      },
      {
        key: "3_______",
        name: "Название месторождения",
        type: "number",
        value: 43,
      },
    ],
  }];
const ProjectTSManagerForm = () => {
  const [entries, setEntries] = useState(dataEntries);
  const [jsonOutput, setJsonOutput] = useState("");
  const [showContent, setShowContent] = useState(false); // Состояние переключателя

  const handleVariableChange = (entryIndex, variableKey, value) => {
    const updatedEntries = [...entries];
    const entry = updatedEntries[entryIndex];

    // Обновляем значение переменной
    if (!entry.values) {
      entry.values = {};
    }
    entry.values[variableKey] = value;

    // Обновляем контент с подстановкой переменных
    let updatedContent = entry.content;
    entry.variables.forEach((variable) => {
      const variableValue =
        entry.values[variable.key] !== undefined
          ? entry.values[variable.key]
          : variable.key;
      const regex = new RegExp(variable.key, "g");
      updatedContent = updatedContent.replace(regex, variableValue);
    });
    entry.updatedContent = updatedContent;

    setEntries(updatedEntries);
  };

  const handleSave = () => {
    // Подготавливаем данные для сохранения
    const dataToSave = entries.map((entry) => {
      const { name, content, variables, values } = entry;
      return {
        name,
        content,
        variables,
        values,
      };
    });

    // Конвертируем в JSON-строку
    const jsonData = JSON.stringify(dataToSave, null, 2);

    // Выводим JSON-данные
    setJsonOutput(jsonData);
    message.success("Данные сохранены. JSON отображен ниже.");
  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={12}>
          <Alert
            message={
              <Row
                gutter={[16, 16]}
                align="middle"
                style={{ marginBottom: 10 }}
              >
                <Col span={8}>
                  <strong>№. Наименование раздела</strong>
                  <br />
                  Содержание
                  <br />
                  Выберите значение
                </Col>
              </Row>
            }
          />
          {/* Правая часть: Переменные с переключателем для отображения содержимого */}
          <div style={{ marginBottom: 20 }}>
            <Switch
              checked={showContent}
              onChange={(checked) => setShowContent(checked)}
              checkedChildren="Показать содержимое"
              unCheckedChildren="Скрыть содержимое"
            />
          </div>
          {entries.map(
            (entry, entryIndex) =>
              entry.variables.length > 0 && (
                <div key={entryIndex} style={{ marginBottom: 20 }}>
                  <h3>
                    {entryIndex + 1}. {entry.name}
                  </h3>
                  {showContent && (
                    <p>{entry.updatedContent || entry.content}</p>
                  )}
                  {entry.variables.map((variable, varIndex) => (
                    <Row
                      key={varIndex}
                      gutter={[16, 16]}
                      align="middle"
                      style={{ marginBottom: 10 }}
                    >
                      <Col span={8}>
                        <strong>{variable.name}:</strong>
                      </Col>
                      <Col span={16}>
                        {variable.type === "number" ? (
                          <InputNumber
                            style={{ width: "100%" }}
                            value={
                              entry.values
                                ? entry.values[variable.key]
                                : undefined
                            }
                            onChange={(value) =>
                              handleVariableChange(
                                entryIndex,
                                variable.key,
                                value
                              )
                            }
                            placeholder="Введите число"
                          />
                        ) : variable.type === "list" ? (
                          <Select
                            style={{ width: "100%" }}
                            value={
                              entry.values
                                ? entry.values[variable.key]
                                : undefined
                            }
                            onChange={(value) =>
                              handleVariableChange(
                                entryIndex,
                                variable.key,
                                value
                              )
                            }
                            placeholder="Выберите значение"
                          >
                            {variable.table.map((option) => (
                              <Option key={option.key} value={option.value}>
                                {option.value}
                              </Option>
                            ))}
                          </Select>
                        ) : (
                          <Input
                            style={{ width: "100%" }}
                            value={
                              entry.values
                                ? entry.values[variable.key]
                                : undefined
                            }
                            onChange={(e) =>
                              handleVariableChange(
                                entryIndex,
                                variable.key,
                                e.target.value
                              )
                            }
                            placeholder="Введите текст"
                          />
                        )}
                      </Col>
                    </Row>
                  ))}
                  <Divider style={{ margin: 0, marginBottom: "5px" }} />
                </div>
              )
          )}
        </Col>
      </Row>
      <Button type="primary" onClick={handleSave}>
        Сохранить
      </Button>
      {jsonOutput && (
        <div style={{ marginTop: 20 }}>
          <h3>JSON данные:</h3>
          <pre>{jsonOutput}</pre>
        </div>
      )}
    </div>
  );
};

export default ProjectTSManagerForm;
