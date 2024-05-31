import React, {useContext, useEffect, useState} from 'react';
import {Form, Input, Button, Select} from 'antd';
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import {
    ADD_GROUP_TYPE_PROJECTS_MUTATION, UPDATE_GROUP_TYPE_PROJECTS_MUTATION
} from "../../../graphql/mutationsTypeProject";

import {NotificationContext} from "../../../NotificationProvider";
import {
    GROUP_TYPE_PROJECTS_QUERY_COMPACT,
} from "../../../graphql/queriesCompact";
import {CONTACTS_QUERY_BY_ID, GROUP_TYPE_PROJECTS_QUERY_BY_ID} from "../../../graphql/queriesByID";
import {CustomAutoCompleteAndCreate} from "../../style/SearchAutoCompleteStyles";
const {Option} = Select;

const GroupTypeProjectForm = ({ initialObject, onCompleted }) => {
    // Первичные данные
    const {openNotification} = useContext(NotificationContext);
    const [form] = Form.useForm();
    const nameModel = 'Группа типа документации';

    const [actualObject, setActualObject] = useState(localObject ?? (initialObject ?? null));

    // Состояния
    const [organizationModalStatus, setOrganizationModalStatus] = useState(null);
    const [technicalSpecificationAutoComplete, setTechnicalSpecificationAutoComplete] = useState({options: [], selected: {}});
    const [loadContact, { loading, data }] = useLazyQuery(GROUP_TYPE_PROJECTS_QUERY_BY_ID, {
        variables: { id: 0},
        onCompleted: (data) => {
            console.log("lazyContact 0", data?.contacts?.items[0])
            setActualObject(data?.groupTypeProjects[0]?.items[0]);
            console.log("actualObject", actualObject);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при загрузке данных: ${error.message}`);
        },
    });
    // Мутация
    const [mutate] = useMutation(actualObject ? UPDATE_GROUP_TYPE_PROJECTS_MUTATION : ADD_GROUP_TYPE_PROJECTS_MUTATION, {
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
                technical_specification_id:  actualObject.technicalSpecification
            });
        }
    }, [actualObject, form]);

    // Получение данных для выпадающих списков
    const {loading: loadingGroupTypeProject, error: errorGroupTypeProject, data: dataGroupTypeProject} = useQuery(GROUP_TYPE_PROJECTS_QUERY_COMPACT);


    const handleSubmit = () => {
        mutate({variables: {...(actualObject ? {id: actualObject.id} : {}), ...form.getFieldsValue(),
                organization_id: organizationAutoComplete?.selected, position_id: positionAutoComplete?.selected}});
    };

    if (errorGroupTypeProject) return `Ошибка! ${errorGroupTypeProject?.message}`;

    return (
        <div>
            <Form form={form} layout="vertical">
                <Form.Item name="name" label="Наименование"  rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="name" label="Наименование"  rules={[{ required: true }]}>
                    <CustomAutoCompleteAndCreate/>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" onClick={handleSubmit}>
                        {actualObject ? "Сохранить" : "Создать"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default GroupTypeProjectForm;
