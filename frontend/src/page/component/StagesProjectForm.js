import {StyledFormBig} from "../style/FormStyles";
import {Button, Form,  InputNumber, Modal, notification, Select, Space} from "antd";
import {LoadingOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import React, { useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {
    SEARCH_STAGES_QUERY,

    SEARCH_TEMPLATE_STAGES_OR_TYPE_PROJECT_QUERY
} from "../../graphql/queriesSearch";
import {DatePicker} from "antd/lib";
import {UPDATE_STAGES_TO_PROJECT_MUTATION} from "../../graphql/mutationsProject";
import {StyledButtonGreen} from "../style/ButtonStyles";
import TasksToProjectStageForm from "./TasksToProjectStageForm";

const {RangePicker} = DatePicker;
const StagesProjectForm = ({ typeProjectId, projectId, triggerMethod,
                               setTriggerMethod, price ,dateStart, dateEnd }) => {
    // Триггер
    if (triggerMethod) {
        handleSubmit();
        setTriggerMethod(false); // Reset the trigger
    }

    // Состояния
    const [formStage] = Form.useForm();
    const [autoCompleteStage, setAutoCompleteStage] = useState('');
    const [stageFormViewModalVisible, setStageFormViewModalVisible] = useState(false);
    const [viewListProjectTasksStageModalVisible, setViewListProjectTasksStageModalVisible] = useState(false);


    const handleViewListProjectTasksStage = () => {
        setViewListProjectTasksStageModalVisible(false);
    };
    const handleAutoCompleteStageSelect = (value) => {
        if (value == 'CREATE_NEW') {
            setStageFormViewModalVisible(true);
            setAutoCompleteStage('');
        } else {
            setAutoCompleteStage('');
        }
    };
    const handleDateStageRebuild = () => {
        const stageList = formStage.getFieldValue('stageList');

        if (Array.isArray(stageList)) {
            const updatedStageList = stageList.map((stage, index) => {
                if (index === 0) {
                    return {
                        ...stage,
                        date_range: [dateStart, stage.date_range ? stage.date_range[1] : null],
                    };
                } else if (index === stageList.length - 1) {
                    return {
                        ...stage,
                        date_range: [stage.date_range ? stage.date_range[0] : null, dateEnd],
                    };
                } else {
                    const prevStageEndDate = stageList[index - 1].date_range ? stageList[index - 1].date_range[1] : null;
                    return {
                        ...stage,
                        date_range: [prevStageEndDate, stage.date_range ? stage.date_range[1] : null],
                    };
                }
            });

            formStage.setFieldsValue({
                stageList: updatedStageList,
            });
        }
    };


    const handleAutoCompleteStage = (value) => {
        setAutoCompleteStage(value);
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
        onCompleted: (data) => addingStages(data),
    });

    const addingStages = (value) => {
        if (dataStages && value) {
            console.log('addingStages');
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
    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message, placement,
        });
    };

    // Подгрузка формы
    const loadTemplate = () => {
        if (dataTemplate) {
            const stages = dataTemplate && dataTemplate.templatesStagesTypeProjects;
            const initialValuesStages = stages && stages.map(data => ({
                stage_item: data.stage.id,
                percent_item: data.percentage,
            }));
            formStage.setFieldsValue({stageList: initialValuesStages});
        }
    };

    // Мутации для добавления и обновления
    const [updateStagesToProject] = useMutation(UPDATE_STAGES_TO_PROJECT_MUTATION, {
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно обновлены!');
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных: ' + error.message);
        }
    });

    const handleSubmit = () => {
        const stagesData = formStage.getFieldsValue().stageList.map(stage => ({
            stage_id: stage.stage_item, dateStart: stage.data_range.date_start_item, dateEnd: stage.data_range.date_end_item, percent: stage.percent_item,
        }));

        // Вызов мутаций для обновления данных
        updateStagesToProject({
            variables: {
                typeProjectId: typeProjectId,
                listStages_id: stagesData && stagesData.map(stage => parseInt(stage.stage_id)),
                listPercent: stagesData && stagesData.map(stage => stage.procent)
            }
        });
    }

    if(loadingTemplate)
       return <LoadingOutlined
           style={{
               fontSize: 24,
           }}
           spin
       />

    return (
            <StyledFormBig  form={formStage} name="dynamic_form_nest_item" autoComplete="off">
                <Space.Compact block>
                    <Form.Item label="Суммарный срок реализации">
                        <RangePicker value={[dateStart, dateEnd]}  suffix={"₽"}/>
                    </Form.Item>
                    <Button onClick={handleDateStageRebuild}>Уровнять</Button>
                </Space.Compact>
                <Space.Compact block>
                <StyledButtonGreen type={"dashed"} icon={<PlusOutlined/>} style={{width: '50%'}}
                                   onClick={() => setViewListProjectTasksStageModalVisible(true)}>Распределить задачи по этапам</StyledButtonGreen>
                </Space.Compact>
                <Form.List name="stageList">
                    {(fields, {add, remove}) => (<>
                        {fields.map(({key, name, ...restField}) => (<Space
                            key={key}
                            style={{
                                display: 'flex',
                                marginBottom: 2,
                                marginTop: 2
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
                                        <Select.Option value={stage.id}>{stage.name}</Select.Option>))}
                                    {dataStages && dataStages.stagesTable && dataStages.stagesTable.stages && dataStages.stagesTable.stages.length === 0 && (
                                        <Select.Option value="CREATE_NEW">Создать новый
                                            этап?</Select.Option>)}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                {...restField}
                                style={{marginBottom: 0, display: 'flex'}}
                                name={[name, 'date_range']}
                                rules={[{
                                    required: true, message: 'Missing last name',
                                },]}
                            >
                                <RangePicker
                                    minDate={dateStart}
                                    maxDate={dateEnd}
                                    onChange={handleDateStageRebuild}
                                    id={{
                                        start: 'date_start_item',
                                        end: 'date_end_item',
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                {...restField}
                                style={{marginBottom: 0, display: 'flex'}}
                                name={[name, 'percent_item']}
                                rules={[{
                                    required: true, message: 'Missing last name',
                                },]}
                            >
                                <InputNumber/>
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
                {/* распределение задач */}
                <Modal
                    width={1200}
                    open={viewListProjectTasksStageModalVisible}
                    onCancel={() => setViewListProjectTasksStageModalVisible(false)}
                    footer={null}
                    onClose={handleViewListProjectTasksStage}>
                    <TasksToProjectStageForm />
                </Modal>
            </StyledFormBig>
    );
}
export default StagesProjectForm;