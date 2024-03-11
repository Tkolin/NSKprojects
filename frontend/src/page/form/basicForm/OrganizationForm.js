import React, {useEffect, useState} from 'react';
import {Form, Input, Select, Space, notification, Row, Col, Modal} from 'antd';
import {useMutation, useQuery} from '@apollo/client';
import {
    UPDATE_ORGANIZATION_MUTATION, ADD_ORGANIZATION_MUTATION,
} from '../../../graphql/mutationsOrganization';
import {
    StyledFormItem, StyledFormBig
} from '../../style/FormStyles';

import {AddressSuggestions} from "react-dadata";
import 'react-dadata/dist/react-dadata.css';
import ContactForm from "./ContactForm";
import BikForm from "../simpleForm/BikForm";
import {StyledBlockBig} from "../../style/BlockStyles";
import { StyledButtonGreen} from "../../style/ButtonStyles";
import {PlusOutlined} from "@ant-design/icons";
import {BIKS_QUERY, CONTACTS_QUERY, LEGAL_FORM_QUERY, ORGANIZATIONS_QUERY} from "../../../graphql/queries";

const OrganizationForm = ({organization, onClose}) => {
    // Состояния
    const [editingOrganization, setEditingOrganization] = useState(null);
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();
    const [bikFormViewModalVisible, setBikFormViewModalVisible] = useState(false);
    const [contactFormViewModalVisible, setContactFormViewModalVisible] = useState(false);
    const [autoCompleteContacts, setAutoCompleteContacts] = useState('');
    const [autoCompleteBiks, setAutoCompleteBiks] = useState('');
    const [address1, setAddress1] = useState();
    const [address2, setAddress2] = useState();
    const addresChange1 = (suggestion) => {setAddress1(suggestion?.unrestricted_value);};
    const addresChange2 = (suggestion) => {setAddress2(suggestion?.unrestricted_value);};
    const handleAutoCompleteContacts = (value) => {setAutoCompleteContacts(value)};
    const handleAutoCompleteBiks = (value) => {setAutoCompleteBiks(value)};
    const handleBikFormView = () => {setBikFormViewModalVisible(false);};
    const handleContactFormView = () => {setContactFormViewModalVisible(false);};

    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message, placement,
        });};

    // Получение данных для выпадающих списков
    const {loading: loadingLegalForm, error: errorLegalForm, data: dataLegalForm} = useQuery(LEGAL_FORM_QUERY);
    const {loading: loadingBiks, error: errorBiks, data: dataBiks} = useQuery(BIKS_QUERY, {
        variables: {
            queryOptions: {search: autoCompleteBiks, limit: 10, page: 1}
        },});
    const {loading: loadingContacts, error: errorContacts, data: dataContacts} = useQuery(CONTACTS_QUERY, {
        variables: {
            queryOptions: { search: autoCompleteContacts, limit: 10, page: 1}
        },});

    // Заполнение формы данными контакта при его редактировании
    useEffect(() => {
        if (organization) {
            setEditingOrganization(organization);
            form.resetFields();

            form.setFieldsValue({
                ...organization,
                director: organization?.director?.id ??  null,
                legal_form: organization?.legal_form?.id ?? null,
                BIK_id: organization?.BiK?.id ?? null,
            });

            setAddress1(organization.address_mail);
            setAddress2(organization.address_legal);
        }
    }, [organization, form]);

    // Мутации для добавления и обновления
    const [addOrganization] = useMutation(ADD_ORGANIZATION_MUTATION, {
        refetchQueries: [{query: ORGANIZATIONS_QUERY}], onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно добавлены!');
            form.resetFields();
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных:' + error.message);
        }
    });

    const [updateOrganization] = useMutation(UPDATE_ORGANIZATION_MUTATION, {
        refetchQueries: [{query: ORGANIZATIONS_QUERY}], onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно обновлены!');
            setEditingOrganization(null);
            if(onClose) onClose();
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных:' + error.message);
        }
    });

    // Обработчик отправки формы
    const handleSubmit = () => {
        const formValues = form.getFieldsValue();
        const {address_legal, address_mail, director, BIK_id, legal_form, ...rest} = formValues;
        const restrictedValue1 =  address_legal?.unrestricted_value ?? address_legal;
        const restrictedValue2 =  address_mail?.unrestricted_value ?? address_mail;

        if (editingOrganization) {
            updateOrganization({
                variables: {
                    id: editingOrganization.id,
                    address_legal: restrictedValue1,
                    address_mail: restrictedValue2,
                    legal_form: legal_form,
                    director_id: director,
                    BIK_id: BIK_id,
                    ...rest
                }
            });
        } else {
            addOrganization({
                variables: {
                    address_legal: restrictedValue1,
                    address_mail: restrictedValue2,
                    legal_form: legal_form,
                    director_id: director,
                    BIK_id: BIK_id,
                    ...rest
                }
            });
        }
    };


    return (<StyledBlockBig label={'Организация'}>
            <StyledFormBig form={form} onFinish={handleSubmit}>
                <Space.Compact block>
                    <StyledFormItem name="name"
                                    label={"Наименование компании"}
                                    rules={[{required: true, message: "Укажите наименование компании"}]}
                                    style={{width: '100%',}}>
                        <Input placeholder={"Наименование"}/>
                    </StyledFormItem>
                    <StyledFormItem name="legal_form" rules={[{required: true, message: "Укажите тип организации"}]}>
                        <Select placeholder={"Форма"} style={{maxWidth: 100}} loading={loadingLegalForm}>
                            {dataLegalForm?.legalForms?.map(row => (
                                <Select.Option key={row.id} value={row.id}>{row.name}</Select.Option>))}
                        </Select>
                    </StyledFormItem>
                </Space.Compact>
                <StyledFormItem name="full_name" label="Полное наименование" rules={[{required: true, message: "Укажите полное наименование компании"}]}>
                    <Input/>
                </StyledFormItem>
                <Space.Compact block>
                    <StyledFormItem name="director"
                                    label="Руководитель"
                                    style={{width: '100%',}}
                                    >
                        <Select
                            popupMatchSelectWidth={false}
                            allowClear
                            showSearch
                            filterOption={false}
                            onSearch={(value) => handleAutoCompleteContacts(value)}
                            loading={loadingContacts}
                            placeholder="Начните ввод...">
                            {dataContacts?.contacts?.items?.map(row => (
                                <Select.Option key={row.id}
                                               value={row.id}>{row.last_name} {row.first_name} {row.patronymic}</Select.Option>))}
                        </Select>


                    </StyledFormItem>
                    <StyledButtonGreen type={"dashed"} icon={<PlusOutlined/>}
                                       onClick={() => setContactFormViewModalVisible(true)}/>

                </Space.Compact>
                <Space.Compact block>
                    <StyledFormItem name="address_legal" label="Юридический адрес" minchars={3}
                                    delay={50}
                                    style={{
                                        width: '100%',
                                    }}>
                        <AddressSuggestions token="5c988a1a82dc2cff7f406026fbc3e8d04f2a168e"
                                            defaultQuery={address1}
                                            onChange={addresChange1}/>
                    </StyledFormItem>
                    <StyledFormItem name="office_number_legal" style={{width: 100,}}>
                        <Input placeholder="Офис"/>
                    </StyledFormItem>
                </Space.Compact>
                <Space.Compact block>
                    <StyledFormItem name="address_mail" label="Почтовый адрес" minchars={3}
                                    delay={50}
                                    style={{
                                        width: '100%',
                                    }}>
                        <AddressSuggestions token="5c988a1a82dc2cff7f406026fbc3e8d04f2a168e"
                                            defaultQuery={address2}
                                            onChange={addresChange2}
                                            style={{textFontSize: 10}}/>
                    </StyledFormItem>
                    <StyledFormItem
                        name="office_number_mail"
                        style={{
                            width: 100,
                        }}>
                        <Input placeholder="Офис"/>
                    </StyledFormItem>
                </Space.Compact>
                <Row gutter={8}>
                    <Col span={12}>
                        <StyledFormItem name="phone_number" label="Телефон" rules={[{
                            pattern: /^[\d\s()-]+$/, message: 'Пожалуйста, введите корректный номер телефона в формате 9003001234',},]}>
                            <Input
                                placeholder="Введите номер телефона"
                                addonBefore="+7"
                                maxLength={11}
                                minLength={10}
                                pattern="\d*"
                            />
                        </StyledFormItem>
                        <StyledFormItem name="fax_number" label="Факс">
                            <Input placeholder="Введите номер факса"/>
                        </StyledFormItem>
                        <StyledFormItem name="email" label="e-mail" rules={[{
                            type: "email", message: 'Пожалуйста, введите корректный почтовый адресс',},]}>
                            <Input placeholder="Введите почтовый адресс"/>
                        </StyledFormItem>
                        <StyledFormItem name="payment_account" label="Расчётынй счёт">
                            <Input placeholder="Введите номер расчётного счёта"/>
                        </StyledFormItem>
                        <Space.Compact block>
                        <StyledFormItem name="BIK_id" label="Бик" style={{
                            width: '100%',
                        }}>

                                <Select popupMatchSelectWidth={false}
                                        allowClear
                                        showSearch
                                        filterOption = {false}
                                        onSearch={(value) => handleAutoCompleteBiks(value)}
                                        loading={loadingBiks}
                                        placeholder="Бик">
                                    {dataBiks && dataBiks.biks && dataBiks.biks.items && dataBiks.biks.items.map(row => (
                                        <Select.Option key={row.id}
                                                       value={row.id}>{row.bik} {row.name}</Select.Option>))}
                                </Select>


                        </StyledFormItem>
                            <StyledButtonGreen icon={<PlusOutlined/>}
                                               onClick={() => setBikFormViewModalVisible(true)}/>
                        </Space.Compact>

                    </Col>
                    <Col span={12}>
                        <StyledFormItem name="INN" label="ИНН" rules={[{
                            pattern: /^[\d\s]+$/, message: 'Пожалуйста, введите корректный номер ИНН',
                        },]}>
                            <Input
                                placeholder="Введите номер ИНН"
                                maxLength={12}
                                minLength={10}
                                pattern="\d*"
                            />
                        </StyledFormItem>
                        <StyledFormItem name="OGRN" label="ОГРН" rules={[{
                            pattern: /^[\d\s]+$/, message: 'Пожалуйста, введите корректный номер ОГРН',
                        },]}>
                            <Input
                                placeholder="Введите номер ОГРН"
                                maxLength={13}
                                minLength={13}
                                pattern="\d*"
                            />
                        </StyledFormItem>
                        <StyledFormItem name="OKPO" label="ОКПО" rules={[{
                            pattern: /^[\d\s]+$/, message: 'Пожалуйста, введите корректный номер ОКПО',
                        },]}>
                            <Input
                                placeholder="Введите номер ОКПО"
                                maxLength={10}
                                minLength={8}
                                pattern="\d*"
                            />
                        </StyledFormItem>
                        <StyledFormItem name="KPP" label="КПП" rules={[{
                            pattern: /^[\d\s]+$/, message: 'Пожалуйста, введите корректный номер КПП',
                        },]}>
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
                    <div style={{textAlign: 'center'}}>
                        <StyledButtonGreen type="dashed" htmlType={"submit"}>
                            {editingOrganization ? "Сохранить изменения" : "Добавить контакт"}
                        </StyledButtonGreen>
                    </div>
                </StyledFormItem>
            </StyledFormBig>
            {/*
            Модальные окна редактирования
            */}
            {/* Бики */}
            <Modal
                open={bikFormViewModalVisible}
                title="Бик"
                onCancel={() => setBikFormViewModalVisible(false)}
                footer={null}
                onClose={handleBikFormView}>
                <BikForm/>
            </Modal>
            {/* контакты */}
            <Modal
                open={contactFormViewModalVisible}
                title="Контакт"
                onCancel={() => setContactFormViewModalVisible(false)}
                footer={null}
                onClose={handleContactFormView}>
                <ContactForm/>
            </Modal>
        </StyledBlockBig>

    );
};

export default OrganizationForm;
