import React, {useEffect, useState} from 'react';
import {Form, Input, Button, Select, notification} from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import {
    ADD_BIK_MUTATION,
    BIK_QUERY,
    UPDATE_BIK_MUTATION
} from '../../graphql/queries';
import {StyledFormBlock, StyledForm, StyledFormItem } from '../style/FormStyles';


const IrdForm = ({ bik, onClose }) => {

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
            form.setFieldsValue();
        }
    }, [bik, form]);

    // Мутации для добавления и обновления
    const [addBik] = useMutation(ADD_BIK_MUTATION, {
        refetchQueries: [{ query: BIK_QUERY }],
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно добавлены!');
            form.resetFields();
        },
        onError: () => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных.');
        }
    });

    const [updateBik] = useMutation(UPDATE_BIK_MUTATION, {
        refetchQueries: [{ query: BIK_QUERY }],
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
        <StyledFormBlock>
            <StyledForm form={form} layout="vertical">
                {contextHolder}
                <StyledFormItem name="BIK" label="Бик" rules={[{ required: true }]}>
                    <Input />
                </StyledFormItem>
                <StyledFormItem name="name" label="Наименование"  rules={[{ required: true }]}>
                    <Input />
                </StyledFormItem>
                <StyledFormItem name="correspondent_account" label="Корреспондентский счёт" >
                    <Input />
                </StyledFormItem>
                <StyledFormItem>
                    <Button type="primary" onClick={handleSubmit}>
                        {editingBik ? "Сохранить изменения" : "Добавить бик"}
                    </Button>
                </StyledFormItem>
            </StyledForm>
        </StyledFormBlock>
    );
};

export default IrdForm;
