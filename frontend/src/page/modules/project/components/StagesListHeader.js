import React from 'react';
import {Row, Col} from 'antd';



const StagesListHeader = ({}) => {

    return (
        <Row gutter={2} style={{marginBottom: 0}}>
            <Col span={0.5} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div style={{width: "100%", textAlign: "center"}}>
                </div>

            </Col>
            <Col span={1}>
                <div style={{width: "100%", textAlign: "center"}}>

                </div>
            </Col>
            <Col span={8} style={{width: "100%", alignContent: "center"}}>
                <div style={{width: "100%", textAlign: "center"}}>
                    Наименование этапа

                </div>
            </Col>
            <Col span={4}>
                <div style={{width: "100%", textAlign: "center"}}>
                    Продолжительность
                </div>
            </Col>

            <Col span={2}>
                <div style={{width: "100%", textAlign: "center"}}>

                </div>
            </Col>
            <Col span={3}>
                <div style={{width: "100%", textAlign: "center"}}>
                    Стоимость
                </div>
            </Col>
            <Col span={3}>
                <div style={{width: "100%", textAlign: "center"}}>
                    Итоговая стоимость
                </div>
            </Col>


        </Row>
    );
};

export default StagesListHeader;
