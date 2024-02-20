import React, {useEffect, useState} from 'react';
import {Form, Input, Button, Select, notification, Row, Col, Modal, AutoComplete} from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import {ORGANIZATION_FORM_QUERY} from '../../graphql/queriesGroupData';
import {ORGANIZATION_QUERY} from '../../graphql/queries';
import {
    UPDATE_ORGANIZATION_MUTATION,
    ADD_ORGANIZATION_MUTATION,
} from '../../graphql/mutationsOrganization';
import {
    StyledBigFormBlock,
    StyledBigForm,
    StyledFormItem,
    StyledFormBlock,
    StyledForm,
    StyledButtonForm
} from '../style/FormStyles';
import {AddressSuggestions} from "react-dadata";
import 'react-dadata/dist/react-dadata.css';
import ContactForm from "./ContactForm";
import BikForm from "./BikForm";
import LoadingSpinner from "../component/LoadingSpinner";
import {SEARCH_CONTACTS_QUERY} from "../../graphql/queriesSearch";
const OrganizationForm = ({ organization, onClose }) => {

    // Переменные

    const phoneRegExp = /^\+?[0-9]{10,}$/;

    // Состояния
    const [editingOrganization, setEditingOrganization] = useState(null);
    const [form] = Form.useForm();
    const [api,contextHolder] = notification.useNotification();
    const [bikFormViewModalVisible, setBikFormViewModalVisible] = useState(false);
    const [contactFormViewModalVisible, setContactFormViewModalVisible] = useState(false);
    const [autoCompleteContacts, setAutoCompleteContacts] = useState({ id: '', name: '' });
    const handleAutoCompleteContacts = (value, option) => {
        setAutoCompleteContacts({ id: option.key, name: value });
    };
    const handleBikFormView = () => {setBikFormViewModalVisible(false);};
    const handleContactFormView = () => {setContactFormViewModalVisible(false);};

    const [address1, setAddress1] = useState();
    const [address2, setAddress2] = useState();
    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };

    // Получение данных для выпадающих списков
    const { loading, error, data } = useQuery(ORGANIZATION_FORM_QUERY);
    const { loadingContacts, errorContacts, dataContacts } = useQuery(SEARCH_CONTACTS_QUERY, {
        variables: {
            searchContacts: autoCompleteContacts.name,
        },
    });
    // Заполнение формы данными контакта при его редактировании
    useEffect(() => {
        if (organization) {
            setEditingOrganization(true);
            form.setFieldsValue({
                ...organization
            });

            form.setFieldsValue({
                director: organization.director ? organization.director.id : null,
                legal_form: organization.legal_form ? organization.legal_form.id : null,
                BIK_id: organization.BiK ? organization.BiK.id : null,
            });
            setAddress1(organization.address_mail);
            setAddress2(organization.address_legal);
        }
    }, [organization, form]);

    // Мутации для добавления и обновления
    const [addOrganization] = useMutation(ADD_ORGANIZATION_MUTATION, {
        refetchQueries: [{ query: ORGANIZATION_QUERY }],
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно добавлены!');
            form.resetFields();
        },
        onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных:' + error.message );
        }
    });

    const [updateOrganization] = useMutation(UPDATE_ORGANIZATION_MUTATION, {
        refetchQueries: [{ query: ORGANIZATION_QUERY }],
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно обновлены!');
            setEditingOrganization(null);
            onClose();
        },
        onError: () => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных.');
        }
    });

    // Обработчик отправки формы
    const handleSubmit = () => {
        const formValues = form.getFieldsValue();
        const { address_legal, address_mail, ...rest } = formValues; // разделяем address_legal и остальные значения
        const restrictedValue1 = address_legal ?  address_legal.unrestricted_value : address_legal; // получаем unrestricted_value из address_legal
        const restrictedValue2 = address_mail ? address_mail.unrestricted_value : address_mail;
        if (editingOrganization) {
            updateOrganization({ variables: { id: editingOrganization, idaddress_legal: restrictedValue1, address_mail: restrictedValue2 , ...rest} });
        } else {
            addOrganization({ variables: { address_legal: restrictedValue1, address_mail: restrictedValue2 , ...rest } });
        }
    };
    const addresChange1 = (suggestion) => {
        setAddress1(suggestion?.unrestricted_value);
    };
    const addresChange2 = (suggestion) => {
        setAddress2(suggestion?.unrestricted_value);
    };


    // Обработка загрузки и ошибок
    if (loading) return <LoadingSpinner/>;
    if (error) return `Ошибка! ${error.message}`;

    return (
        <StyledBigFormBlock>
            <StyledBigForm form={form} layout="vertical">
                {contextHolder}
                <Row gutter={8}>
                    <Col span={20}>
                        <StyledFormItem name="name" label="Наименование компании" rules={[{ required: true }]}>
                            <Input />
                        </StyledFormItem>
                    </Col>
                    <Col span={4}>
                        <StyledFormItem name="legal_form" label="Форма">
                            <Select>
                                {data && data.legalForms  && data.legalForms .map(data => (
                                    <Select.Option key={data.id} value={data.id}>{data.name}</Select.Option>
                                ))}
                            </Select>
                        </StyledFormItem>
                    </Col>
                </Row>
                <StyledFormItem name="full_name" label="Полное наименование компании" rules={[{ required: true }]}>
                    <Input />
                </StyledFormItem>
                <div>
                    <Row gutter={4} align={"bottom"}>
                        <Col flex="auto">
                            <StyledFormItem name="director" label="Руководитель">
                                <AutoComplete
                                    dropdownMatchSelectWidth={false}
                                    filterOption = {false}
                                    options={dataContacts && dataContacts.contactsTable && dataContacts.contactsTable.positions.map(position => ({
                                        key: position.id,
                                        value: position.last_name + position.first_name + position.patronymic,
                                        label: position.last_name + position.first_name + position.patronymic,
                                    }))}
                                    onChange={(value, option)=>handleAutoCompleteContacts(value, option)} // Передаем введенное значение
                                    placeholder="Начните ввод..."
                                />
                            </StyledFormItem>
                        </Col>
                        <Col>
                            <StyledButtonForm onClick={()=>setContactFormViewModalVisible(true)}>Создать</StyledButtonForm>
                        </Col>
                    </Row>
                </div>
                <Row gutter={8}>
                    <Col span={20}>

                        <StyledFormItem name="address_legal" label="Юридический адрес" minChars={3} delay={50}>
                            <AddressSuggestions token="5c988a1a82dc2cff7f406026fbc3e8d04f2a168e"
                                                value={address1}
                                                onChange={addresChange1} />
                        </StyledFormItem>
                        <StyledFormItem name="address_mail" label="Почтовый адрес" minChars={3} delay={50} >
                                <AddressSuggestions token="5c988a1a82dc2cff7f406026fbc3e8d04f2a168e"
                                                    value={address2}
                                                    onChange={addresChange2}/>
                        </StyledFormItem>
                    </Col>
                    <Col span={4}>
                        <StyledFormItem name="office_number_legal" label="Номер офиса" >
                            <Input  placeholder="№"/>
                        </StyledFormItem>
                        <StyledFormItem name="office_number_mail" label="Номер офиса" >
                            <Input  placeholder="№"/>
                        </StyledFormItem>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={12}>
                        <StyledFormItem name="phone_number" label="Телефон"  rules={[
                            {
                                pattern: /^[\d\s()-]+$/,
                                message: 'Пожалуйста, введите корректный номер телефона',
                            },
                        ]}
                        >
                            <Input
                                placeholder="Введите номер телефона"
                                addonBefore="+7"
                                maxLength={15}
                                minLength={11}
                                pattern="\d*"
                            />
                        </StyledFormItem>
                        <StyledFormItem name="fax_number" label="Факс">
                            <Input                                 placeholder="Введите номер факса" />
                        </StyledFormItem>
                        <StyledFormItem name="email" label="e-mail"  rules={[
                            {
                                type: "email",
                                message: 'Пожалуйста, введите корректный почтовый адресс',
                            },
                        ]}
                        >
                            <Input                                 placeholder="Введите почтовый адресс"/>
                        </StyledFormItem>
                        <StyledFormItem name="payment_account" label="Расчётынй счёт">
                            <Input placeholder="Введите номер расчётного счёта"/>
                        </StyledFormItem>
                        <div >
                            <Row gutter={4} align={"bottom"}>
                                <Col flex="auto">
                                    <StyledFormItem name="BIK_id" label="Бик" >
                                    <Select placeholder="fafda">
                                        {data && data.biks && data.biks.map(biks => (
                                            <Select.Option key={biks.id} value={biks.id}>{biks.name}</Select.Option>
                                        ))}
                                    </Select>
                                    </StyledFormItem>
                                </Col>
                                <Col>
                                    <StyledButtonForm onClick={()=>setBikFormViewModalVisible(true)}>Создать</StyledButtonForm>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col span={12} >
                        <StyledFormItem name="INN" label="ИНН" rules={[
                            {
                                pattern: /^[\d\s]+$/,
                                message: 'Пожалуйста, введите корректный номер ИНН',
                            },
                        ]}
                        >
                            <Input
                                placeholder="Введите номер ИНН"
                                maxLength={12}
                                minLength={10}
                                pattern="\d*"
                            />
                        </StyledFormItem>
                        <StyledFormItem name="OGRN" label="ОГРН" rules={[
                            {
                                pattern: /^[\d\s]+$/,
                                message: 'Пожалуйста, введите корректный номер ОГРН',
                            },
                        ]}
                        >
                            <Input
                                placeholder="Введите номер ОГРН"
                                maxLength={13}
                                minLength={13}
                                pattern="\d*"
                            />
                        </StyledFormItem>
                        <StyledFormItem name="OKPO" label="ОКПО" rules={[
                            {
                                pattern: /^[\d\s]+$/,
                                message: 'Пожалуйста, введите корректный номер ОКПО',
                            },
                        ]}
                        >
                            <Input
                                placeholder="Введите номер ОКПО"
                                maxLength={10}
                                minLength={8}
                                pattern="\d*"
                            />
                        </StyledFormItem>
                        <StyledFormItem name="KPP" label="КПП" rules={[
                            {
                                pattern: /^[\d\s]+$/,
                                message: 'Пожалуйста, введите корректный номер КПП',
                            },
                        ]}
                        >
                            <Input
                                placeholder="Введите номер КПП"
                                maxLength={9}
                                minLength={9}
                                pattern="\d*"
                            />
                        </StyledFormItem>
                    </Col>
                </Row>

                <StyledFormItem>
                    <Button type="primary" onClick={handleSubmit}>
                        {editingOrganization ? "Сохранить изменения" : "Добавить контакт"}
                    </Button>
                </StyledFormItem>
            </StyledBigForm>
            {/*
            Модальные окна редактирования
            */}
            {/* Бики */}
            <Modal
                visible={bikFormViewModalVisible}
                title="Бик"
                onCancel={() => setBikFormViewModalVisible(false)}
                footer={null}
                onClose={handleBikFormView}
            >
                <StyledFormBlock>
                    <StyledForm form={form} layout="vertical">
<BikForm/>

                    </StyledForm>
                </StyledFormBlock>
            </Modal>
            {/* контакты */}
            <Modal
                visible={contactFormViewModalVisible}
                title="Контакт"
                onCancel={() => setContactFormViewModalVisible(false)}
                footer={null}
                onClose={handleContactFormView}
            >
                <StyledFormBlock>
                    <StyledForm form={form} layout="vertical">
                        <ContactForm/>
                    </StyledForm>
                </StyledFormBlock>
            </Modal>
        </StyledBigFormBlock>

    );
};

export default OrganizationForm;
