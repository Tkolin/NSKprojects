import React, {useContext, useEffect, useState} from 'react';
import {Divider, Form, Input, Modal} from 'antd';
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import {ADD_CONTACT_MUTATION, UPDATE_CONTACT_MUTATION} from '../../../graphql/mutationsContact';
import {StyledFormItem, StyledFormRegular} from '../../style/FormStyles';
import {DatePicker} from "antd/lib";
import moment from 'moment';
import {StyledBlockRegular} from "../../style/BlockStyles";
import {StyledButtonGreen} from "../../style/ButtonStyles";
import {NotificationContext} from "../../../NotificationProvider";
import {
    ORGANIZATIONS_QUERY_COMPACT,
    POSITIONS_QUERY_COMPACT
} from "../../../graphql/queriesCompact";
import {
    StyledFormItemAutoComplete,
    StyledFormItemAutoCompleteAndCreateWitchEdit
} from "../../style/SearchAutoCompleteStyles";
import OrganizationForm from "./OrganizationForm";
import {CONTACTS_QUERY_BY_ID} from "../../../graphql/queriesByID";
import LoadingSpinnerStyles from "../../style/LoadingSpinnerStyles";
import OrganizationModalForm from "../../../page/simples/modal/OrganizationModalForm";

const ContactForm = ({localObject, initialObject, onCompleted}) => {
    // Первичные данные
    const {openNotification} = useContext(NotificationContext);
    const [form] = Form.useForm();
    const nameModel = 'Контакт';
    const [actualObject, setActualObject] = useState(localObject ?? (initialObject ?? null));
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
    const [organizationAutoComplete, setOrganizationAutoComplete] = useState({options: [], selected: {}});
    const [positionAutoComplete, setPositionAutoComplete] = useState({options: [], selected: {}});


    // Мутация
    const [mutate] = useMutation(actualObject ? UPDATE_CONTACT_MUTATION : ADD_CONTACT_MUTATION, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Создание новой записи в таблице ${nameModel} выполнено успешно`);
            form.resetFields();
            onCompleted && onCompleted(data);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при выполнении сооздания ${nameModel}: ${error.message}`);
        },
    });


    // Подгрузка при обновлении
    useEffect(() => {
        if (initialObject?.id)
            loadContext();
    }, [initialObject]);
    const updateForm = (data) => {
        if (data) {
            console.log("useEffect");
            form.resetFields();
            form.setFieldsValue({
                ...data,
                position_name: data?.position?.name,
                organization_name: data?.organization?.name,
                birth_day: data?.birth_day ? moment(data.birth_day) : null,
            });
            setPositionAutoComplete({selected: data?.position?.id});
            setOrganizationAutoComplete({selected: data?.organization?.id});
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
        mutate({
            variables: {
                ...(actualObject ? {id: actualObject.id} : {}), ...form.getFieldsValue(),
                organization_id: organizationAutoComplete?.selected, position_id: positionAutoComplete?.selected
            }
        });
    };
    if (loading) return <LoadingSpinnerStyles/>

    if (errorOrganizations || errorPositions) return `Ошибка! ${errorOrganizations?.message || errorPositions?.message}`;

    return (
        <div>
            <StyledFormRegular
                form={form}
                onFinish={handleSubmit}
                labelCol={{span: 8}}
                labelAlign="left"
                wrapperCol={{span: 16}}
            >
                <Divider orientation="left">ФИО:</Divider>
                <StyledFormItem
                    name="last_name"
                    label="Фамилия"
                    rules={[{required: true, message: 'Пожалуйста, заполните фамилию'}]}
                >
                    <Input/>
                </StyledFormItem>
                <StyledFormItem
                    name="first_name"
                    label="Имя"
                    rules={[{required: true, message: 'Пожалуйста, заполните имя'}]}
                >
                    <Input/>
                </StyledFormItem>
                <StyledFormItem name="patronymic" label="Отчество">
                    <Input/>
                </StyledFormItem>

                <Divider orientation="left">Персональные данные:</Divider>

                <StyledFormItem
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
                </StyledFormItem>
                <StyledFormItem
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
                </StyledFormItem>
                <StyledFormItem
                    name="email"
                    label="Личный e-mail"
                    rules={[{type: 'email', message: 'Пожалуйста, введите корректный почтовый адрес',}]}
                >
                    <Input placeholder="Введите e-mail"/>
                </StyledFormItem>
                <StyledFormItem
                    name="work_email"
                    label="Рабочий e-mail"
                    rules={[{type: 'email', message: 'Пожалуйста, введите корректный почтовый адрес',}]}
                >
                    <Input placeholder="Введите e-mail"/>
                </StyledFormItem>
                <StyledFormItem name="birth_day" label="Дата рождения">
                    <DatePicker placeholder="Выберите дату"/>
                </StyledFormItem>

                <Divider orientation="left">Данные организации:</Divider>
                <StyledFormItemAutoComplete
                    formName={"position_name"}
                    formLabel={"Должность"}
                    data={dataPositions?.positions?.items}

                    placeholder="Выберите должность"
                    stateSearch={positionAutoComplete}
                    setStateSearch={ setPositionAutoComplete}

                />
                <StyledFormItemAutoCompleteAndCreateWitchEdit
                    formName={"organization_name"}
                    formLabel={"Организация"}

                    data={dataOrganizations?.organizations?.items}
                    placeholder="Выберите организацию"

                    stateSearch={organizationAutoComplete}
                    setStateSearch={setOrganizationAutoComplete}
                    firstBtnOnClick={() => setOrganizationModalStatus("add")}
                    secondBtnOnClick={() => setOrganizationModalStatus("edit")}
                />


                <StyledFormItem labelCol={{span: 24}} wrapperCol={{span: 24}}>
                    <div style={{textAlign: 'center'}}>
                        <StyledButtonGreen style={{marginBottom: 0}} type="primary" htmlType="submit">
                            {actualObject ? `Обновить` : `Создать`}
                        </StyledButtonGreen>
                    </div>
                </StyledFormItem>
            </StyledFormRegular>
            <OrganizationModalForm
                key={organizationAutoComplete?.selected}
                object={organizationAutoComplete?.selected}
                mode={organizationModalStatus}
                onClose={() => setOrganizationModalStatus(null)}/>
        </div>
    );
};

export default ContactForm;
