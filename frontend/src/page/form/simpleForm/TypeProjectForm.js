import React, {useEffect, useState} from 'react';
import {Form, Input, Button, notification, Space, Select, Modal} from 'antd';
import {useMutation, useQuery} from '@apollo/client';
import { TYPES_PROJECTS_QUERY} from '../../../graphql/queries';
import { StyledFormItem, StyledFormLarge} from '../../style/FormStyles';
import {StyledBlockLarge} from "../../style/BlockStyles";
import {ADD_TYPE_PROJECTS_MUTATION, UPDATE_TYPE_PROJECTS_MUTATION} from "../../../graphql/mutationsTypeProject";
import {StyledButtonGreen} from "../../style/ButtonStyles";
import {EditOutlined, PlusOutlined} from "@ant-design/icons";
import GroupTypeProjectForm from "./GroupTypeProjectForm";
const {Option} = Select;

const IrdForm = ({ typeProject, onClose }) => {

    // Состояния
    const [editingTypeProject, setEditingTypeProject] = useState(null);
    const [form] = Form.useForm();
    const [ api,contextHolder] = notification.useNotification();
    const [addGroupTypeProjectFormViewModalVisible, setAddGroupTypeProjectFormViewModalVisible] = useState(false);
    const [editGroupTypeProjectFormViewModalVisible, setEditGroupTypeProjectFormViewModalVisible] = useState(false);
    const [selectedGroupTypeProject, setSelectedGroupTypeProject] = useState();

    const handleAddGroupTypeProjectFormView = () => {
        setAddGroupTypeProjectFormViewModalVisible(false);
    };
    const handleEditGroupTypeProjectFormView = () => {
        setEditGroupTypeProjectFormViewModalVisible(false);
    };
    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message,
            placement,
        });
    };


    // Заполнение формы данными контакта при его редактировании
    useEffect(() => {
        if (typeProject) {
            setEditingTypeProject(typeProject);
            form.setFieldsValue({code: typeProject.code, name: typeProject.name});
        }
    }, [typeProject, form]);

    // Мутации для добавления и обновления
    const [addTypeProject] = useMutation(ADD_TYPE_PROJECTS_MUTATION, {
        refetchQueries: [{ query: TYPES_PROJECTS_QUERY }],
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно добавлены!');
            form.resetFields();
        },
        onError: () => {
            openNotification('topRight', 'error', 'Ошибка при добавлении данных.');
        }
    });

    const [updateTypeProject] = useMutation(UPDATE_TYPE_PROJECTS_MUTATION, {
        refetchQueries: [{ query: TYPES_PROJECTS_QUERY }],
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно обновлены!');
            setEditingTypeProject(null);
            onClose();
        },
        onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных:' + error.message);
        }
    });
    const {
        loading: loadingGroupTypeProject, error: errorGroupTypeProject, data: dataGroupTypeProject
    } = useQuery(TYPES_PROJECTS_QUERY);
    // Обработчик отправки формы
    const handleSubmit = () => {
        if (editingTypeProject) {
            updateTypeProject({ variables: { id: editingTypeProject.id, ...form.getFieldsValue() } });
        } else {
            addTypeProject({ variables: form.getFieldsValue() });
        }
    };

    return (
        <StyledBlockLarge lable={''}>
            <StyledFormLarge form={form} layout="vertical">
                <StyledFormItem name="name" label="Наименование"  rules={[{ required: true }]}>
                    <Input />
                </StyledFormItem>
                <StyledFormItem name="code" label="код"  rules={[{ required: true }]}>
                    <Input />
                </StyledFormItem>
                <Space.Compact style={{width: "calc(100% + 64px)", alignItems: 'flex-end'}}>
                    <StyledFormItem name="group_type_project_id" label="Группа"
                        style={{width: "calc(100% - 64px)", marginBottom: 0}}>
                        <Select
                            style={{width: "calc(100% - 64px)"}}
                            popupMatchSelectWidth={false}
                            allowClear
                            showSearch
                            filterOption = {false}
                            value={selectedGroupTypeProject}
                            onSelect={(value) => setSelectedGroupTypeProject(value)}
                            loading={loadingGroupTypeProject}
                            placeholder="Начните ввод...">
                            {dataGroupTypeProject?.groupTypeProjects?.items?.map(row => (
                                <Option key={row.id}
                                        value={row.id}>{row.name}</Option>))}
                        </Select>
                    </StyledFormItem>
                    <StyledButtonGreen style={{marginLeft: "-64px", marginBottom: '0px'}}   type={"dashed"} icon={<PlusOutlined/>}
                                          onClick={() => setAddGroupTypeProjectFormViewModalVisible(true)}/>
                    <Button      style={{marginLeft: "0px"}}         type={"dashed"} icon={<EditOutlined/>}
                                          disabled={!selectedGroupTypeProject}
                                          onClick={() => setEditGroupTypeProjectFormViewModalVisible(true)}/>

                </Space.Compact>
                <StyledFormItem>
                    <Button type="primary" onClick={handleSubmit}>
                        {editingTypeProject ? "Сохранить изменения" : "Добавить"}
                    </Button>
                </StyledFormItem>
            </StyledFormLarge>
            <Modal
                open={addGroupTypeProjectFormViewModalVisible}
                onCancel={() => setAddGroupTypeProjectFormViewModalVisible(false)}
                footer={null}
                onClose={handleAddGroupTypeProjectFormView}
            >
                <GroupTypeProjectForm/>
            </Modal>
            <Modal
                open={editGroupTypeProjectFormViewModalVisible}
                onCancel={() => setEditGroupTypeProjectFormViewModalVisible(false)}
                footer={null}
                onClose={handleEditGroupTypeProjectFormView}
            >
                <GroupTypeProjectForm groupTypeProject={selectedGroupTypeProject}/>
            </Modal>
        </StyledBlockLarge>
    );
};

export default IrdForm;
