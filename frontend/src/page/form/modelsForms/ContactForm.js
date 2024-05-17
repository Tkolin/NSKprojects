import React, {useContext, useEffect, useState} from 'react';
import {AutoComplete, Divider, Form, Input, Modal, Select} from 'antd';
import {useMutation, useQuery} from '@apollo/client';
import {ADD_CONTACT_MUTATION, UPDATE_CONTACT_MUTATION} from '../../../graphql/mutationsContact';
import {StyledFormItem, StyledFormRegular} from '../../style/FormStyles';
import {DatePicker} from "antd/lib";
import moment from 'moment';
import {StyledBlockRegular} from "../../style/BlockStyles";
import {StyledButtonGreen} from "../../style/ButtonStyles";
import {NotificationContext} from "../../../NotificationProvider";
import {ORGANIZATIONS_QUERY_COMPACT, POSITIONS_QUERY_COMPACT} from "../../../graphql/queriesCompact";

const ContactForm = ({initialObject, onCompleted}) => {
    // Первичные данные
    const {openNotification} = useContext(NotificationContext);
    const [form] = Form.useForm();
    const nameModel = 'Контакт';

    // Состояния
    const [organizationModalStatus, setOrganizationModalStatus] = useState(null);
     const [organizationAutoComplete, setOrganizationAutoComplete] = useState({options: [], selected: {}});
    const [positionAutoComplete, setPositionAutoComplete] = useState({options: [], selected: {}});

    // Мутация
    const [mutate] = useMutation(initialObject ? UPDATE_CONTACT_MUTATION : ADD_CONTACT_MUTATION, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Создание новой записи в таблице ${nameModel} выполнено успешно`);
            onCompleted && onCompleted(data);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при выполнении сооздания ${nameModel}: ${error.message}`);
        },
    });

    // Подгрузка при обновлении
    useEffect(() => {
        if (initialObject) {
            form.resetFields();
            form.setFieldsValue({
                ...initialObject,
                birth_day: initialObject?.birth_day ? moment(initialObject.birth_day) : null,
                position_id: initialObject?.position.id ?? null,
                organization_id: initialObject?.organization?.id ?? null
            });
        }
    }, [initialObject, form]);

    // Получение данных для выпадающих списков
    const {loading: loadingPositions, error: errorPositions, data: dataPositions} = useQuery(POSITIONS_QUERY_COMPACT);
    const {
        loading: loadingOrganizations,
        error: errorOrganizations,
        data: dataOrganizations
    } = useQuery(ORGANIZATIONS_QUERY_COMPACT);

    // Обработка поиска и выбора
    const handleSearch = (data, value, stateSearch, setStateSearch) => {
        if (!data) return;
        const filteredOptions = data
            .filter(row => row.name.toLowerCase().includes(value.toLowerCase()))
            .map(row => ({value: row.name, label: row.name, data: row.id}));
        setStateSearch({...stateSearch, options: filteredOptions});
    };

    const handleSubmit = () => {
                 mutate({variables: {...(initialObject ? {id: initialObject.id} : {}), ...form.getFieldsValue(),
                         organization_id: organizationAutoComplete?.selected, position_id: positionAutoComplete?.selected}});
    };

    if (errorOrganizations || errorPositions) return `Ошибка! ${errorOrganizations?.message || errorPositions?.message}`;

    return (
        <StyledBlockRegular label={nameModel}>
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
                <StyledFormItem
                    name="organization_name"
                    label="Организация"
                    rules={[{required: true, message: 'Пожалуйста, выберите организацию'}]}
                >
                    <AutoComplete
                        options={organizationAutoComplete?.options}
                        style={{width: '100%'}}
                        value={organizationAutoComplete?.selected}
                        onSearch={(value) => handleSearch(dataOrganizations?.organizations?.items, value, organizationAutoComplete, setOrganizationAutoComplete)}
                        onSelect={(value, option)=> setOrganizationAutoComplete({...organizationAutoComplete, selected: option.data})}
                        placeholder="Выберите организацию"
                    />
                </StyledFormItem>

                <StyledFormItem
                    name="position_name"
                    label="Должность"
                    rules={[{required: true, message: 'Пожалуйста, выберите должность'}]}
                >
                    <AutoComplete
                        options={positionAutoComplete?.options}
                        style={{width: '100%'}}
                        value={positionAutoComplete?.selected}
                        onSearch={(value) => handleSearch(dataPositions?.positions?.items, value, positionAutoComplete, setPositionAutoComplete)}
                        onSelect={(value, option)=> setPositionAutoComplete({...positionAutoComplete, selected: option.data})}
                        placeholder="Выберите должность"
                    />
                </StyledFormItem>

                <StyledFormItem labelCol={{span: 24}} wrapperCol={{span: 24}}>
                    <div style={{textAlign: 'center'}}>
                        <StyledButtonGreen style={{marginBottom: 0}} type="primary" htmlType="submit">
                            {initialObject ? "Сохранить изменения" : "Добавить контакт"}
                        </StyledButtonGreen>
                    </div>
                </StyledFormItem>
            </StyledFormRegular>
            <Modal
                key={organizationAutoComplete?.selected}
                open={organizationModalStatus === "add" || organizationModalStatus === "edit"}
                onCancel={() => setOrganizationModalStatus(null)}
                footer={null}
                onClose={() => setOrganizationModalStatus(null)}
            >
                {/* Организация формы */}
            </Modal>
        </StyledBlockRegular>
    );
};

export default ContactForm;
