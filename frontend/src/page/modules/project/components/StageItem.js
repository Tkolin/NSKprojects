import React, {useEffect, useState} from 'react';
import {Row, Col, Form, InputNumber, Select, Tooltip, DatePicker, Input, Space} from 'antd';
import {CaretUpOutlined, CaretDownOutlined, MinusCircleOutlined, CloseOutlined} from '@ant-design/icons';
import {CustomAutoComplete} from "../../../../components/style/SearchAutoCompleteStyles";
import {EmptyFormItem} from "../../../../components/formComponents/EmptyFormItem";
import dayjs from "dayjs";
import {StyledButtonRed} from "../../../../components/style/ButtonStyles";
import DateRangePickerComponent from "./DateRangePickerComponent";

const {RangePicker} = DatePicker;

const StageItem = ({
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


    useEffect(() => {
        handlePriceChange(form.getFieldValue(["stageList", index, "percent"]));
    }, []);


    // Обработчик изменения даты
    // const handleDateRangeChange = (dates) => {
    //     if (dates && dates[0] && dates[1]) {
    //         form.setFieldValue(["stageList", index, "duration"],
    //             dayjs(dates[1]).diff(dayjs(dates[0]), 'day') + 1); // обновляем поле продолжительности
    //         onChange(); // вызываем onChange для обновления данных
    //     }
    // };
    // Обработчик цен
    const handlePriceChange = (percent) => {
        if (percent) {
            const price = (projectPrice * (percent / 100)).toFixed(2);
            const priceToPaid = (price - price * (prepayment / 100)).toFixed(2);

            form.setFieldValue(["stageList", index, "price"], parseFloat(price)); // обновляем поле продолжительности
            form.setFieldValue(["stageList", index, "price_to_paid"], parseFloat(priceToPaid)); // обновляем поле продолжительности
            onChange(); // вызываем onChange для обновления данных
        }
    };
    return (
        <Row key={index} gutter={0} style={{marginBottom: 0}}>
            <Space.Compact style={{width: "100%"}}>
            <Col span={1} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
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
            <Col span={11} style={{width: "100%"}}>
                <Tooltip title="Наименование этапа">
                    <Form.Item name={[index, 'stage']}>
                        <CustomAutoComplete
                            style={{width: "100%"}}
                             placeholder={"Выбор этапа..."}
                            data={stagesData}
                        />
                    </Form.Item>
                </Tooltip>
            </Col>
            <Col span={5}>
                <Tooltip title="Сроки этапа">
                    <Form.Item
                        style={{marginBottom: 0, width: "100%"}}
                        name={[index, 'date_range']}
                        rules={[{
                            required: true,
                        },]}
                    >
                        <DateRangePickerComponent onChange={() => onChange()}/>


                    </Form.Item>
                </Tooltip>
            </Col>
            <Col span={0}>
                <EmptyFormItem name={"duration"}/>
            </Col>
            <Col span={1}>
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
            <Col span={2}>
                <Tooltip title="Стоимость этапа">
                    <Form.Item
                        style={{marginBottom: 0, width: "100%"}}
                        name={[index, 'price']}
                        rules={[{
                            required: true,
                        },]}>
                        <InputNumber
                            disabled={true}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            suffix={"₽"} style={{width: "100%"}}/>
                    </Form.Item>
                </Tooltip>
            </Col>
            <Col span={2}>
                <Tooltip title="Сумма к оплате за этап">
                    <Form.Item
                        style={{marginBottom: 0, width: "100%"}}
                        name={[index, 'price_to_paid']}
                        rules={[{
                            required: true,
                        },]}>
                        <InputNumber
                            disabled={true}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            suffix={"₽"} style={{width: "100%"}}/>
                    </Form.Item>
                </Tooltip>
            </Col>
            <Col span={1}
            >
                <StyledButtonRed icon={<CloseOutlined/>} onClick={() => removeItem && removeItem(index)}/>
            </Col>
            </Space.Compact>
        </Row>
    );
};

export default StageItem;
