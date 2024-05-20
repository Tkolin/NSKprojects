import React, {useContext, useEffect, useState} from 'react';
import {Form, Input, Button} from 'antd';
import {useMutation, useQuery} from '@apollo/client';
import { StyledFormItem, StyledFormLarge} from '../../style/FormStyles';
import {StyledBlockLarge} from "../../style/BlockStyles";
import {
    ADD_TYPE_PROJECTS_MUTATION,
    UPDATE_TYPE_PROJECTS_MUTATION
} from "../../../graphql/mutationsTypeProject";
import {NotificationContext} from "../../../NotificationProvider";
import {
    ORGANIZATIONS_QUERY_COMPACT,
    POSITIONS_QUERY_COMPACT
} from "../../../graphql/queriesCompact";
import {StyledFormItemAutoCompleteAndCreate} from "../../style/SearchAutoCompleteStyles";

const TypeProjectForm = ({ initialObject, onCompleted }) => {
    // Первичные данные
    const {openNotification} = useContext(NotificationContext);
    const [form] = Form.useForm();
    const nameModel = 'Тип проекта';
    const [actualObject, setActualObject] = useState(initialObject);

    // Состояния
    const [groupModalStatus, setGroupModalStatus] = useState(null);
    const [GroupAutoComplete, setGroupAutoComplete] = useState({options: [], selected: {}});

    // Мутация
    const [mutate] = useMutation(actualObject ? UPDATE_TYPE_PROJECTS_MUTATION : ADD_TYPE_PROJECTS_MUTATION, {
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
        if (actualObject) {
            form.resetFields();
            form.setFieldsValue({
                ...actualObject,
                group_id: actualObject?.group?.id ?? null
            });
        }
    }, [actualObject, form]);

    // Получение данных для выпадающих списков
    const {loading: loadingPositions, error: errorPositions, data: dataPositions} = useQuery(POSITIONS_QUERY_COMPACT);
    const {
        loading: loadingOrganizations,
        error: errorOrganizations,
        data: dataOrganizations
    } = useQuery(ORGANIZATIONS_QUERY_COMPACT);

    const handleSubmit = () => {
        mutate({variables: {...(actualObject ? {id: actualObject.id} : {}), ...form.getFieldsValue(),
                organization_id: organizationAutoComplete?.selected, position_id: positionAutoComplete?.selected}});
    };

    if (errorOrganizations || errorPositions) return `Ошибка! ${errorOrganizations?.message || errorPositions?.message}`;


    return (
        <StyledBlockLarge lable={''}>
            <StyledFormLarge form={form} layout="vertical">
                <StyledFormItem name="name" label="Наименование"  rules={[{ required: true }]}>
                    <Input />
                </StyledFormItem>
                <StyledFormItem name="code" label="код"  rules={[{ required: true }]}>
                    <Input />
                </StyledFormItem>
                <StyledFormItemAutoCompleteAndCreate
                    formName={"group_name"}
                    formLabel={"Группа"}
                    onSelect={setSelectedGroupTypeProject}
                    loading={loadingGroupTypeProject}
                    placeholder={"Начните ввод..."}
                    formatOptionText={(row) => `${row.name}`}
                    firstBtnOnClick={()=>setGroupModalStatus("edit")}

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

export default TypeProjectForm;
