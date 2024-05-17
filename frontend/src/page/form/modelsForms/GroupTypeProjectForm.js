import React, {useContext, useEffect, useState} from 'react';
import {Form, Input, Button, notification, Space, Select, Modal} from 'antd';
import {useMutation, useQuery} from '@apollo/client';
import {GROUP_TYPE_PROJECTS_QUERY, TYPES_PROJECTS_QUERY} from '../../../graphql/queries';
import { StyledFormItem, StyledFormLarge} from '../../style/FormStyles';
import {
    ADD_GROUP_TYPE_PROJECTS_MUTATION,
    ADD_TYPE_PROJECTS_MUTATION, UPDATE_GROUP_TYPE_PROJECTS_MUTATION,
    UPDATE_TYPE_PROJECTS_MUTATION
} from "../../../graphql/mutationsTypeProject";
import {StyledBlockLarge} from "../../style/BlockStyles";
import {StyledButtonGreen} from "../../style/ButtonStyles";
import {PlusOutlined} from "@ant-design/icons";
import TypeProjectForm from "./TypeProjectForm";
import GroupTypeProjectForm from "./GroupTypeProjectForm";
import {NotificationContext} from "../../../NotificationProvider";
const {Option} = Select;

const IrdForm = ({ initialObject, mutation, onCompleted }) => {
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
        if (groupTypeProject) {
            setEditingGroupTypeProject(groupTypeProject);
            form.setFieldsValue({name: groupTypeProject.name, technical_specification_id: groupTypeProject.technicalSpecification });
        }
    }, [groupTypeProject, form]);


    // Мутации для добавления и обновления
    const [addGroupTypeProject] = useMutation(ADD_GROUP_TYPE_PROJECTS_MUTATION, {
        refetchQueries: [{ query: GROUP_TYPE_PROJECTS_QUERY }],
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно добавлены!');
            if (onClose)
                onClose();
            form.resetFields();
        },
        onError: () => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных.');
        }
    });

    const [updateGroupTypeProject] = useMutation(UPDATE_GROUP_TYPE_PROJECTS_MUTATION, {
        refetchQueries: [{ query: GROUP_TYPE_PROJECTS_QUERY }],
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно обновлены!');
            setEditingGroupTypeProject(null);
            if (onClose)
                onClose();
            form.resetFields();
        },
        onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных:' + error.message);
        }
    });
    const {
        loading: loadingGroupTypeProject, error: errorGroupTypeProject, data: dataGroupTypeProject
    } = useQuery(GROUP_TYPE_PROJECTS_QUERY);

    // Обработчик отправки формы
    const handleSubmit = () => {
        if (editingGroupTypeProject) {
            updateGroupTypeProject({ variables: {id: editingGroupTypeProject.id,  ...form.getFieldsValue() } });
        } else {
            addGroupTypeProject({variables: form.getFieldsValue() });
        }
    };

    return (
        <StyledBlockLarge lable={''}>
            <StyledFormLarge form={form} layout="vertical">
                <StyledFormItem name="name" label="Наименование"  rules={[{ required: true }]}>
                    <Input />
                </StyledFormItem>
                <Space.Compact block style={{alignItems: 'flex-end'}}>
                    <StyledFormItem name="techinacl_specification_id" label="Тип документации" style={{width: '100%'}}>
                        <Select
                            popupMatchSelectWidth={false}
                            allowClear
                            showSearch
                            filterOption = {false}
                            loading={loadingGroupTypeProject}
                            placeholder="Начните ввод...">
                            {dataGroupTypeProject?.groupTypeProjects?.items?.map(row => (
                                <Option key={row.id}
                                        value={row.id}>{row.name}</Option>))}
                        </Select>
                    </StyledFormItem>
                </Space.Compact>
                <StyledFormItem>
                    <Button type="primary" onClick={handleSubmit}>
                        {editingGroupTypeProject ? "Сохранить изменения" : "Добавить"}
                    </Button>
                </StyledFormItem>
            </StyledFormLarge>
        </StyledBlockLarge>
    );
};

export default IrdForm;
