import React, {useEffect, useState} from 'react';
import {Form, Input, notification} from 'antd';
import { useMutation } from '@apollo/client';
import { StyledFormItem, StyledFormRegular} from '../../style/FormStyles';
import {StyledBlockRegular} from "../../style/BlockStyles";
import {StyledButtonGreen} from "../../style/ButtonStyles";
import {ADD_TASK_MUTATION, UPDATE_TASK_MUTATION} from "../../../graphql/mutationsTask";

const TaskForm = ({ task, onClose }) => {

    // Состояния
    const [editTask, setEditTask] = useState(null);
    const [form] = Form.useForm();
    const [ api,contextHolder] = notification.useNotification();

    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };

    // Мутации для добавления и обновления
    const [addTask] = useMutation(ADD_TASK_MUTATION, {
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно добавлены!');
            form.resetFields();
        },
        onError: () => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных.');
        }
    });

    const [updateTask] = useMutation(UPDATE_TASK_MUTATION, {
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно обновлены!');
            setEditTask(null);
            if(onClose)
                onClose();
        },
        onError: () => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных.');
        }
    });
    // Заполнение формы данными контакта при его редактировании
    useEffect(() => {
        if (task) {
            console.log("task "+ task);
            setEditTask(task);
            form.setFieldsValue({name: task.name});
        }
    }, [task, form]);
    // Обработчик отправки формы
    const handleSubmit = () => {
        if (editTask) {
            updateTask({ variables: { id: editTask.id, ...form.getFieldsValue() } });
        } else {
            addTask({ variables: form.getFieldsValue() });
        }
    };

    return (
        <StyledBlockRegular label={'Задача'}>
            <StyledFormRegular form={form} layout="vertical">
                <StyledFormItem name="name" label="Наименование" rules={[{required: true}]}>
                    <Input/>
                </StyledFormItem>
                <div style={{textAlign: 'center'}}>
                    <StyledFormItem>
                        <StyledButtonGreen type="primary" onClick={handleSubmit}>
                            Сохранить изменения
                        </StyledButtonGreen>
                    </StyledFormItem>
                </div>
            </StyledFormRegular>
        </StyledBlockRegular>
    );
};

export default TaskForm;
