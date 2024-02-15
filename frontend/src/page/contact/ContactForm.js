import React, {useEffect, useState} from 'react';
import {Form, Input, Button, Select, notification} from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import {CONTACTS_QUERY} from '../../graphql/queries';
import { CONTACT_FORM_QUERY}  from '../../graphql/queriesGroupData';
import {
    ADD_CONTACT_MUTATION,
    UPDATE_CONTACT_MUTATION
} from '../../graphql/mutationsContact';
import {StyledFormBlock, StyledForm, StyledFormItem } from '../style/FormStyles';
import {DatePicker} from "antd/lib"; // Импорт стилей
import moment from 'moment';

const ContactForm = ({ contact, onClose }) => {

    // Состояния
    const [editingContact, setEditingContact] = useState(null);
    const [form] = Form.useForm();
    const [ api,contextHolder] = notification.useNotification();

    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };

    // Получение данных для выпадающих списков
    const { loading, error, data } = useQuery(CONTACT_FORM_QUERY);

    // Заполнение формы данными контакта при его редактировании
    useEffect(() => {
        if (contact) {
            setEditingContact(true);
            form.setFieldsValue({
                ...contact,
                birth_day:  contact.birth_day ? moment(contact.birth_day): null
            });

            form.setFieldsValue({
                position_id: contact.position ? contact.position.id : null,
                organization_id: contact.organization ? contact.organization.id : null,
            });
        }
    }, [contact, form]);

    // Мутации для добавления и обновления
    const [addContact] = useMutation(ADD_CONTACT_MUTATION, {
        refetchQueries: [{ query: CONTACTS_QUERY }],
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно добавлены!');
            form.resetFields();
        },
        onError: () => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных.');
        }
    });

    const [updateContact] = useMutation(UPDATE_CONTACT_MUTATION, {
        refetchQueries: [{ query: CONTACTS_QUERY }],
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно обновлены!');
            setEditingContact(null);
            onClose();
        },
        onError: () => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных.');
        }
    });

    // Обработчик отправки формы
    const handleSubmit = () => {
        if (editingContact) {
            updateContact({ variables: { id: editingContact.id, ...form.getFieldsValue() } });
        } else {
            addContact({ variables: form.getFieldsValue() });
        }
    };

    // Обработка загрузки и ошибок
    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    return (
        <StyledFormBlock>
            <StyledForm form={form} layout="vertical">
                {contextHolder}
                <StyledFormItem name="first_name" label="Имя" rules={[{ required: true }]}>
                    <Input />
                </StyledFormItem>
                <StyledFormItem name="last_name" label="Фамилия"  rules={[{ required: true }]}>
                    <Input />
                </StyledFormItem>
                <StyledFormItem name="patronymic" label="Отчество" >
                    <Input />
                </StyledFormItem>
                <StyledFormItem name="birth_day" label="Дата рождения" rules={[{ required: true }]}>
                    <DatePicker />
                </StyledFormItem>
                <StyledFormItem name="work_phone" label="Рабочий номер телефона" >
                    <Input />
                </StyledFormItem>
                <StyledFormItem name="mobile_phone" label="Мобильный номер телефона" >
                    <Input />
                </StyledFormItem>
                <StyledFormItem name="email" label="e-mail" rules={[{ type: 'email' }]} >
                    <Input />
                </StyledFormItem>
                <StyledFormItem name="work_email" label="Рабочий e-mail" rules={[{  type: 'email' }]}>
                    <Input />
                </StyledFormItem>
                <StyledFormItem name="position_id" label="Должность" >
                    <Select>
                        {data && data.positionsNames && data.positionsNames.map(position => (
                            <Select.Option key={position.id} value={position.id}>{position.name}</Select.Option>
                        ))}
                    </Select>
                </StyledFormItem>
                <StyledFormItem name="organization_id" label="Организация" rules={[{ required: true }]}>
                    <Select>
                        {data && data.organizations && data.organizations.map(organization => (
                            <Select.Option key={organization.id} value={organization.id}>{organization.name}</Select.Option>
                        ))}
                    </Select>
                </StyledFormItem>
                <StyledFormItem>
                    <Button type="primary" onClick={handleSubmit}>
                        {editingContact ? "Сохранить изменения" : "Добавить контакт"}
                    </Button>
                </StyledFormItem>
            </StyledForm>
        </StyledFormBlock>
    );
};

export default ContactForm;
