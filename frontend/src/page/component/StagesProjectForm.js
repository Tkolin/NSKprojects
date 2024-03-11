import {StyledFormBig, StyledFormItem} from "../style/FormStyles";
import {Button, Form, Input, InputNumber, notification, Select, Space, Tooltip} from "antd";
import {MinusCircleOutlined, PlusOutlined, RetweetOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {useMutation, useQuery} from "@apollo/client";

import {DatePicker} from "antd/lib";
import {UPDATE_PROJECT_MUTATION, UPDATE_STAGES_TO_PROJECT_MUTATION} from "../../graphql/mutationsProject";

import LoadingSpinner from "./LoadingSpinner";
import {STAGES_QUERY, TEMPLATE_STAGES_TYPE_PROJECTS_QUERY} from "../../graphql/queries";
import {StyledButtonGreen} from "../style/ButtonStyles";
import moment from "moment";

const {RangePicker} = DatePicker;
const StagesProjectForm = ({project, disable, onSubmit}) => {
    // Состояния
    const [formStage] = Form.useForm();
    const [autoCompleteStage, setAutoCompleteStage] = useState('');
    const [stageFormViewModalVisible, setStageFormViewModalVisible] = useState(false);
const [totalPrice, setTotalPrice] = useState(0);
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
                let dateRangeStart = null;
                let dateRangeEnd = null;

                if (index === 0) {
                    dateRangeStart = project?.date_signing ? moment(project.date_signing) : null;
                    dateRangeEnd = stage.date_range && stage.date_range[1] ? moment(stage.date_range[1]) : null;
                } else if (index === stageList.length - 1) {
                    dateRangeStart = stage.date_range && stage.date_range[0] ? moment(stage.date_range[0]) : null;
                    dateRangeEnd = project?.date_end ? moment(project.date_end) : null;
                } else {
                    const prevStageEndDate = stageList[index - 1].date_range && stageList[index - 1].date_range[1];
                    dateRangeStart = prevStageEndDate ? moment(prevStageEndDate) : null;
                    dateRangeEnd = stage.date_range && stage.date_range[1] ? moment(stage.date_range[1]) : null;
                }

                return {
                    ...stage,
                    date_range: [dateRangeStart, dateRangeEnd],
                };
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
    const {loading: loadingStages, error: errorStages, refetch: refetchStages} = useQuery(STAGES_QUERY, {
        variables: {queryOptions: {search: autoCompleteStage, limit: 10, page: 1}},
        onCompleted: (data) => setDataStages(data)
    });
    const {
        loading: loadingTemplate, error: errorTemplate, data: dataTemplate
    } = useQuery(TEMPLATE_STAGES_TYPE_PROJECTS_QUERY, {
        variables: {typeProject: project?.type_project_document?.id},
        fetchPolicy: 'network-only',
        onCompleted: (data) => addingStages(data),
    });
    // Мутации для добавления и обновления
    const [updateProject] = useMutation(UPDATE_PROJECT_MUTATION, {
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные об проекте успешно обновлены!');
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных  об проекте : ' + error.message);
        }
    });

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
    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message, placement,
        });
    };

    // Подгрузка формы
    const loadTemplate = () => {
        if (dataTemplate) {
            const stages = dataTemplate?.templatesStagesTypeProjects;
            const initialValuesStages = stages?.map(data => ({
                stage_item: data.stage.id,
                percent_item: data.percentage,
                duration_item: data.duration,
                date_start_item: data?.dateStart ? moment(data.dateStart )  : null,
                date_end_item: data?.dateEnd ? moment(data.dateEnd) : null
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
        const stageToProject = formStage.getFieldsValue().stageList.map(stage => ({
            projectId: project?.id,
            stage_id: stage?.stage_item,
            stageNumber: stage?.number_item,
            dateStart: stage?.data_range?.date_start_item,
            duration: stage?.duration_item,
            dateEnd: stage?.data_range?.date_end_item,
            percent: stage?.percent_item,
            price: stage?.price_item,
        }));

        // Вызов мутаций для обновления данных
        updateStagesToProject({
            variables: {
                stageToProject: stageToProject
            }
        });

        const dateRangeValue = formStage.getFieldValue('totalRange_item');
        const projectData = {
            id: project?.id,
            number: project?.number,
            name: project?.name,
            organization_customer_id: project?.organization_customer?.id,
            type_project_document_id: project?.type_project_document?.id,
            status_id: project?.status.id,
            date_completion: project?.date_completion,


            price: totalPrice,
            duration: totalToDuration,
            date_signing: dateRangeValue && dateRangeValue.length > 0 ? dateRangeValue[0] : null,
            date_end: dateRangeValue && dateRangeValue.length > 1 ? dateRangeValue[1] : null,
        };

        updateProject({variables: {
                data: projectData
            }})

        if (onSubmit)
            onSubmit();
    }
    // Подсчёт суммы процентов
    const [totalToPercent, setTotalToPercent] = useState(0);
    const recomputePricesAndPercentages = () => {
        const stageList = formStage.getFieldValue('stageList');
        if (Array.isArray(stageList)) {
            const totalProcent = stageList.reduce((acc, item) => {
                const procent = item.percent_item || 0;
                return acc + procent;
            }, 0);
            setTotalToPercent(totalProcent);

            const updatedStageList = stageList.map(row => ({
                ...row,
                price_item: (totalPrice * row.percent_item) / 100,
            }));

            formStage.setFieldsValue({
                stageList: updatedStageList,
            });
        }
    };
    const handleChangeItemPercent = () => {
        recomputePricesAndPercentages();
    };


    const [totalToDuration, setTotalToDuration] = useState(0);
    const recomputeTotalToDuration = () => {
        const stageList = formStage.getFieldValue('stageList');
        if (Array.isArray(stageList)) {
            const totalDuration = stageList.reduce((acc, item) => {
                const duration = item.duration_item || 0;
                return acc + duration;
            }, 0);
            setTotalToDuration(totalDuration);
        }
    };
    const handleChangeItemDuration = () => {
        recomputeTotalToDuration();
    };
    const handleChangePrice = (value) => {
        setTotalPrice(value);
        recomputePricesAndPercentages();
    };

    useEffect(() => {
        recomputeTotalToDuration();
        handleChangeItemPercent();
    }, [formStage.getFieldValue('stageList')]);

    useEffect(() => {
        setTotalPrice(project?.price);
    }, [project]);

    if (loadingTemplate)
        return <LoadingSpinner/>

    return (
        <StyledFormBig form={formStage}
                       disabled={disable}
                       name="dynamic_form_nest_item"
                       autoComplete="off"
        >

            <Space.Compact block>
                <StyledFormItem label="Суммарный срок реализации" name="totalRange_item">
                    <RangePicker value={[project.date_signing ? moment(project.date_signing) : null, project?.date_end ? moment(project.date_end) : null]}
                                 disabled={disable} suffix={"дни"}/>
                </StyledFormItem>
                <Button onClick={handleDateStageRebuild}>Уровнять</Button>
            </Space.Compact>
            <Space.Compact block>
                <StyledFormItem label="Стоимость проекта" name="totalPrice_item">
                    <InputNumber onChange={handleChangePrice} value={totalPrice} defaultValue={project?.price} disabled={disable} suffix={"₽"}/>
                </StyledFormItem>
            </Space.Compact>
            <Space.Compact block>
                <StyledFormItem label="Суммарная продолжительность">
                    <InputNumber value={totalToDuration} disabled={disable} suffix={"дни"}/>
                </StyledFormItem>
            </Space.Compact>
            <Space.Compact block style={{alignItems: 'flex-end'}}>
                <StyledFormItem label="Сумма процентов">
                    <Input
                        value={totalToPercent}
                        suffix={"%"}
                        style={{
                            width: '80px',
                            background: totalToPercent > 100 ? '#EE4848' : totalToPercent < 100 ? '#FFD700' : '#7DFF7D'
                        }}
                    />
                </StyledFormItem>
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
                        <Tooltip title="Номер этапа">

                            <Form.Item
                                {...restField}
                                style={{marginBottom: 0, display: 'flex'}}
                                name={[name, 'number_item']}
                            >
                                <InputNumber style={{width: 65}} prefix={"№"} min={1} max={25}/>
                            </Form.Item>
                        </Tooltip>
                        <Tooltip title="Наименование этапа">
                            <Form.Item
                                {...restField}
                                style={{marginBottom: 0, display: 'flex'}}
                                name={[name, 'stage_item']}
                            >
                                <Select
                                    style={{maxWidth: 360, minWidth: 360}}
                                    popupMatchSelectWidth={false}
                                    filterOption={false}
                                    onSearch={(value) => handleAutoCompleteStage(value)} // Передаем введенное значение
                                    onSelect={(value) => handleAutoCompleteStageSelect(value)}
                                    placeholder="Начните ввод..."
                                    allowClear
                                    showSearch
                                >
                                    {dataStages?.stages?.items?.map(stage => (
                                        <Select.Option value={stage.id}>{stage.name}</Select.Option>))}
                                </Select>
                            </Form.Item>
                        </Tooltip>
                        <Tooltip title="Продолжительность этапа (дни)">
                            <Form.Item
                                {...restField}
                                style={{marginBottom: 0, display: 'flex'}}
                                name={[name, 'duration_item']}
                                rules={[{
                                    required: true,
                                },]}
                            >
                                <InputNumber onChange={handleChangeItemDuration} style={{width: 80}}/>
                            </Form.Item>
                        </Tooltip>
                        <Tooltip title="Сроки этапа">
                            <Form.Item
                                {...restField}
                                style={{marginBottom: 0, display: 'flex'}}
                                name={[name, 'date_range']}
                                rules={[{
                                    required: true,
                                },]}
                            >
                                <RangePicker
                                    disabled={disable}
                                    minDate={project.date_signing}
                                    maxDate={project.date_end}
                                    onChange={handleDateStageRebuild}
                                    id={{
                                        start: 'date_start_item',
                                        end: 'date_end_item',
                                    }}
                                />
                            </Form.Item>
                        </Tooltip>
                        <Tooltip title="Процент от общей стоимости">
                            <Form.Item
                                {...restField}

                                style={{marginBottom: 0, display: 'flex'}}
                                name={[name, 'percent_item']}
                                rules={[{
                                    required: true,
                                },]}
                            >
                                <InputNumber onChange={handleChangeItemPercent} max={100} min={0} suffix={"%"}/>
                            </Form.Item>
                        </Tooltip>
                        <Tooltip title="Стоимость этапа">
                            <Form.Item
                                {...restField}

                                style={{marginBottom: 0, display: 'flex'}}
                                name={[name, 'price_item']}
                                rules={[{
                                    required: true,
                                },]}>
                                <InputNumber style={{width: 200}} suffix={"₽"}/>
                            </Form.Item>
                        </Tooltip>
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
            <div style={{textAlign: 'center'}}>
                <Space>
                    <StyledButtonGreen style={{marginBottom: 0}} type="dashed" onClick={handleSubmit}>
                        Сохранить проект
                    </StyledButtonGreen>
                </Space>
            </div>
        </StyledFormBig>
    );
}
export default StagesProjectForm;