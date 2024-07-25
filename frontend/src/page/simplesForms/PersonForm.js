import React, {useContext, useEffect, useState} from 'react';
import {Form, Input, Col, Row, Modal, Divider, Card, Button, Skeleton} from 'antd';
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import {
    ADD_PERSON_MUTATION, UPDATE_PERSON_MUTATION
} from '../../graphql/mutationsPerson';

import {StyledButtonGreen, StyledButtonGreenGhost} from "../components/style/ButtonStyles";
import {AddressSuggestions} from "react-dadata";
import {StyledAddressSuggestionsInput} from "../components/style/InputStyles";
import {NotificationContext} from "../../NotificationProvider";
import {
    BANKS_QUERY_COMPACT, BIKS_QUERY_COMPACT,
    PASSPORTS_PLACE_ISSUES_QUERY_COMPACT,
} from "../../graphql/queriesCompact";
import {PERSONS_QUERY_BY_ID} from "../../graphql/queriesByID";
import LoadingSpinnerStyles from "../components/style/LoadingSpinnerStyles";
import {CustomAutoComplete, CustomAutoCompleteAndCreate} from "../components/style/SearchAutoCompleteStyles";

import dayjs from "dayjs";
import {nanoid} from "nanoid";
import {CustomDatePicker} from "../components/FormattingDateElementComponent";
import PassportPlaceIssuesForm from "./PassportPlaceIssuesForm";
import BikForm from "./BikForm";
import {ModalButton} from "./formComponents/ModalButtonComponent";

const PersonForm = ({localObject, initialObject, onCompleted, cardProps}) => {
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

        const data = {
            firstname: formDataPassport.firstname,
            lastname: formData.lastname,
            patronymic: formDataPassport.patronymic,
            serial: formDataPassport.serial,
            number: formDataPassport.number,
            passport_place_issue_id: formDataPassport?.passport_place_issue?.selected ?? null,
            address_registration: address?.registration?.unrestricted_value ?? address?.registration ?? null,
            address_residential: address?.residential?.unrestricted_value ?? address?.residential ?? null,
            birth_date: formDataPassport.birth_date,
            date: formDataPassport.date,
            SHILS: formData.SHILS,
            INN: formData.INN,
            payment_account: formData.payment_account,
            phone_number: formData.phone_number,
            email: formData.email,
            email_sibnipi: formData.email_sibnipi,
            bank_id: formData?.bank?.selected ?? null,
            bik_id: formData?.bik?.selected ?? null
        };

        mutate({
            variables: {
                ...(actualObject ? {id: actualObject.id} : {}),
                data: data
            }
        });
    };
    if (loading || loadingSave) return <LoadingSpinnerStyles/>

    if (errorPpi || errorBank || errorBik) return `Ошибка! ${errorPpi?.message || errorBank?.message || errorBik?.message}`;


    return (
        <Card style={{width: 900}}
            {...cardProps}
              actions={[
                  <ModalButton
                      modalType={"green"}
                      isMany={cardProps?.actions}
                      loading={loadingSave}
                      onClick={handleSubmit}
                      children={actualObject ? `Обновить` : `Создать`}/>
                  , ...cardProps?.actions ?? []
              ]}

              children={<>
                  <Row gutter={50}>
                      <Col span={12}>
                          <Form form={formPassport}

                                layout="horizontal"
                                labelCol={{span: 8}}
                                labelAlign="left"
                                wrapperCol={{span: 16}}>
                              {!loading ? ( <>
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
                              </>) : <Skeleton active/>}
                          </Form>
                      </Col>
                      <Col span={12}>
                          <Form form={form}
                                layout="horizontal"
                                labelCol={{span: 9}}
                                labelAlign="left"
                                wrapperCol={{span: 15}}>
                              <Divider orientation={"left"}>Персональные данные</Divider>
                              {!loading ? ( <>

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
                          </>) : <Skeleton active/>}

                          </Form>
                      </Col>
                  </Row>

                  <Modal
                      key={ppiModalStatus?.mode || ppiModalStatus?.ppi_id || null}
                      open={ppiModalStatus}
                      onCancel={() => setPpiModalStatus(null)}
                      footer={null}
                      width={"max-content"}
                      children={
                          <PassportPlaceIssuesForm
                              cardProps={{title: "Место выдачи"}}
                              onCompleted={(value) => {
                                  formPassport.setFieldValue("passport_place_issue", {
                                      selected: value?.id,
                                      output: value?.name
                                  });
                                  setPpiModalStatus(null);
                              }}
                              initialObject={ppiModalStatus?.ppi_id ? {id: ppiModalStatus?.ppi_id} : null}
                          />
                      }
                  />
                  <Modal
                      key={bikModalStatus?.mode || bikModalStatus?.bik_id || null}
                      open={bikModalStatus}
                      onCancel={() => setBikModalStatus(null)}
                      footer={null}
                      width={"max-content"}
                      children={
                          <BikForm
                              cardProps={{title: "Бик"}}
                              onCompleted={(value) => {
                                  form.setFieldValue("bik", {selected: value?.id, output: value?.name});
                                  setBikModalStatus(null);
                              }}
                              initialObject={bikModalStatus?.bik_id ? {id: bikModalStatus?.bik_id} : null}
                          />
                      }
                  /></>}/>);
};

export default PersonForm;
