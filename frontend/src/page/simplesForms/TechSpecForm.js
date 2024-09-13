import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Card, Form} from 'antd';
import TextArea from "antd/es/input/TextArea";
import {Input, Space} from 'antd/lib';
import React, {useContext, useState} from 'react';
import {NotificationContext} from '../../NotificationProvider';
import {ModalButton} from "./formComponents/ModalButtonComponent";

const TechSpecForm = ({localObject, initialObject, onCompleted, cardProps}) => {
    const {openNotification} = useContext(NotificationContext);
    const [form] = Form.useForm();
    const [argumentsList, setArgumentsList] = useState([]); // Состояние для списка аргументов
    const [timer, setTimer] = useState(null); // Таймер для отслеживания изменений
    const [counterParament, setCounterParament] = useState(0);
    // Функция для обновления поля и добавления атрибута
    const addAtribute = () => {
        const contentText = form.getFieldValue("content");
        if (!contentText.endsWith(" ")) {
            form.setFieldValue("content", contentText + " " + counterParament + "_______ ");
        } else {
            form.setFieldValue("content", contentText + "" + counterParament + "_______ ");
        }
        setCounterParament(counterParament + 1)
        openNotification('top', 'info', `Attribute added to content: ${contentText}`);
    };

    // Функция, которая срабатывает при изменении контента
    const handleContentChange = (event) => {
        let contentText = event.target.value;

        // Открыть уведомление с текущим контентом
        openNotification('top', 'info', `Content changed: ${contentText}`);

        // Найти все фрагменты с подчёркиваниями и заменить их на пустую строку, если они меньше 7 или не начинаются с цифры
        contentText = contentText.replace(/\b\d?_+/g, (match) => {
            // Условие: если нет цифры в начале или длина подчёркиваний меньше 7, затираем
            const hasDigit = /^\d/.test(match);
            const underscoreCount = (match.match(/_/g) || []).length;
            return hasDigit && underscoreCount >= 7 ? match : '';
        });

        // Обновить поле content новым значением
        form.setFieldValue("content", contentText);

        // Очищаем старый таймер
        if (timer) clearTimeout(timer);

        // Устанавливаем новый таймер на 3 секунды
        setTimer(setTimeout(() => {
            // Разбиваем контент на аргументы и обновляем массив
            const argumentsArray = contentText.split(" ").filter(item => item.includes("_"));
            setArgumentsList((prevList) => [...prevList, ...argumentsArray]); // Добавляем новые аргументы

            // Показываем уведомление с результатом
            openNotification('top', 'info', `Arguments list updated: ${argumentsArray.join(", ")}`);
        }, 1000));
    };


    return (
        <Card style={{width: 400}}
              {...cardProps}
              actions={[
                  <ModalButton
                      modalType={"green"}
                      isMany={cardProps?.actions}
                      loading={false}
                      onClick={() => form.submit()}
                      children={localObject ? `Обновить` : `Создать`}/>,
                  ...cardProps?.actions ?? []
              ]}
              children={
                  <>
                      <Form form={form}>
                          <Form.Item name="name" label="Наименов" rules={[{required: true}]}>
                              <TextArea/>
                          </Form.Item>
                          <Form.Item name="content" label="Содержание" rules={[{required: true}]}>
                              <TextArea onChange={handleContentChange}/>
                          </Form.Item>
                          <Button onClick={() => addAtribute()}>Добавить данные от заказчика</Button>

                          {/* Отображаем список аргументов */}
                          <Form.List name="items">
                              {(fields, {add, remove}) => (
                                  <>
                                      {fields.map(({key, name, fieldKey, ...restField}, index) => (
                                          <Space key={key} style={{display: 'flex', marginBottom: 8}} align="baseline">
                                              <Form.Item
                                                  {...restField}
                                                  name={[name, 'title']}
                                                  fieldKey={[fieldKey, 'title']}
                                                  label={`Название ${index + 1}`}
                                                  rules={[{required: true, message: 'Пожалуйста, введите название'}]}
                                              >
                                                  <Input placeholder="Введите название"/>
                                              </Form.Item>

                                              <Form.Item
                                                  {...restField}
                                                  name={[name, 'description']}
                                                  fieldKey={[fieldKey, 'description']}
                                                  label={`Описание ${index + 1}`}
                                                  rules={[{required: true, message: 'Пожалуйста, введите описание'}]}
                                              >
                                                  <Input placeholder="Введите описание"/>
                                              </Form.Item>

                                              <div>Аргумент: {argumentsList[index]}</div>

                                              <MinusCircleOutlined onClick={() => remove(name)}/>
                                          </Space>
                                      ))}

                                      <Form.Item>
                                          <Button
                                              type="dashed"
                                              onClick={() => add()}
                                              icon={<PlusOutlined/>}
                                              style={{width: '100%'}}
                                          >
                                              Добавить элемент
                                          </Button>
                                      </Form.Item>
                                  </>
                              )}
                          </Form.List>
                      </Form>
                  </>
              }
        />
    );
};

export default TechSpecForm;
