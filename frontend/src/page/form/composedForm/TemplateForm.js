import React, {useState} from 'react';
import {
    Form, Select, Col, Row, notification, Modal, Space
} from 'antd';
import {useQuery} from '@apollo/client';
import {TYPES_PROJECTS_QUERY} from '../../../graphql/queries';

import {
    StyledFormItem, StyledFormRegular
} from '../../style/FormStyles';
import {  PlusOutlined} from '@ant-design/icons';

import TypeProjectForm from "../simpleForm/TypeProjectForm";
import LoadingSpinnerStyles from "../../style/LoadingSpinnerStyles";
import {StyledBlockBig, StyledBlockLarge, StyledBlockRegular} from "../../style/BlockStyles";
import {StyledButtonForm, StyledButtonGreen} from "../../style/ButtonStyles";
import StagesTemplateForm from "../aggregateComponent/templateForm/StagesTemplateForm";
import IrdsTemplateForm from "../aggregateComponent/templateForm/IrdsTemplateForm";
import TasksTemplateForm from "../aggregateComponent/templateForm/TasksTemplateForm";

const {Option} = Select;

const TemplateForm = ({project, onClose}) => {

    // Состояния
    const [form] = Form.useForm();
    const [typeProjectFormViewModalVisible, setTypeProjectFormViewModalVisible] = useState(false);
    const [selectedTypeProject, setSelectedTypeProject] = useState(null);
    const handleTypeProjectFormView = () => {
        setTypeProjectFormViewModalVisible(false);
    };
    const [triggerSaveStages, setTriggerSaveStages] = useState(false);
    const [triggerSaveIrds, setTriggerSaveIrds] = useState(false);
    const [triggerSaveTasks, setTriggerSaveTasks] = useState(false);
    // Функции уведомлений


    // Получение данных для выпадающих списков
    const [autoCompleteProjectType, setAutoCompleteProjectType] =useState('');
    const handleAutoCompleteProjectType = (data) =>{
        setAutoCompleteProjectType(data);
    }
    const {
        loading: loadingTypeProject, error: errorTypeProject, data: dataTypeProject
    } = useQuery(TYPES_PROJECTS_QUERY, {
        variables: {
            queryOptions: {page: 1, limit: 20, search: autoCompleteProjectType}
        },
    });

    // Переключение типов документации
    const handleEditingTemplate = (value) => {
        console.log(value);
        setSelectedTypeProject(value);
    };

    const handleSubmit = () => {
        setTriggerSaveStages(true);
        setTriggerSaveIrds(true);
        setTriggerSaveTasks(true);
    }

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
                                    allowClear
                                    showSearch
                                    filterOption = {false}
                                    loading={loadingTypeProject}
                                    onSearch={(value) => handleAutoCompleteProjectType(value)}
                                    onSelect={(value) => handleEditingTemplate(value)} // Добавлен обработчик onSelect
                                    placeholder="Начните ввод...">
                                    {dataTypeProject && dataTypeProject.typeProjects && dataTypeProject.typeProjects.items && dataTypeProject.typeProjects.items.map(row => (
                                        <Option key={row.id}
                                                value={row.id}>{row.name}</Option>))}
                                </Select>
                            </StyledFormItem>
                            <StyledButtonGreen    type={"dashed"} icon={<PlusOutlined/>}
                                               onClick={() => setTypeProjectFormViewModalVisible(true)}/>

                        </Space.Compact>
                        <div style={{textAlign: 'center'}}>
                            <StyledButtonForm type="primary" onClick={() => handleSubmit()}>Сохранить
                                настройки</StyledButtonForm>
                        </div>
                    </StyledFormRegular>
                </StyledBlockRegular>
                <StyledBlockRegular label={'Этапы'}>
                    <StagesTemplateForm triggerMethod={triggerSaveStages}
                                        setTriggerMethod={setTriggerSaveStages}
                                        typeProjectId={selectedTypeProject}
                                        disabled={!selectedTypeProject}/>
                </StyledBlockRegular>
            </Col>
            <Col span={16}>
                <StyledBlockBig label={'ИРД'} >
                    <IrdsTemplateForm triggerMethod={triggerSaveIrds}
                                      setTriggerMethod={setTriggerSaveIrds}
                                      typeProjectId={selectedTypeProject}
                                      disabled={!selectedTypeProject}/>
                </StyledBlockBig>
                <StyledBlockBig label={'Задачи'}>
                    <TasksTemplateForm triggerMethod={triggerSaveTasks}
                                       setTriggerMethod={setTriggerSaveTasks}
                                       typeProjectId={selectedTypeProject}
                                       disabled={!selectedTypeProject}/>
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
