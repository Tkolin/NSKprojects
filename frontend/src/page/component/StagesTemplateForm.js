import {Button, Form, InputNumber, Modal, notification, Select, Space} from "antd";
import React, {useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {
    SEARCH_STAGES_QUERY,
    SEARCH_TEMPLATE_OR_TYPE_PROJECT_QUERY,
    SEARCH_TEMPLATE_STAGES_OR_TYPE_PROJECT_QUERY
} from "../../graphql/queriesSearch";
import {UPDATE_STAGES_TEMPLATE_MUTATION} from "../../graphql/mutationsTemplate";
import LoadingSpinner from "./LoadingSpinner";
import {StyledFormRegular} from "../style/FormStyles";
import {LoadingOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {StyledButtonGreen} from "../style/ButtonStyles";
import StageForm from "../form/StageForm";
import TemplateForm from "../form/TemplateForm";

const StagesTemplateForm = ({typeProjectId, triggerMethod, setTriggerMethod  }) => {
    // Состояния
    const [formStage] = Form.useForm();
    const [stageFormViewModalVisible, setStageFormViewModalVisible] = useState(false);
    const [autoCompleteStage, setAutoCompleteStage] = useState('');
    const handleAutoCompleteStageSelect = (value) => {
        if (value == 'CREATE_NEW') {
            setStageFormViewModalVisible(true);
            setAutoCompleteStage('');
        } else {
            setAutoCompleteStage('');
        }
    };
    const handleAutoCompleteStage = (value) => {
        setAutoCompleteStage(value);
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
    const [dataStages, setDataStages] = useState(null);
    const {loading: loadingStages, error: errorStages, refetch: refetchStages} = useQuery(SEARCH_STAGES_QUERY, {
        variables: {search: autoCompleteStage}, onCompleted: (data) => setDataStages(data)
    });
    const {
        loading: loadingTemplate, error: errorTemplate, data: dataTemplate
    } = useQuery(SEARCH_TEMPLATE_STAGES_OR_TYPE_PROJECT_QUERY, {
        variables: {typeProject: typeProjectId},
        fetchPolicy: 'network-only',
        onCompleted: (data) => addingStages(data)
    });

    // Загрузка шаблонов при редактировании
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
            loadTemplate();
        }
    }

    // Мутации для добавления и обновления
    const [updateTemplateStage] = useMutation(UPDATE_STAGES_TEMPLATE_MUTATION, {
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно обновлены ts!');
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных: ts' + error.message);
        }
    });

    // Обработчик отправки формы
    const handleSubmit = () => {
        const stagesData = formStage.getFieldsValue().stageList.map(stage => ({
            stage_id: stage.stage_item, procent: stage.procent_item,
        }));
        // Вызов мутаций для обновления данных
        updateTemplateStage({
            variables: {
                typeProjectId: typeProjectId,
                listStages_id: stagesData && stagesData.map(stage => parseInt(stage.stage_id)),
                listPercent: stagesData && stagesData.map(stage => stage.procent)
            }
        });
    };
    // Триггер
    if (triggerMethod) {
        handleSubmit();
        setTriggerMethod(false); // Reset the trigger
    }

    // Подстановка значений
    const loadTemplate = () => {
        if (dataTemplate) {
            const stages = dataTemplate && dataTemplate.templatesStagesTypeProjects;
            const initialValuesStages = stages && stages.map(data => ({
                stage_item: data.stage.id, procent_item: data.percentage,
            }));
            formStage.setFieldsValue({stageList: initialValuesStages});
        }
    };
    if(loadingTemplate)
        return <LoadingOutlined
            style={{
                fontSize: 24,
            }}
            spin
        />
    return (<>
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
            <Modal
                open={stageFormViewModalVisible}
                onCancel={() => setStageFormViewModalVisible(false)}
                footer={null}
                onClose={handleStageFormView}
            >
                <StageForm/>
            </Modal></>)
};
export default StagesTemplateForm;