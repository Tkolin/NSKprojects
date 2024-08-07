import React, {useEffect, useState} from 'react';
import {Row, Col, Form, InputNumber, Tooltip, DatePicker, Space, Switch, Button} from 'antd';
import {CaretUpOutlined, CaretDownOutlined, CloseOutlined} from '@ant-design/icons';
import {CustomAutoComplete, CustomAutoCompleteExtension} from "../../components/style/SearchAutoCompleteStyles";
import {EmptyFormItem} from "../../simplesForms/formComponents/EmptyFormItem";
import {StyledButtonRed} from "../../components/style/ButtonStyles";
import DateRangePickerComponent from "../../components/DateRangePickerComponent";
import {AutoCompleteFormItem} from "../../components/CustomForm";
import {useQuery} from "@apollo/client";
import {STAGES_QUERY_COMPACT} from "../../../graphql/queriesCompact";
import Link from "antd/es/typography/Link";

const {RangePicker} = DatePicker;

const StageItem = ({
                       project,
                       key,
                       onChange,
                       index,
                       moveItem,
                       removeItem,
                       setStageModalStatus,
                       value,


                   }) => {


    const {loading: loadingStages, error: errorStages, data: dataStages} =
        useQuery(STAGES_QUERY_COMPACT);
    const [stageTimes, setStageTimes] = useState({duration: 0, offset: 0})
    const [stagePrices, setStagePrices] = useState({price: 0, price_to_paid: 0})

    const handlePriceChange = (percent) => {
        if (percent) {
            const price = (project.price * (percent / 100)).toFixed(2);
            setStagePrices({
                price: price,
                price_to_paid: (price - price * (project.prepayment / 100)).toFixed(2)
            })
        }
    };
    return (
        <Row key={index} gutter={0} style={{marginBottom: 0}}>
            <Space.Compact style={{width: "100%"}}>


                <Col span={2} style={{marginTop: "-3px"}} >
                    <Space.Compact direction={"horizontal"}    >
                        <Space.Compact direction={"vertical"}   >
                            <Button icon={<CaretUpOutlined/>}
                                    size={"small"}
                                    onClick={() => {
                                        moveItem && moveItem(index, index - 1)
                                    }}
                                    style={{  height: "16px"}}/>
                            <Button
                                icon={<CaretDownOutlined/>}
                                size={"small"}
                                onClick={() => {
                                    moveItem && moveItem(index, index + 1)
                                }}
                                style={{height: "17px"}}/>

                        </Space.Compact>
                        <Tooltip title="Номер этапа">

                            <InputNumber disabled={true}
                                         style={{width: "100%" }}
                                         value={index + 1}
                                         min={1}
                                         max={25}/>
                        </Tooltip>
                    </Space.Compact>
                </Col>
                <Col span={11} style={{width: "100%"}}>
                    <Tooltip title="Наименование этапа">
                        <AutoCompleteFormItem rulesValidationRequired={true}
                                              rulesValidationMessage={"Выбор этапа обязателен"} name={[index, 'stage']}>
                            <CustomAutoCompleteExtension
                                visibleMode={"CREATE_WHERE_NON_SELECTED"}
                                firstBtnOnClick={() =>
                                    setStageModalStatus({mode: "add", key: index})}
                                style={{width: "100%"}}
                                placeholder={"Выбор этапа..."}
                                loading={loadingStages}
                                data={dataStages?.stages?.items}/>
                        </AutoCompleteFormItem>
                    </Tooltip>
                </Col>

                <Col span={2}>
                    <Tooltip title="Смещение">
                        <Form.Item
                            style={{marginBottom: 0, width: "100%"}}
                            name={[index, 'offset']}

                            rules={[{required: true, message: "Укажите смещение"}]}>
                            <InputNumber max={project.duration - stageTimes.duration}
                                         onChange={(value) => setStageTimes({...stageTimes, offset: value})}
                                         placeholder={"Сроки смещение"} style={{marginBottom: 0, width: "100%"}}/>
                        </Form.Item>
                    </Tooltip>
                </Col>

                <Col span={2}>
                    <Tooltip title="Укажите продолжнительность">
                        <Form.Item
                            style={{marginBottom: 0, width: "100%"}}
                            name={[index, 'duration']}

                            rules={[{required: true, message: "Укажите продолжнительность"}]}>
                            <InputNumber max={project.duration - stageTimes.offset}
                                         placeholder={"Сроки продолжнительность"}
                                         onChange={(value) => setStageTimes({...stageTimes, duration: value})}

                                         style={{marginBottom: 0, width: "100%"}}/>
                        </Form.Item>
                    </Tooltip>
                </Col>
                <Col span={2}>
                    <Tooltip title="Процент от общей стоимости">
                        <Form.Item
                            style={{marginBottom: 0, width: "100%"}}
                            name={[index, 'percent']}
                            rules={[{required: true, message: "Процент от стоимости обязателен"}]}>
                            <InputNumber max={100} min={0}
                                         onChange={(value) => handlePriceChange(value)}
                                         suffix={"%"}
                                         style={{width: "100%"}}/>
                        </Form.Item>
                    </Tooltip>
                </Col>
                <Col span={2}>
                    <Tooltip title="Стоимость этапа">

                        <InputNumber
                            value={stagePrices.price ?? 0}
                            disabled={true}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                            suffix={"₽"} style={{width: "100%"}}/>

                    </Tooltip>
                </Col>
                <Col span={2}>
                    <Tooltip title="Сумма к оплате за этап">

                        <InputNumber
                            value={stagePrices.price_to_paid ?? 0}
                            disabled={true}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                            suffix={"₽"} style={{width: "100%"}}/>

                    </Tooltip>
                </Col>
                <Col span={1}>
                    <StyledButtonRed icon={<CloseOutlined/>} onClick={() => removeItem && removeItem(index)}/>
                </Col>
            </Space.Compact>
        </Row>
    );
};

export default StageItem;
