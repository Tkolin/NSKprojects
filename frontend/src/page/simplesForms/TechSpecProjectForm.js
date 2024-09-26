import { useLazyQuery } from "@apollo/client";
import { Alert, Col, Row, Switch } from "antd";
import { useEffect } from "react";
import { PROJECT_TS_QUERY } from "../../graphql/queriesByID";

const DataEntryForm = ({ projectId }) => {
  const [loadContact, { loading, data }] = useLazyQuery(PROJECT_TS_QUERY, {
    onCompleted: (data) => {},
    onError: (error) => {},
  });
  useEffect(() => {
    loadContact();
  }, []);
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
