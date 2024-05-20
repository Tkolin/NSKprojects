import React, {useContext, useEffect, useState} from 'react';
import {Form, Input, notification} from 'antd';
import {useMutation, useQuery} from '@apollo/client';
import { StyledFormItem, StyledFormRegular} from '../../style/FormStyles';
import {ADD_STAGE_MUTATION, UPDATE_STAGE_MUTATION} from "../../../graphql/mutationsStage";
import {StyledBlockRegular} from "../../style/BlockStyles";
import {StyledButtonGreen} from "../../style/ButtonStyles";
import {STAGES_QUERY} from "../../../graphql/queries";
import {NotificationContext} from "../../../NotificationProvider";
import {ADD_CONTACT_MUTATION, UPDATE_CONTACT_MUTATION} from "../../../graphql/mutationsContact";
import moment from "moment/moment";
import {ORGANIZATIONS_QUERY_COMPACT, POSITIONS_QUERY_COMPACT} from "../../../graphql/queriesCompact";

const IrdForm = ({ initialObject, mutation, onCompleted }) => {
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
            form.resetFields();
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

    const handleSubmit = () => {
        mutate({variables: {...(initialObject ? {id: initialObject.id} : {}), ...form.getFieldsValue(),
                organization_id: organizationAutoComplete?.selected, position_id: positionAutoComplete?.selected}});
    };

    if (errorOrganizations || errorPositions) return `Ошибка! ${errorOrganizations?.message || errorPositions?.message}`;
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


    // Заполнение формы данными контакта при его редактировании
    useEffect(() => {
        if (stage) {
            setEditingStage(stage);
            form.setFieldsValue({name: stage.name});
        }
    }, [stage, form]);

    // Мутации для добавления и обновления
    const [addStage] = useMutation(ADD_STAGE_MUTATION, {
        refetchQueries: [{ query: STAGES_QUERY }],
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно добавлены!');
            form.resetFields();
        },
        onError: () => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных.');
        }
    });

    const [updateStage] = useMutation(UPDATE_STAGE_MUTATION, {
        refetchQueries: [{ query: STAGES_QUERY }],
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно обновлены!');
            setEditingStage(null);
            onClose();
        },
        onError: () => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных.');
        }
    });

    // Обработчик отправки формы
    const handleSubmit = () => {
        if (editingStage) {
            updateStage({ variables: { id: editingStage.id, ...form.getFieldsValue() } });
        } else {
            addStage({ variables: form.getFieldsValue() });
        }
    };

    return (
        <StyledBlockRegular label={'Этап'}>
            <StyledFormRegular form={form} layout="vertical">
                <StyledFormItem name="name" label="Наименование" rules={[{required: true}]}>
                    <Input/>
                </StyledFormItem>
                <div style={{textAlign: 'center'}}>
                    <StyledFormItem>
                        <StyledButtonGreen type="primary" onClick={handleSubmit}>
                            {editingStage ? "Сохранить изменения" : "Добавить"}
                        </StyledButtonGreen>
                    </StyledFormItem>
                </div>
            </StyledFormRegular>
        </StyledBlockRegular>
);
};

export default IrdForm;
