import React, {useEffect, useState} from 'react';
import {
    Form, Button, Select, InputNumber, Col, Row, notification, Modal, Space
} from 'antd';
import {useMutation, useQuery} from '@apollo/client';
import {TYPES_PROJECTS_QUERY} from '../../graphql/queries';
import {
    UPDATE_IRDS_TEMPLATE_MUTATION, UPDATE_STAGES_TEMPLATE_MUTATION, UPDATE_TASKS_TEMPLATE_MUTATION
} from '../../graphql/mutationsTemplate';
import {
    StyledFormBig, StyledFormItem, StyledFormLarge, StyledFormRegular
} from '../style/FormStyles';
import {Loading3QuartersOutlined, MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {
    SEARCH_IRDS_QUERY, SEARCH_STAGES_QUERY, SEARCH_TASKS_QUERY, SEARCH_TEMPLATE_OR_TYPE_PROJECT_QUERY
} from "../../graphql/queriesSearch";
import IrdForm from "./IrdForm";
import StageForm from "./StageForm";
import TypeProjectForm from "./TypeProjectForm";
import LoadingSpinner from "../component/LoadingSpinner";
import {StyledBlockBig, StyledBlockLarge, StyledBlockRegular} from "../style/BlockStyles";
import {StyledButtonForm, StyledButtonGreen} from "../style/ButtonStyles";
import StagesTemplateForm from "../component/StagesTemplateForm";
import IrdsTemplateForm from "../component/IrdsTemplateForm";
import TasksTemplateForm from "../component/TasksTemplateForm";

const {Option} = Select;

const TemplateForm = ({project, onClose}) => {

    // Состояния
    const [form] = Form.useForm();
    const [typeProjectFormViewModalVisible, setTypeProjectFormViewModalVisible] = useState(false);
    const [confirmTypeChangeModalVisible, setConfirmTypeChangeModalVisible] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [selectedTypeProject, setSelectedTypeProject] = useState(null);
    const handleTypeProjectFormView = () => {
        setTypeProjectFormViewModalVisible(false);
    };
    const [triggerSaveStages, setTriggerSaveStages] = useState(false);
    const [triggerSaveIrds, setTriggerSaveIrds] = useState(false);
    const [triggerSaveTasks, setTriggerSaveTasks] = useState(false);
    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message, placement,
        });
    };

    // Получение данных для выпадающих списков
    const {
        loading: loadingTypeProject, error: errorTypeProject, data: dataTypeProject
    } = useQuery(TYPES_PROJECTS_QUERY);

    // Переключение типов документации
    const handleEditingTemplate = (value) => {
        setSelectedTypeProject(value);
    };

    const handleSubmit = () => {
        setTriggerSaveStages(true);
        setTriggerSaveIrds(true);
        setTriggerSaveTasks(true);
    }
    if (loadingTypeProject) return <LoadingSpinner/>

    return (<StyledBlockLarge>
        <Row gutter={8}>
            <Col span={8}>
                <StyledBlockRegular label={'Тип проекта'}>
                    <StyledFormRegular form={form} layout="vertical">
                        <Space.Compact block style={{alignItems: 'flex-end'}}>
                            <StyledFormItem name="type_project_id" label="Тип документации" style={{
                                width: '90%'
                            }}>
                                <Select
                                    popupMatchSelectWidth={false}
                                    value={selectedTypeProject}
                                    onSelect={handleEditingTemplate}>
                                    {dataTypeProject && dataTypeProject.typeProjectsTable && dataTypeProject.typeProjectsTable.typeProjects.map(typeDocument => (
                                        <Option key={typeDocument.id}
                                                value={typeDocument.id}>{typeDocument.name}</Option>))}
                                </Select>
                            </StyledFormItem>
                            <StyledButtonGreen type={"dashed"} icon={<PlusOutlined/>}
                                               onClick={() => setTypeProjectFormViewModalVisible(true)}/>

                        </Space.Compact>
                        <div style={{textAlign: 'center'}}>
                            <StyledButtonForm type="primary" onClick={() => handleSubmit()}>Сохранить
                                настройки</StyledButtonForm>
                        </div>
                    </StyledFormRegular>
                </StyledBlockRegular>
                <StyledBlockRegular label={'Этапы'}>
                    <StagesTemplateForm triggerMethod={triggerSaveStages} setTriggerMethod={setTriggerSaveStages} typeProjectId={selectedTypeProject}/>
                </StyledBlockRegular>
            </Col>
            <Col span={16}>
                <StyledBlockBig label={'ИРД'}>
                    <IrdsTemplateForm triggerMethod={triggerSaveIrds} setTriggerMethod={setTriggerSaveIrds} typeProjectId={selectedTypeProject}/>
                </StyledBlockBig>
                <StyledBlockBig label={'Задачи'}>
                    <TasksTemplateForm triggerMethod={triggerSaveTasks} setTriggerMethod={setTriggerSaveTasks} typeProjectId={selectedTypeProject}/>
                </StyledBlockBig>
            </Col>
        </Row>
        {/* ТИП ДОКУМЕНТА */}
        <Modal
            open={typeProjectFormViewModalVisible}
            onCancel={() => setTypeProjectFormViewModalVisible(false)}
            footer={null}
            onClose={handleTypeProjectFormView}
        >
            <TypeProjectForm/>
        </Modal>
    </StyledBlockLarge>);
};

export default TemplateForm;
