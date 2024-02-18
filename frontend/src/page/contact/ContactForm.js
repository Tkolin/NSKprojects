import React, {useEffect, useState} from 'react';
import {Form, Input, Button, Select, notification, Spin, AutoComplete} from 'antd';
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
import LoadingSpinner from "../component/LoadingSpinner";
import {values} from "mobx";
import {log} from "util";

const ContactForm = ({ contact, onClose }) => {

    // Состояния
    const [editingContact, setEditingContact] = useState(null);
    const [form] = Form.useForm();
    const [ api,contextHolder] = notification.useNotification();
    const [autoCompleteOrganization, setAutoCompleteOrganization] = useState({ id: '', name: '' });
    const [autoCompletePositions, setAutoCompletePositions] = useState({ id: '', name: '' });
    const handleAutoCompleteOrganization = (value, option) => {
        setAutoCompleteOrganization({ id: option.key, name: value });
    };
    const handleAutoCompletePositions = (value, option) => {
        setAutoCompletePositions({ id: option.key, name: value });
    };
    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };

    // Получение данных для выпадающих списков
    const { loading, error, data } = useQuery(CONTACT_FORM_QUERY, {
        variables: {
            searchOrganizations: autoCompleteOrganization.name,
            searchPositions: autoCompletePositions.name,
        },
    });

    // Заполнение формы данными контакта при его редактировании
    useEffect(() => {
        if (contact) {
            setEditingContact(contact);
            form.setFieldsValue({
                ...contact,
                birth_day:  contact.birth_day ? moment(contact.birth_day): null
            });

            contact.position ? setAutoCompletePositions({id: contact.position.id, name: contact.position.name}) : setAutoCompletePositions({id: "", name: ""});
            contact.organization ? setAutoCompleteOrganization({id: contact.organization.id, name: contact.organization.name}) : setAutoCompleteOrganization({id: "", name: ""});
            form.setFieldsValue({
                position_id:   contact.position ? contact.position.name : null,
                organization_id: contact.organization ? contact.organization.name : null
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
        onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных:' + error.message);
        }
    });

    const [updateContact] = useMutation(UPDATE_CONTACT_MUTATION, {
        refetchQueries: [{ query: CONTACTS_QUERY }],
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно обновлены!');
            setEditingContact(null);
            onClose();
        },
        onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных:' + error.message);
        }
    });

    // Обработчик отправки формы
    const handleSubmit = () => {
        if (editingContact) {
            console.log(editingContact.id);
            updateContact({ variables: { id: editingContact.id , ...form.getFieldsValue(), organization_id: autoCompleteOrganization.id , position_id: autoCompletePositions.id} });
        } else {
            addContact({ variables: {...form.getFieldsValue(), organization_id: autoCompleteOrganization.id , position_id: autoCompletePositions.id} });
        }
    };


    if (error) return `Ошибка! ${error.message}`;
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
                    <AutoComplete
                        dropdownMatchSelectWidth ={false}
                        filterOption = {false}
                        options={data && data.positionsTable && data.positionsTable.positions.map(position => ({
                            key: position.id,
                            value: position.name,
                            label: position.name,
                        }))}
                        onChange={(value, option)=>handleAutoCompletePositions(value, option)} // Передаем введенное значение
                        placeholder="Начните ввод..."
                    />
                </StyledFormItem>
                <StyledFormItem name="organization_id" label="Организация" rules={[{ required: true }]}>
                    <AutoComplete
                        dropdownMatchSelectWidth ={false}
                        filterOption = {false}
                        options={data && data.organizationsTable && data.organizationsTable.organizations.map(organization => ({
                            key: organization.id,
                            value: organization.name,
                            label: organization.name,
                        }))}
                        onChange={(value, option)=>handleAutoCompleteOrganization(value, option)} // Передаем введенное значение
                        placeholder="Начните ввод..."
                    />
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
