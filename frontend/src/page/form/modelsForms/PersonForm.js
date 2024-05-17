import React, {useContext, useEffect, useState} from 'react';
import {Form, Input, Select, notification, Col, Row, Modal, Space, Divider, Button} from 'antd';
import {useMutation, useQuery} from '@apollo/client';
import {
    ADD_PERSON_MUTATION, UPDATE_PERSON_MUTATION
} from '../../../graphql/mutationsPerson';
import {
    StyledFormItem, StyledFormRegular
} from '../../style/FormStyles';
import {DatePicker} from "antd/lib";
import moment from 'moment';
import PassportPlaceIssuesForm from "./PassportPlaceIssuesForm";
import {StyledBlockBig} from "../../style/BlockStyles";
import {StyledButtonGreen} from "../../style/ButtonStyles";
import {PlusOutlined} from "@ant-design/icons";
import {BANKS_QUERY, BIKS_QUERY, PASSPORTS_PLACE_ISSUES_QUERY, PERSONS_QUERY} from "../../../graphql/queries";
import BikForm from "./BikForm";
import {AddressSuggestions} from "react-dadata";
import {StyledAddressSuggestions, StyledAddressSuggestionsInput} from "../../style/InputStyles";
import {StyledFormItemSelectAndCreate, StyledFormItemSelectAndCreateWitchEdit} from "../../style/SelectStyles";
import {NotificationContext} from "../../../NotificationProvider";

const PersonForm = ({ initialObject, mutation, onCompleted }) => {
    // Первичные данные
    const {openNotification} = useContext(NotificationContext);
    const [form] = Form.useForm();
    const nameModel = 'Контакт';

    // Состояния
    const [organizationModalStatus, setOrganizationModalStatus] = useState("add");
    const [selectedOrganizationData, setSelectedOrganizationData] = useState(null);


    // Изменение состояния
    const handleSelectedOrganization = (value) => {
        setAutoCompleteOrganization(null);
        setSelectedOrganizationData(dataOrganizations?.organizations?.items?.find(org => org.id === value));
    };

    // Мутация
    const [mutate] = useMutation(initialObject ? UPDATE_CONTACT_MUTATION : ADD_CONTACT_MUTATION, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Мутация ${nameModel} выполнена успешно`);
            onCompleted && onCompleted(data);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при выполнении мутации ${nameModel}: ${error.message}`);
        },
    });

    // Подгрузка при обновлении
    useEffect(() => {
        initialObject &&
        form.setFieldsValue({
            ...initialObject,
            birth_day: initialObject?.birth_day ? moment(initialObject.birth_day) : null,
            position_id: initialObject?.position.id ?? null,
            organization_id: initialObject?.organization?.id ?? null
        });
    }, [initialObject, form]);


    // Получение данных для выпадающих списков
    const {loading: loadingPositions, error: errorPositions, data: dataPositions} = useQuery(POSITIONS_QUERY_COMPACT);

    const {
        loading: loadingOrganizations,
        error: errorOrganizations,
        data: dataOrganizations
    } = useQuery(ORGANIZATIONS_QUERY_COMPACT);

    // Завершение
    const handleSubmit = () => {
        mutate({variables: {...(initialObject ? {id: initialObject.id} : {}), ...form.getFieldsValue()}});
    };

    if (errorOrganizations || errorPositions) return `Ошибка! ${errorOrganizations?.message || errorPositions?.message}`;
//////TODO:
//
//
//
// /////////////////////////////////////////////////////////////////////////////////////

    // Состояния
    const [bikFormViewModalVisible, setBikFormViewModalVisible] = useState(false);
    const [editingPerson, setEditingPerson] = useState(null);
    const [formPassport] = Form.useForm();
    const [ppiFormViewModalVisible, setPpiFormViewModalVisible] = useState(false);
    const handlePpiFormView = () => {setPpiFormViewModalVisible(false);};
    const handleBikFormView = () => {setBikFormViewModalVisible(false);};

    // Получение данных для выпадающих списков
    const [address1, setAddress1] = useState();
    const [address2, setAddress2] = useState();

     const [autoCompletebiks, setAutoCompletebiks] = useState('');
    const [autoCompleteBanks, setAutoCompleteBanks] = useState('');
    const [autoCompletePPI, setAutoCompletePPI] = useState('');

    const [databiks, setDatabiks] = useState('');
    const [dataBanks, setDataBanks] = useState('');
    const [dataPPI, setDataPPI] = useState('');
    const handleAutoCompletebiks = (value) => {setAutoCompletebiks(value);};
    const handleAutoCompleteBanks = (value) => {setAutoCompleteBanks(value);};
    const handleAutoCompletePPI = (value) => {setAutoCompletePPI(value);};
    const addresChange1 = (suggestion) => {setAddress1(suggestion?.unrestricted_value);};
    const addresChange2 = (suggestion) => {setAddress2(suggestion?.unrestricted_value);};


    const {loading: loadingbiks} = useQuery(BIKS_QUERY, {
        variables: {
            queryOptions: {search: autoCompletebiks, limit: 10, page: 1}
        },
        onCompleted: (data) => setDatabiks(data)
    });
    const {loading: loadingBanks, error: errorBanks} = useQuery(BANKS_QUERY, {
        variables: {
            queryOptions: {search: autoCompleteBanks, limit: 10, page: 1}
        },
        onCompleted: (data) => setDataBanks(data)
    });
    const {loading: loadingPPI, error: errorPPI} = useQuery(PASSPORTS_PLACE_ISSUES_QUERY, {
        variables: {
            queryOptions: {search: autoCompletePPI, limit: 10, page: 1}
        },
        onCompleted: (data) => setDataPPI(data)
    });

    // Мутации для добавления и обновления
    const [addPerson] = useMutation(ADD_PERSON_MUTATION, {
        refetchQueries: [{query: PERSONS_QUERY}], onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно добавлены!');
            if (onClose) {
                console.log("Закрыл")
                onClose()
            }
            form.resetFields();
            formPassport.resetFields();

        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных: ' + error.message);
        }
    });

    const [updatePerson] = useMutation(UPDATE_PERSON_MUTATION, {
        refetchQueries: [{query: PERSONS_QUERY}], onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно обновлены!');
            if (onClose) {
                console.log("Закрыл")
                onClose()
            }
            form.resetFields();
            formPassport.resetFields();
            setEditingPerson(null);

        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных: ' + error.message);
        }
    });
    useEffect(() => {
        form.resetFields();
        formPassport.resetFields();
        setAddress1("");
        setAddress2("");
    }, []);
    // Заполнение формы данными контакта при его редактировании
    useEffect(() => {
        if (person) {
            setEditingPerson(person);
            form.setFieldsValue({
                ...person,
                bank_id: person.bank ? person.bank.id : null,
                bik_id: person.bik ? person.bik.id : null,
            });

            person.bank ? setAutoCompleteBanks(person.bank.name) : setAutoCompleteBanks('');
            person.bik ? setAutoCompletebiks(person.bik.name) : setAutoCompletebiks('');
            person.passport.passport_place_issue ? setAutoCompletePPI(person.passport.passport_place_issue.name) : setAutoCompletePPI('');

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

            setAddress1(person.passport.address_registration);
            setAddress2(person.passport.address_residential);
        }
    }, [person, form, formPassport]);

    // Обработчик отправки формы
    const handleSubmit = () => {
        const { address_registration, address_residential, ...formPassportValues } = formPassport.getFieldsValue();
        const restrictedValue1 = address_registration?.unrestricted_value ?? address1;
        const restrictedValue2 = address_residential?.unrestricted_value ?? address2;

        const variables = {
            ...form.getFieldsValue(),
            ...formPassportValues,
            address_registration: restrictedValue1,
            address_residential: restrictedValue2,
        };

        if (editingPerson) {
            updatePerson({ variables: { id: editingPerson.id, ...variables } });
        } else {
            addPerson({ variables });
        }
    };

    const TokenDADATA = process.env.REACT_APP_TOKEN_DADATAADDRESS;

    return (
        <StyledBlockBig label={'Подрядчик'}>
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
                        <StyledFormItemSelectAndCreate
                            formName={"passport_place_issue_id"}
                            formLabel={"Место выдачи"}
                            onSearch={handleAutoCompletePPI}
                            placeholder={"Начните ввод..."}
                            loading={loadingPPI}
                            items={dataPPI?.passportPlaceIssues?.items}
                            firstBtnOnClick={setPpiFormViewModalVisible}
                            formatOptionText={(row) => `${row.name}`}
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
                                                defaultQuery={address1}
                                                onChange={addresChange1}/>
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
                                                defaultQuery={address2}
                                                onChange={addresChange2}/>
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
                        <StyledFormItem name="bank_id" label="Банк">
                            <Select
                                popupMatchSelectWidth={false}
                                allowClear
                                showSearch
                                filterOption={false}
                                onSearch={(value) => handleAutoCompleteBanks(value)}
                                loading={loadingBanks}
                                placeholder="Начните ввод...">
                                {dataBanks?.banks?.items?.map(bank => (
                                    <Select.Option key={bank.id} value={bank.id}>{bank.name}</Select.Option>))}
                            </Select>
                        </StyledFormItem>
                        <StyledFormItemSelectAndCreate
                            formName={"bik_id"}
                            formLabel={"Бик"}
                            onSearch={handleAutoCompletebiks}
                            placeholder={"Начните ввод..."}
                            loading={loadingbiks}
                            items={databiks?.biks?.items}
                            firstBtnOnClick={setBikFormViewModalVisible}
                            formatOptionText={(row) => `${row.BIK} ${row.name}`}
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
                        {editingPerson ? "Сохранить изменения" : "Добавить сотрудника"}
                    </StyledButtonGreen>
                </div>
            </StyledFormItem>

            {/* Места выдачи */}
            <Modal
                open={ppiFormViewModalVisible}
                onCancel={() => setPpiFormViewModalVisible(false)}
                footer={null}
                onClose={handlePpiFormView}>
                <PassportPlaceIssuesForm/>
            </Modal>
            <Modal
                open={bikFormViewModalVisible}
                onCancel={() => setBikFormViewModalVisible(false)}
                footer={null}
                onClose={handleBikFormView}>
                <BikForm/>
            </Modal>
        </StyledBlockBig>);
};

export default PersonForm;
