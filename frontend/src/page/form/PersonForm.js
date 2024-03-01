import React, {useEffect, useState} from 'react';
import {Form, Input, Select, notification, Col, Row, Modal, Space} from 'antd';
import {useMutation, useQuery} from '@apollo/client';
import {PERSON_QUERY} from '../../graphql/queries';
import {PERSON_FORM_QUERY} from '../../graphql/queriesGroupData';
import {
    ADD_PERSON_MUTATION, UPDATE_PERSON_MUTATION
} from '../../graphql/mutationsPerson';
import {
    StyledFormItem, StyledFormRegular
} from '../style/FormStyles';
import {DatePicker} from "antd/lib";
import moment from 'moment';
import PassportPlaceIssuesForm from "./passportPlaceIssuesForm";
import LoadingSpinner from "../component/LoadingSpinner";
import {StyledBlockBig} from "../style/BlockStyles";
import {StyledButtonGreen} from "../style/ButtonStyles";
import {PlusOutlined} from "@ant-design/icons";

const PersonForm = ({person, onClose}) => {

    // Состояния
    const [editingPerson, setEditingPerson] = useState(null);
    const [form] = Form.useForm();
    const [formPassport] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();
    const [ppiFormViewModalVisible, setPpiFormViewModalVisible] = useState(false);
    const handlePpiFormView = () => {
        setPpiFormViewModalVisible(false);
    };

    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message, placement,
        });
    };

    // Получение данных для выпадающих списков
    const {loading, error, data} = useQuery(PERSON_FORM_QUERY);

    // Заполнение формы данными контакта при его редактировании
    useEffect(() => {
        if (person) {
            setEditingPerson(person);
            form.setFieldsValue({
                ...person, bank_id: person.bank ? person.bank.id : null, bik_id: person.BIK ? person.BIK.id : null,
            });

            formPassport.setFieldsValue({
                firstname: person.passport.firstname,
                lastname: person.passport.lastname,
                patronymic: person.passport.patronymic,
                birth_date: person.passport.birth_date ? moment(person.passport.birth_date, 'YYYY-MM-DD') : null,
                date: person.passport.date ? moment(person.passport.date, 'YYYY-MM-DD') : null,
                passport_place_issue_id: person.passport.passport_place_issue ? person.passport.passport_place_issue.id : null,// TODO: НЕ РАБОТАЕТ
                serial: person.passport.serial,
                number: person.passport.number,
            });
        }
    }, [person, form, formPassport]);

    // Мутации для добавления и обновления
    const [addPerson] = useMutation(ADD_PERSON_MUTATION, {
        refetchQueries: [{query: PERSON_QUERY}], onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно добавлены!');
            form.resetFields();
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных: ' + error.message);
        }
    });

    const [updatePerson] = useMutation(UPDATE_PERSON_MUTATION, {
        refetchQueries: [{query: PERSON_QUERY}], onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно обновлены!');
            setEditingPerson(null);
            onClose();
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных: ' + error.message);
        }
    });

    // Обработчик отправки формы
    const handleSubmit = () => {
        if (editingPerson) {
            updatePerson({variables: {id: editingPerson.id, ...form.getFieldsValue(), ...formPassport.getFieldsValue(), }});
        } else {
            addPerson({variables: {...form.getFieldsValue(), ...formPassport.getFieldsValue()}});
        }
    };

    // Обработка загрузки и ошибок
    if (loading) return <LoadingSpinner/>;
    if (error) return `Ошибка! ${error.message}`;

    return (

        <StyledBlockBig label={'Сотрудник'}>

            <Row gutter={8}>
                <Col span={12}>
                    <StyledFormRegular form={formPassport} layout="horizontal">
                        <StyledFormItem name="firstname" label="Имя" rules={[{required: true}]}>
                            <Input/>
                        </StyledFormItem>
                        <StyledFormItem name="lastname" label="Фамилия" rules={[{required: true}]}>
                            <Input/>
                        </StyledFormItem>
                        <StyledFormItem name="patronymic" label="Отчество" rules={[{required: true}]}>
                            <Input/>
                        </StyledFormItem>
                        <StyledFormItem name="birth_date" label="Дата рождения" rules={[{required: true}]}>
                            <DatePicker/>
                        </StyledFormItem>
                        <StyledFormItem name="date" label="Дата выдачи" rules={[{required: true}]}>
                            <DatePicker/>
                        </StyledFormItem>
                        <Space.Compact block>
                        <StyledFormItem name="passport_place_issue_id" label="Место выдачи"
                                        rules={[{required: true}]}>

                                <Select style={{minWidth: 180}}>
                                    {data && data.passportPlaceIssues && data.passportPlaceIssues.map(ppi => (
                                        <Select.Option key={ppi.id} value={ppi.id}>{ppi.name}</Select.Option>))}
                                </Select>


                        </StyledFormItem>
                            <StyledButtonGreen icon={<PlusOutlined/>}
                                               onClick={() => setPpiFormViewModalVisible(true)}/>
                        </Space.Compact>

                        <StyledFormItem name="serial" label="Серия" rules={[{required: true}]}>
                            <Input/>
                        </StyledFormItem>
                        <StyledFormItem name="number" label="Номер" rules={[{required: true}]}>
                            <Input/>
                        </StyledFormItem>
                    </StyledFormRegular>
                </Col>
                <Col span={12}>
                    <StyledFormRegular form={form} layout="horizontal">
                        <StyledFormItem name="SHILS" label="Снилс">
                            <Input/>
                        </StyledFormItem>
                        <StyledFormItem name="INN" label="Инн" rules={[{required: true}]}>
                            <Input/>
                        </StyledFormItem>
                        <StyledFormItem name="payment_account" label="Расчётный счёт">
                            <Input/>
                        </StyledFormItem>
                        <StyledFormItem name="phone_number" label="Мобильный" rules={[{
                            pattern: /^[\d\s()-]+$/, message: 'Пожалуйста, введите корректный номер телефона',
                        },]}
                        >
                            <Input
                                placeholder="Введите номер телефона"
                                addonBefore="+7"
                                maxLength={15}
                                minLength={11}
                                pattern="\d*"/>
                        </StyledFormItem>
                        <StyledFormItem name="email" label="e-mail" rules={[{type: 'email'}]}>
                            <Input/>
                        </StyledFormItem>
                        <StyledFormItem name="email_sibnipi" label="e-mail Сибнипи" rules={[{type: 'email'}]}>
                            <Input/>
                        </StyledFormItem>
                        <StyledFormItem name="bank_id" label="Банк">
                            <Select style={{minWidth: 200}}>
                                {data && data.banks && data.banks.map(bank => (
                                    <Select.Option key={bank.id} value={bank.id}>{bank.name}</Select.Option>))}
                            </Select>
                        </StyledFormItem>
                        <StyledFormItem name="bik_id" label="Бик">
                            <Select style={{minWidth: 200}}>
                                {data && data.biks && data.biks.map(bik => (
                                    <Select.Option key={bik.id} value={bik.id}>{bik.name}</Select.Option>))}
                            </Select>
                        </StyledFormItem>
                    </StyledFormRegular>
                </Col>
            </Row>
            <StyledFormItem>
                <div style={{textAlign: 'center'}}>
                    <StyledButtonGreen   style={{    marginBottom: 0}} type="dashed" onClick={handleSubmit}>
                        {editingPerson ? "Сохранить изменения" : "Добавить сотрудника"}
                    </StyledButtonGreen>
                </div>
            </StyledFormItem>

            {/* Места выдачи */}
            <Modal
                open={ppiFormViewModalVisible}
                title="Бик"
                onCancel={() => setPpiFormViewModalVisible(false)}
                footer={null}
                onClose={handlePpiFormView}
            >

                <PassportPlaceIssuesForm/>

            </Modal>
        </StyledBlockBig>);
};

export default PersonForm;
