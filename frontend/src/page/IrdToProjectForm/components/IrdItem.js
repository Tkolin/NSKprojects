import React, {useEffect, useState} from 'react';
import {Row, Col, Form, InputNumber, Tooltip, DatePicker, Space} from 'antd';
import {
    CloseOutlined,
} from '@ant-design/icons';
import {
    CustomAutoComplete,
    CustomAutoCompleteAndCreate,
    CustomAutoCompleteExtension
} from "../../components/style/SearchAutoCompleteStyles";
import {StyledButtonRed} from "../../components/style/ButtonStyles";

const IrdItem = ({
                     onChange,
                     index,
                     irdData,
                     removeItem,
                     setIrdModalStatus,
                 }) => {

    return (
        <Row key={index} gutter={0} style={{marginBottom: 0}}>
            <Space.Compact style={{width: "100%"}}>
                <Col span={14}>
                    <Tooltip title="Наименование ИРД">
                        <Form.Item name={[index, 'ird']}>
                            <CustomAutoCompleteExtension
                                style={{marginBottom: 0, width: "100%"}}
                                placeholder={"Выбор ИРД..."}
                                visibleMode={"CREATE_WHERE_NON_SELECTED"}
                                firstBtnOnClick={() =>
                                    setIrdModalStatus({mode: "add",key: index})}
                                data={irdData}
                                onSelect={() => {
                                    onChange && onChange();
                                }}
                                onChange={() => {
                                    onChange && onChange()
                                }}
                            />


                        </Form.Item>
                    </Tooltip>
                </Col>
                <Col span={3}>
                    <Tooltip title="Номер этапа">
                        <Form.Item
                            name={[index, 'stage_number']}
                            style={{marginBottom: 0, width: "100%"}}>
                            <InputNumber max={100}
                                         style={{marginBottom: 0, width: "100%"}}
                                         min={0} prefix={"№"}/>
                        </Form.Item>
                    </Tooltip>
                </Col>
                <Col span={3}>
                    <Tooltip title="Номер в приложении">
                        <Form.Item
                            name={[index, 'application_project']}
                            style={{marginBottom: 0, width: "100%"}}>
                            <InputNumber max={100} min={0}
                                         style={{marginBottom: 0, width: "100%"}}
                                         prefix={"№"}/>
                        </Form.Item>
                    </Tooltip>
                </Col>
                <Col span={3}>
                    <Tooltip title="Дата получения">
                        <Form.Item
                            name={[index, 'received_date']}
                            style={{marginBottom: 0, width: "100%"}}>
                            <DatePicker
                                style={{marginBottom: 0, width: "100%"}}
                                onChange={() => onChange && onChange()}
                                status={"warning"}
                                placeholder="Получено"/>
                        </Form.Item>
                    </Tooltip>
                </Col>
                <Col span={1}>
                    <StyledButtonRed icon={<CloseOutlined/>} onClick={() => removeItem && removeItem(index)}/>
                </Col>
            </Space.Compact>
        </Row>
    );
};

export default IrdItem;
