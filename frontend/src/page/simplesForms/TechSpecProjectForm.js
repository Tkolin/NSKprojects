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

const dataEntries = [
  {
    name: "Заказчик проекта",
    content: "АО «0_______»",
    variables: [
      {
        key: "0_______",
        name: "Наименование заказчика",
        type: "text",
      },
    ],
  },
  {
    name: "Место расположения объекта",
    content: "г. 1_______ Новосибирской области",
    variables: [
      {
        key: "1_______",
        name: "Город",
        type: "text",
      },
    ],
  },
  {
    name: "Вид строительства",
    content: "2_______",
    variables: [
      {
        key: "2_______",
        name: "Вид строительства",
        type: "list",
        table: [
          { key: "1", value: "Техническое перевооружение" },
          { key: "2", value: "Новое строительство" },
          { key: "3", value: "Реконструкция" },
        ],
      },
    ],
  },
  {
    name: "Наименование объекта",
    content: "2_______ 3_______ месторождения известняков",
    variables: [
      {
        key: "2_______",
        name: "Вид строительства",
        type: "list",
        table: [
          { key: "1", value: "Техническое перевооружение" },
          { key: "2", value: "Новое строительство" },
          { key: "3", value: "Реконструкция" },
        ],
      },
      {
        key: "3_______",
        name: "Название месторождения",
        type: "text",
      },
    ],
  },
  {
    name: "Стадийность проектирования",
    content: "4_______ - проектная документация",
    variables: [
      {
        key: "4_______",
        name: "Стадийность проектирования",
        type: "list",
        table: [
          { key: "1", value: "Одностадийное" },
          { key: "2", value: "Двухстадийное" },
        ],
      },
    ],
  },
  {
    name: "Основание для проектирования",
    content: "5_______",
    variables: [
      {
        key: "5_______",
        name: "Основание для проектирования",
        type: "text",
      },
    ],
  },
  {
    name: "Особые условия строительства",
    content: "Сейсмичность – 6 баллов (ОСР-97)",
    variables: [],
  },
  {
    name: "Источник финансирования",
    content: "Собственные средства АО «0_______»",
    variables: [
      {
        key: "0_______",
        name: "Наименование заказчика",
        type: "text",
      },
    ],
  },
  {
    name: "Основные технико-экономические показатели объекта",
    content:
      "Годовой объём добычи камня в плотном теле:\n-2024 – 6_______ тыс.т\n-2025г  - 7_______ тыс. т\n- с 2026г. -8_______ тыс.т\nРежим работы карьера - 9_______",
    variables: [
      {
        key: "6_______",
        name: "Объём добычи на 2024 г.",
        type: "number",
      },
      {
        key: "7_______",
        name: "Объём добычи на 2025 г.",
        type: "number",
      },
      {
        key: "8_______",
        name: "Объём добычи с 2026 г.",
        type: "number",
      },
      {
        key: "9_______",
        name: "Режим работы карьера",
        type: "text",
      },
    ],
  },
  {
    name: "Технологические решения и оборудование",
    content:
      "1. Произвести расчет потребности экскаваторного парка при применении экскаваторов марки 10_______ с емкостью ковша 11_______ м3, с 2024 года 12_______ и других аналогичных по техническим характеристикам с емкостью ковша 13_______ м3.\n2. Применение поливочной машины на базе 14_______\n3. Применение самосвалов, грузоподъемностью до 15_______ тонн.",
    variables: [
      {
        key: "10_______",
        name: "Марка экскаватора",
        type: "text",
      },
      {
        key: "11_______",
        name: "Емкость ковша (м3)",
        type: "number",
      },
      {
        key: "12_______",
        name: "Марки экскаваторов с 2024 года",
        type: "text",
      },
      {
        key: "13_______",
        name: "Емкость ковша аналогичных экскаваторов (м3)",
        type: "number",
      },
      {
        key: "14_______",
        name: "База поливочной машины",
        type: "text",
      },
      {
        key: "15_______",
        name: "Грузоподъемность самосвалов (тонн)",
        type: "number",
      },
    ],
  },
  {
    name: "Основные эксплуатационные показатели",
    content:
      "1. Эксплуатационные потери полезного ископаемого, календарь добычных и вскрышных работ запроектировать с учетом изменения объемов добычи.",
    variables: [],
  },
  {
    name: "Требования к полноте отработки запасов",
    content:
      "Предусмотреть отработку запасов в пределах границы подсчета запасов до отм. +16_______ м",
    variables: [
      {
        key: "16_______",
        name: "Отметка доработки запасов (м)",
        type: "number",
      },
    ],
  },
  {
    name: "Сведения о проведении буровзрывных работ",
    content:
      "БВР производятся подрядной организацией, имеющей лицензию. Описать порядок проведения БВР при постановке бортов в предельное положение.",
    variables: [],
  },
  {
    name: "Обеспечение трудящихся жильём, питанием, бытовыми услугами",
    content: "17_______",
    variables: [
      {
        key: "17_______",
        name: "Требуется обеспечение?",
        type: "list",
        table: [
          { key: "1", value: "Требуется" },
          { key: "2", value: "Не требуется" },
        ],
      },
    ],
  },
  {
    name: "Состав и содержание проектной документации",
    content:
      "Состав технического проекта должен соответствовать приказу Минприроды России №18_______ от 25.06.2010 г.",
    variables: [
      {
        key: "18_______",
        name: "Номер приказа Минприроды",
        type: "text",
      },
    ],
  },
  {
    name: "Указания о выполнении экологических и санитарно-эпидемиологических условий к объекту",
    content: "19_______",
    variables: [
      {
        key: "19_______",
        name: "Требования экологических условий",
        type: "text",
      },
    ],
  },
  {
    name: "Требования по разработке инженерно-технических мероприятий гражданской обороны и мероприятий по предупреждению чрезвычайных ситуаций",
    content: "20_______",
    variables: [
      {
        key: "20_______",
        name: "Требования ГО и ЧС",
        type: "text",
      },
    ],
  },
  {
    name: "Границы проектирования",
    content: "21_______",
    variables: [
      {
        key: "21_______",
        name: "Границы проектирования",
        type: "text",
      },
    ],
  },
  {
    name: "Основные исходные материалы",
    content:
      "Предоставляются заказчиком согласно Приложению №22_______ к договору «Перечень исходно-разрешительной документации»",
    variables: [
      {
        key: "22_______",
        name: "Номер приложения к договору",
        type: "text",
      },
    ],
  },
  {
    name: "Выделение очередей и пусковых комплексов",
    content: "23_______",
    variables: [
      {
        key: "23_______",
        name: "Требуется выделение очередей?",
        type: "list",
        table: [
          { key: "1", value: "Требуется" },
          { key: "2", value: "Не требуется" },
        ],
      },
    ],
  },
  {
    name: "Сроки проектирования",
    content:
      "Определяется Приложением №24_______ «График выполнения работ и платежей»",
    variables: [
      {
        key: "24_______",
        name: "Номер приложения с графиком",
        type: "text",
      },
    ],
  },
  {
    name: "Комплектность передаваемой проектно-сметной документации",
    content:
      "Все результаты работ, выполняемых в рамках данного проекта, предоставляются Заказчику:\n- на бумажном носителе - 25_______ экз.\n- в электронном виде - 26_______ экз. текстовые документы в формате Word, графические приложения в векторной графике (dwg, иное)",
    variables: [
      {
        key: "25_______",
        name: "Количество бумажных экземпляров",
        type: "number",
      },
      {
        key: "26_______",
        name: "Количество электронных экземпляров",
        type: "number",
      },
    ],
  },
  {
    name: "Порядок согласования и экспертизы",
    content:
      "Подрядчик:\n- Согласовывает проектные решения с Заказчиком;\n- Осуществляет техническое сопровождение проекта при прохождении экспертизы промышленной безопасности и согласование в Минприроде.",
    variables: [],
  },
];
const DataEntryForm = () => {
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

export default DataEntryForm;
