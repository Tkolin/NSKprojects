import React, {useContext, useEffect, useState} from 'react';
import {Button, Divider, Form, Input} from 'antd';
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import {DatePicker} from "antd/lib";
import moment from 'moment';
import {StyledButtonGreen} from "../../style/ButtonStyles";
import {NotificationContext} from "../../../../NotificationProvider";
import {
    CONTACTS_QUERY_COMPACT,
    ORGANIZATIONS_QUERY_COMPACT,
    POSITIONS_QUERY_COMPACT
} from "../../../../graphql/queriesCompact";
import {
    CustomAutoComplete,
    CustomAutoCompleteAndCreateWitchEdit
} from "../../style/SearchAutoCompleteStyles";
import {REQUEST_QUERY_BY_ID} from "../../../../graphql/queriesByID";
import LoadingSpinnerStyles from "../../style/LoadingSpinnerStyles";
import OrganizationModalForm from "../../modal/OrganizationModalForm";
import {CustomDatePicker} from "../../FormattingDateElementComponent";
import {ADD_REQUEST_MUTATION, UPDATE_REQUEST_MUTATION} from "../../../../graphql/mutationsRequest";
import dayjs from "dayjs";

const RequestForm = ({localObject, initialObject, onCompleted}) => {
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
                name: data.name,
                organization: {selected: data?.organization?.id, output: data?.organization?.name},
                contact: {selected: data?.contact?.id, output: data?.contact?.name},
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
    if (loading || loadingSave) return <LoadingSpinnerStyles/>
    if (errorOrganizations || errorOrganizations) return `Ошибка! ${errorOrganizations?.message || errorOrganizations?.message}`;

    return (
        <div>
            <Form
                onChange={() => console.log("change", form.getFieldsValue())}
                form={form}
                onFinish={handleSubmit}
                labelCol={{span: 5}}

                labelAlign="left"
                wrapperCol={{span: 19}}
            >
                <Divider></Divider>
                <Form.Item name="name" label="Наименование проекта">
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="organization"
                    label="Организация"
                    rules={[{required: true, message: 'Пожалуйста, заполните фамилию'}]}
                >
                    <CustomAutoCompleteAndCreateWitchEdit
                        data={dataOrganizations?.organizations?.items}/>
                </Form.Item>
                <Form.Item
                    name="contact"
                    label="Контакт"
                    rules={[{required: true, message: 'Пожалуйста, заполните имя'}]}
                >
                    <CustomAutoCompleteAndCreateWitchEdit
                        typeData={"FIO"}
                        data={dataContacts?.contacts?.items}/>
                </Form.Item>
                <Form.Item name="number_message" label="Номер письма">
                    <Input/>
                </Form.Item>
                <Form.Item name="date_send" label="Дата обращения">
                    <CustomDatePicker/>
                </Form.Item>

                <Form.Item labelCol={{span: 24}} wrapperCol={{span: 24}}>
                    <div style={{textAlign: 'center'}}>
                        <StyledButtonGreen style={{marginBottom: 0}} type="primary" htmlType="submit">
                            {actualObject ? `Обновить` : `Создать`}
                        </StyledButtonGreen>
                    </div>
                </Form.Item>
            </Form>
            <OrganizationModalForm
                key={organizationModalStatus?.selected?.id ?? organizationModalStatus?.organization_id ?? null}
                object={organizationModalStatus?.selected ?? null}
                objectId={organizationModalStatus?.organization_id ?? null}
                mode={organizationModalStatus?.mode ?? null}
                onClose={() => setOrganizationModalStatus(null)}
            />
        </div>
    );
};

export default RequestForm;
