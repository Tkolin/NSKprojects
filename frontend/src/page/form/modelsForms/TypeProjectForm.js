import React, {useContext, useEffect, useState} from 'react';
import {Form, Input, Button, notification, Space, Select, Modal} from 'antd';
import {useMutation, useQuery} from '@apollo/client';
import {GROUP_TYPE_PROJECTS_QUERY, TYPES_PROJECTS_QUERY} from '../../../graphql/queries';
import { StyledFormItem, StyledFormLarge} from '../../style/FormStyles';
import {StyledBlockLarge} from "../../style/BlockStyles";
import {ADD_TYPE_PROJECTS_MUTATION, UPDATE_TYPE_PROJECTS_MUTATION} from "../../../graphql/mutationsTypeProject";
import {StyledButtonGreen} from "../../style/ButtonStyles";
import {EditOutlined, PlusOutlined} from "@ant-design/icons";
import GroupTypeProjectForm from "./GroupTypeProjectForm";
import {StyledFormItemSelect, StyledFormItemSelectAndCreateWitchEdit} from "../../style/SelectStyles";
import {NotificationContext} from "../../../NotificationProvider";
import {GROUP_TYPE_PROJECTS_QUERY_COMPACT} from "../../../graphql/queriesCompact";
const {Option} = Select;

const IrdForm = ({ initialObject, mutation, onCompleted }) => {
    // Первичные данные
    const {openNotification} = useContext(NotificationContext);
    const [form] = Form.useForm();
    const nameModel = 'Контакт';

    // Состояния
    const [selectedGroupTypeProject, setSelectedGroupTypeProject] = useState();


    // Изменение состояния
    const handleSelectedOrganization = (value) => {
        setAutoCompleteOrganization(null);
        setSelectedOrganizationData(dataOrganizations?.organizations?.items?.find(org => org.id === value));
    };

    // Мутация
    const [mutate] = useMutation(initialObject ? UPDATE_TYPE_PROJECTS_MUTATION : ADD_TYPE_PROJECTS_MUTATION, {
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
    const {
        loading: loadingGroupTypeProject,
        error: errorGroupTypeProject,
        data: dataGroupTypeProject
    } = useQuery(GROUP_TYPE_PROJECTS_QUERY_COMPACT);


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


    return (
        <StyledBlockLarge lable={''}>
            <StyledFormLarge form={form} layout="vertical">
                <StyledFormItem name="name" label="Наименование"  rules={[{ required: true }]}>
                    <Input />
                </StyledFormItem>
                <StyledFormItem name="code" label="код"  rules={[{ required: true }]}>
                    <Input />
                </StyledFormItem>
                <StyledFormItemSelect
                    formName={"group_id"}
                    formLabel={"Группа"}
                    onSelect={setSelectedGroupTypeProject}
                    loading={loadingGroupTypeProject}
                    placeholder={"Начните ввод..."}
                    formatOptionText={(row) => `${row.name}`}
                    items={dataGroupTypeProject?.groupTypeProjects}
                />
                <StyledFormItem>
                    <Button type="primary" onClick={handleSubmit}>
                        {editingTypeProject ? "Сохранить изменения" : "Добавить"}
                    </Button>
                </StyledFormItem>
            </StyledFormLarge>
        </StyledBlockLarge>
    );
};

export default IrdForm;
