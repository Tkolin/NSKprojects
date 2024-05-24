import React, {useEffect, useState} from 'react';
import {Row, Col, Form, InputNumber, Select, Tooltip, DatePicker, Input} from 'antd';
import {CaretUpOutlined, CaretDownOutlined, MinusCircleOutlined} from '@ant-design/icons';
import {StyledFormItemAutoComplete} from "../../../../components/style/SearchAutoCompleteStyles";
import {EmptyFormItem} from "../../../../components/formComponents/EmptyFormItem";
import dayjs from "dayjs";

const {RangePicker} = DatePicker;

const StageItem = ({
                       value,

                        projectPrice,
                        prepayment,


                       onChange,
                       index,
                       form,
                       stagesData,
                       moveItem,
                       removeItem,
                       isFirst,
                       isLast
                   }) => {

    // бновления всех записей в строке
    const [stageAutoComplete, setStageAutoComplete] = useState({options: [], selected: null});
    const [firstLoad, setFirstLoad] = useState(false)

    useEffect(() => {
        if (firstLoad) {
            const stageList = form.getFieldValue("stageList");
            const updatedStageList = stageList.map((item, idx) => {
                if (idx === index) {
                    return {
                        ...item,
                        stage_id: stageAutoComplete?.selected
                    };
                }
                return item;
            });
            form.setFieldValue("stageList", updatedStageList);
            onChange();
        }
    }, [stageAutoComplete?.selected]);
    useEffect(() => {
        setStageAutoComplete({...stageAutoComplete, selected: form.getFieldValue("stageList")?.[index]?.stage_id})
        handlePriceChange(form.getFieldValue(["stageList",index,"percent"]));
        setFirstLoad(true);
    }, []);
    // Для хранения выбора элемента


    // Обработчик изменения даты
    const handleDateRangeChange = (dates) => {
        if (dates && dates[0] && dates[1]) {
            form.setFieldValue(["stageList", index, "duration"],
                dayjs(dates[1]).diff(dayjs(dates[0]), 'day') + 1); // обновляем поле продолжительности
            onChange(); // вызываем onChange для обновления данных
        }
    };
    // Обработчик цен
    const handlePriceChange = (percent) => {
        if (percent) {
            const price = projectPrice * (percent / 100);
            form.setFieldValue(["stageList", index, "price"],
                price); // обновляем поле продолжительности
            form.setFieldValue(["stageList", index, "price_to_paid"],
                price * ( prepayment / 100)); // обновляем поле продолжительности
            onChange(); // вызываем onChange для обновления данных
        }
    };
    return (
        <Row key={index} gutter={2} style={{marginBottom: 0}}>
            <Col span={0.5} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                {/* Стрелка вверх для перемещения строки вверх */}
                {!isFirst && (
                    <Tooltip title="Переместить вверх">
                        <CaretUpOutlined
                            onClick={() => {
                                moveItem && moveItem(index, index - 1)
                                //
                                // const items = formStage.getFieldValue('stageList');
                                // const newItems = moveItem(items, index, index - 1);
                                // formStage.setFieldsValue({stageList: newItems});
                            }}
                            style={{marginTop: 0}}
                        />
                    </Tooltip>
                )}
                {/* Стрелка вниз для перемещения строки вниз */}
                {!isLast && (
                    <Tooltip title="Переместить вниз">
                        <CaretDownOutlined
                            onClick={() => {
                                moveItem && moveItem(index, index + 1)
                                // const items = formStage.getFieldValue('stageList');
                                // const newItems = moveItem(items, index, index + 1);
                                // formStage.setFieldsValue({stageList: newItems});
                            }}
                            style={{marginTop: 0}} // Размещение внизу
                        />
                    </Tooltip>
                )}
            </Col>
            <Col span={1}>
                     <Tooltip title="Номер этапа">
                        <InputNumber disabled={true}
                                     style={{width: "100%"}}
                               value={index + 1}
                                      min={1}
                                     max={25}/>
                    </Tooltip>
             </Col>
            <Col span={8} style={{width: "100%"}}>
                <Tooltip title="Наименование этапа">

                    <StyledFormItemAutoComplete
                        style={{width: "100%"}}
                        formName={[index, 'stage_name']}
                        placeholder={"Выбор этапа..."}

                        value={value.stage_name}

                        data={stagesData}
                        stateSearch={stageAutoComplete}
                        setStateSearch={setStageAutoComplete}
                    />
                </Tooltip>
            </Col>
            <EmptyFormItem name={"stage_id"}/>
            <Col span={4}>
                <Tooltip title="Сроки этапа">
                    <Form.Item
                        style={{marginBottom: 0, width: "100%"}}
                        name={[index,'date_range']}
                        rules={[{
                            required: true,
                        },]}
                    >
                        <RangePicker
                            style={{width: "100%"}}
                            onChange={handleDateRangeChange}
                            id={{
                                start: 'date_start',
                                end: 'date_end',
                            }}
                        />
                    </Form.Item>
                </Tooltip>
            </Col>
            <Col span={0}>
                <EmptyFormItem name={"duration"}/>
            </Col>
            <Col span={2}>
                <Tooltip title="Процент от общей стоимости">
                    <Form.Item
                        style={{marginBottom: 0, width: "100%"}}
                        name={[index, 'percent']}
                        rules={[{
                            required: true,
                        },]}
                    >
                        <InputNumber max={100} min={0} value={0}
                                     onChange={handlePriceChange}
                                     defaultValue={1} suffix={"%"}
                                     style={{width: "100%"}}
                        />
                    </Form.Item>
                </Tooltip>
            </Col>
            <Col span={3}>
                <Tooltip title="Стоимость этапа">
                    <Form.Item
                        style={{marginBottom: 0, width: "100%"}}
                        name={[index, 'price']}
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
                        style={{marginBottom: 0, width: "100%"}}
                        name={[index, 'price_to_paid']}
                        rules={[{
                            required: true,
                        },]}>
                        <InputNumber
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            suffix={"₽"} style={{width: "100%"}}/>
                    </Form.Item>
                </Tooltip>
            </Col>
            <Col span={0.1} style={{marginBottom: 0, width: "0%"}}
            >
                <MinusCircleOutlined style={{marginTop: 10, marginLeft: 10}}
                                     onClick={() => removeItem && removeItem(index)}/>
            </Col>

        </Row>
    );
};

export default StageItem;
