import React, {useContext, useEffect, useState} from 'react';
import {Alert, Card, Divider, Form, Input, Modal, Skeleton, Space} from 'antd';
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import {ADD_CONTACT_MUTATION, UPDATE_CONTACT_MUTATION} from '../../graphql/mutationsContact';
import {NotificationContext} from "../../NotificationProvider";
import {ORGANIZATIONS_QUERY_COMPACT, POSITIONS_QUERY_COMPACT} from "../../graphql/queriesCompact";
import {CustomAutoComplete, CustomAutoCompleteAndCreateWitchEdit} from "../components/style/SearchAutoCompleteStyles";
import {CONTACTS_QUERY_BY_ID} from "../../graphql/queriesByID";
import {CustomDatePicker} from "../components/FormattingDateElementComponent";
import OrganizationForm from "./OrganizationForm";
import {ModalButton} from "./formComponents/ModalButtonComponent";
import {AutoCompleteFormItem} from "../components/CustomForm";
import dayjs from "dayjs";

const ContactForm = ({localObject, initialObject, options, onCompleted, cardProps}) => {
    // Первичные данные
    const {openNotification} = useContext(NotificationContext);
    const [form] = Form.useForm();
    const [actualObject, setActualObject] = useState(localObject?.id ?? (initialObject ?? null));
    const [loadContext, {loading, data}] = useLazyQuery(CONTACTS_QUERY_BY_ID, {
        variables: {id: initialObject?.id},
        onCompleted: (data) => {
            setActualObject(data?.contacts?.items[0]);
            updateForm(data?.contacts?.items[0])
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при загрузке данных: ${error.message}`);
        },
    });

    // Состояния
    const [organizationModalStatus, setOrganizationModalStatus] = useState(null);
    useEffect(() => {
        console.log("organizationModalStatus", organizationModalStatus);
    }, [organizationModalStatus]);
    // Мутация
    const [mutate, {loading: loadingSave}] = useMutation(actualObject ? UPDATE_CONTACT_MUTATION : ADD_CONTACT_MUTATION, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Создание новой записи в таблице контакт выполнено успешно`);
            form.resetFields();
            onCompleted && onCompleted(data?.createContact || data?.updateContact);
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
        if (localObject)
            updateForm(localObject);
    }, [localObject]);

    const updateForm = (data) => {
        console.log("updateForm Contact", data);
        if (data) {
            console.log(actualObject);
            form.resetFields();
            form.setFieldsValue({
                ...data,
                position: {selected: data?.position?.id, output: data?.position?.name},
                organization: {selected: data?.organization?.id, output: data?.organization?.name},
                birth_day: data?.birth_day ? dayjs(data.birth_day) : null,
            });
        }
    };

    // Получение данных для выпадающих списков
    const {loading: loadingPositions, error: errorPositions, data: dataPositions} = useQuery(POSITIONS_QUERY_COMPACT);
    const {
        loading: loadingOrganizations,
        error: errorOrganizations,
        data: dataOrganizations
    } = useQuery(ORGANIZATIONS_QUERY_COMPACT);

    const handleSubmit = () => {
        const formData = form.getFieldsValue();
        const data = {
            last_name: formData.last_name,
            first_name: formData.first_name,
            patronymic: formData.patronymic,
            work_phone: formData.work_phone,
            mobile_phone: formData.mobile_phone,
            email: formData.email,
            work_email: formData.work_email,
            birth_day: formData.birth_day ? dayjs(formData.birth_day).format("YYYY-MM-DD") : null,
            organization_id: formData?.organization?.selected ?? null,
            position_id: formData?.position?.selected ?? null
        };
        mutate({
            variables: {
                ...(actualObject ? {id: actualObject.id} : {}),
                data,
            }
        });
    };
    if (errorOrganizations || errorPositions) return `Ошибка! ${errorOrganizations?.message || errorPositions?.message}`;

    return (
        <Card style={{width: 400}}
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
                          onChange={() => console.log("change", form.getFieldsValue())}
                          form={form}
                          onFinish={handleSubmit}
                          labelCol={{span: 8}}
                          labelAlign="left"
                          wrapperCol={{span: 16}}
                      >
                          {!loading ? (
                              <>
                                  <Divider orientation="left">ФИО:</Divider>
                                  <Form.Item
                                      name="last_name"
                                      label="Фамилия"
                                      rules={[{required: true, message: 'Пожалуйста, заполните фамилию'}]}
                                  >
                                      <Input/>
                                  </Form.Item>
                                  <Form.Item
                                      name="first_name"
                                      label="Имя"
                                      rules={[{required: true, message: 'Пожалуйста, заполните имя'}]}
                                  >
                                      <Input/>
                                  </Form.Item>
                                  <Form.Item name="patronymic" label="Отчество">
                                      <Input/>
                                  </Form.Item>

                                  <Divider orientation="left">Персональные данные:</Divider>

                                  <Form.Item
                                      name="work_phone"
                                      label="Рабочий тел."
                                      rules={[
                                          {
                                              pattern: /^\+[0-9\s()-]+$/,
                                              message: 'Пожалуйста, введите в формате +79003001234',
                                          },
                                      ]}
                                  >
                                      <Input placeholder="+790031001234" maxLength={16} minLength={10}/>
                                  </Form.Item>
                                  <Form.Item
                                      name="mobile_phone"
                                      label="Личный тел."
                                      rules={[
                                          {
                                              pattern: /^\+[0-9\s()-]+$/,
                                              message: 'Пожалуйста, введите в формате +79003001234',
                                          },
                                      ]}
                                  >
                                      <Input placeholder="+790031001234" maxLength={16} minLength={10}/>
                                  </Form.Item>
                                  <Form.Item
                                      name="email"
                                      label="Личный e-mail"
                                      rules={[{
                                          type: 'email',
                                          message: 'Пожалуйста, введите корректный почтовый адрес',
                                      }]}
                                  >
                                      <Input placeholder="Введите e-mail"/>
                                  </Form.Item>
                                  <Form.Item
                                      name="work_email"
                                      label="Рабочий e-mail"
                                      rules={[{
                                          type: 'email',
                                          message: 'Пожалуйста, введите корректный почтовый адрес',
                                      }]}
                                  >
                                      <Input placeholder="Введите e-mail"/>
                                  </Form.Item>
                                  <Form.Item name="birth_day" label="Дата рождения">
                                      <CustomDatePicker placeholder="Выберите дату"/>
                                  </Form.Item>
                                  {!options?.disabled?.includes("organization") && (<>
                                      <Divider orientation="left">Данные организации:</Divider>
                                      <AutoCompleteFormItem
                                          name={"position"}
                                          label={"Должность"}
                                          style={{width: "100%"}}
                                          rulesValidationRequired={true}
                                          rulesValidationMessage={'Пожалуйста, укажите должность в организации'}>
                                          <CustomAutoComplete
                                              data={dataPositions?.positions?.items}
                                              placeholder="Выберите должность"
                                              loading={loadingPositions}
                                              popupMatchSelectWidth={true}
                                          />
                                      </AutoCompleteFormItem>
                                      <AutoCompleteFormItem
                                          name={"organization"}
                                          label={"Организация"}
                                          style={{width: "100%"}}

                                          // rulesValidationRequired={true}
                                          // rulesValidationMessage={'Пожалуйста, укажите организацию'}
                                      >
                                          <CustomAutoCompleteAndCreateWitchEdit
                                              loading={loadingOrganizations}
                                              data={dataOrganizations?.organizations?.items}
                                              onChange={(value) => form.setFieldValue("organization", value)}
                                              placeholder="Выберите организацию"
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
                                          />
                                      </AutoCompleteFormItem> </>)}
                              </>
                          ) : <Skeleton active/>}
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
                  </>
              }
        />


    );
};

export default ContactForm;