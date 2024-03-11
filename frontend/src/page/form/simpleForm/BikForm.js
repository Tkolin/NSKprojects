import React, {useEffect, useState} from 'react';
import {Form, Input, notification} from 'antd';
import { useMutation } from '@apollo/client';
import {
    ADD_BIK_MUTATION,
    UPDATE_BIK_MUTATION
} from '../../../graphql/mutationsBik';
import {StyledFormItem, StyledFormRegular} from "../../style/FormStyles";
import {StyledBlockRegular} from "../../style/BlockStyles";
import {StyledButtonGreen} from "../../style/ButtonStyles";
import {BIKS_QUERY} from "../../../graphql/queries";

const BikForm = ({ bik, onClose }) => {

    // Состояния
    const [editingBik, setEditingBik] = useState(null);
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
        if (bik) {
            setEditingBik(bik);
            form.setFieldsValue(...bik);
        }
    }, [bik, form]);

    // Мутации для добавления и обновления
    const [addBik] = useMutation(ADD_BIK_MUTATION, {
        refetchQueries: [{ query: BIKS_QUERY }],
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно добавлены!');
            form.resetFields();
        },
        onError: () => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных.');
        }
    });

    const [updateBik] = useMutation(UPDATE_BIK_MUTATION, {
        refetchQueries: [{ query: BIKS_QUERY }],
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно обновлены!');
            setEditingBik(null);
            onClose();
        },
        onError: () => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных.');
        }
    });

    // Обработчик отправки формы
    const handleSubmit = () => {
        if (editingBik) {
            updateBik({ variables: { id: editingBik.id, ...form.getFieldsValue() } });
        } else {
            addBik({ variables: form.getFieldsValue() });
        }
    };

    return (
        <StyledBlockRegular label={'Бик'}>
            <StyledFormRegular form={form}>
                <StyledFormItem name="BIK" label="Бик" rules={[{required: true}]}>
                    <Input/>
                </StyledFormItem>
                <StyledFormItem name="name" label="Наименование" rules={[{required: true}]}>
                    <Input/>
                </StyledFormItem>
                <StyledFormItem name="correspondent_account" label="Корреспондентский счёт">
                    <Input/>
                </StyledFormItem>
                <div style={{textAlign: 'center'}}>
                    <StyledFormItem>
                        <StyledButtonGreen   style={{    marginBottom: 0}} type="primary" onClick={handleSubmit}>
                            {editingBik ? "Сохранить изменения" : "Добавить бик"}
                        </StyledButtonGreen>
                    </StyledFormItem>
                </div>
            </StyledFormRegular>
        </StyledBlockRegular>
);
};

export default BikForm;
