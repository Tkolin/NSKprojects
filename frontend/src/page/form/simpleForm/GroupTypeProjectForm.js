import React, {useEffect, useState} from 'react';
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
const {Option} = Select;

const IrdForm = ({ groupTypeProject, onClose }) => {

    // Состояния
    const [editingGroupTypeProject, setEditingGroupTypeProject] = useState(null);
    const [form] = Form.useForm();
    const [ api,contextHolder] = notification.useNotification();

    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };


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
