import React from 'react';
import {Row, Col, Input, Form, DatePicker} from 'antd';
import dayjs from "dayjs";

 import moment from "moment/moment";
const {RangePicker} = DatePicker;


const StagesListFooter = ({project, totalToPercent, totalToDuration}) => {

    return (
        <Row gutter={4} style={{marginBottom: 0, marginLeft: 35}}>
            <Col span={0.5} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div style={{width: "100%", textAlign: "center"}}>
                </div>

            </Col>
            <Col span={1}>
                <div style={{width: "100%", textAlign: "center"}}>

                </div>
            </Col>
            <Col span={8} style={{width: "100%", alignContent: "center"}}>
                <div style={{width: "100%", textAlign: "right"}}>
                    Итого:

                </div>
            </Col>
            <Col span={4}>
                {/*<div style={{width: "100%", textAlign: "center"}}>*/}
                {/*    <Input value={totalToDuration} disabled*/}
                {/*           style={{*/}
                {/*               marginLeft: 20,*/}
                {/*               width: 90,*/}
                {/*               background: totalToDuration > project?.duration ? '#EE4848' : totalToDuration < project?.duration ? '#FFD700' : '#7DFF7D'*/}
                {/*           }}/>*/}
                {/*    <Input value={project?.duration} disableв*/}
                {/*           style={{width: 90}}/>*/}
                {/*    <Form.Item*/}
                {/*        style={{marginBottom: 0, display: 'flex'}} name="totalRange_item">*/}
                {/*        <RangePicker*/}
                {/*            value={[project?.date_signing ? dayjs(project.date_signing) : null, project?.date_end ? dayjs(project.date_end) : null]}*/}
                {/*            disabled={true}/>*/}
                {/*    </Form.Item>*/}
                {/*</div>*/}

            </Col>

            <Col span={2}>
                <div style={{width: "100%", textAlign: "center"}}>
                <Input
                        value={totalToPercent}
                        suffix={"%"}
                        style={{
                            marginBottom: 0, width: "100%",
                            background: totalToPercent > 100 ? '#EE4848' : totalToPercent < 100 ? '#FFD700' : '#7DFF7D'
                        }}/>
                </div>
            </Col>
            <Col span={3}>
                <div style={{width: "100%", textAlign: "center"}}>
                    <Input disabled={true}
                           value={project?.price}
                           defaultValue={project?.price}
                           suffix={"₽"} style={{width: "100%"}}/>
                </div>
            </Col>
            <Col span={4}>
                <div style={{width: "100%", textAlign: "center"}}>
                    <Input disabled={true}
                           value={project?.price}
                           defaultValue={project?.price}
                           suffix={"₽"} style={{width: "100%"}}/>
                </div>
            </Col>


        </Row>
    );
};

export default StagesListFooter;
