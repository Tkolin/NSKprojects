import React, {useEffect, useState} from 'react';
import {Row, Col, Form, InputNumber, Select, Tooltip, DatePicker, Input} from 'antd';
import {CaretUpOutlined, CaretDownOutlined, MinusCircleOutlined} from '@ant-design/icons';
import {StyledFormItemAutoComplete} from "../../../../components/style/SearchAutoCompleteStyles";

const {RangePicker} = DatePicker;

const StageItem = ({value, onChangeStageId, onChange, index, stagesData, moveItem, removeItem, isFirst, isLast}) => {
    // бновления всех записей в строке

    const [stageAutoComplete, setStageAutoComplete] = useState({options: [], selected: null});
    const handleItems = () => {
    }
    useEffect(() => {
        onChangeStageId && onChangeStageId(index, stageAutoComplete?.selected)
    }, [stageAutoComplete?.selected]);
    // Для хранения выбора элемента

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
                                 value={index}
                                 style={{width: "100%"}}
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

                        data={stagesData}
                        stateSearch={stageAutoComplete}
                        setStateSearch={setStageAutoComplete}
                    />
                </Tooltip>
            </Col>
            <Col span={0} style={{width: "0"}}>
                <Form.Item
                    style={{marginBottom: 0, width: "0", height: "0"}}
                    name={[index, 'stage_id']}
                >
                    <Input value={stageAutoComplete.selected} style={{width: "0"}}
                    />
                </Form.Item>
            </Col>
            <Col span={2}>
                <Tooltip title="Продолжительность этапа (дни)">
                    <Form.Item
                        style={{marginBottom: 0, width: "100%"}}
                        name={[index, 'duration_item']}
                        rules={[{
                            required: true,
                        },]}
                    >
                        <InputNumber onChange={() => handleItems()} style={{width: "100%"}}
                        />
                    </Form.Item>
                </Tooltip>
            </Col>
            <Col span={4}>
                <Tooltip title="Сроки этапа">
                    <Form.Item
                        style={{marginBottom: 0, width: "100%"}}
                        name={[index, 'date_range']}
                        rules={[{
                            required: true,
                        },]}
                    >
                        <RangePicker
                            style={{width: "100%"}}
                            onChange={() => handleItems()}
                            id={{
                                start: 'date_start_item',
                                end: 'date_end_item',
                            }}
                        />
                    </Form.Item>
                </Tooltip>
            </Col>
            <Col span={2}>
                <Tooltip title="Процент от общей стоимости">
                    <Form.Item
                        style={{marginBottom: 0, width: "100%"}}
                        name={[index, 'percent_item']}
                        rules={[{
                            required: true,
                        },]}
                    >
                        <InputNumber onChange={() => handleItems()} max={100} min={0} value={0}
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
                        name={[index, 'price_item']}
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
                        name={[index, 'end_price_item']}
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
