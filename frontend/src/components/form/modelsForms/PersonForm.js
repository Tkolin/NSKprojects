import React, {useContext, useEffect, useState} from 'react';
import {Form, Input, Col, Row, Modal, Divider} from 'antd';
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import {
    ADD_PERSON_MUTATION, UPDATE_PERSON_MUTATION
} from '../../../graphql/mutationsPerson';
import {
    StyledFormItem, StyledFormRegular
} from '../../style/FormStyles';
import {DatePicker} from "antd/lib";
import PassportPlaceIssuesForm from "./PassportPlaceIssuesForm";
import {StyledButtonGreen} from "../../style/ButtonStyles";
import {AddressSuggestions} from "react-dadata";
import { StyledAddressSuggestionsInput} from "../../style/InputStyles";
import {NotificationContext} from "../../../NotificationProvider";
import {
    BANKS_QUERY_COMPACT, BIKS_QUERY_COMPACT,
    PASSPORTS_PLACE_ISSUES_QUERY_COMPACT,
} from "../../../graphql/queriesCompact";
import { PERSONS_QUERY_BY_ID} from "../../../graphql/queriesByID";
import LoadingSpinnerStyles from "../../style/LoadingSpinnerStyles";
import {StyledFormItemAutoComplete, StyledFormItemAutoCompleteAndCreate} from "../../style/SearchAutoCompleteStyles";
import BikForm from "./BikForm";

const PersonForm = ({localObject,initialObject, onCompleted}) => {
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
            updateForm      (data?.contacts?.items[0]);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при загрузке данных: ${error.message}`);
        },
    });


    // Состояния
    const [address, setAddress] = useState({registration: "", residential: ""});

    const [bikModalStatus, setBikModalStatus] = useState(null);
    const [bikAutoComplete, setBikAutoComplete] = useState({options: [], selected: {}});
    const [ppiModalStatus, setPpiModalStatus] = useState(null);
    const [ppiAutoComplete, setPpiAutoComplete] = useState({options: [], selected: {}});
    const [bankModalStatus, setBankModalStatus] = useState(null);
    const [bankAutoComplete, setBankAutoComplete] = useState({options: [], selected: {}});


    // Мутация
    const [mutate] = useMutation(actualObject ? UPDATE_PERSON_MUTATION : ADD_PERSON_MUTATION, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Создание новой записи в таблице ${nameModel} выполнено успешно`);
            form.resetFields();
            formPassport.resetFields();
            setActualObject(null)
            setAddress({registration: "", residential: "" })
            onCompleted && onCompleted(data);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при выполнении сооздания ${nameModel}: ${error.message}`);
        },
    });


    // Подгрузка при обновлении
    useEffect(() => {
        if (initialObject?.id)
            loadContact();
    }, []);
    const updateForm = (data) =>  {
        if (data) {
            console.log("useEffect");
            form.resetFields();
            form.setFieldsValue({
                ...data,
                bank_name: data?.bank?.name ?? "",
                bik_name: data?.bik?.name ?? ""
            });
            formPassport.setFieldsValue({
                ...data?.passport,
                passport_place_issue_name: data?.passport?.name,
            });
            setPpiAutoComplete({selected: data?.Ppi?.id});
            setBikAutoComplete({selected: data?.organization?.id});
            setBankAutoComplete({selected: data?.organization?.id});

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
        mutate({
            variables: {
                ...(actualObject ? {id: actualObject.id} : {}), ...form.getFieldsValue(),
                ...formPassport.getFieldsValue(),
                bank_id: bankAutoComplete?.selected ?? null,
                bik_id:  bikAutoComplete?.selected ?? null,
                passport_place_issue_id:  ppiAutoComplete?.selected ?? null,
                address_registration: address.registration,
                address_residential: address.residential
             }
        });
    };
    if (loading) return <LoadingSpinnerStyles/>

    if (errorPpi || errorBank || errorBik) return `Ошибка! ${errorPpi?.message || errorBank?.message || errorBik?.message}`;



    return (
        <div>
            <Row gutter={8}>
                <Col span={12}>
                    <StyledFormRegular form={formPassport}
                                       layout="horizontal"
                                       labelCol={{span: 8}}
                                       labelAlign="left"
                                       wrapperCol={{span: 16}}>
                        <Divider orientation={"left"}>ФИО:</Divider>
                        <StyledFormItem name="lastname" label="Фамилия" rules={[{required: true}]}>
                            <Input/>
                        </StyledFormItem>
                        <StyledFormItem name="firstname" label="Имя" rules={[{required: true}]}>
                            <Input/>
                        </StyledFormItem>
                        <StyledFormItem name="patronymic" label="Отчество">
                            <Input/>
                        </StyledFormItem>
                        <Divider orientation={"left"}>Данные паспорта:</Divider>
                        <StyledFormItem name="birth_date" label="Дата рождения">
                            <DatePicker/>
                        </StyledFormItem>
                        <StyledFormItem name="date" label="Дата выдачи">
                            <DatePicker/>
                        </StyledFormItem>
                        <StyledFormItemAutoCompleteAndCreate
                            formName={"passport_place_issue_name"}
                            formLabel={"Место выдачи"}
                            placeholder={"Начните ввод..."}
                            firstBtnOnClick={()=>setPpiModalStatus("add")}

                            data={dataPpi?.passportPlaceIssues?.items}
                            stateSearch={ppiAutoComplete}
                            setStateSearch={setPpiAutoComplete}
                         />
                        <StyledFormItem name="serial" label="Серия">
                            <Input/>
                        </StyledFormItem>
                        <StyledFormItem name="number" label="Номер">
                            <Input/>
                        </StyledFormItem>
                        <StyledFormItem name="address_registration" label="Адрес регистрации" minchars={3}
                                        delay={50}
                                        style={{
                                            width: '100%',
                                        }}>
                            <AddressSuggestions token={TokenDADATA}
                                                inputProps={{
                                                    placeholder: 'Введите адрес',
                                                    style: StyledAddressSuggestionsInput,
                                                }}
                                                defaultQuery={address.registration}
                                                onChange={(suggestion)=>setAddress({...address, registration: suggestion?.unrestricted_value })}
                            />
                        </StyledFormItem>
                        <StyledFormItem name="address_residential" label="Адрес проживания" minchars={3}
                                        delay={50}
                                        style={{
                                            width: '100%',
                                        }}>
                            <AddressSuggestions token={TokenDADATA}
                                                inputProps={{
                                                    placeholder: 'Введите адрес',
                                                    style: StyledAddressSuggestionsInput,
                                                }}
                                                defaultQuery={address.residential}
                                                onChange={(suggestion)=>setAddress({...address, residential: suggestion?.unrestricted_value })}
                            />
                        </StyledFormItem>
                    </StyledFormRegular>
                </Col>
                <Col span={12}>
                    <StyledFormRegular form={form}
                                       layout="horizontal"
                                       labelCol={{span: 9}}
                                       labelAlign="left"
                                       wrapperCol={{span: 15}}>
                        <Divider orientation={"left"}>Персональные данные</Divider>


                        <StyledFormItem name="phone_number" label="Личный тел." rules={[{
                            pattern: /^\+[0-9\s()-]+$/,
                            message: 'Пожалуйста, введите в формате +79003001234',
                        },]}
                        >
                            <Input
                                placeholder="+790031001234"
                                maxLength={13}
                                minLength={11}
                            />
                        </StyledFormItem>
                        <StyledFormItem name="email" label="e-mail" rules={[{type: 'email'}]}>
                            <Input/>
                        </StyledFormItem>
                        <StyledFormItem name="email_sibnipi" label="e-mail СибНИПИ" rules={[{type: 'email'}]}>
                            <Input/>
                        </StyledFormItem>


                        <Divider orientation={"left"}>Реквизиты:</Divider>
                        <StyledFormItem name="payment_account" label="Расчётный счёт">
                            <Input/>
                        </StyledFormItem>
                        <StyledFormItemAutoComplete
                            formName="bank_name"
                            formLabel="Банк"
                            data={dataBank?.banks?.items}
                            placeholder="Выберите банк"
                            stateSearch={bankAutoComplete}
                            setStateSearch={setBankAutoComplete}
                        />

                        <StyledFormItemAutoCompleteAndCreate
                            formName={"bik_name"}
                            formLabel={"Бик"}
                            placeholder={"Начните ввод..."}
                            data={dataBik?.biks?.items}

                            firstBtnOnClick={()=>setBankModalStatus("add")}
                            stateSearch={bikAutoComplete}
                            setStateSearch={setBikAutoComplete}
                         />
                        <StyledFormItem name="INN" label="Инн">
                            <Input/>
                        </StyledFormItem>
                        <StyledFormItem name="SHILS" label="Снилс">
                            <Input/>
                        </StyledFormItem>


                    </StyledFormRegular>
                </Col>
            </Row>
            <StyledFormItem>
                <div style={{textAlign: 'center'}}>
                    <StyledButtonGreen style={{marginBottom: 0}} type="dashed" onClick={handleSubmit}>
                        {actualObject ? `Обновить` : `Создать`}
                    </StyledButtonGreen>
                </div>
            </StyledFormItem>

            <Modal
                key={bikAutoComplete?.selected}
                open={ppiModalStatus === "add" || ppiModalStatus === "edit"}
                onCancel={() => setPpiModalStatus(null)}
                footer={null}
                onClose={()=> setPpiModalStatus(null)}>
                {ppiModalStatus === "edit" ? (
                    ppiAutoComplete?.selected && (
                        <PassportPlaceIssuesForm onCompleted={() => setPpiModalStatus(null)}
                                     initialObject={{id: ppiAutoComplete.selected}}/>
                    )
                ) : (
                    <PassportPlaceIssuesForm onCompleted={() => setPpiModalStatus(null)}/>
                )}            </Modal>
            <Modal
                key={bikAutoComplete?.selected}
                open={bikModalStatus === "add" || bikModalStatus === "edit"}

                onCancel={() => setBikModalStatus(null)}
                footer={null}
                onClose={()=>setBikModalStatus(null)}>
                {bikModalStatus === "edit" ? (
                    bikAutoComplete?.selected && (
                        <BikForm onCompleted={() => setBikModalStatus(null)}
                                     initialObject={{id: bikAutoComplete.selected}}/>
                    )
                ) : (
                    <BikForm onCompleted={() => setBikModalStatus(null)}/>
                )}            </Modal>
        </div>);
};

export default PersonForm;
