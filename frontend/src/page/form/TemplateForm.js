import React, {useEffect, useState} from 'react';
import {
    Form, Button, Select, InputNumber, Col, Row, notification, Modal, Space
} from 'antd';
import {useMutation, useQuery} from '@apollo/client';
import {TYPES_PROJECTS_QUERY} from '../../graphql/queries';
import {UPDATE_IRDS_TEMPLATE_MUTATION, UPDATE_STAGES_TEMPLATE_MUTATION} from '../../graphql/mutationsTemplate';
import {
    StyledFormBig, StyledFormItem, StyledFormLarge, StyledFormRegular
} from '../style/FormStyles';
import {Loading3QuartersOutlined, MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {
    SEARCH_IRDS_QUERY, SEARCH_STAGES_QUERY, SEARCH_TEMPLATE_OR_TYPE_PROJECT_QUERY
} from "../../graphql/queriesSearch";
import IrdForm from "./IrdForm";
import StageForm from "./StageForm";
import TypeProjectForm from "./TypeProjectForm";
import LoadingSpinner from "../component/LoadingSpinner";
import {StyledBlockBig, StyledBlockLarge, StyledBlockRegular} from "../style/BlockStyles";
import {StyledButtonForm, StyledButtonGreen} from "../style/ButtonStyles";

const {Option} = Select;

const TemplateForm = ({project, onClose}) => {

    // Состояния
    const [form] = Form.useForm();
    const [formIRD] = Form.useForm();
    const [formStage] = Form.useForm();

    const [typeProjectFormViewModalVisible, setTypeProjectFormViewModalVisible] = useState(false);
    const [irdFormViewModalVisible, setIrdFormViewModalVisible] = useState(false);
    const [stageFormViewModalVisible, setStageFormViewModalVisible] = useState(false);
    const [confirmTypeChangeModalVisible, setConfirmTypeChangeModalVisible] = useState(false);

    const [editingTemplate, setEditingTemplate] = useState(null);

    const [autoCompleteIrd, setAutoCompleteIrd] = useState('');
    const [autoCompleteStage, setAutoCompleteStage] = useState('');

    const [selectedTypeProject, setSelectedTypeProject] = useState(null);
    const handleAutoCompleteIrdSelect = (value) => {
        if (value == 'CREATE_NEW') {
            setIrdFormViewModalVisible(true);
            setAutoCompleteIrd('');
        } else {
            setAutoCompleteIrd('');
        }
    };
    const handleAutoCompleteStageSelect = (value) => {
        if (value == 'CREATE_NEW') {
            setIrdFormViewModalVisible(true);
            setAutoCompleteIrd('');
        } else {
            setAutoCompleteIrd('');
        }
    };
    const handleAutoCompleteIrd = (value) => {
        setAutoCompleteIrd(value)
    };
    const handleAutoCompleteStage = (value) => {
        setAutoCompleteStage(value);
    };
    const handleTypeProjectFormView = () => {
        setTypeProjectFormViewModalVisible(false);
    };
    const handleIrdFormView = () => {
        setIrdFormViewModalVisible(false);
    };
    const handleStageFormView = () => {
        setStageFormViewModalVisible(false);
    };
    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message, placement,
        });
    };

    // Получение данных для выпадающих списков
    const [dataIrds, setDataIrds] = useState(null);
    const [dataStages, setDataStages] = useState(null);

    const {
        loading: loadingTypeProject, error: errorTypeProject, data: dataTypeProject
    } = useQuery(TYPES_PROJECTS_QUERY);
    const {
        loading: loadingTemplate, error: errorTemplate, data: dataTemplate
    } = useQuery(SEARCH_TEMPLATE_OR_TYPE_PROJECT_QUERY, {
        variables: {typeProject: editingTemplate},
        fetchPolicy: 'network-only',
        onCompleted: (data) => addIrdsAndStages(data)
    });
    const {loading: loadingIrds, error: errorIrds, refetch: refetchIrds} = useQuery(SEARCH_IRDS_QUERY, {
        variables: {search: autoCompleteIrd}, onCompleted: (data) => setDataIrds(data)
    });
    const {loading: loadingStages, error: errorStages, refetch: refetchStages} = useQuery(SEARCH_STAGES_QUERY, {
        variables: {search: autoCompleteStage}, onCompleted: (data) => setDataStages(data)
    });


    // Переключение типов документации
    const handleEditingTemplate = (value) => {
        setSelectedTypeProject(value);
        console.log('нажатие SelectedTypeProject: ' + value);
        showConfirmTypeChangeModal();
    };

    const showConfirmTypeChangeModal = () => {
        console.log('открытие selectedTypeProject: ' + selectedTypeProject);
        console.log('открытие editingTemplate pre: ' + editingTemplate);
        setConfirmTypeChangeModalVisible(true);
    };

    const handleConfirmTypeChange = (confirm) => {
        if (confirm) {
            console.log('принятие да selectedTypeProject: ' + selectedTypeProject);
            console.log('принятие да editingTemplate pre: ' + editingTemplate);
            setEditingTemplate(selectedTypeProject);
            console.log('принятие да editingTemplate post: ' + editingTemplate);
        }
        setSelectedTypeProject(null);
        console.log('принятие нет SelectedTypeProject null: ' + selectedTypeProject);
        setConfirmTypeChangeModalVisible(false);
    };


    // Загрузка шаблонов при редактировании
    const addIrdsAndStages = (value) => {
        addingStages(value);
        addingIrds(value);
        loadTemplate();
    }

    const addingStages = (value) => {
        if (dataStages && value) {
            const newStages = value.templatesStagesTypeProjects.map(a => ({
                id: a.stage ? a.stage.id : null, name: a.stage ? a.stage.name : null,
            }));

            refetchStages({search: autoCompleteStage}).then(({data}) => {
                const existingStages = dataStages.stagesTable ? dataStages.stagesTable.stages : [];
                const updatedStages = [...existingStages, ...newStages];
                setDataStages({
                    ...dataStages, stagesTable: {
                        ...dataStages.stagesTable, stages: updatedStages,
                    },
                });
            });
        }
    }


    const addingIrds = (value) => {
        if (dataIrds && value) {
            const newIrds = value.templatesIrdsTypeProjects.map(a => ({
                id: a.ird ? a.ird.id : null, name: a.ird ? a.ird.name : null,
            }));

            refetchIrds({search: autoCompleteIrd}).then(({data}) => {
                const existingIrds = dataIrds.irdsTable ? dataIrds.irdsTable.irds : [];
                const updatedIrds = [...existingIrds, ...newIrds];
                setDataIrds({
                    ...dataIrds, irdsTable: {
                        ...dataIrds.irdsTable, irds: updatedIrds,
                    },
                });
            });
        }
    }
    useEffect(() => {
        console.log(editingTemplate);
    }, [editingTemplate]);


    // Мутации для добавления и обновления
    const [updateTemplateStage] = useMutation(UPDATE_STAGES_TEMPLATE_MUTATION, {
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно обновлены ts!');
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных: ts' + error.message);
        }
    });
    const [updateTemplateIrds] = useMutation(UPDATE_IRDS_TEMPLATE_MUTATION, {
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно обновлены! ti');
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных: ti' + error.message);
        }
    });

    // Обработчик отправки формы
    const handleSubmit = () => {
        const stagesData = formStage.getFieldsValue().stageList.map(stage => ({
            stage_id: stage.stage_item, procent: stage.procent_item,
        }));

        const irdsData = formIRD.getFieldsValue().irdList.map(ird => ({
            ird_id: ird.ird_item, stage_number: ird.stageNumber_item, app_number: ird.appNumber_item,
        }));
        // Вызов мутаций для обновления данных
        updateTemplateStage({
            variables: {
                typeProjectId: editingTemplate,
                listStages_id: stagesData && stagesData.map(stage => parseInt(stage.stage_id)),
                listPercent: stagesData && stagesData.map(stage => stage.procent)
            }
        });
        updateTemplateIrds({
            variables: {
                typeProjectId: editingTemplate,
                listIrds_id: irdsData.map(ird => parseInt(ird.ird_id)),
                listStageNumber: irdsData.map(ird => ird.stage_number),
                listAppNumber: irdsData.map(ird => ird.app_number)
            }
        });
    };


    // Подстановка значений
    const loadTemplate = () => {
        if (dataTemplate) {
            const irds = dataTemplate && dataTemplate.templatesIrdsTypeProjects;

            const initialValuesIrds = irds && irds.map(data => ({
                ird_item: data.ird.id, stageNumber_item: data.stage_number, appNumber_item: data.application_to_project,
            }));

            formIRD.setFieldsValue({irdList: initialValuesIrds});

            const stages = dataTemplate && dataTemplate.templatesStagesTypeProjects;

            const initialValuesStages = stages && stages.map(data => ({
                stage_item: data.stage.id, procent_item: data.percentage,
            }));

            formStage.setFieldsValue({stageList: initialValuesStages});
        }
    };

    if (loadingTemplate && loadingTypeProject) return <LoadingSpinner/>

    return (<StyledBlockLarge>
        <Row gutter={8}>
            <Col span={8}>
                <StyledBlockRegular label={'Тип проекта'}>
                    <StyledFormRegular form={form} layout="vertical">
                        <StyledFormItem name="type_project_id" label="Тип документации">
                            <Space.Compact block>
                                <Select
                                    popupMatchSelectWidth={false}
                                    value={editingTemplate}
                                    onSelect={handleEditingTemplate}>
                                    {dataTypeProject && dataTypeProject.typeProjectsTable && dataTypeProject.typeProjectsTable.typeProjects.map(typeDocument => (
                                        <Option key={typeDocument.id}
                                                value={typeDocument.id}>{typeDocument.name}</Option>))}
                                </Select>
                                <StyledButtonGreen type={"dashed"} icon={<PlusOutlined/>}
                                                   onClick={() => setTypeProjectFormViewModalVisible(true)}/>
                            </Space.Compact>
                        </StyledFormItem>
                        <div style={{textAlign: 'center'}}>
                            <StyledButtonForm type="primary" onClick={() => handleSubmit()}>Сохранить
                                настройки</StyledButtonForm>
                        </div>
                    </StyledFormRegular>
                </StyledBlockRegular>
                <StyledBlockRegular label={'Этапы'}>
                    <StyledFormRegular form={formStage} layout="vertical">

                        <Form.List name="stageList">
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
                                        style={{marginBottom: 0, display: 'flex'}}
                                        name={[name, 'stage_item']}
                                    >
                                        <Select
                                            style={{maxWidth: 260, minWidth: 260}}
                                            popupMatchSelectWidth={false}
                                            filterOption={false}
                                            onSearch={(value) => handleAutoCompleteStage(value)} // Передаем введенное значение
                                            onSelect={(value) => handleAutoCompleteStageSelect(value)}
                                            placeholder="Начните ввод..."
                                            allowClear
                                            showSearch
                                        >
                                            {dataStages && dataStages.stagesTable && dataStages.stagesTable.stages.map(stage => (
                                                <Select.Option key={stage.id} value={stage.id}>{stage.name}</Select.Option>))}
                                            {dataStages && dataStages.stagesTable && dataStages.stagesTable.stages && dataStages.stagesTable.stages.length === 0 && (
                                                <Select.Option value="CREATE_NEW">Создать новый
                                                    этап?</Select.Option>)}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        style={{marginBottom: 0, display: 'flex'}}
                                        name={[name, 'procent_item']}>
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
                                        Добавить элемент
                                    </Button>
                                </Form.Item>
                            </>)}
                        </Form.List>
                        <div style={{textAlign: 'center'}}>
                            <StyledButtonGreen type={'dashed'}
                                               onClick={() => setStageFormViewModalVisible(true)}>
                                Создать этап
                            </StyledButtonGreen>

                        </div>
                    </StyledFormRegular>
                </StyledBlockRegular>
            </Col>
            <Col span={16}>
                <StyledBlockBig label={'ИРД'}>
                    <StyledFormBig
                        name="dynamic_form_nest_itemы"
                        style={{maxWidth: 600}}
                        form={formIRD}
                    >

                        <Form.List name="irdList">
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
                                        name={[name, 'ird_item']}
                                    >
                                        <Select
                                            style={{maxWidth: 570, minWidth: 570, marginBottom: 0}}
                                            popupMatchSelectWidth={false}
                                            filterOption={false}
                                            placeholder="Начните ввод..."
                                            onSearch={(value) => handleAutoCompleteIrd(value)}
                                            onSelect={(value) => handleAutoCompleteIrdSelect(value)}
                                            allowClear
                                            showSearch
                                            loading={loadingIrds}
                                        >
                                            {dataIrds && dataIrds.irdsTable && dataIrds.irdsTable.irds && dataIrds.irdsTable.irds.map(ird => (
                                                <Select.Option key={ird.id}
                                                               value={ird.id}>{ird.name}</Select.Option>))}
                                            {dataIrds && dataIrds.irdsTable && dataIrds.irdsTable.irds && dataIrds.irdsTable.irds.length === 0 && (
                                                <Select.Option value="CREATE_NEW">Создать новый
                                                    ИРД?</Select.Option>)}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        style={{
                                            display: 'flex', marginBottom: 0, marginTop: 0
                                        }}
                                        name={[name, 'stageNumber_item']}
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
                                        name={[name, 'appNumber_item']}
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
                        <div style={{textAlign: 'center'}}>
                            <StyledButtonGreen
                                type={'dashed'}
                                onClick={() => setIrdFormViewModalVisible(true)}>Создать ИРД</StyledButtonGreen></div>

                    </StyledFormBig>
                </StyledBlockBig>
            </Col>
        </Row>
        <Modal
            open={stageFormViewModalVisible}
            onCancel={() => setStageFormViewModalVisible(false)}
            footer={null}
            onClose={handleStageFormView}
        >

            <StageForm/>

        </Modal>
        {/* ИРД */}
        <Modal
            open={irdFormViewModalVisible}
            onCancel={() => setIrdFormViewModalVisible(false)}
            footer={null}
            onClose={handleIrdFormView}
        >
            <IrdForm/>

        </Modal>
        {/*  */}
        {/* ТИП ДОКУМЕНТА */}
        <Modal
            open={typeProjectFormViewModalVisible}
            onCancel={() => setTypeProjectFormViewModalVisible(false)}
            footer={null}
            onClose={handleTypeProjectFormView}
        >

            <TypeProjectForm/>

        </Modal>
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
    </StyledBlockLarge>);
};

export default TemplateForm;
