import React, {useContext, useEffect, useState} from 'react';
import {Form, Input, Select, Space, Row, Col, Modal} from 'antd';
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import {
    UPDATE_ORGANIZATION_MUTATION, ADD_ORGANIZATION_MUTATION,
} from '../../../graphql/mutationsOrganization';

import 'react-dadata/dist/react-dadata.css';
import {StyledButtonGreen} from "../../style/ButtonStyles";
import {NotificationContext} from "../../../NotificationProvider";
import {
    BIKS_QUERY_COMPACT,
    CONTACTS_QUERY_COMPACT, LEGAL_FORM_QUERY_COMPACT,
} from "../../../graphql/queriesCompact";
import {ORGANIZATIONS_QUERY_BY_ID} from "../../../graphql/queriesByID";

import {
    StyledFormItemAutoCompleteAndCreate,
    StyledFormItemAutoCompleteAndCreateWitchEdit
} from "../../style/SearchAutoCompleteStyles";


import LoadingSpinnerStyles from "../../style/LoadingSpinnerStyles";
import {AddressSuggestions} from "react-dadata";
import {StyledAddressSuggestionsInput} from "../../style/InputStyles";
import BikForm from "./BikForm";
import ContactForm from "./ContactForm";

const OrganizationForm = ({localObject,initialObject, onCompleted}) => {
    // Первичные данные
    const {openNotification} = useContext(NotificationContext);
    const [form] = Form.useForm();
    const nameModel = 'Организация';
    const TokenDADATA = process.env.REACT_APP_TOKEN_DADATAADDRESS;
    const [actualObject, setActualObject] = useState(localObject ?? (initialObject ?? null));
    const [loadContext, {loading, data}] = useLazyQuery(ORGANIZATIONS_QUERY_BY_ID, {
        variables: {id: initialObject?.id ?? null},
        onCompleted: (data) => {
            setActualObject(data?.organizations?.items[0]);
            updateForm(data?.organizations?.items[0]);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при загрузке данных: ${error.message}`);
        },
    });
    // Состояния
    const [contactModalStatus, setContactModalStatus] = useState(null);
    const [contactAutoComplete, setContactAutoComplete] = useState({options: [], selected: {}});
    const [bikModalStatus, setBikModalStatus] = useState(null);
    const [bikAutoComplete, setBikAutoComplete] = useState({options: [], selected: {}});
    const [address, setAddress] = useState({legal: "", mail: ""});
    // Мутация
    const [mutate] = useMutation(actualObject ? UPDATE_ORGANIZATION_MUTATION : ADD_ORGANIZATION_MUTATION, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Создание новой записи в таблице ${nameModel} выполнено успешно`);
            form.resetFields();
            setAddress({legal: "", mail: ""});
            onCompleted && onCompleted(data);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при выполнении сооздания ${nameModel}: ${error.message}`);
        },
    });

    // Подгрузка при обновлении
    useEffect(() => {
        console.log("initialObject",initialObject);
        if (initialObject?.id) {
            loadContext();
        }
    }, [initialObject]);
    const updateForm = (data) => {
        if (data) {
            form.resetFields();
            setAddress({ legal: "", mail: "" });

            const director = data?.director || {};
            const bik = data?.bik || {};
            const legalForm = data?.legal_form || {};

            form.setFieldsValue({
                ...data,
                director_name:
                    (director.last_name ?? "") + " " +
                    (director.first_name ?? "") + " " +
                    (director.patronymic ?? ""),
                bik_name: (bik.BIK ?? "") + " " + (bik.name ?? ""),
                legal_form_id: legalForm.id ?? null,
                address_legal: "Пельменная"
            });

            setBikAutoComplete({ selected: bik.id });
            setContactAutoComplete({ selected: director.id });
            setAddress({ legal: data.address_legal, mail: data.address_mail });
        }
    };



    // Получение данных для выпадающих списков
    const {loading: loadingContacts, error: errorContacts, data: dataContacts} = useQuery(CONTACTS_QUERY_COMPACT);
    const {loading: loadingLegalForm, error: errorLegalForm, data: dataLegalForm} = useQuery(LEGAL_FORM_QUERY_COMPACT);
    const {loading: loadingBik,error: errorBik,data: dataBik} = useQuery(BIKS_QUERY_COMPACT);

    const handleSubmit = () => {
        mutate({
            variables: {
                ...(actualObject ? {id: actualObject.id} : {}), ...form.getFieldsValue(),
                director_id: contactAutoComplete?.selected,
                bik_id: bikAutoComplete?.selected,
                address_legal: form.getFieldValue("address_legal")?.unrestricted_value,
                address_mail: form.getFieldValue("address_mail")?.unrestricted_value
            }
        });
    };

    if (loading) return <LoadingSpinnerStyles/>
    if (errorContacts || errorBik) return `Ошибка! ${errorContacts?.message || errorBik?.message}`;


    return (<div>
            <Form form={form} onFinish={handleSubmit}>
                <Space.Compact style={{width: "100%", alignItems: 'flex-end'}}>
                    <Form.Item name="name"
                                    label={"Наименование компании"}
                                    rules={[{required: true, message: "Укажите наименование компании"}]}
                                    style={{width: "90%"}}>
                        <Input style={{width: "100%)"}}
                               placeholder={"Наименование"}/>
                    </Form.Item>
                    <Form.Item style={{width: "10%"}} name="legal_form_id"
                                    rules={[{required: true, message: "Укажите тип организации"}]}>
                        <Select placeholder={"Форма"} style={{width: "100%)"}} loading={loadingLegalForm}>
                            {dataLegalForm?.legalForms?.map(row => (
                                <Select.Option key={row.id} value={row.id}>{row.name}</Select.Option>))}
                        </Select>
                    </Form.Item>
                </Space.Compact>
                <Form.Item name="full_name" label="Полное наименование"
                                rules={[{required: true, message: "Укажите полное наименование компании"}]}>
                    <Input/>
                </Form.Item>
                <StyledFormItemAutoCompleteAndCreateWitchEdit
                    formName={"director_name"}
                    formLabel={"Руководитель"}
                    placeholder={"Начните ввод..."}
                    loading={loadingContacts}
                    secondDisable={!contactAutoComplete?.selected}
                    firstBtnOnClick={() => setContactModalStatus("add")}
                    secondBtnOnClick={() => setContactModalStatus("edit")}

                    data={dataContacts?.contacts?.items}
                    stateSearch={contactAutoComplete}
                    setStateSearch={setContactAutoComplete}

                    typeData={"FIO"}
                />

                <Space.Compact style={{width: "100%", alignItems: 'flex-end'}}>
                    <Form.Item name="address_legal" label="Юридический адрес" minchars={3}
                                    delay={50}
                                    style={{width: '90%'}}>
                        <AddressSuggestions token={TokenDADATA}
                                            defaultQuery={address?.legal ?? ""}
                                            inputProps={{
                                                placeholder: 'Введите адрес',
                                                style: StyledAddressSuggestionsInput,
                                            }}
                                            onChange={(suggestion) => setAddress({
                                                ...address,
                                                legal: suggestion?.unrestricted_value
                                            })}
                                            style={{width: '100%'}}/>
                    </Form.Item>
                    <Form.Item name="office_number_legal" style={{width: "10%"}}>
                        <Input placeholder="Офис" style={{width: '100%'}}/>
                    </Form.Item>
                </Space.Compact>
                <Space.Compact style={{width: "100%", alignItems: 'flex-end'}}>
                    <Form.Item name="address_mail" label="Почтовый адрес" minchars={3}
                                    delay={50}
                                    style={{width: '90%'}}>
                        <AddressSuggestions token={TokenDADATA}
                                            defaultQuery={address?.mail ?? ""}
                                            inputProps={{
                                                placeholder: 'Введите адрес',
                                                style: StyledAddressSuggestionsInput,
                                            }}
                                            onChange={(suggestion) => setAddress({
                                                ...address,
                                                mail: suggestion?.unrestricted_value
                                            })}
                                            style={{width: '100%'}}/>
                    </Form.Item>
                    <Form.Item
                        name="office_number_mail"
                        style={{width: "10%"}}>
                        <Input placeholder="Офис" style={{width: '100%'}}/>
                    </Form.Item>
                </Space.Compact>
                <Row gutter={8}>
                    <Col span={12}>
                        <Form.Item name="phone_number" label="Телефон" rules={[{
                            pattern: /^\+[0-9\s()-]+$/,
                            message: 'Пожалуйста, введите в формате +79003001234',
                        },]}>
                            <Input
                                placeholder="+790031001234"
                                maxLength={11}
                                minLength={10}
                            />
                        </Form.Item>
                        <Form.Item name="fax_number" label="Факс">
                            <Input placeholder="Введите номер факса"/>
                        </Form.Item>
                        <Form.Item name="email" label="e-mail" rules={[{
                            type: "email", message: 'Пожалуйста, введите корректный почтовый адрес',
                        },]}>
                            <Input placeholder="Введите почтовый адрес"/>
                        </Form.Item>
                        <Form.Item name="payment_account" label="Расчётынй счёт">
                            <Input placeholder="Введите номер расчётного счёта"/>
                        </Form.Item>
                        <StyledFormItemAutoCompleteAndCreate
                            formName={"bik_name"}
                            formLabel={"Бик"}
                            data={dataBik?.biks?.items}
                            placeholder={"Бик"}
                            stateSearch={ bikAutoComplete}
                            setStateSearch={setBikAutoComplete}
                            loading={loadingBik}
                            firstBtnOnClick={() => setBikModalStatus("add")}
                        />
                    </Col>
                    <Col span={12}>
                        <Form.Item name="INN" label="ИНН" rules={[{
                            pattern: /^[\d\s]+$/, message: 'Пожалуйста, введите корректный номер ИНН',
                        },]}>
                            <Input
                                placeholder="Введите номер ИНН"
                                maxLength={12}
                                minLength={10}
                                pattern="\d*"
                            />
                        </Form.Item>
                        <Form.Item name="OGRN" label="ОГРН" rules={[{
                            pattern: /^[\d\s]+$/, message: 'Пожалуйста, введите корректный номер ОГРН',
                        },]}>
                            <Input
                                placeholder="Введите номер ОГРН"
                                maxLength={13}
                                minLength={13}
                                pattern="\d*"
                            />
                        </Form.Item>
                        <Form.Item name="OKPO" label="ОКПО" rules={[{
                            pattern: /^[\d\s]+$/, message: 'Пожалуйста, введите корректный номер ОКПО',
                        },]}>
                            <Input
                                placeholder="Введите номер ОКПО"
                                maxLength={10}
                                minLength={8}
                                pattern="\d*"
                            />
                        </Form.Item>
                        <Form.Item name="KPP" label="КПП" rules={[{
                            pattern: /^[\d\s]+$/, message: 'Пожалуйста, введите корректный номер КПП',
                        },]}>
                            <Input
                                placeholder="Введите номер КПП"
                                maxLength={9}
                                minLength={9}
                                pattern="\d*"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <div style={{textAlign: 'center'}}>
                        <StyledButtonGreen type="dashed" htmlType={"submit"}>
                            {actualObject ? `Обновить` : `Создать`}
                        </StyledButtonGreen>
                    </div>
                </Form.Item>
            </Form>
            {/*
            Модальные окна редактирования
            */}
            {/* Бики */}
            <Modal
                key={bikAutoComplete?.selected}
                open={bikModalStatus === "add" || bikModalStatus === "edit"}
                onCancel={() => setBikModalStatus(null)}
                footer={null}
                onClose={() => setBikModalStatus(null)}>
                {bikModalStatus === "edit" ? (
                    bikAutoComplete?.selected && (
                        <BikForm onCompleted={() => setBikModalStatus(null)}
                                          initialObject={{id: bikAutoComplete.selected}}/>
                    )
                ) : (
                    <BikForm onCompleted={() => setBikModalStatus(null)}/>
                )}
            </Modal>

            {/* контакты */}
            <Modal
                key={contactAutoComplete?.selected}
                open={contactModalStatus === "add" || contactModalStatus === "edit"}
                onCancel={() => setContactModalStatus(null)}
                footer={null}
                onClose={() => setContactModalStatus(null)}>
                {contactModalStatus === "edit" ? (
                    contactAutoComplete?.selected && (
                        <ContactForm onCompleted={() => setContactModalStatus(null)}
                                          initialObject={{id: contactAutoComplete.selected}}/>
                    )
                ) : (
                    <ContactForm onCompleted={() => setContactModalStatus(null)}/>
                )}

            </Modal>

        </div>

    );
};

export default OrganizationForm;
