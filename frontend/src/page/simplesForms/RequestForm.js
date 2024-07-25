import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, Divider, Form, Input, Modal, Skeleton, Space} from 'antd';
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';

import {NotificationContext} from "../../NotificationProvider";
import {
    CONTACTS_QUERY_COMPACT,
    ORGANIZATIONS_QUERY_COMPACT,
    POSITIONS_QUERY_COMPACT
} from "../../graphql/queriesCompact";
import {
    CustomAutoCompleteAndCreateWitchEdit
} from "../components/style/SearchAutoCompleteStyles";
import {REQUEST_QUERY_BY_ID} from "../../graphql/queriesByID";
import {CustomDatePicker} from "../components/FormattingDateElementComponent";
import {ADD_REQUEST_MUTATION, UPDATE_REQUEST_MUTATION} from "../../graphql/mutationsRequest";
import dayjs from "dayjs";
import OrganizationForm from "./OrganizationForm";
import {ModalButton} from "./formComponents/ModalButtonComponent";
import ContactForm from "./UserForm";

const RequestForm = ({localObject, initialObject, onCompleted, cardProps}) => {
    // Первичные данные
    const {openNotification} = useContext(NotificationContext);
    const [form] = Form.useForm();
    const [actualObject, setActualObject] = useState(localObject ?? (initialObject ?? null));
    const [loadContext, {loading, data}] = useLazyQuery(REQUEST_QUERY_BY_ID, {
        variables: {id: initialObject?.id},
        onCompleted: (data) => {
            setActualObject(data?.requests?.items[0]);
            updateForm(data?.requests?.items[0])
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при загрузке данных: ${error.message}`);
        },
    });

    // Состояния
    const [organizationModalStatus, setOrganizationModalStatus] = useState(null);
    const [contactModalStatus, setContactModalStatus] = useState(null);
    useEffect(() => {
        console.log("organizationModalStatus", organizationModalStatus);
    }, [organizationModalStatus]);
    // Мутация
    const [mutate, {loading: loadingSave}] = useMutation(actualObject ? UPDATE_REQUEST_MUTATION : ADD_REQUEST_MUTATION, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Создание новой записи в таблице контакт выполнено успешно`);
            form.resetFields();
            onCompleted && onCompleted(data?.createRequests || data?.updateRequests);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при выполнении сооздания контакта: ${error.message}`);
        },
    });


    // Подгрузка при обновлении
    useEffect(() => {
        if (initialObject?.id)
            loadContext();
    }, [initialObject]);
    useEffect(() => {
        if (actualObject?.id)
            updateForm(actualObject);
    }, [actualObject]);
    const updateForm = (data) => {
        if (data) {
            form.resetFields();
            form.setFieldsValue({
                data: {
                    name: data.name,
                    organization: {selected: data?.organization?.id, output: data?.organization?.name},
                    contact: {selected: data?.contact?.id, output: data?.contact?.name}
                }
            });
        }
    };

    // Получение данных для выпадающих списков
    const {loading: loadingContacts, error: errorContacts, data: dataContacts} = useQuery(CONTACTS_QUERY_COMPACT);
    const {
        loading: loadingOrganizations,
        error: errorOrganizations,
        data: dataOrganizations
    } = useQuery(ORGANIZATIONS_QUERY_COMPACT);

    const handleSubmit = () => {
        const formData = form.getFieldsValue();
        console.log(formData);
        mutate({
            variables: {
                data: {
                    name: formData?.name,
                    number_message: formData?.number_message,
                    organization_id: formData?.organization?.selected ?? null,
                    contact_id: formData?.contact?.selected ?? null,
                    date_send: formData?.date_send ? dayjs(formData?.date_send).format("YYYY-MM-DD") : null,
                }
            }
        });
    };
    if (errorOrganizations || errorContacts) return `Ошибка! ${errorOrganizations?.message || errorContacts?.message}`;

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
              children={
                  <>
                      <Form
                          onChange={() => console.log("change", form.getFieldsValue())}
                          form={form}
                          onFinish={handleSubmit}
                          labelCol={{span: 5}}
                          labelAlign="left"
                          wrapperCol={{span: 19}}
                      >
                          {!loading ? (<>
                              <Form.Item name="name" label="Наименование проекта"
                                         children={ <Input/>}/>
                              <Form.Item
                                  name="organization"
                                  label="Организация"
                                  rules={[{required: true, message: 'Пожалуйста, заполните фамилию'}]}
                                  children={
                                      <CustomAutoCompleteAndCreateWitchEdit
                                          loading={loadingOrganizations}
                                          firstBtnOnClick={() =>
                                              setOrganizationModalStatus({
                                                  organization_id: form.getFieldValue("organization")?.selected,
                                                  mode: "add"
                                              })}
                                          secondBtnOnClick={() =>
                                              form.getFieldValue("organization")?.selected &&
                                              setOrganizationModalStatus({
                                                  organization_id: form.getFieldValue("organization")?.selected,
                                                  mode: "edit"
                                              })}
                                          data={dataOrganizations?.organizations?.items}/>
                                  }
                              />
                              <Form.Item
                                  name="contact"
                                  label="Контакт"
                                  rules={[{required: true, message: 'Пожалуйста, заполните имя'}]}
                                  children={
                                      <CustomAutoCompleteAndCreateWitchEdit
                                          loading={loadingContacts}
                                          firstBtnOnClick={() =>
                                              setContactModalStatus({
                                                  contact_id: form.getFieldValue("contact")?.selected,
                                                  mode: "add"
                                              })}
                                          secondBtnOnClick={() =>
                                              form.getFieldValue("organization")?.selected &&
                                              setContactModalStatus({
                                                  contact_id: form.getFieldValue("contact")?.selected,
                                                  mode: "edit"
                                              })}
                                          typeData={"FIO"}
                                          data={dataContacts?.contacts?.items}/>
                                  }
                              />
                              <Form.Item name="number_message" label="Номер письма"
                                         children={<Input/>}/>

                              <Form.Item name="date_send" label="Дата обращения"
                                         children={<CustomDatePicker/>}/>
                          </>) : <Skeleton active/>}
                      </Form>
                      <Modal
                          key={organizationModalStatus?.mode || organizationModalStatus?.organization_id || null}
                          open={organizationModalStatus}
                          onCancel={() => setOrganizationModalStatus(null)}
                          footer={null}
                          width={"max-content"}
                          children={
                              <Space style={{justifyContent: "center", width: "100%"}}
                                     children={
                                         <OrganizationForm
                                             cardProps={{title: "Организация"}}
                                             onCompleted={() =>
                                                 setOrganizationModalStatus(null)}
                                             initialObject={organizationModalStatus?.organization_id ? {id: organizationModalStatus?.organization_id} : null}
                                         />
                                     }
                              />}
                      />
                      <Modal
                          key={contactModalStatus?.mode || contactModalStatus?.contact_id || null}
                          open={contactModalStatus}
                          onCancel={() => setContactModalStatus(null)}
                          footer={null}
                          width={"max-content"}
                          children={
                              <Space style={{justifyContent: "center", width: "100%"}}
                                     children={
                                         <ContactForm
                                             cardProps={{title: "Контакт"}}
                                             onCompleted={() =>
                                                 setOrganizationModalStatus(null)}
                                             initialObject={contactModalStatus?.contact_id ? {id: contactModalStatus?.contact_id} : null}
                                         />
                                     }
                              />}
                      />
                  </>
              }/>)
        ;
};

export default RequestForm;
