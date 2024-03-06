import {Button, Divider, Form, Input, InputNumber, Modal, notification, Select, Space, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {UPDATE_STAGES_TEMPLATE_MUTATION} from "../../graphql/mutationsTemplate";
import {StyledFormRegular} from "../style/FormStyles";
import {LoadingOutlined, MinusCircleOutlined, PlusOutlined, RetweetOutlined} from "@ant-design/icons";
import {StyledButtonGreen} from "../style/ButtonStyles";
import StageForm from "../form/StageForm";
import {STAGES_QUERY, TEMPLATE_STAGES_TYPE_PROJECTS_QUERY} from "../../graphql/queries";

const StagesTemplateForm = ({typeProjectId, triggerMethod, setTriggerMethod, disabled}) => {
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
    const {loading: loadingStages, error: errorStages, refetch: refetchStages} = useQuery(STAGES_QUERY, {
        variables: {
            queryOptions: { search: autoCompleteStage, limit: 10, page: 1}
        }, onCompleted: (data) => setDataStages(data)
    });
    const {
        loading: loadingTemplate, error: errorTemplate, data: dataTemplate
    } = useQuery(TEMPLATE_STAGES_TYPE_PROJECTS_QUERY, {
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
                const existingStages = dataStages.stages ? dataStages.stages.items : [];
                const updatedStages = [...existingStages, ...newStages];
                setDataStages({
                    ...dataStages, stages: {
                        ...dataStages.stages, stages: updatedStages,
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

    // Подсчёт суммы процентов
    const [totalToPercent, setTotalToPercent] = useState(0);
    const [totalToDuration, setTotalToDuration] = useState(0);
    const handleChangeItemPercent = () => {
        const stageList = formStage.getFieldValue('stageList');
        if (Array.isArray(stageList)) {
            const allProcents = stageList.map(item => item.procent_item);
            const totalProcent = allProcents.reduce((acc, val) => acc + val, 0);
            setTotalToPercent(totalProcent);
        }
    };
    const handleChangeItemDuration = () => {
        const stageList = formStage.getFieldValue('stageList');
        if (Array.isArray(stageList)) {
            const allDuration = stageList.map(item => item.duration_item);
            const totalDuration = allDuration.reduce((acc, val) => acc + val, 0);
            setTotalToDuration(totalDuration);
        }
    };
    const reComputeDurationToPercent = () => {
        const stageList = formStage.getFieldValue('stageList');
        if (Array.isArray(stageList) && totalToDuration > 0) {
            const allPercentages = stageList.map(item => Math.round((item.duration_item / totalToDuration) * 100));
            const totalPercentage = allPercentages.reduce((acc, val) => acc + val, 0);
            const maxPercentageIndex = allPercentages.indexOf(Math.max(...allPercentages));
            const diff = 100 - totalPercentage;

            if (totalPercentage !== 100) {
                const updatedPercentages = [...allPercentages];
                updatedPercentages[maxPercentageIndex] += diff;
                formStage.setFieldsValue({
                    stageList: stageList.map((item, index) => ({ ...item, procent_item: updatedPercentages[index] })),
                });
                setTotalToPercent(updatedPercentages.reduce((acc, val) => acc + val, 0));
            } else {
                formStage.setFieldsValue({
                    stageList: stageList.map((item, index) => ({ ...item, procent_item: allPercentages[index] })),
                });
                setTotalToPercent(totalPercentage);
            }
        }
    };
    useEffect(() => {
        handleChangeItemPercent();
    }, [formStage.getFieldValue('stageList')]);


    if (loadingTemplate)
        return <LoadingOutlined
            style={{
                fontSize: 24,
            }}
            spin
        />
    return (<>
        <StyledFormRegular form={formStage}
                           layout="vertical"
                           disabled={disabled}>
            <Form.List name="stageList">
                {(fields, {add, remove}) => (<>
                    {fields.map(({key, name, ...restField}) => (<Space
                        key={key}
                        style={{
                            display: 'flex', marginBottom: 0, marginTop: 0
                        }}
                        align="baseline"
                    >
                        <Tooltip title="Наименование этапа">
                            <Form.Item
                                {...restField}
                                style={{marginBottom: 0, display: 'flex'}}
                                name={[name, 'stage_item']}
                            >
                                <Select
                                    style={{maxWidth: 200, minWidth: 200}}
                                    popupMatchSelectWidth={false}
                                    allowClear
                                    showSearch
                                    filterOption={false}
                                    onSearch={(value) => handleAutoCompleteStage(value)} // Передаем введенное значение
                                    onSelect={(value) => handleAutoCompleteStageSelect(value)}
                                    placeholder="Начните ввод..."
                                >
                                    {dataStages && dataStages.stages && dataStages.stages.items.map(stage => (
                                        <Select.Option key={stage.id} value={stage.id}>{stage.name}</Select.Option>))}
                                    {dataStages && dataStages.stages && dataStages.stages.items && dataStages.stages.items.length === 0 && (
                                        <Select.Option value="CREATE_NEW">Создать новый
                                            этап?</Select.Option>)}
                                </Select>
                            </Form.Item>
                        </Tooltip>
                        <Tooltip title="Процент от стоимости">
                            <Form.Item
                                {...restField}
                                style={{marginBottom: 0, display: 'flex'}}
                                name={[name, 'procent_item']}>
                                <InputNumber
                                    onChange={handleChangeItemPercent}
                                    size={"middle"}
                                    min={1}
                                    max={100}
                                    style={{
                                        width: 50
                                    }}/>
                            </Form.Item>
                        </Tooltip>
                        <Tooltip title="Продолжительность этапа">
                            <Form.Item
                                {...restField}
                                style={{marginBottom: 0, display: 'flex'}}
                                name={[name, 'duration_item']}>
                                <InputNumber
                                    onChange={handleChangeItemDuration}
                                    size={"middle"}
                                    min={1}
                                    max={325}
                                    style={{
                                        width: 50
                                    }}
                                />
                            </Form.Item>
                        </Tooltip>
                        <MinusCircleOutlined onClick={() => remove(name)}/>
                    </Space>))}
                    <Divider style={{ margin: '20px 0' }} />
                    <Space.Compact block style={{alignItems: 'flex-end'}}>
                    <Form.Item label="Сумма процентов">
                        <Input
                            value={totalToPercent}
                            suffix={"%"}
                            style={{
                                width: '100%',
                                background: totalToPercent > 100 ? '#EE4848' : totalToPercent < 100 ? '#FFD700' : '#7DFF7D'
                            }}
                        />
                    </Form.Item>
                        <Form.Item label="Всего дней">
                            <Input
                                value={totalToDuration}
                                suffix={"%"}
                                style={{
                                    width: '100%',
                                }}
                            />
                        </Form.Item>
                        <Tooltip title="Установить % от кол-ва дней">
                        <Form.Item>
                            <Button type={"dashed"} icon={<RetweetOutlined />} onClick={reComputeDurationToPercent} />
                        </Form.Item>
                        </Tooltip>
                    </Space.Compact>
                    <Form.Item>
                        <Button type="dashed" onClick={() => add()} block
                                icon={<PlusOutlined/>}>
                            Добавить элемент
                        </Button>
                    </Form.Item>
                </>)}
            </Form.List>
            <div style={{textAlign: 'center'}}>
                <StyledButtonGreen type={'dashed'} style={{marginBottom: 0}}
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