import React, {useEffect, useState} from 'react';
import {Row, Col, Form, InputNumber, Tooltip, DatePicker} from 'antd';
import {
    MinusCircleOutlined,
} from '@ant-design/icons';
import {CustomAutoComplete} from "../../../../components/style/SearchAutoCompleteStyles";
import {EmptyFormItem} from "../../../../components/formComponents/EmptyFormItem";


const IrdItem = ({
                     onChange,
                     index,
                     irdData,
                     removeItem,
                 }) => {


    return (
        <Row key={index} gutter={2} style={{marginBottom: 0}}>

            <Col span={14}>
                <Tooltip title="Наименование ИРД">

                    <Form.Item name={[index, 'IRD']}>

                        <CustomAutoComplete
                            style={{marginBottom: 0, width: "100%"}}
                            placeholder={"Выбор ИРД..."}
                            data={irdData}
                            onChange={() => console.log("1 CustomAutoComplete")}
                        />
                    </Form.Item>
                </Tooltip>

            </Col>
            <Col span={3}>
                <Tooltip title="Номер этапа">
                    <Form.Item
                        name={[index, 'stageNumber']}
                        style={{marginBottom: 0, width: "100%"}}
                    >
                        <InputNumber max={100}
                                     style={{marginBottom: 0, width: "100%"}}
                                     min={0} prefix={"№"}/>
                    </Form.Item>
                </Tooltip>
            </Col>
            <Col span={3}>
                <Tooltip title="Номер в приложении">
                    <Form.Item
                        name={[index, 'applicationProject']}
                        style={{marginBottom: 0, width: "100%"}}
                    >
                        <InputNumber max={100} min={0}
                                     style={{marginBottom: 0, width: "100%"}}
                                     prefix={"№"}/>
                    </Form.Item>
                </Tooltip>
            </Col>

            <Col span={3}>
                <Tooltip title="Дата получения">
                    <Form.Item
                        name={[index, 'receivedDate']}
                        style={{marginBottom: 0, textAlign: "center", width: "100%"}}

                    >
                        <DatePicker
                            style={{marginBottom: 0, width: "100%"}}
                            onChange={() => onChange()}
                            status={"warning"}
                            placeholder="Получено"/>
                    </Form.Item>
                </Tooltip>
            </Col>

            <Col span={1} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <MinusCircleOutlined onClick={() => removeItem && removeItem(index)}/>
            </Col>

        </Row>
    );
};

export default IrdItem;
