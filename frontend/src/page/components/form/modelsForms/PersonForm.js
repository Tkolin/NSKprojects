import React, {useContext, useEffect, useState} from 'react';
import {Form, Input, Col, Row, Modal, Divider} from 'antd';
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import {
    ADD_PERSON_MUTATION, UPDATE_PERSON_MUTATION
} from '../../../../graphql/mutationsPerson';

import {DatePicker} from "antd/lib";
import {StyledButtonGreen} from "../../style/ButtonStyles";
import {AddressSuggestions} from "react-dadata";
import {StyledAddressSuggestionsInput} from "../../style/InputStyles";
import {NotificationContext} from "../../../../NotificationProvider";
import {
    BANKS_QUERY_COMPACT, BIKS_QUERY_COMPACT,
    PASSPORTS_PLACE_ISSUES_QUERY_COMPACT,
} from "../../../../graphql/queriesCompact";
import {PERSONS_QUERY_BY_ID} from "../../../../graphql/queriesByID";
import LoadingSpinnerStyles from "../../style/LoadingSpinnerStyles";
import {CustomAutoComplete, CustomAutoCompleteAndCreate} from "../../style/SearchAutoCompleteStyles";
import BikModalForm from "../../modal/BikModalForm";
import PpiModalForm from "../../modal/PpiModalForm";
import dayjs from "dayjs";
import {nanoid} from "nanoid";
import {CustomDatePicker} from "../../FormattingDateElementComponent";

const PersonForm = ({localObject, initialObject, onCompleted}) => {
    // Первичные данные
    const {openNotification} = useContext(NotificationContext);
    const [form] = Form.useForm();
    const [formPassport] = Form.useForm();

    const nameModel = 'Подрядчики';
    const TokenDADATA = process.env.REACT_APP_TOKEN_DADATAADDRESS;
    const [actualObject, setActualObject] = useState(localObject ?? (initialObject ?? null));
    const [loadContact, {loading, data}] = useLazyQuery(PERSONS_QUERY_BY_ID, {
        variables: {id: initialObject?.id},
        onCompleted: (data) => {
            setActualObject(data?.contacts?.items[0]);
            updateForm(data?.contacts?.items[0]);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при загрузке данных: ${error.message}`);
        },
    });


    // Состояния
    const [address, setAddress] =
        useState({registration: "", residential: ""});

    const [bikModalStatus, setBikModalStatus] = useState(null);
    const [ppiModalStatus, setPpiModalStatus] = useState(null);

    // Мутация
    const [mutate, {loading: loadingSave}] = useMutation(actualObject ? UPDATE_PERSON_MUTATION : ADD_PERSON_MUTATION, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Создание новой записи в таблице ${nameModel} выполнено успешно`);
            form.resetFields();
            formPassport.resetFields();
            setActualObject(null)
            setAddress({registration: "", residential: ""})
            onCompleted && onCompleted(data?.createPerson || data?.updatePerson);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при выполнении сооздания ${nameModel}: ${error.message}`);
        },
    });


    // Подгрузка при обновлении
    useEffect(() => {
        if (initialObject?.id)
            loadContact();
    }, [initialObject]);
    useEffect(() => {
        if (localObject?.id) {
            updateForm(localObject);
        }
    }, [localObject]);
    const updateForm = (data) => {
        console.log("updateForm", data)
        if (data) {
            form.resetFields();
            form.setFieldsValue({
                ...data,
                bank: {selected: data?.bank?.id, output: data?.bank?.name},
                bik: {selected: data?.bik?.id, output: data?.bik?.name}
            });
            formPassport.setFieldsValue({
                ...data?.passport,
                passport_place_issue: {
                    selected: data?.passport?.passport_place_issue?.id,
                    output: data?.passport?.passport_place_issue?.name
                },
                birth_date: data?.passport?.birth_date ? (dayjs(data?.passport?.birth_date)) : null,
                date: data?.passport?.date ? (dayjs(data?.passport?.date)) : null,
            });

            setAddress({
                registration: data?.passport?.address_registration,
                residential: data?.passport?.address_residential
            });
        }
    };

    // Получение данных для выпадающих списков
    const {loading: loadingPpi, error: errorPpi, data: dataPpi} = useQuery(PASSPORTS_PLACE_ISSUES_QUERY_COMPACT);
    const {loading: loadingBank, error: errorBank, data: dataBank} = useQuery(BANKS_QUERY_COMPACT);
    const {loading: loadingBik, error: errorBik, data: dataBik} = useQuery(BIKS_QUERY_COMPACT);


    const handleSubmit = () => {
        const formData = form.getFieldsValue();
        const formDataPassport = formPassport.getFieldsValue();
        mutate({
            variables: {
                ...(actualObject ? {id: actualObject.id} : {}), ...formData, ...formDataPassport,
                bank_id: formData?.bank?.selected ?? null,
                bik_id: formData?.bik?.selected ?? null,
                passport_place_issue_id: formDataPassport?.passport_place_issue?.selected ?? null,
                address_registration: address?.registration?.unrestricted_value ?? address?.registration ?? null,
                address_residential: address?.residential?.unrestricted_value ?? address?.residential ?? null
            }
        });
    };
    if (loading || loadingSave) return <LoadingSpinnerStyles/>

    if (errorPpi || errorBank || errorBik) return `Ошибка! ${errorPpi?.message || errorBank?.message || errorBik?.message}`;


    return (
        <div>
            <Row gutter={8}>
                <Col span={12}>
                    <Form form={formPassport}

                          layout="horizontal"
                          labelCol={{span: 8}}
                          labelAlign="left"
                          wrapperCol={{span: 16}}>
                        <Divider orientation={"left"}>ФИО:</Divider>
                        <Form.Item name="lastname" label="Фамилия" rules={[{required: true}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item name="firstname" label="Имя" rules={[{required: true}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item name="patronymic" label="Отчество">
                            <Input/>
                        </Form.Item>
                        <Divider orientation={"left"}>Данные паспорта:</Divider>
                        <Form.Item name="birth_date" label="Дата рождения">
                            <CustomDatePicker/>
                        </Form.Item>
                        <Form.Item name="date" label="Дата выдачи">
                            <CustomDatePicker/>
                        </Form.Item>
                        <Form.Item name="passport_place_issue" label="Место выдачи">
                            <CustomAutoCompleteAndCreate
                                firstBtnOnClick={() =>
                                setPpiModalStatus({ppi_id: null, mode: "add"})}
                                data={dataPpi?.passportPlaceIssues?.items}
                            />
                        </Form.Item>
                        <Form.Item name="serial" label="Серия">
                            <Input/>
                        </Form.Item>
                        <Form.Item name="number" label="Номер">
                            <Input/>
                        </Form.Item>
                        <Form.Item name="address_registration" label="Адрес регистрации" minchars={3}
                                   delay={50}
                                   style={{
                                       width: '100%',
                                   }}>
                            <AddressSuggestions token={TokenDADATA}
                                                defaultQuery={address?.registration ?? ""}
                                                inputProps={{
                                                    placeholder: 'Введите адрес',
                                                    style: StyledAddressSuggestionsInput,
                                                }}
                                                onChange={(suggestion) => setAddress({
                                                    ...address,
                                                    registration: suggestion?.unrestricted_value
                                                })}
                                                style={{width: '100%'}}/>
                        </Form.Item>
                        <Form.Item name="address_residential" label="Адрес проживания" minchars={3}
                                   delay={50}
                                   style={{
                                       width: '100%',
                                   }}>
                            <AddressSuggestions token={TokenDADATA}
                                                defaultQuery={address?.regisresidentialtration ?? ""}
                                                inputProps={{
                                                    placeholder: 'Введите адрес',
                                                    style: StyledAddressSuggestionsInput,
                                                }}
                                                onChange={(suggestion) => setAddress({
                                                    ...address,
                                                    residential: suggestion?.unrestricted_value
                                                })}
                                                style={{width: '100%'}}/>
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={12}>
                    <Form form={form}
                          layout="horizontal"
                          labelCol={{span: 9}}
                          labelAlign="left"
                          wrapperCol={{span: 15}}>
                        <Divider orientation={"left"}>Персональные данные</Divider>


                        <Form.Item name="phone_number" label="Личный тел." rules={[{
                            pattern: /^\+[0-9\s()-]+$/,
                            message: 'Пожалуйста, введите в формате +79003001234',
                        },]}
                        >
                            <Input
                                placeholder="+790031001234"
                                maxLength={13}
                                minLength={11}
                            />
                        </Form.Item>
                        <Form.Item name="email" label="e-mail" rules={[{type: 'email'}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item name="email_sibnipi" label="e-mail СибНИПИ" rules={[{type: 'email'}]}>
                            <Input/>
                        </Form.Item>


                        <Divider orientation={"left"}>Реквизиты:</Divider>
                        <Form.Item name="payment_account" label="Расчётный счёт">
                            <Input/>
                        </Form.Item>
                        <Form.Item name="bank" label="Банк">
                            <CustomAutoComplete
                                data={dataBank?.banks?.items}
                                placeholder="Выберите банк"
                            />
                        </Form.Item>
                        <Form.Item name="bik" label="Бик" style={{width: "100%"}}>
                            <CustomAutoCompleteAndCreate
                                typeData={"CODENAME"}
                                placeholder={"Начните ввод..."}
                                data={dataBik?.biks?.items}
                                firstBtnOnClick={() =>
                                    setBikModalStatus({bik_id: null, mode: "add"})}
                            />
                        </Form.Item>

                        <Form.Item name="INN" label="Инн">
                            <Input/>
                        </Form.Item>
                        <Form.Item name="SHILS" label="Снилс">
                            <Input/>
                        </Form.Item>


                    </Form>
                </Col>
            </Row>
            <Form.Item>
                <div style={{textAlign: 'center'}}>
                    <StyledButtonGreen style={{marginBottom: 0}} type="dashed" onClick={handleSubmit}>
                        {actualObject ? `Обновить` : `Создать`}
                    </StyledButtonGreen>
                </div>
            </Form.Item>

            <PpiModalForm
                key={ppiModalStatus?.ppi_id ?? nanoid()}
                onClose={() => setPpiModalStatus(null)}
                onCompleted={(value) => {
                    formPassport.setFieldValue("passport_place_issue",{selected: value?.id, output: value?.name});
                    setPpiModalStatus(null);
                }}
                mode={ppiModalStatus?.mode ?? null}
            />
            <BikModalForm
                key={bikModalStatus?.bik_id ?? nanoid()}
                onClose={() => setBikModalStatus(null)}
                onCompleted={(value) => {
                    form.setFieldValue("bik",{selected: value?.id, output: value?.name});
                    setBikModalStatus(null);
                }}
                mode={bikModalStatus?.mode ?? null}
            />
            {/*<BankModalForm*/}
            {/*    key={bikModalStatus?.bik?.id ?? null}*/}
            {/*    onClose={()=>setBikModalStatus(null)}*/}
            {/*    mode={bikModalStatus?.mode ?? null}*/}
            {/*/>*/}
        </div>);
};

export default PersonForm;
