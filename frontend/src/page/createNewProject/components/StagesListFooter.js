import React from 'react';
import {Row, Col, Input, Form, DatePicker, Space} from 'antd';
import dayjs from "dayjs";

import moment from "moment/moment";

const {RangePicker} = DatePicker;


const StagesListFooter = ({project, totalToPercent, totalToDuration}) => {

    return (
        <Row gutter={0}>
            <Space.Compact style={{width: "100%"}}>
                {/*Стрелки*/}
                <Col span={1} />
                {/*Номера*/}
                <Col span={1}/>
                {/*Наименование этапа*/}
                <Col span={11}/>
                {/*Даты*/}
                <Col span={5} style={{justifyContent: "center"}}>
                    <div style={{width: "100%", textAlign: "right"}}>
                        <strong>
                            Итого:

                        </strong>
                    </div>
                    {/*<div style={{width: "100%", textAlign: "center"}}>*/}
                    {/*    <Input value={totalToDuration} disabled*/}
                    {/*           style={{*/}
                    {/*               marginLeft: 20,*/}
                    {/*               width: 90,*/}
                    {/*               background: totalToDuration > createNewProject?.duration ? '#EE4848' : totalToDuration < createNewProject?.duration ? '#FFD700' : '#7DFF7D'*/}
                    {/*           }}/>*/}
                    {/*    <Input value={createNewProject?.duration} disableв*/}
                    {/*           style={{width: 90}}/>*/}
                    {/*    <Form.Item*/}
                    {/*        style={{marginBottom: 0, display: 'flex'}} name="totalRange_item">*/}
                    {/*        <RangePicker*/}
                    {/*            value={[createNewProject?.date_signing ? dayjs(createNewProject.date_signing) : null, createNewProject?.date_end ? dayjs(createNewProject.date_end) : null]}*/}
                    {/*            disabled={true}/>*/}
                    {/*    </Form.Item>*/}
                    {/*</div>*/}

                </Col>

                <Col span={1}>
                    <div style={{width: "100%", textAlign: "center"}}>
                    <Input
                            value={totalToPercent}
                            style={{
                                marginBottom: 0, width: "100%",
                                background: totalToPercent > 100 ? '#EE4848' : totalToPercent < 100 ? '#FFD700' : '#7DFF7D'
                            }}/>
                    </div>
                </Col>
                <Col span={2}>
                    <div style={{width: "100%", textAlign: "center"}}>
                        <Input disabled={true}
                               value={project?.price}
                               defaultValue={project?.price}
                               suffix={"₽"} style={{width: "100%"}}/>
                    </div>
                </Col>
                <Col span={2}>
                    <div style={{width: "100%", textAlign: "center"}}>
                        <Input disabled={true}
                               value={project?.price}
                               defaultValue={project?.price}
                               suffix={"₽"} style={{width: "100%"}}/>
                    </div>
                </Col>
                <Col span={1}/>

            </Space.Compact>
        </Row>
    );
};

export default StagesListFooter;
