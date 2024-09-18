import { Button, Card, Col, InputNumber, List, message, Row, Select } from 'antd';
import { evaluate } from 'mathjs';
import React, { useEffect, useRef, useState } from 'react';

const { Option } = Select;

// Исходные данные из ТЗ
const dataSources = [
  {
    name: 'Основные данные проекта',
    key: 'project_data',
    variables: [
      { name: 'Годовой объем добычи 2024', key: 'production_2024', value: 1300000 }, // в тоннах
      { name: 'Годовой объем добычи 2025', key: 'production_2025', value: 1400000 }, // в тоннах
      { name: 'Годовой объем добычи с 2026', key: 'production_2026', value: 1700000 }, // в тоннах
      { name: 'Емкость ковша экскаватора', key: 'bucket_capacity', value: 1.5 }, // в м3
      { name: 'Рабочие часы в году', key: 'work_hours_per_year', value: 365 * 12 }, // 12 часов в день
      { name: 'Коэффициент использования экскаватора', key: 'excavator_efficiency', value: 0.85 }, // от 0 до 1
      { name: 'Плотность породы', key: 'rock_density', value: 2.5 }, // тонн/м3
    ],
  },
];

// Формулы для расчетов в горнодобывающей сфере
const formulaList = [
  {
    id: 1,
    name: 'Производительность экскаватора',
    expression: 'bucket_capacity * rock_density * excavator_efficiency * work_hours_per_year',
    variables: [
      { key: 'bucket_capacity', name: 'Емкость ковша экскаватора' },
      { key: 'rock_density', name: 'Плотность породы' },
      { key: 'excavator_efficiency', name: 'Коэффициент использования экскаватора' },
      { key: 'work_hours_per_year', name: 'Рабочие часы в году' },
    ],
  },
  {
    id: 2,
    name: 'Требуемое количество экскаваторов в 2024',
    expression: 'production_2024 / pnd31',
    variables: [
      { key: 'production_2024', name: 'Годовой объем добычи 2024' },
      { key: 'pnd31', name: 'Производительность экскаватора' },
    ],
  },
  {
    id: 3,
    name: 'Требуемое количество экскаваторов в 2025',
    expression: 'production_2025 / pnd31',
    variables: [
      { key: 'production_2025', name: 'Годовой объем добычи 2025' },
      { key: 'pnd31', name: 'Производительность экскаватора' },
    ],
  },
  {
    id: 4,
    name: 'Требуемое количество экскаваторов с 2026',
    expression: 'production_2026 / pnd31',
    variables: [
      { key: 'production_2026', name: 'Годовой объем добычи с 2026' },
      { key: 'pnd31', name: 'Производительность экскаватора' },
    ],
  },
];

const App = () => {
  // Инициализация переменных из источников данных
  const initialVariables = {};
  dataSources.forEach((source) => {
    source.variables.forEach((variable) => {
      initialVariables[variable.key] = variable.value;
    });
  });

  const [formulas, setFormulas] = useState([]);
  const [results, setResults] = useState({});
  const [variables, setVariables] = useState(initialVariables);
  const [selectedFormula, setSelectedFormula] = useState(null);

  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());
  const timerRef = useRef(null);

  // Обновление времени последнего взаимодействия
  const resetTimer = () => {
    setLastInteractionTime(Date.now());
  };

  // Автоматическое вычисление формул каждые 3 секунды, если пользователь не взаимодействует
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      if (Date.now() - lastInteractionTime >= 3000) {
        evaluateFormulas();
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [lastInteractionTime, variables, formulas]);

  const handleAddFormula = () => {
    if (selectedFormula) {
      setFormulas([...formulas, { ...selectedFormula }]);
      setSelectedFormula(null);
      resetTimer();
    }
  };

  const handleVariableChange = (key, value) => {
    setVariables({ ...variables, [key]: value });
    resetTimer();
  };

  const handleVariableSelect = (formulaIndex, varKey, selectedVarKey) => {
    const updatedFormulas = [...formulas];
    updatedFormulas[formulaIndex].variableMapping = {
      ...updatedFormulas[formulaIndex].variableMapping,
      [varKey]: selectedVarKey,
    };
    setFormulas(updatedFormulas);
    resetTimer();
  };

  const evaluateFormulas = () => {
    let newResults = { ...results };
    formulas.forEach((formula, index) => {
      try {
        // Подготовка локальных переменных для вычисления
        let localVariables = { ...variables, ...newResults };
        let expr = formula.expression;
        formula.variables.forEach(({ key }) => {
          const mappedKey = formula.variableMapping?.[key] || key;
          const varValue = localVariables[mappedKey] !== undefined ? localVariables[mappedKey] : 0;
          expr = expr.replace(new RegExp(`\\b${key}\\b`, 'g'), varValue);
        });
        const result = evaluate(expr);
        newResults[formula.name] = result;
        // Сохраняем результат как переменную для последующего использования
        setVariables((prevVariables) => ({
          ...prevVariables,
          [formula.name]: result,
        }));
      } catch (error) {
        newResults[formula.name] = 'Ошибка';
      }
    });
    setResults(newResults);
  };

  // Получение списка всех доступных переменных и результатов формул
  const getAllVariableOptions = () => {
    const variableOptions = Object.keys(variables).map((key) => ({
      key,
      name: key,
    }));
    return variableOptions;
  };

  // Функция для сохранения расчёта
  const handleSaveCalculation = () => {
    const calculationData = {
      formulas: formulas.map((formula) => ({
        id: formula.id,
        name: formula.name,
        expression: formula.expression,
        variables: formula.variables,
        variableMapping: formula.variableMapping,
      })),
      variables,
    };
    // Здесь вы можете отправить calculationData на сервер или сохранить в базе данных SQL
    // Для демонстрации просто выведем JSON на экран
    const jsonData = JSON.stringify(calculationData, null, 2);
    message.success('Расчёт сохранён');
    console.log('Сохранённые данные:', calculationData);
    // Вы можете заменить console.log на отправку данных на сервер
  };

  return (
    <div style={{ padding: '20px' }} onClick={resetTimer} onKeyDown={resetTimer}>
      <Row gutter={16}>
        {/* Левая часть: Источники данных */}
        <Col span={6}>
          <Card title="Источники данных">
            {dataSources.map((source) => (
              <Card type="inner" title={source.name} key={source.key} style={{ marginBottom: '10px' }}>
                {source.variables.map((variable) => (
                  <div key={variable.key} style={{ marginBottom: '5px' }}>
                    <strong>{variable.name}:</strong> {variables[variable.key]}
                    <InputNumber
                      style={{ width: '100%' }}
                      defaultValue={variable.value}
                      onChange={(value) => handleVariableChange(variable.key, value)}
                    />
                  </div>
                ))}
              </Card>
            ))}
          </Card>
        </Col>

        {/* Центральная часть: Формулы */}
        <Col span={12}>
          <Card title="Формулы" extra={<Button onClick={handleSaveCalculation}>Сохранить расчёт</Button>}>
            <Select
              style={{ width: '100%', marginBottom: '10px' }}
              placeholder="Выберите формулу для добавления"
              value={selectedFormula ? selectedFormula.id : undefined}
              onChange={(value) => {
                const formula = formulaList.find((f) => f.id === value);
                setSelectedFormula(formula);
              }}
            >
              {formulaList.map((formula) => (
                <Option key={formula.id} value={formula.id}>
                  {formula.name}
                </Option>
              ))}
            </Select>
            <Button type="primary" onClick={handleAddFormula} disabled={!selectedFormula} style={{ marginBottom: '20px' }}>
              Добавить формулу
            </Button>
            <List
              bordered
              dataSource={formulas}
              renderItem={(formula, index) => (
                <List.Item>
                  <List.Item.Meta
                    title={formula.name}
                    description={
                      <div>
                        <p>Выражение: {formula.expression}</p>
                        {formula.variables.map(({ key, name }) => (
                          <div key={key} style={{ marginBottom: '5px' }}>
                            <strong>{name}:</strong> {variables[key]}
                            <Select
                              style={{ width: '100%' }}
                              placeholder="Выберите переменную"
                              value={formula.variableMapping?.[key] || key}
                              onChange={(value) => handleVariableSelect(index, key, value)}
                            >
                              {getAllVariableOptions().map((option) => (
                                <Option key={option.key} value={option.key}>
                                  {option.key} ({variables[option.key]})
                                </Option>
                              ))}
                            </Select>
                          </div>
                        ))}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Правая часть: Результаты расчетов */}
        <Col span={6}>
          <Card title="Результаты расчетов">
            <List
              bordered
              dataSource={Object.keys(results)}
              renderItem={(key) => (
                <List.Item>
                  {key}: {results[key]}
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default App;
