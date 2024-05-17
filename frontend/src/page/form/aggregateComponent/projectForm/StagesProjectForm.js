import React, {useEffect, useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {Button, Col, Divider, Form, Input, InputNumber, Modal, notification, Row, Select, Space, Tooltip} from "antd";
import {
    CaretDownOutlined,
    CaretUpOutlined,
    CloudUploadOutlined,
    MinusCircleOutlined,
    PlusOutlined, SaveOutlined
} from "@ant-design/icons";
import moment from "moment";

import {DatePicker} from "antd/lib";
import {UPDATE_PROJECT_MUTATION, UPDATE_STAGES_TO_PROJECT_MUTATION} from "../../../../graphql/mutationsProject";
import {PROJECTS_QUERY, STAGES_QUERY, TEMPLATE_STAGES_TYPE_PROJECTS_QUERY} from "../../../../graphql/queries";
import LoadingSpinnerStyles from "../../../style/LoadingSpinnerStyles";
import {StyledFormLarge} from "../../../style/FormStyles";
import {StyledButtonGreen} from "../../../style/ButtonStyles";
import IrdForm from "../../modelsForms/IrdForm";
import StageForm from "../../modelsForms/StageForm";

const {RangePicker} = DatePicker;


const StagesProjectForm = ({project, setProject, disable, onSubmit}) => {
    // Состояния
    const [formStage] = Form.useForm();
    const [autoCompleteStage, setAutoCompleteStage] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [dataStages, setDataStages] = useState(null);
    const [totalToPercent, setTotalToPercent] = useState(0);
    const [actualityProjectData, setActualityProjectData] = useState(null);
    const [addModalVisible, setAddModalVisible] = useState(false);

    const handleAutoCompleteStageSelect = (value) => {
        setAutoCompleteStage('');
    };
    const handleAutoCompleteStage = (value) => {
        setAutoCompleteStage(value);
    };
    const handleItemPercentages = () => {
        recomputePricesAndPercentages();
    }
    const handleItemDuration = () => {
        recomputeTotalToDuration();
    }
    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message, placement,
        });
    };
    useEffect(() => {
        recomputePricesAndPercentages();
     }, [formStage.getFieldValue('stageList')]);
    const handleDateStageRebuild = () => {
        const stageList = formStage.getFieldValue('stageList');
        if (Array.isArray(stageList)) {
            const updatedStageList = stageList.map((stage, index) => {
                let dateRangeStart = null;
                let dateRangeEnd = null;
                if (index === 0) {
                    dateRangeStart = actualityProjectData?.date_signing ? moment(actualityProjectData.date_signing) : null;
                    dateRangeEnd = stage.date_range && stage.date_range[1] ? moment(stage.date_range[1]) : null;
                } else if (index === stageList.length - 1) {
                    dateRangeStart = stage.date_range && stage.date_range[0] ? moment(stage.date_range[0]) : null;
                    dateRangeEnd = actualityProjectData?.date_end ? moment(actualityProjectData.date_end) : null;
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
    // Получение данных для выпадающих списков
    const {refetch: refetchStages} = useQuery(STAGES_QUERY, {
        variables: {queryOptions: {search: autoCompleteStage, limit: 10, page: 1}},
        onCompleted: (data) => setDataStages(data)
    });
    const {
        loading: loadingTemplate, error: errorTemplate, data: dataTemplate
    } = useQuery(TEMPLATE_STAGES_TYPE_PROJECTS_QUERY, {
        variables: {typeProject: actualityProjectData?.type_project_document?.id},
        fetchPolicy: 'network-only',
        onCompleted: (data) => {
            loadTemplate();
            addingStages(actualityProjectData?.project_stages?.length > 0 ? actualityProjectData.project_stages :
                (data?.templatesStagesTypeProjects?.length > 0 ? data.templatesStagesTypeProjects
                    : null))
        }
        ,
    });
    // Мутации для добавления и обновления
    // const [updateProject] = useMutation(UPDATE_PROJECT_MUTATION, {
    //     onCompleted: (data) => {
    //         console.log("Проект обновлен и данные ЭТАПОВ перезагружены:", data.updateProject);
    //         if (data && data.updateProject) {
    //             setProject(data.updateProject);
    //         }
    //         if (onSubmit) onSubmit();
    //         openNotification('topRight', 'success', 'Данные этапов успешно обновлены !');
    //     },
    //     onError: (error) => {
    //         openNotification('topRight', 'error', 'Ошибка при обновлении данных  об проекте : ' + error.message);
    //     }
    // });
    const { refetch: refetchProject, loading: projectLoading} = useQuery(PROJECTS_QUERY, {
        variables: {queryOptions: {id: project?.id}},
        fetchPolicy: 'network-only',
        onCompleted: (data) => {
            if (data.projects.items[0]) {
                console.log("data.items[0] ", data.projects.items[0]);
                setProject(data.projects.items[0]);
                setActualityProjectData(data.projects.items[0])

            }
            openNotification('topRight', 'success', 'Данные проекта подргужены!');
        },
        onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при загрузки проекта: ' + error.message);

        }
    });
    const handleClose = () => {
        refetchStages();
        setAddModalVisible(false);
    };
    useEffect(() => {
        if (project?.id) {
            refetchProject({queryOptions: {id: Number(project?.id)}});
        }
    }, []);
    useEffect(() => {
        if (actualityProjectData) {
            setTotalPrice(actualityProjectData?.price);
        }
        loadTemplate();
    }, [actualityProjectData]);
    const addingStages = (value) => {
        if (!dataStages || !value) return;
        const newStages = value.map(a => ({
            id: a.stage ? a.stage.id : null, name: a.stage ? a.stage.name : null,
        }));
        const existingStages = dataStages.stages ? dataStages.stages.items : [];
        const updatedStages = [...existingStages, ...newStages];
        setDataStages({
            ...dataStages,
            stages: {
                ...dataStages.stages,
                items: updatedStages,
            },
        });
    };

    // Подгрузка формы
    const loadTemplate = () => {
        const stages = actualityProjectData?.project_stages?.length > 0 ? actualityProjectData.project_stages :
            (dataTemplate?.templatesStagesTypeProjects?.length > 0 ? dataTemplate.templatesStagesTypeProjects : null);

        if (!stages) return; // Ранний выход, если нет этапов

        const sumStagesDuration = stages.reduce((total, {duration}) => total + (duration ?? 0), 0);
        const koef = actualityProjectData.duration / sumStagesDuration;

        const initialValuesStages = stages.map(({
                                                    number,
                                                    stage,
                                                    percentage,
                                                    percent,
                                                    duration,
                                                    dateStart,
                                                    dateEnd,
                                                    price
                                                }) => ({
            index: number,
            stage_item: stage?.id,
            percent_item: percentage ?? percent,
            duration_item: parseInt(duration * koef),
            date_start_item: dateStart ? moment(dateStart) : null,
            date_end_item: dateEnd ? moment(dateEnd) : null,
            totalPrice_item: price ?? null
        }));
        formStage.setFieldsValue({stageList: initialValuesStages});
        setTotalToDuration(actualityProjectData.duration);
    };

    // Мутации для добавления и обновления
    const [updateStagesToProject] = useMutation(UPDATE_STAGES_TO_PROJECT_MUTATION, {
        onCompleted: () => {
            // const dateRangeValue = formStage.getFieldValue('totalRange_item');
            // const projectData = {
            //     id: actualityProjectData?.id ?? null,
            //     number: actualityProjectData?.number ?? null,
            //     name: actualityProjectData?.name ?? null,
            //     organization_customer_id: actualityProjectData?.organization_customer?.id ?? null,
            //     type_project_document_id: actualityProjectData?.type_project_document?.id ?? null,
            //     status_id: actualityProjectData?.status?.id ?? null,
            //     date_completion: actualityProjectData?.date_completion ?? null,
            //     date_create: actualityProjectData?.date_create ?? null,
            //     price: actualityProjectData?.price,
            //     prepayment: actualityProjectData?.prepayment,
            //     duration: totalToDuration,
            //     date_signing: dateRangeValue?.length > 0 ? dateRangeValue[0] : null,
            //     date_end: dateRangeValue?.length > 1 ? dateRangeValue[1] : null,
            // };
            // updateProject({
            //     variables: {
            //         data: projectData
            //     }
            // });
            if (onSubmit) onSubmit();

        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных: ' + error.message);
        }
    });

    // Подсчёт суммы процентов
    const recomputePricesAndPercentages = () => {
        console.log('recomputePricesAndPercentages');

        const stageList = formStage.getFieldValue('stageList');

        if (Array.isArray(stageList)) {
            let countRow = 0;
            const totalProcent = stageList.reduce((acc, item) => {
                const procent = item?.percent_item ?? 0;
                return acc + procent;
            }, 0);
            setTotalToPercent(totalProcent);

            const updatedStageList = stageList.map(row => {
                const percentItem = row?.percent_item ?? 1;
                const priceItem =  Number((totalPrice * percentItem / 100)?.toFixed(2));
                const endPriceItem = priceItem - priceItem/100*project.prepayment;
                return {
                    ...row,
                    price_item: priceItem,
                    end_price_item: endPriceItem,
                };
            });
            formStage.setFieldsValue({
                stageList: updatedStageList,
            });
        }
    };
    const [totalToDuration, setTotalToDuration] = useState(0);
    const recomputeTotalToDuration = () => {
        const stageList = formStage.getFieldValue('stageList');
        if (Array.isArray(stageList)) {
            const totalDuration = stageList.reduce((acc, item) => {
                const duration = parseInt(item?.duration_item) || 0;
                return acc + duration;
            }, 0);
            setTotalToDuration(totalDuration);
        }
    };
    const handleSubmit = () => {
        const faae = formStage.getFieldsValue().stageList;
        console.log("faae ", faae);
        const stageToProject = formStage.getFieldsValue().stageList.map(stage => ({
            projectId: actualityProjectData?.id,
            stage_id: stage?.stage_item,
            stageNumber: stage?.index - 1,
            dateStart: stage?.data_range?.date_start_item,
            duration: stage?.duration_item,
            dateEnd: stage?.data_range?.date_end_item,
            percent: stage?.percent_item ?? 1,
            price: stage?.price_item,
            price_to_paid: stage?.end_price_item,
        }));
        updateStagesToProject({
            variables: {
                data: stageToProject
            }
        });
    }
    const saveTemplate = () => {
        console.log("saveTemplate");
    }
    const moveItem = (array, fromIndex, toIndex) => {
        const newArray = [...array];
        const item = newArray[fromIndex];
        newArray.splice(fromIndex, 1);
        newArray.splice(toIndex, 0, item);
        return newArray;
    };
    if (loadingTemplate || projectLoading)
        return <LoadingSpinnerStyles/>

    return (
        <StyledFormLarge form={formStage}
                         disabled={disable}
                         name="dynamic_form_nest_item"
                         autoComplete="off"
        >
            <Row gutter={3} style={{marginBottom: 4}}>
                <Col span={0.5} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

                </Col>
                <Col span={1} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Divider style={{margin: 0}}>№</Divider>
                </Col>
                <Col span={10} style={{display: 'flex', alignItems: 'center'}}>
                    <Divider style={{margin: 0}}>Этапы</Divider>
                </Col>
                <Col span={7} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Divider style={{margin: 0}}>Продолжительность</Divider>
                </Col>
                <Col span={3} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Divider style={{margin: 0}}>
                        Сумма к
                        оплате за этап
                    </Divider>
                </Col>
                <Col span={2} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Divider style={{margin: 0}}>
                        Стоимость этапа
                    </Divider>
                </Col>
            </Row>
            <Form.List name="stageList">
                {(fields, {add, remove}) => (<>
                    {fields.map(({key, name, ...restField}, index) => (
                        <Row key={key} gutter={2} style={{marginBottom: 8}}>
                            <Col span={0.5} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                {/* Стрелка вверх для перемещения строки вверх */}
                                {index > 0 && (
                                    <Tooltip title="Переместить вверх">
                                        <CaretUpOutlined
                                            onClick={() => {
                                                const items = formStage.getFieldValue('stageList');
                                                const newItems = moveItem(items, index, index - 1);
                                                formStage.setFieldsValue({stageList: newItems});
                                            }}
                                        />
                                    </Tooltip>
                                )}
                                {/* Стрелка вниз для перемещения строки вниз */}
                                {index < fields.length - 1 && (
                                    <Tooltip title="Переместить вниз">
                                        <CaretDownOutlined
                                            onClick={() => {
                                                const items = formStage.getFieldValue('stageList');
                                                const newItems = moveItem(items, index, index + 1);
                                                formStage.setFieldsValue({stageList: newItems});
                                            }}
                                            style={{marginTop: "auto"}} // Размещение внизу
                                        />
                                    </Tooltip>
                                )}
                            </Col>
                            <Col span={1}>
                                <Tooltip title="Номер этапа">
                                    <InputNumber disabled={true} value={index} style={{width: "100%"}}
                                                 min={1}
                                                 max={25}/>
                                </Tooltip>
                            </Col>
                            <Col span={8} style={{width: "100%"}}>
                                <Tooltip title="Наименование этапа">
                                    <Form.Item
                                        {...restField}
                                        style={{width: "100%", marginBottom: 0}}
                                        name={[name, 'stage_item']}
                                    >
                                        <Select
                                            style={{width: "100%"}}

                                            popupMatchSelectWidth={false}
                                            filterOption={false}
                                            onSearch={(value) => handleAutoCompleteStage(value)} // Передаем введенное значение
                                            onSelect={(value) => handleAutoCompleteStageSelect(value)}
                                            placeholder="Начните ввод..."
                                            allowClear
                                            showSearch
                                        >
                                            {dataStages?.stages?.items?.map(stage => (
                                                <Select.Option style={{width: "100%"}}
                                                               value={stage.id}>{stage.name}</Select.Option>))}
                                        </Select>
                                    </Form.Item>
                                </Tooltip>
                            </Col>
                            <Col span={2}>
                                <Tooltip title="Продолжительность этапа (дни)">
                                    <Form.Item
                                        {...restField}
                                        style={{marginBottom: 0, width: "100%"}}
                                        name={[name, 'duration_item']}
                                        rules={[{
                                            required: true,
                                        },]}
                                    >
                                        <InputNumber onChange={handleItemDuration} style={{width: "100%"}}
                                        />
                                    </Form.Item>
                                </Tooltip>
                            </Col>
                            <Col span={3}>
                                <Tooltip title="Сроки этапа">
                                    <Form.Item
                                        {...restField}
                                        style={{marginBottom: 0, width: "100%"}}
                                        name={[name, 'date_range']}
                                        rules={[{
                                            required: true,
                                        },]}
                                    >
                                        <RangePicker
                                            style={{width: "100%"}}
                                            disabled={disable}
                                            minDate={actualityProjectData.date_signing}
                                            maxDate={actualityProjectData.date_end}
                                            onChange={handleDateStageRebuild}
                                            id={{
                                                start: 'date_start_item',
                                                end: 'date_end_item',
                                            }}
                                        />
                                    </Form.Item>
                                </Tooltip>
                            </Col>
                            <Col span={3}>
                                <Tooltip title="Процент от общей стоимости">
                                    <Form.Item
                                        {...restField}
                                        style={{marginBottom: 0, width: "100%"}}
                                        name={[name, 'percent_item']}
                                        rules={[{
                                            required: true,
                                        },]}
                                    >
                                        <InputNumber onChange={handleItemPercentages} max={100} min={0} value={0}
                                                     defaultValue={1} suffix={"%"}
                                                     style={{width: "100%"}}
                                        />
                                    </Form.Item>
                                </Tooltip>
                            </Col>
                            <Col span={3}>
                                <Tooltip title="Стоимость этапа">
                                    <Form.Item
                                        {...restField}
                                        style={{marginBottom: 0, width: "100%"}}
                                        name={[name, 'price_item']}
                                        rules={[{
                                            required: true,
                                        },]}>
                                        <InputNumber
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            suffix={"₽"} style={{width: "100%"}}/>
                                    </Form.Item>
                                </Tooltip>
                            </Col>
                            <Col span={3}>
                                <Tooltip title="Сумма к оплате за этап">
                                    <Form.Item
                                        {...restField}
                                        style={{marginBottom: 0, width: "100%"}}
                                        name={[name, 'end_price_item']}
                                        rules={[{
                                            required: true,
                                        },]}>
                                        <InputNumber
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            suffix={"₽"} style={{width: "100%"}}/>
                                    </Form.Item>
                                </Tooltip>
                            </Col>
                            <Col span={0.5} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <MinusCircleOutlined onClick={() => remove(name)}/>
                            </Col>

                        </Row>))}
                    <Space style={{
                        width: "100%",
                        marginBottom: 2,
                        marginTop: 2,
                        alignContent: "end"
                    }}>
                        <Row gutter={3} style={{marginBottom: 4}}>
                            <Col span={0.5} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

                            </Col>
                            <Col span={1} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

                            </Col>
                            <Col span={8} style={{display: 'flex', alignItems: 'center'}}>
                                <Divider style={{margin: 0}}>Итого: </Divider>

                            </Col>
                            <Col span={9} style={{display: 'flex', alignItems: 'center'}}>
                                <Input value={totalToDuration} disabled
                                       style={{
                                           marginLeft: 20,
                                           width: 90,
                                           background: totalToDuration > actualityProjectData?.duration ? '#EE4848' : totalToDuration < actualityProjectData?.duration ? '#FFD700' : '#7DFF7D'
                                       }}/>
                                <Input value={actualityProjectData?.duration} disableв
                                       style={{width: 90}}/>
                                <Form.Item
                                    style={{marginBottom: 0, display: 'flex'}} name="totalRange_item">
                                    <RangePicker
                                        value={[actualityProjectData?.date_signing ? moment(actualityProjectData.date_signing) : null, actualityProjectData?.date_end ? moment(actualityProjectData.date_end) : null]}
                                        disabled={disable || true}/>
                                </Form.Item>
                            </Col>

                            <Col span={2} style={{display: 'flex', alignItems: 'center'}}>
                                <Input
                                    value={totalToPercent}
                                    suffix={"%"}
                                    style={{
                                        marginBottom: 0, width: "100%",
                                        background: totalToPercent > 100 ? '#EE4848' : totalToPercent < 100 ? '#FFD700' : '#7DFF7D'
                                    }}/>
                            </Col>
                            <Col span={3} style={{display: 'flex', alignItems: 'center'}}>
                                <Input disabled={true}
                                       value={actualityProjectData?.price}
                                       defaultValue={actualityProjectData?.price}
                                       suffix={"₽"} style={{width: "100%"}}/>
                            </Col>
                        </Row>


                    </Space>
                    <Form.Item block style={{width: "100%"}}>
                        <Space.Compact block style={{width: "100%"}}>
                            <Button type="dashed" onClick={() => add()} block
                                    icon={<PlusOutlined/>}>
                                Добавить элемент
                            </Button>
                            <StyledButtonGreen   icon={<SaveOutlined />} onClick={() => setAddModalVisible(true)}>Создать этап</StyledButtonGreen>
                            <Button type={"primary"} onClick={() => saveTemplate()}   icon={<CloudUploadOutlined/>}>Сохранить
                                в шаблоне</Button>
                        </Space.Compact>

                    </Form.Item>
                </>)}
            </Form.List>
            {/* распределение задач */}
            <div style={{textAlign: 'center'}}>
                <Space>
                    <StyledButtonGreen style={{marginBottom: 0}} type="dashed" onClick={handleSubmit}>
                        Сохранить этапы
                    </StyledButtonGreen>
                </Space>
            </div>
            <Modal
                open={addModalVisible}
                onCancel={() => setAddModalVisible(false)}
                footer={null}
                onClose={handleClose}
            >
                <StageForm onClose={handleClose}/>
            </Modal>
        </StyledFormLarge>
    );
}
export default StagesProjectForm;
