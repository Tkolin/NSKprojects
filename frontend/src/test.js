import React, {useState} from 'react';
import {Col, Form, Input, Modal, Row, Select} from "antd";
import {StyledFormItem, StyledFormRegular} from './page/style/FormStyles';
import {StyledBlockBig, StyledBlockLarge, StyledBlockRegular} from "./page/style/BlockStyles";
import {TYPES_PROJECTS_QUERY} from "./graphql/queries";
import {useQuery} from "@apollo/client";
const {Option} = Select;
const Test = () => {
    const [form] = Form.useForm();
    const [selectedTypeProject, setSelectedTypeProject] = useState(null);
    const [confirmTypeChangeModalVisible, setConfirmTypeChangeModalVisible] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);


    const handleEditingTemplate = (value) => {
        setSelectedTypeProject(value);
        showConfirmTypeChangeModal(value);
    };

    const showConfirmTypeChangeModal = (value) => {
        setConfirmTypeChangeModalVisible(true);
    };

    const handleConfirmTypeChange = (confirm) => {
        if (confirm) {
            console.log('p,');

            setEditingTemplate(selectedTypeProject);
        }
        setSelectedTypeProject(null);
        setConfirmTypeChangeModalVisible(false);
    };
    const {
        loading: loadingTypeProject, error: errorTypeProject, data: dataTypeProject
    } = useQuery(TYPES_PROJECTS_QUERY);
    return (
        <StyledFormItem name="type_project_id" label="Тип документации">
            <Select
                popupMatchSelectWidth={false}
                value={editingTemplate}
                onSelect={handleEditingTemplate}>
                {dataTypeProject && dataTypeProject.typeProjectsTable && dataTypeProject.typeProjectsTable.typeProjects.map(typeDocument => (
                    <Option key={typeDocument.id}
                            value={typeDocument.id}>{typeDocument.name}</Option>))}
            </Select>
            <Modal
                open={confirmTypeChangeModalVisible}
                title="Подтверждение изменения типа документа"
                onCancel={() => handleConfirmTypeChange(false)}
                onOk={() => handleConfirmTypeChange(true)}
                okText="Да"
                cancelText="Отмена"
            >
                <p>Вы уверены, что хотите изменить выбранный тип документа?</p>
            </Modal>
        </StyledFormItem>
    );};

export default Test;
