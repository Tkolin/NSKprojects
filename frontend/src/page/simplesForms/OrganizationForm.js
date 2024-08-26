import React, {useContext, useEffect, useState} from 'react';
import {Form, Input, Select, Space, Row, Col, Modal, Card, Button, Skeleton, Alert} from 'antd';
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import {
    UPDATE_ORGANIZATION_MUTATION, ADD_ORGANIZATION_MUTATION,
} from '../../graphql/mutationsOrganization';

import 'react-dadata/dist/react-dadata.css';
import './style.css';
import {NotificationContext} from "../../NotificationProvider";
import {
    BIKS_QUERY_COMPACT,
    CONTACTS_QUERY_COMPACT, LEGAL_FORM_QUERY_COMPACT,
} from "../../graphql/queriesCompact";
import {ORGANIZATIONS_QUERY_BY_ID} from "../../graphql/queriesByID";

import {
    CustomAutoCompleteAndCreate,
    CustomAutoCompleteAndCreateWitchEdit
} from "../components/style/SearchAutoCompleteStyles";


import {AddressSuggestions} from "react-dadata";
import {StyledAddressSuggestionsInput} from "../components/style/InputStyles";

import ContactForm from "./ContactForm";
import {ModalButton} from "./formComponents/ModalButtonComponent";
import BikForm from "./BikForm";
import {AutoCompleteFormItem} from "../components/CustomForm";

const OrganizationForm = ({localObject, initialObject, onCompleted, style, cardProps}) => {
    // Первичные данные
    const {openNotification} = useContext(NotificationContext);
    const [form] = Form.useForm();
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
    const [bikModalStatus, setBikModalStatus] = useState(null);
    const [address, setAddress] = useState({legal: "", mail: ""});

    // Мутация
    const [mutate, {loading: loadingSave}] = useMutation(actualObject ? UPDATE_ORGANIZATION_MUTATION : ADD_ORGANIZATION_MUTATION, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Создание новой записи в таблице организаций выполнено успешно`);
            form.resetFields();
            setAddress({legal: "", mail: ""});
            console.log(`Создание новой записи в таблице организаций выполнено успешно`, data?.updateOrganization || data?.createOrganization);
            onCompleted && onCompleted(data?.updateOrganization || data?.createOrganization);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при выполнении сооздания организации: ${error.message}`);
        },
    });

    // Подгрузка при обновлении
    useEffect(() => {
        if (initialObject?.id) {
            loadContext();
        }
    }, [initialObject]);
    useEffect(() => {
        console.log("contactModalStatus", contactModalStatus);
    }, [contactModalStatus]);
    useEffect(() => {
        if (localObject?.id) {
            updateForm(localObject);
        }
    }, [localObject]);
    const updateForm = (data) => {
        if (data) {
            form.resetFields();
            setAddress({legal: "", mail: ""});
            form.setFieldsValue({
                ...data,
                bik: {selected: data?.bik?.id, output: (data?.bik?.BIK ?? "") + " " + (data?.bik?.name ?? "")},
                legal_form_id: data?.legal_form?.id ?? null,
                director: {
                    selected: data?.director?.id, output: (data?.director?.last_name ?? "") + " " +
                        (data?.director?.first_name ?? "") + " " +
                        (data?.director?.patronymic ?? "")
                }
            });
            setAddress({legal: data.address_legal, mail: data.address_mail});
        }
    };


    // Получение данных для выпадающих списков
    const {loading: loadingContacts, error: errorContacts, data: dataContacts} = useQuery(CONTACTS_QUERY_COMPACT);
    const {loading: loadingLegalForm, error: errorLegalForm, data: dataLegalForm} = useQuery(LEGAL_FORM_QUERY_COMPACT);
    const {loading: loadingBik, error: errorBik, data: dataBik} = useQuery(BIKS_QUERY_COMPACT);

    const handleSubmit = () => {
        const formData = form.getFieldsValue();
        const data = {
            legal_form_id: formData.legal_form_id,
            name: formData.name,
            full_name: formData.full_name,
            address_legal: formData?.address_legal?.unrestricted_value ?? address?.legal ?? null,
            office_number_legal: formData.office_number_legal,
            address_mail: formData?.address_mail?.unrestricted_value ?? address?.mail ?? null,
            office_number_mail: formData.office_number_mail,
            phone_number: formData.phone_number,
            fax_number: formData.fax_number,
            email: formData.email,
            INN: formData.INN,
            OGRN: formData.OGRN,
            OKPO: formData.OKPO,
            KPP: formData.KPP,
            bik_id: formData?.bik?.selected,
            payment_account: formData.payment_account,
            director_id: formData?.director?.selected
        };

        mutate({
            variables: {
                ...(actualObject ? {id: actualObject.id} : {}),
                data: data
            }
        });
    };

    if (errorContacts || errorBik) return `Ошибка! ${errorContacts?.message || errorBik?.message}`;


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
                      {cardProps?.alert && <Alert {...cardProps.alert}/>}
                      <Form
                          form={form}
                          onFinish={handleSubmit}
                      >
                          {!loading ? (<>
                                  <Space.Compact style={{width: "100%", alignItems: 'start'}}>
                                      <Form.Item name="name"
                                                 label={"Наименование компании"}
                                                 rules={[{required: true, message: "Укажите наименование компании"}]}
                                                 style={{width: "90%"}}>
                                          <Input style={{width: "100%)"}}
                                                 placeholder={"Наименование"}/>
                                      </Form.Item>
                                      <Form.Item style={{width: "10%"}} name="legal_form_id"
                                                 rules={[{required: true, message: "Укажите тип организации"}]}>
                                          <Select placeholder={"Форма"} style={{width: "100%)"}}
                                                  onChange={(value, option) => {
                                                      if (!form.getFieldValue("name"))
                                                          form.setFieldValue("name",
                                                              option.children + " ");
                                                  }}
                                                  loading={loadingLegalForm}>
                                              {dataLegalForm?.legalForms?.map(row => (
                                                  <Select.Option key={row.id} value={row.id}>{row.name}</Select.Option>))}
                                          </Select>
                                      </Form.Item>
                                  </Space.Compact>
                                  <Form.Item name="full_name" label="Полное наименование"
                                             rules={[{required: true, message: "Укажите полное наименование компании"}]}>
                                      <Input/>
                                  </Form.Item>
                                  <AutoCompleteFormItem name="director" label="Руководитель"
                                                        rulesValidationRequired={true}
                                                        rulesValidationMessage={'Укажите руководителя организации'}>
                                      <CustomAutoCompleteAndCreateWitchEdit
                                          data={dataContacts?.contacts?.items}
                                          typeData={"FIO"}
                                          loading={loadingContacts}
                                          firstBtnOnClick={() =>
                                              setContactModalStatus({contact_id: null, mode: "add"})}
                                          secondBtnOnClick={() =>
                                              form.getFieldValue("director")?.selected &&
                                              setContactModalStatus({
                                                  contact_id:
                                                  form.getFieldValue("director")?.selected, mode: "edit"
                                              })}
                                      />
                                  </AutoCompleteFormItem>

                                  <Space.Compact style={{width: "100%", alignItems: 'flex-start'}}>
                                      <Form.Item name="address_legal" label="Юридический адрес" minchars={3}
                                                 delay={50}
                                                 style={{width: '100%'}}>
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
                                  <Space.Compact style={{width: "100%", alignItems: 'flex-start'}}>
                                      <Form.Item name="address_mail" label="Почтовый адрес" minchars={3}
                                                 delay={50}
                                                 style={{width: '100%'}}>
                                          <AddressSuggestions token={TokenDADATA}
                                                              defaultQuery={address?.mail ?? ""}
                                                              inputProps={{
                                                                  placeholder: 'Введите адрес',
                                                                  style: StyledAddressSuggestionsInput,
                                                              }}
                                                              onChange={(suggestion) => setAddress({
                                                                  ...address,
                                                                  mail: suggestion?.unrestricted_value
                                                              })}/>
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
                                                  maxLength={12}
                                                  minLength={11}
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
                                          <AutoCompleteFormItem rulesValidationRequired={false}
                                                                rulesValidationMessage={'Пожалуйста, укажите бик'}
                                                                name="bik" label="Бик" style={{width: "100%"}}>
                                              <CustomAutoCompleteAndCreateWitchEdit
                                                  typeData={"CODENAME"}
                                                  data={dataBik?.biks?.items}
                                                  loading={loadingBik}
                                                  firstBtnOnClick={() =>
                                                      setBikModalStatus({bik_id: null, mode: "add"})}
                                                  secondBtnOnClick={() =>
                                                      form.getFieldValue("bik").selected && setBikModalStatus(
                                                          {bik_id: form.getFieldValue("bik").selected, mode: "edit"})}
                                              />
                                          </AutoCompleteFormItem>
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
                                  </Row> </>)
                              : <Skeleton active/>
                          }
                      </Form>
                      <Modal
                          key={bikModalStatus?.mode || bikModalStatus?.bik_id || null}
                          open={bikModalStatus}
                          onCancel={() => setBikModalStatus(null)}
                          footer={null}
                          width={"max-content"}
                          title={"Бик"}
                          children={
                              <BikForm
                                  onCompleted={(value) => {
                                      form.setFieldValue("bik", {selected: value?.id, output: value?.name});
                                      setBikModalStatus(null);
                                  }}
                                  initialObject={bikModalStatus?.bik_id ? {id: bikModalStatus?.bik_id} : null}
                              />
                          }
                      />
                      <Modal
                          key={contactModalStatus?.mode || contactModalStatus?.contact_id || null}
                          open={contactModalStatus}
                          onCancel={() => setContactModalStatus(null)}
                          footer={null}
                          width={"max-content"}
                          children={
                              <ContactForm

                                  cardProps={{title: "Контакт"}}
                                  options={{disabled: ["organization"]}}
                                  onCompleted={(value) => {
                                      console.log("onCompleted", value);
                                      form.setFieldValue("director", {
                                          selected: value?.id,
                                          output: value.last_name + " " + value.first_name + " " + value?.patronymic ?? ""
                                      });
                                      setContactModalStatus(null);
                                  }}
                                  initialObject={contactModalStatus?.contact_id ? {id: contactModalStatus?.contact_id} : null}
                              />
                          }

                      />
                  </>}
        />


    )
        ;
};

export default OrganizationForm;
