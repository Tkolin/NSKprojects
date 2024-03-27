import React, {useEffect, useState} from 'react';
import {Divider, Form, Input, Modal, notification, Select} from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import {
    CONTACTS_QUERY,
    ORGANIZATIONS_QUERY,
    POSITIONS_QUERY
} from '../../../graphql/queries';
import {
    ADD_CONTACT_MUTATION,
    UPDATE_CONTACT_MUTATION
} from '../../../graphql/mutationsContact';
import {StyledFormItem, StyledFormRegular} from '../../style/FormStyles';
import {DatePicker} from "antd/lib";
import moment from 'moment';
import {StyledBlockRegular} from "../../style/BlockStyles";
import {StyledButtonGreen} from "../../style/ButtonStyles";
import OrganizationForm from "./OrganizationForm";
import {StyledFormItemSelectAndCreateWitchEdit} from "../../style/SelectStyles";

const ContactForm = ({ contact, onClose }) => {

    // Состояния
    const [editingContact, setEditingContact] = useState(null);
    const [form] = Form.useForm();
    const [ api,contextHolder] = notification.useNotification();
    const [autoCompleteOrganization, setAutoCompleteOrganization] = useState('');
    const [autoCompletePositions, setAutoCompletePositions] = useState('');
    const [addOrganizationModalVisible,setAddOrganizationModalVisible]= useState(false);
    const [editOrganizationModalVisible,setEditOrganizationModalVisible]= useState(false);
    const [selectedOrganizationData,setSelectedOrganizationData]= useState(null);
    const handleSelectedOrganization = (value) => {
        setAutoCompleteOrganization(null);
        setSelectedOrganizationData(dataOrganizations?.organizations?.items?.find(org => org.id === value));
        console.log(value);
    };
    const handleAutoCompleteOrganization = (value) => {
        setAutoCompleteOrganization(value);
    };
    const handleAutoCompletePositions = (value) => {
        setAutoCompletePositions(value);
    };
    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };

    // Получение данных для выпадающих списков
    const [dataPositions, setDataPositions] = useState();
    const [dataOrganizations, setDataOrganizations] = useState();
    const { loading: loadingPositions, error: errorPositions } = useQuery(POSITIONS_QUERY, {
        variables: {
            queryOptions: {  search: autoCompletePositions, limit: 10, page: 1}
        },
        onCompleted: (data) => setDataPositions(data)
    });

    const { loading: loadingOrganizations, error: errorOrganizations, refetch: orgRefetch } = useQuery(ORGANIZATIONS_QUERY, {
        variables: {
            queryOptions: { search: autoCompleteOrganization, limit: 10, page: 1}
        },
        onCompleted: (data) => setDataOrganizations(data)
    });
    // Мутации для добавления и обновления
    const [addContact] = useMutation(ADD_CONTACT_MUTATION, {
        refetchQueries: [{ query: CONTACTS_QUERY }],
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно добавлены!');
            form.resetFields();
            if(onClose())
                onClose()
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
            if(onClose())
                onClose()
        },
        onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных:' + error.message);
        }
    });
    useEffect(() =>{
        form.resetFields();
    }, []);
    // Заполнение формы данными контакта при его редактировании
    useEffect(() => {
        if (contact) {
            setEditingContact(contact);
            form.setFieldsValue({
                ...contact,
                birth_day:  contact.birth_day ? moment(contact.birth_day): null
            });

            contact.position ? setAutoCompletePositions(contact.position.name) : setAutoCompletePositions('');
            contact.organization ? setAutoCompleteOrganization(contact.organization.name) : setAutoCompleteOrganization('');
            form.setFieldsValue({
                position_id:   contact.position ? contact.position.id: null,
                organization_id: contact.organization ? contact.organization.id : null
            });

        }
    }, [contact, form]);
    const handleCloseModalFormView = () => {
        orgRefetch();
        setAddOrganizationModalVisible(false);
        setEditOrganizationModalVisible(false);
    };
    // Обработчик отправки формы
    const handleSubmit = () => {
        if (editingContact) {
            updateContact({ variables: { id: editingContact.id , ...form.getFieldsValue()} });
        } else {
            addContact({ variables: {...form.getFieldsValue()} });
        }
    };

    if (errorOrganizations) return `Ошибка! ${errorOrganizations.message}`;
    return (
        <StyledBlockRegular label={'Контакт'}>
            <StyledFormRegular form={form}   onFinish={handleSubmit}
                               labelCol={{ span: 8 }}
                               labelAlign="left"
                               wrapperCol={{ span: 16 }}>
                <Divider orientation={"left"}>ФИО:</Divider>
                <StyledFormItem   name="last_name" label="Фамилия"  rules={[{ required: true, message: 'Пожалуйста, заполните фамилию' }]}>
                    <Input />
                </StyledFormItem>
                <StyledFormItem  name="first_name" label="Имя" rules={[{ required: true, message: 'Пожалуйста, заполните имя' }]}>
                    <Input />
                </StyledFormItem>
                <StyledFormItem     name="patronymic" label="Отчество" >
                    <Input />
                </StyledFormItem>


                <Divider orientation={"left"}>Персональные данные:</Divider>

                <StyledFormItem name="work_phone" label="Рабочий тел."  rules={[
                    {
                        pattern: /^\+[0-9\s()-]+$/,
                        message: 'Пожалуйста, введите в формате +79003001234',
                    },
                ]}
                >
                    <Input
                        placeholder="+790031001234"
                        maxLength={16}
                        minLength={10}
                    />

                </StyledFormItem>
                <StyledFormItem name="mobile_phone" label="Личный тел."  rules={[
                    {
                        pattern: /^\+[0-9\s()-]+$/,
                        message: 'Пожалуйста, введите в формате +79003001234',
                    },
                ]}
                >
                    <Input
                        placeholder="+790031001234"
                        maxLength={16}
                        minLength={10}/>
                </StyledFormItem>
                <StyledFormItem name="email" label="Личный e-mail" rules={[{ type: 'email', message: 'Пожалуйста, введите корректный почтовый адресс', }]} >
                    <Input        placeholder="Введите e-mail"/>
                </StyledFormItem>
                <StyledFormItem name="work_email" label="Рабочий e-mail" rules={[{  type: 'email', message: 'Пожалуйста, введите корректный почтовый адресс', }]}>
                    <Input        placeholder="Введите e-mail"/>
                </StyledFormItem>
                <StyledFormItem name="birth_day" label="Дата рождения">
                    <DatePicker placeholder="Выберите дату" />
                </StyledFormItem>
                <Divider orientation={"left"}>Данные организации:</Divider>
                <StyledFormItemSelectAndCreateWitchEdit
                    formName={"organization_id"}
                    onSearch={handleAutoCompleteOrganization}
                    onSelect={handleSelectedOrganization}
                    placeholder={"Выберите организацию..."}
                    loading={loadingOrganizations}
                    items={dataOrganizations?.organizations?.items}
                    firstBtnOnClick={setAddOrganizationModalVisible}
                    secondBtnOnClick={setEditOrganizationModalVisible}
                    secondDisable={!selectedOrganizationData}
                    formatOptionText={(row) => `${row.name}`}
                    labelCol={{span: 0}}
                    wrapperCol={{span:24 }}
                />
             <StyledFormItem name="position_id" labelCol={{ span: 6 }} wrapperCol={{span: 18}}  label="Должность" >
                    <Select
                        popupMatchSelectWidth={false}
                        allowClear
                        showSearch
                        filterOption = {false}
                        loading={loadingPositions}
                        onSearch={(value) => handleAutoCompletePositions(value)}
                        placeholder="Начните ввод...">
                        {dataPositions?.positions?.items?.map(row => (
                            <Select.Option key={row.id}
                                           value={row.id}>{row.name}</Select.Option>))}

                    </Select>
                </StyledFormItem>

                <StyledFormItem labelCol={{ span: 24 }} wrapperCol={{span: 24}}>
                    <div style={{textAlign: 'center'}}>
                        <StyledButtonGreen   style={{    marginBottom: 0}} type="primary" htmlType={"submit"}>
                            {editingContact ? "Сохранить изменения" : "Добавить контакт"}
                        </StyledButtonGreen>
                    </div>
                </StyledFormItem>
            </StyledFormRegular>
            <Modal
                key={selectedOrganizationData?.id}
                open={addOrganizationModalVisible}
                onCancel={() => setAddOrganizationModalVisible(false)}
                footer={null}
                onClose={handleCloseModalFormView}
            >
                <OrganizationForm organization={null} onClose={handleCloseModalFormView}/>
            </Modal>
            <Modal
                key={selectedOrganizationData?.id}
                open={editOrganizationModalVisible}
                onCancel={() => setEditOrganizationModalVisible(false)}
                footer={null}
                onClose={handleCloseModalFormView}
            >
                <OrganizationForm organization={selectedOrganizationData} onClose={handleCloseModalFormView}/>
            </Modal>
        </StyledBlockRegular>
    );
};

export default ContactForm;
