import React, {useEffect, useState} from 'react';
import {
    Form,
    Button,
    Select,
    InputNumber,
    Col,
    Row,
    notification,
    Modal,
    Space,
    AutoComplete
} from 'antd';
import {useMutation, useQuery} from '@apollo/client';
import { TYPES_PROJECTS_QUERY} from '../../graphql/queries';
import { UPDATE_IRDS_TEMPLATE_MUTATION, UPDATE_STAGES_TEMPLATE_MUTATION } from '../../graphql/mutationsTemplate';
import {
    StyledFormBlock,
    StyledForm,
    StyledFormItem,
    StyledBigFormBlock,
    StyledVeryBigFormBlock, StyledVeryBigForm, StyledButtonForm
} from '../style/FormStyles';
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {
    SEARCH_IRDS_QUERY,
    SEARCH_STAGES_QUERY,
    SEARCH_TEMPLATE_OR_TYPE_PROJECT_QUERY
} from "../../graphql/queriesSearch";
import IrdForm from "./IrdForm";
import StageForm from "./StageForm";
import TypeProjectForm from "./TypeProjectForm";

const {Option} = Select;

const TemplateForm = ({project, onClose}) => {

    // Состояния
    const [form] = Form.useForm();
    const [formIRD] = Form.useForm();
    const [formStage] = Form.useForm();

    const [typeProjectFormViewModalVisible, setTypeProjectFormViewModalVisible] = useState(false);
    const [irdFormViewModalVisible, setIrdFormViewModalVisible] = useState(false);
    const [stageFormViewModalVisible, setStageFormViewModalVisible] = useState(false);

    const [editingTemplate, setEditingTemplate] = useState();
    const handleEditingTemplate = (value) => {
        setEditingTemplate(value);
    };

    const [autoCompleteIrd, setAutoCompleteIrd] = useState('');
    const [autoCompleteStage, setAutoCompleteStage] = useState('');
    const handleAutoCompleteIrdSelect = (value) => {
        if(value == 'CREATE_NEW')
        {
            setIrdFormViewModalVisible(true);
            setAutoCompleteIrd('');
        }
        else{
            setAutoCompleteIrd('');
        }
    };
    const handleAutoCompleteStageSelect = (value) => {
        if(value == 'CREATE_NEW')
        {
            setIrdFormViewModalVisible(true);
            setAutoCompleteIrd('');
        }
        else{
            setAutoCompleteIrd('');
        }
    };
    const handleAutoCompleteIrd = (value) => {
            setAutoCompleteIrd(value)
    };
    const handleAutoCompleteStage = (value) => {
            setAutoCompleteStage(value);
    };


    const handleTypeProjectFormView = () => { setTypeProjectFormViewModalVisible(false); };
    const handleIrdFormView = () => { setIrdFormViewModalVisible(false); };
    const handleStageFormView = () => { setStageFormViewModalVisible(false); };
    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message, placement,
        });
    };

    // Получение данных для выпадающих списков
    const { loading: loadingTypeProject, error: errorTypeProject, data: dataTypeProject} = useQuery(TYPES_PROJECTS_QUERY);
    const { loading: loadingTemplate, error: errorTemplate, data: dataTemplate} = useQuery(SEARCH_TEMPLATE_OR_TYPE_PROJECT_QUERY,{
        variables: { typeProject: editingTemplate },
    });
    const { loading: loadingIrds, error: errorIrds,data:  dataIrds} = useQuery(SEARCH_IRDS_QUERY, {
        variables: { search: autoCompleteIrd},
    });
    const { loading: loadingStages, error: errorStages,data:  dataStages} = useQuery(SEARCH_STAGES_QUERY, {
        variables: { search: autoCompleteStage},
    });

    // Загрузка шаблонов при редактировании
    useEffect(() => {
        if (editingTemplate) {
            setEditingTemplate(editingTemplate);
            form.setFieldsValue({
                ...editingTemplate
            });

            const irds = dataTemplate.templatesIrdsTypeProjects;
            const initialValuesIrds = irds.map(ird => ({
                ird_id: ird.id,
                isChecked: false,
            }));
            formIRD.setFieldsValue({ irds_to_project: initialValuesIrds });

            const stages = dataTemplate.templatesStagesTypeProjects;
            const initialValuesStages = stages.map(ird => ({
                ird_id: ird.id,
                isChecked: false,
            }));
            formStage.setFieldsValue({ irds_to_project: initialValuesIrds });
        }
    }, [project, form, formIRD, formStage]);


    // Мутации для добавления и обновления
    const [updateTemplateStage] = useMutation(UPDATE_STAGES_TEMPLATE_MUTATION, {
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно обновлены ts!');
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных: ts'+ error.message);
        }
    });
    const [updateTemplateIrds] = useMutation(UPDATE_IRDS_TEMPLATE_MUTATION, {
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно обновлены! ti');
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных: ti'+ error.message);
        }
    });

    // Обработчик отправки формы
    const handleSubmit = () => {
        const stagesData = formStage.getFieldsValue().stageList.map(stage => ({
            stage_id: stage.stage,
            procent: stage.procent
        }));

        const irdsData = formIRD.getFieldsValue().irdList.map(ird => ({
            ird_id: ird.ird_id,
            stage_number: ird.stageNumber,
            app_number: ird.appNumber
        }));

        // Вызов мутаций для обновления данных
        updateTemplateStage({
            variables:
                {
                    typeProjectId: editingTemplate,
                    listStages_id: stagesData.map(stage => parseInt(stage.stage_id)),
                    listPercent: stagesData.map(stage => stage.procent)
                }});
        updateTemplateIrds({
            variables:
                {
                    typeProjectId: editingTemplate,
                    listIrds_id: irdsData.map(ird => parseInt(ird.ird_id)),
                    listStageNumber: irdsData.map(ird => ird.stage_number),
                    listAppNumber: irdsData.map(ird => ird.app_number)
                }});
    };

    const loadTemplate = () => {
        const irds = dataTemplate && dataTemplate.templatesIrdsTypeProjects;
        const initialValuesIrds = irds && irds.map(ird => ({
            ird_id: ird.id,
        }));
        formIRD.setFieldsValue({ irdList: initialValuesIrds });

        const stages = dataTemplate && dataTemplate.templatesStagesTypeProjects;
        const initialValuesStages = stages && stages.map(stage => ({
            stage_id: stage.id,
        }));
        formStage.setFieldsValue({ stageList: initialValuesStages });
    };

    return (
        <>
            <StyledVeryBigFormBlock>
                <StyledVeryBigForm layout="vertical">
                    <Row gutter={8}>
                        <Col span={8}>
                                <StyledFormBlock form={form} layout="vertical">
                                    <Row gutter={8} align={"bottom"}>
                                        <Col flex="auto">
                                            <StyledFormItem  name="type_project_id" label="Тип документации">
                                               <Row>
                                                   <Col flex="auto">
                                                       <Select onSelect={(value)=>handleEditingTemplate(value)}>
                                                           {dataTypeProject && dataTypeProject.typeProjectsTable  && dataTypeProject.typeProjectsTable.typeProjects .map(typeDocument => (
                                                               <Option key={typeDocument.id}
                                                                       value={typeDocument.id}>{typeDocument.name}</Option>))}
                                                       </Select>
                                                   </Col>
                                                    <Col>
                                                        <StyledButtonForm onClick={() => setTypeProjectFormViewModalVisible(true)}>Создать тип</StyledButtonForm>
                                                        <StyledButtonForm onClick={() => loadTemplate()}>Загрузить шаблоны</StyledButtonForm>
                                                        <StyledButtonForm onClick={() => loadTemplate()}>Создать этап</StyledButtonForm>
                                                        <StyledButtonForm onClick={() => loadTemplate()}>Создать ИРД</StyledButtonForm>
                                                    </Col>
                                              </Row>
                                            </StyledFormItem>
                                            <StyledButtonForm type="primary" onClick={() => handleSubmit()}>Сохранить настройки</StyledButtonForm>
                                        </Col>
                                    </Row>
                                </StyledFormBlock>
                                  <p>           Список этапов:</p>
                                <StyledFormBlock form={formStage} layout="vertical">
                                    <Form.List name="stageList" >
                                        {(fields, {add, remove}) => (<>
                                            {fields.map(({key, name, ...restField}) => (<Space
                                                key={key}
                                                style={{
                                                    display: 'flex', marginBottom: 0, marginTop: 0
                                                }}
                                                align="baseline"
                                            >
                                                <Form.Item
                                                    {...restField}
                                                    style={{ marginBottom: 0, display: 'flex' }}
                                                    name={[name, 'stage']}
                                                >
                                                    <Select
                                                        style={{ maxWidth: 249 , minWidth: 249}}
                                                        dropdownMatchSelectWidth={false}
                                                        filterOption = {false}
                                                        onSearch={(value)=>handleAutoCompleteStage(value)} // Передаем введенное значение
                                                        onSelect={(value)=>handleAutoCompleteStageSelect(value)}
                                                        placeholder="Начните ввод..."
                                                        allowClear
                                                        showSearch
                                                    >
                                                        {dataStages &&  dataStages.stagesTable && dataStages.stagesTable.stages.map(stage => (
                                                            <Select.Option value={stage.id}>{stage.name}</Select.Option>
                                                        ))}
                                                        {dataStages && dataStages.stagesTable && dataStages.stagesTable.stages && dataStages.stagesTable.stages.length === 0 && (
                                                            <Select.Option value="CREATE_NEW">Создать новый этап?</Select.Option>
                                                        )}
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    style={{ marginBottom: 0, display: 'flex' }}
                                                    name={[name, 'procent']}>
                                                    <InputNumber
                                                        size={"middle"}
                                                        min={1}
                                                        max={100}
                                                        style={{
                                                            width: 50
                                                        }}/>
                                                </Form.Item>
                                                <MinusCircleOutlined onClick={() => remove(name)}/>
                                            </Space>))}
                                            <Form.Item>
                                                <Button type="dashed" onClick={() => add()} block
                                                        icon={<PlusOutlined/>}>
                                                    Добавить список этапов
                                                </Button>
                                            </Form.Item>
                                        </>)}
                                    </Form.List>
                                </StyledFormBlock>
                        </Col>
                        <Col span={16}>
                            ИРД
                            <StyledBigFormBlock
                                name="dynamic_form_nest_itemы"
                                style={{ maxWidth: 600 }}
                                form={formIRD}
                            >
                                <Form.List name="irdList" >
                                    {(fields, {add, remove}) => (<>
                                        {fields.map(({key, name, ...restField}) => (<Space
                                            key={key}
                                            style={{
                                                display: 'flex', marginBottom: 0, marginTop: 0
                                            }}
                                            align="baseline"
                                        >
                                            <Form.Item
                                                {...restField}
                                                style={{
                                                    display: 'flex', marginBottom: 0, marginTop: 0
                                                }}
                                                name={[name, 'ird_id']}
                                            >
                                                <Select
                                                    style={{ maxWidth: 300 , minWidth: 300, marginBottom: 0}}
                                                    dropdownMatchSelectWidth={false}
                                                    filterOption = {false}
                                                    placeholder="Начните ввод..."
                                                    onSearch={(value)=>handleAutoCompleteIrd(value)}
                                                    onSelect={(value)=>handleAutoCompleteIrdSelect(value)}
                                                    allowClear
                                                    showSearch
                                                >
                                                    {dataIrds &&  dataIrds.irdsTable && dataIrds.irdsTable.irds && dataIrds.irdsTable.irds.map(ird => (
                                                        <Select.Option key={ird.id} value={ird.id}>{ird.name}</Select.Option>
                                                    ))}
                                                    {dataIrds && dataIrds.irdsTable && dataIrds.irdsTable.irds && dataIrds.irdsTable.irds.length === 0 && (
                                                        <Select.Option value="CREATE_NEW">Создать новый ИРД?</Select.Option>
                                                    )}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                style={{
                                                    display: 'flex', marginBottom: 0, marginTop: 0
                                                }}
                                                name={[name, 'stageNumber']}
                                            >
                                                <InputNumber
                                                    size={"middle"}
                                                    min={1}
                                                    max={100}
                                                    style={{
                                                        width: 60
                                                    }}/>
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                style={{
                                                    display: 'flex', marginBottom: 0, marginTop: 0
                                                }}
                                                name={[name, 'appNumber']}
                                            >
                                                <InputNumber
                                                    size={"middle"}
                                                    min={1}
                                                    max={100}
                                                    style={{
                                                        width: 60
                                                    }}/>
                                            </Form.Item>
                                            <MinusCircleOutlined onClick={() => remove(name)}/>
                                        </Space>))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block
                                                    icon={<PlusOutlined/>}>
                                                Добавить ИРД к шаблону
                                            </Button>
                                        </Form.Item>
                                    </>)}
                                </Form.List>
                            </StyledBigFormBlock>
                        </Col>
                        <Col></Col>
                    </Row>

                    {/* Модальные окна редактирования   */}
                    {/* ЭТАП */}
                    <Modal
                        visible={stageFormViewModalVisible}
                        title="Этап"
                        onCancel={() => setStageFormViewModalVisible(false)}
                        footer={null}
                        onClose={handleStageFormView}
                    >
                        <StyledFormBlock>
                            <StyledForm form={form} layout="vertical">
                                <StageForm/>
                            </StyledForm>
                        </StyledFormBlock>
                    </Modal>
                    {/* ТИП ДОКУМЕНТА */}
                    <Modal
                        visible={typeProjectFormViewModalVisible}
                        title="Тип документа"
                        onCancel={() => setTypeProjectFormViewModalVisible(false)}
                        footer={null}
                        onClose={handleTypeProjectFormView}
                    >
                        <StyledFormBlock>
                            <StyledForm form={form} layout="vertical">
                                <TypeProjectForm/>
                            </StyledForm>
                        </StyledFormBlock>
                    </Modal>
                    {/* ИРД */}
                    <Modal
                        visible={irdFormViewModalVisible}
                        title="Ирд"
                        onCancel={() => setIrdFormViewModalVisible(false)}
                        footer={null}
                        onClose={handleIrdFormView}
                    >
                        <StyledFormBlock>
                            <StyledForm form={form} layout="vertical">
                                <IrdForm/>
                            </StyledForm>
                        </StyledFormBlock>
                    </Modal>
                    {/*  */}
                    {/* ТИП ДОКУМЕНТА */}
                    <Modal
                        visible={typeProjectFormViewModalVisible}
                        title="Тип документа"
                        onCancel={() => setTypeProjectFormViewModalVisible(false)}
                        footer={null}
                        onClose={handleTypeProjectFormView}
                    >
                        <StyledFormBlock>
                            <StyledForm form={form} layout="vertical">
                                <TypeProjectForm/>
                            </StyledForm>
                        </StyledFormBlock>
                    </Modal>
                    {/* ТИП ДОКУМЕНТА */}
                    <Modal
                        visible={typeProjectFormViewModalVisible}
                        title="Тип документа"
                        onCancel={() => setTypeProjectFormViewModalVisible(false)}
                        footer={null}
                        onClose={handleTypeProjectFormView}
                    >
                        <StyledFormBlock>
                            <StyledForm form={form} layout="vertical">
                                <TypeProjectForm/>
                            </StyledForm>
                        </StyledFormBlock>
                    </Modal>

                </StyledVeryBigForm>
            </StyledVeryBigFormBlock>

        </>
    );
};

export default TemplateForm;
