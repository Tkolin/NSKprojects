import React, {useEffect, useState} from 'react';
import {Form, Input, notification} from 'antd';
import { useMutation } from '@apollo/client';
import {BIK_QUERY} from '../../graphql/queries';
import { StyledFormItem, StyledFormRegular} from '../style/FormStyles';
import {ADD_STAGE_MUTATION, UPDATE_STAGE_MUTATION} from "../../graphql/mutationsStage";
import {StyledBlockRegular} from "../style/BlockStyles";
import {StyledButtonGreen} from "../style/ButtonStyles";

const IrdForm = ({ stage, onClose }) => {

    // Состояния
    const [editingStage, setEditingStage] = useState(null);
    const [form] = Form.useForm();
    const [ api,contextHolder] = notification.useNotification();

    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };


    // Заполнение формы данными контакта при его редактировании
    useEffect(() => {
        if (stage) {
            setEditingStage(stage);
            form.setFieldsValue({name: stage.name});
        }
    }, [stage, form]);

    // Мутации для добавления и обновления
    const [addStage] = useMutation(ADD_STAGE_MUTATION, {
        refetchQueries: [{ query: BIK_QUERY }],
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно добавлены!');
            form.resetFields();
        },
        onError: () => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных.');
        }
    });

    const [updateStage] = useMutation(UPDATE_STAGE_MUTATION, {
        refetchQueries: [{ query: BIK_QUERY }],
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно обновлены!');
            setEditingStage(null);
            onClose();
        },
        onError: () => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных.');
        }
    });

    // Обработчик отправки формы
    const handleSubmit = () => {
        if (editingStage) {
            updateStage({ variables: { id: editingStage.id, ...form.getFieldsValue() } });
        } else {
            addStage({ variables: form.getFieldsValue() });
        }
    };

    return (
        <StyledBlockRegular label={'Этап'}>
            <StyledFormRegular form={form} layout="vertical">
                <StyledFormItem name="name" label="Наименование" rules={[{required: true}]}>
                    <Input/>
                </StyledFormItem>
                <div style={{textAlign: 'center'}}>
                    <StyledFormItem>
                        <StyledButtonGreen type="primary" onClick={handleSubmit}>
                            {editingStage ? "Сохранить изменения" : "Добавить"}
                        </StyledButtonGreen>
                    </StyledFormItem>
                </div>
            </StyledFormRegular>
        </StyledBlockRegular>
);
};

export default IrdForm;
