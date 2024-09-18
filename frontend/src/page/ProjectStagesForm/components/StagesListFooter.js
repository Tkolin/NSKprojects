import { Col, DatePicker, Input, Row, Space } from 'antd';
import React from 'react';


const {RangePicker} = DatePicker;


const StagesListFooter = ({project, totalToPercent, totalToDuration, freeCol}) => {

    return (
        <Row gutter={0}>
            <Space.Compact style={{width: "100%"}}>
                {/*Стрелки*/}
                <Col span={1}/>
                {/*Номера*/}
                <Col span={1}/>

                <Col span={10}>
                    {/*Наименование этапа*/}
                    {freeCol}
                </Col>
                {/*Даты*/}
                <Col span={1} style={{justifyContent: "center"}}>

                    {/*<div style={{width: "100%", textAlign: "center"}}>*/}
                    {/*    <Input value={totalToDuration} disabled*/}
                    {/*           style={{*/}
                    {/*               marginLeft: 20,*/}
                    {/*               width: 90,*/}
                    {/*               background: totalToDuration > CreateNewProject?.duration ? '#EE4848' : totalToDuration < CreateNewProject?.duration ? '#FFD700' : '#7DFF7D'*/}
                    {/*           }}/>*/}
                    {/*    <Input value={CreateNewProject?.duration} disableв*/}
                    {/*           style={{width: 90}}/>*/}
                    {/*    <Form.Item*/}
                    {/*        style={{marginBottom: 0, display: 'flex'}} name="totalRange_item">*/}
                    {/*        <RangePicker*/}
                    {/*            value={[CreateNewProject?.date_signing ? dayjs(CreateNewProject.date_signing) : null, CreateNewProject?.date_end ? dayjs(CreateNewProject.date_end) : null]}*/}
                    {/*            disabled={true}/>*/}
                    {/*    </Form.Item>*/}
                    {/*</div>*/}

                </Col>
                <Col span={5} style={{justifyContent: "center"}}>
                    <strong>
                        Продолжительность проекта: {project.duration}
                    </strong>
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
                <Col span={2}  data-permission={"read-project-payments"}>
                    <div style={{width: "100%", textAlign: "center"}}>
                        <Input disabled={true}
                               value={project?.price}
                               defaultValue={project?.price}
                               suffix={"₽"} style={{width: "100%"}}/>
                    </div>
                </Col>
                <Col span={2}  data-permission={"read-project-payments"}>
                    <div style={{width: "100%", textAlign: "center"}}>
                        <Input disabled={true}
                               value={project?.price}
                               defaultValue={project?.price}
                               suffix={"₽"} style={{width: "100%"}}/>
                    </div>
                </Col>
                <Col span={1}  data-permission={"read-project-payments"}/>

            </Space.Compact>
        </Row>
    );
};

export default StagesListFooter;
