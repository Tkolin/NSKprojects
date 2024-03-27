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
import {StyledAddressSuggestionsInput} from "../../style/InputStyles";
import {StyledFormItemSelectAndCreate, StyledFormItemSelectAndCreateWitchEdit} from "../../style/SelectStyles";

const OrganizationForm = ({organization, onClose}) => {
    // Состояния
    const TokenDADATA = process.env.REACT_APP_TOKEN_DADATAADDRESS;

    const [editingOrganization, setEditingOrganization] = useState(null);
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();
    const [bikFormViewModalVisible, setBikFormViewModalVisible] = useState(false);
    const [editContactModalVisible, setEditContactModalVisible] = useState(false);
    const [addContactModalVisible, setAddContactModalVisible] = useState(false);
    const [selectedContactData, setSelectedContactData] = useState();
    const [autoCompleteContacts, setAutoCompleteContacts] = useState('');
    const [autoCompleteBiks, setAutoCompleteBiks] = useState('');
    const [address1, setAddress1] = useState();
    const [address2, setAddress2] = useState();
    const addresChange1 = (suggestion) => {setAddress1(suggestion?.unrestricted_value);};
    const addresChange2 = (suggestion) => {setAddress2(suggestion?.unrestricted_value);};
    const handleAutoCompleteContacts = (value) => {setAutoCompleteContacts(value)};
    const handleAutoCompleteBiks = (value) => {setAutoCompleteBiks(value)};
    const handleBikFormView = () => {setBikFormViewModalVisible(false);};
    const handleCloseModalFormView = () => {
        setAddContactModalVisible(false);
        setEditContactModalVisible(false);
    };
    const handleSelectedContact = (value, option) => {
        setSelectedContactData(dataContacts?.contacts?.items?.find(org => org.id === value))
    }
    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message, placement,
        });};

    // Получение данных для выпадающих списков
    const {loading: loadingLegalForm, error: errorLegalForm, data: dataLegalForm} = useQuery(LEGAL_FORM_QUERY);
    const {loading: loadingBiks, error: errorBiks, data: dataBiks} = useQuery(BIKS_QUERY,{
        variables: {
            queryOptions: {search: autoCompleteBiks, limit: 10, page: 1}
        },});
    const {loading: loadingContacts, error: errorContacts, data: dataContacts} = useQuery(CONTACTS_QUERY, {
        variables: {
            queryOptions: { search: autoCompleteContacts, limit: 10, page: 1}
        },});

    // Заполнение формы данными контакта при его редактировании
    useEffect(() =>{
        form.resetFields();
        setAddress1("");
        setAddress2("");
    }, []);

    useEffect(() => {
        console.log(organization)
        if (organization ) {

            setAutoCompleteBiks(organization?.bik?.id);
            setEditingOrganization(organization);
            form.resetFields();
            form.setFieldsValue({
                ...organization,
                director: organization?.director?.id ??  null,
                legal_form: organization?.legal_form?.id ?? null,
                BIK_id: organization?.bik?.id ?? null,
            });
            setAddress1(organization?.address_mail);
            setAddress2(organization?.address_legal);
        }
    }, [organization, form]);

    // Мутации для добавления и обновления
    const [addOrganization] = useMutation(ADD_ORGANIZATION_MUTATION, {
        refetchQueries: [{query: ORGANIZATIONS_QUERY}], onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно добавлены!');
            form.resetFields();
            if(onClose())
                onClose()
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных:' + error.message);
        }
    });

    const [updateOrganization] = useMutation(UPDATE_ORGANIZATION_MUTATION, {
        refetchQueries: [{query: ORGANIZATIONS_QUERY}], onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно обновлены!');
            setEditingOrganization(null);
            if(onClose())
                onClose()
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных:' + error.message);
        }
    });

    // Обработчик отправки формы
    const handleSubmit = () => {
        const formValues = form.getFieldsValue();
        const {address_legal, address_mail, director, BIK_id, legal_form, ...rest} = formValues;
        const restrictedValue1 =  address_legal?.unrestricted_value ?? address1;
        const restrictedValue2 =  address_mail?.unrestricted_value ?? address2;

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
                <Space.Compact style={{width: "100%", alignItems: 'flex-end'}}>
                    <StyledFormItem name="name"
                                    label={"Наименование компании"}
                                    rules={[{required: true, message: "Укажите наименование компании"}]}
                                    style={{width: "90%" }}>
                        <Input                          style={{width: "100%)"}}
                                                         placeholder={"Наименование"}/>
                    </StyledFormItem>
                    <StyledFormItem  style={{width: "10%" }} name="legal_form" rules={[{required: true, message: "Укажите тип организации"}]}>
                        <Select placeholder={"Форма"} style={{width: "100%)"}} loading={loadingLegalForm}>
                            {dataLegalForm?.legalForms?.map(row => (
                                <Select.Option key={row.id} value={row.id}>{row.name}</Select.Option>))}
                        </Select>
                    </StyledFormItem>
                </Space.Compact>
                <StyledFormItem name="full_name" label="Полное наименование" rules={[{required: true, message: "Укажите полное наименование компании"}]}>
                    <Input/>
                </StyledFormItem>
                <StyledFormItemSelectAndCreateWitchEdit
                                               formName={"director"}
                                               formLabel={"Руководитель"}
                                               onSearch={handleAutoCompleteContacts}
                                               placeholder={"Начните ввод..."}
                                               loading={loadingContacts}
                                               items={dataContacts?.contacts?.items}
                                               onSelect={handleSelectedContact}
                                               secondDisable={!selectedContactData}
                                               firstBtnOnClick={setAddContactModalVisible}
                                               secondBtnOnClick={setEditContactModalVisible}
                                               formatOptionText={(row) => `${row.first_name} ${row.patronymic} ${row.last_name}`}
                />

                <Space.Compact style={{width: "100%", alignItems: 'flex-end'}}>
                    <StyledFormItem name="address_legal" label="Юридический адрес" minchars={3}
                                    delay={50}
                                    style={{width: '90%'}}>
                        <AddressSuggestions token={TokenDADATA}
                                            defaultQuery={address1}
                                            inputProps={{
                                                placeholder: 'Введите адрес',
                                                style: StyledAddressSuggestionsInput,
                                            }}
                                            onChange={addresChange1}
                                            style={{width: '100%'}}/>
                    </StyledFormItem>
                    <StyledFormItem name="office_number_legal" style={{width: "10%"}}>
                        <Input placeholder="Офис" style={{width: '100%'}}/>
                    </StyledFormItem>
                </Space.Compact>
                <Space.Compact style={{width: "100%", alignItems: 'flex-end'}}>
                    <StyledFormItem name="address_mail" label="Почтовый адрес" minchars={3}
                                    delay={50}
                                    style={{width: '90%'}}>
                        <AddressSuggestions token={TokenDADATA}
                                            defaultQuery={address2}
                                            inputProps={{
                                                placeholder: 'Введите адрес',
                                                style: StyledAddressSuggestionsInput,
                                            }}
                                            onChange={addresChange2}
                                            style={{width: '100%'}}/>
                    </StyledFormItem>
                    <StyledFormItem
                        name="office_number_mail"
                        style={{width: "10%"}}>
                        <Input placeholder="Офис" style={{width: '100%'}}/>
                    </StyledFormItem>
                </Space.Compact>
                <Row gutter={8}>
                    <Col span={12}>
                        <StyledFormItem name="phone_number" label="Телефон" rules={[{
                            pattern: /^\+[0-9\s()-]+$/,
                            message: 'Пожалуйста, введите в формате +79003001234',},]}>
                            <Input
                                placeholder="+790031001234"
                                maxLength={11}
                                minLength={10}
                            />
                        </StyledFormItem>
                        <StyledFormItem name="fax_number" label="Факс">
                            <Input placeholder="Введите номер факса"/>
                        </StyledFormItem>
                        <StyledFormItem name="email" label="e-mail" rules={[{
                            type: "email", message: 'Пожалуйста, введите корректный почтовый адрес',},]}>
                            <Input placeholder="Введите почтовый адрес"/>
                        </StyledFormItem>
                        <StyledFormItem name="payment_account" label="Расчётынй счёт">
                            <Input placeholder="Введите номер расчётного счёта"/>
                        </StyledFormItem>
                        <StyledFormItemSelectAndCreate formName={"BIK_id"}
                                                       formLabel={"Бик"}
                                                       onSearch={handleAutoCompleteBiks}
                                                       placeholder={"Начните ввод..."}
                                                       loading={loadingBiks}
                                                       items={dataBiks?.biks?.items}
                                                       firstBtnOnClick={setBikFormViewModalVisible}
                                                       formatOptionText={(row) => `${row.BIK} ${row.name}`}
                        />
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
                onCancel={() => setBikFormViewModalVisible(false)}
                footer={null}
                onClose={handleBikFormView}>
                <BikForm/>
            </Modal>
            {/* контакты */}
            <Modal
                open={addContactModalVisible}
                onCancel={() => setAddContactModalVisible(false)}
                footer={null}
                onClose={handleCloseModalFormView}>
                <ContactForm contact={null}/>
            </Modal>
            <Modal
                open={editContactModalVisible}
                onCancel={() => setEditContactModalVisible(false)}
                footer={null}
                onClose={handleCloseModalFormView}>
                <ContactForm contact={selectedContactData}/>
            </Modal>
        </StyledBlockBig>

    );
};

export default OrganizationForm;
