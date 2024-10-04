import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Card, Col, Divider, Form, Input, Modal, Row, Skeleton } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { AddressSuggestions } from "react-dadata";
import { NotificationContext } from "../../NotificationProvider";
import { ADD_PERSON_MUTATION, UPDATE_PERSON_MUTATION } from '../../graphql/mutationsPerson';
import { PERSONS_QUERY_BY_ID } from "../../graphql/queriesByID";
import {
    BANKS_QUERY_COMPACT,
    BIKS_QUERY_COMPACT,
    PASSPORTS_PLACE_ISSUES_QUERY_COMPACT,
} from "../../graphql/queriesCompact";
import { StyledAddressSuggestionsInput } from "../components/style/InputStyles";
import { CustomAutoComplete, CustomAutoCompleteAndCreate } from "../components/style/SearchAutoCompleteStyles";

import dayjs from "dayjs";
import { CustomDatePicker } from "../components/FormattingDateElementComponent";
import BikForm from "./BikForm";
import PassportPlaceIssuesForm from "./PassportPlaceIssuesForm";
import { ModalButton } from "./formComponents/ModalButtonComponent";

const PersonForm = ({localObject, initialObject, onCompleted, cardProps}) => {
    // Первичные данные
    const {openNotification} = useContext(NotificationContext);
    const [form] = Form.useForm();
    useEffect(() => {
        console.log("initialObject", initialObject)
    }, [initialObject]);
    const nameModel = 'Подрядчики';
    const TokenDADATA = process.env.REACT_APP_TOKEN_DADATAADDRESS;
    const [actualObject, setActualObject] = useState(localObject?.id ?? (initialObject ?? null));
    const [loadContact, {loading, data}] = useLazyQuery(PERSONS_QUERY_BY_ID, {
        variables: {id: initialObject?.id},
        onCompleted: (data) => {

            setActualObject(data?.persons?.items[0]);
            updateForm(data?.persons?.items[0]);
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
                bik: {selected: data?.bik?.id, output: data?.bik?.name},

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

        const data = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            patronymic: formData.patronymic,
            serial: formData.serial,
            number: formData.number,
            passport_place_issue_id: formData?.passport_place_issue?.selected ?? null,
            address_registration: address?.registration?.unrestricted_value ?? address?.registration ?? null,
            address_residential: address?.residential?.unrestricted_value ?? address?.residential ?? null,
            birth_date: formData.birth_date,
            date: formData.date,
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

    if (errorPpi || errorBank || errorBik) return `Ошибка! ${errorPpi?.message || errorBank?.message || errorBik?.message}`;


    return (
        <Card style={{width: 900}}
              {...cardProps}
              actions={[
                  <ModalButton
                      modalType={"green"}
                      isMany={cardProps?.actions}
                      loading={loadingSave}
                      onClick={() => form.submit()}
                      children={actualObject ? `Обновить` : `Создать`}/>
                  , ...cardProps?.actions ?? []
              ]}

              children={
                  <>

                      <Form form={form}
                            onFinish={handleSubmit}
                            layout="horizontal"
                            labelCol={{span: 8}}
                            labelAlign="left"
                            wrapperCol={{span: 16}}>

                          {!loading ? (<>
                              <Row gutter={50}>
                                  <Col span={12}>
                                      <Divider orientation={"left"}>ФИО:</Divider>
                                      <Form.Item name="last_name" label="Фамилия"
                                                 rules={[{required: true, message: "Укажите фамилию"}]}>
                                          <Input/>
                                      </Form.Item>
                                      <Form.Item name="first_name" label="Имя"
                                                 rules={[{required: true, message: "Укажите имя"}]}>
                                          <Input/>
                                      </Form.Item>
                                      <Form.Item name="patronymic" label="Отчество">
                                          <Input/>
                                      </Form.Item>
                                      <Divider orientation={"left"}>Данные паспорта:</Divider>
                                      <Form.Item name="birth_date" label="Дата рождения" rules={[{required: true, message: "Укажите дату рождения"}]}>
                                          <CustomDatePicker/>
                                      </Form.Item>
                                      <Form.Item name="date" label="Дата выдачи">
                                          <CustomDatePicker />
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
                                                              defaultQuery={address?.registration ?? ""}
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

                                  </Col>
                                  <Col span={12}>

                                      <Divider orientation={"left"}>Персональные данные</Divider>


                                      <Form.Item name="phone_number" label="Личный тел." rules={[{
                                          required: true,
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
                                  </Col>
                              </Row>
                          </>) : (<Skeleton active/>)}
                      </Form>

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
                                      form.setFieldValue("passport_place_issue", {
                                          selected: value?.id,
                                          output: value?.name
                                      });
                                      form.validateFields(["passport_place_issue"]);
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
                                      form.validateFields(["bik"]);
                                      setBikModalStatus(null);
                                  }}
                                  initialObject={bikModalStatus?.bik_id ? {id: bikModalStatus?.bik_id} : null}
                              />
                          }
                      />
                  </>
              }
        />);
};

export default PersonForm;
