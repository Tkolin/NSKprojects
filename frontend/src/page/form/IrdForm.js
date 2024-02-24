import React, {useEffect, useState} from 'react';
import {Form, Input, Button, notification} from 'antd';
import { useMutation } from '@apollo/client';
import {IRDS_QUERY} from '../../graphql/queries';
import {StyledFormItem, StyledFormRegular} from '../style/FormStyles';
import {ADD_IRD_MUTATION, UPDATE_IRD_MUTATION} from "../../graphql/mutationsIrd";
import {StyledBlockRegular} from "../style/BlockStyles";
import {StyledButtonGreen} from "../style/ButtonStyles";


const IrdForm = ({ ird, onClose }) => {

    // Состояния
    const [editingIrd, setEditingIrd] = useState(null);
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
        if (ird) {
            console.log(ird);
            setEditingIrd(ird);
            form.setFieldsValue({name: ird.name});
        }
    }, [ird, form]);

    // Мутации для добавления и обновления
    const [addIrd] = useMutation(ADD_IRD_MUTATION, {
        refetchQueries: [{ query: IRDS_QUERY }],
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно добавлены!');
            form.resetFields();
        },
        onError: () => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных.');
        }
    });

    const [updateIrd] = useMutation(UPDATE_IRD_MUTATION, {
        refetchQueries: [{ query: IRDS_QUERY }],
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно обновлены!');
            setEditingIrd(null);
            onClose();
        },
        onError: () => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных.');
        }
    });

    // Обработчик отправки формы
    const handleSubmit = () => {
        if (editingIrd) {
            updateIrd({ variables: { id: editingIrd.id, ...form.getFieldsValue() } });
        } else {
            addIrd({ variables: form.getFieldsValue() });
        }
    };

    return (
        <StyledBlockRegular label={'Ирд'}>
            <StyledFormRegular form={form} layout="vertical">
                <StyledFormItem name="name" label="Наименование" rules={[{required: true}]}>
                    <Input/>
                </StyledFormItem>
                <div style={{textAlign: 'center'}}>
                    <StyledFormItem>
                        <StyledButtonGreen type="primary" onClick={handleSubmit}>
                            {editingIrd ? "Сохранить изменения" : "Добавить"}
                        </StyledButtonGreen>
                    </StyledFormItem>
                </div>
            </StyledFormRegular>
        </StyledBlockRegular>
);
};

export default IrdForm;
