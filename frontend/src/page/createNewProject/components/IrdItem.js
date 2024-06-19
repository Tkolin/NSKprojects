import React, {useEffect, useState} from 'react';
import {Row, Col, Form, InputNumber, Tooltip, DatePicker, Space} from 'antd';
import {
    CloseOutlined,
} from '@ant-design/icons';
import {CustomAutoComplete} from "../../components/style/SearchAutoCompleteStyles";
import {StyledButtonRed} from "../../components/style/ButtonStyles";


const IrdItem = ({
                     onChange,
                     index,
                     irdData,
                     removeItem,
                 }) => {


    return (
        <Row key={index} gutter={0} style={{marginBottom: 0}}>
            <Space.Compact style={{width: "100%"}}>
                <Col span={14}>
                    <Tooltip title="Наименование ИРД">

                        <Form.Item name={[index, 'IRD']}>

                            <CustomAutoComplete
                                style={{marginBottom: 0, width: "100%"}}
                                placeholder={"Выбор ИРД..."}
                                data={irdData}
                                onSelect={()    =>  onChange()}
                                onChange={() => onChange()}
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
                            style={{marginBottom: 0, width: "100%"}}

                        >
                            <DatePicker
                                style={{marginBottom: 0, width: "100%"}}
                                onChange={() => onChange()}
                                status={"warning"}
                                placeholder="Получено"/>
                        </Form.Item>
                    </Tooltip>
                </Col>

                <Col span={1} >
                    <StyledButtonRed icon={<CloseOutlined/>} onClick={() => removeItem && removeItem(index)}/>
                </Col>
            </Space.Compact>
        </Row>
    );
};

export default IrdItem;
