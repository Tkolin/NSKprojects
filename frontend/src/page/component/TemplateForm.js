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
import IrdForm from "../ird/IrdForm";
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

    const [autoCompleteIrd, setAutoCompleteIrd] = useState({ id: '', name: '' });
    const [autoCompleteStage, setAutoCompleteStage] = useState({ id: '', name: '' });
    const handleAutoCompleteIrd = (value, option) => {
        if(option.key == 'СОЗДАТЬ')
        {
            console.log(option.key);
            setIrdFormViewModalVisible(true);
            setAutoCompleteIrd({id: '', name: ''})
        }
        else{
            setAutoCompleteIrd({ id: option.key, name: value });
        }

    };
    const handleAutoCompleteStage = (value, option) => {
        if(option.key == 'СОЗДАТЬ')
        {
            console.log(option.key);
            setStageFormViewModalVisible(true);
            setAutoCompleteStage({id: '', name: ''})
        }
        else{
            setAutoCompleteStage({ id: option.key, name: value });
        }
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
        variables: { search: autoCompleteIrd.name},
    });
    const { loading: loadingStages, error: errorStages,data:  dataStages} = useQuery(SEARCH_STAGES_QUERY, {
        variables: { search: autoCompleteStage.name},
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


    return (
        <>
            <StyledVeryBigFormBlock>
                <StyledVeryBigForm layout="vertical">
                    <Row gutter={8}>
                        <Col span={8}>
                                <StyledFormBlock form={form} layout="vertical">
                                    <Row gutter={8} align={"bottom"}>
                                        <Col flex="auto">
                                            <StyledFormItem name="organization_customer_id" label="Тип документации">
                                               <Row>
                                                   <Col flex="auto">
                                                       <Select onSelect={(value)=>handleEditingTemplate(value)}>
                                                           {dataTypeProject && dataTypeProject.typeProjectDocuments  && dataTypeProject.typeProjectDocuments.map(typeDocument => (
                                                               <Option key={typeDocument.id}
                                                                       value={typeDocument.id}>{typeDocument.name}</Option>))}
                                                       </Select>
                                                   </Col>
                                                    <Col>
                                                        <StyledButtonForm onClick={() => setTypeProjectFormViewModalVisible(true)}>Создать тип</StyledButtonForm>
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
                                                    name={[name, 'stage']}
                                                >
                                                    <AutoComplete
                                                        style={{ maxWidth: 249 , minWidth: 249}}
                                                        dropdownMatchSelectWidth={false}
                                                        filterOption = {false}
                                                        options={dataStages &&  dataStages.stagesTable && dataStages.stagesTable.stages.map(stage => ({
                                                            key: stage.id,
                                                            value: stage.id,
                                                            label: stage.name,
                                                        })).concat(dataStages && dataStages.stagesTable && dataStages.stagesTable.stages && dataStages.stagesTable.stages.length === 0 ? [{ label: 'Создать новый этап?', value: '' ,key: 'СОЗДАТЬ' }] : [])}
                                                        onChange={(value, option)=>handleAutoCompleteStage(value, option)} // Передаем введенное значение
                                                        onSelect={(value, option)=>handleAutoCompleteStage(value, option)}
                                                        placeholder="Начните ввод..."
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
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
                                                name={[name, 'ird_id']}
                                            >
                                                <AutoComplete
                                                    style={{ maxWidth: 300 , minWidth: 300}}
                                                    dropdownMatchSelectWidth={false}
                                                    filterOption = {false}
                                                    options={dataIrds &&  dataIrds.irdsTable && dataIrds.irdsTable.irds && dataIrds.irdsTable.irds.map(ird => ({
                                                        key: ird.id,
                                                        value: ird.id,
                                                        label: ird.name,
                                                    })).concat(dataIrds && dataIrds.irdsTable && dataIrds.irdsTable.irds && dataIrds.irdsTable.irds.length === 0 ? [{ label: 'Создать новый ИРД?', value: '' ,key: 'СОЗДАТЬ' }] : [])}
                                                    onChange={(value, option)=>handleAutoCompleteIrd(value, option)} // Передаем введенное значение
                                                    onSelect={(value, option)=>handleAutoCompleteIrd(value, option)}
                                                    placeholder="Начните ввод..."
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
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
                </StyledVeryBigForm>
            </StyledVeryBigFormBlock>

        </>
    );
};

export default TemplateForm;
