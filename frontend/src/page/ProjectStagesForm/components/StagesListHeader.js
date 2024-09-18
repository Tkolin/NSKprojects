import { Col, Row, Space } from 'antd';
import React from 'react';


const StagesListHeader = ({}) => {

    return (

        <Row gutter={0} style={{textAlign: "center"}}>
            <Space.Compact style={{width: "100%"}}>
                {/*Стрелки*/}
                <Col span={1}/>
                {/*Номера*/}
                <Col span={1}/>
                {/*Наименование этапа*/}
                <Col span={11} >
                    <strong>
                        Наименование этапа
                    </strong>
                </Col>
                {/*Даты*/}
                <Col span={5}  >
                    <strong>
                        Продолжительность
                    </strong>
                </Col>

                <Col span={1}/>
                <Col span={2}   data-permission={"read-project-payments"}>
                    <strong>
                        Стоимость
                    </strong>
                </Col>
                <Col span={3}  data-permission={"read-project-payments"}>
                    <strong>
                        (с вычетом аванса)
                    </strong>
                </Col>
                {/*<Col span={1}/>*/}

            </Space.Compact>
        </Row>
        //     <Row gutter={2} style={{marginBottom: 0}}>
        //         <Col span={0.5} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        //             <div style={{width: "100%", textAlign: "center"}}>
        //             </div>
        //
        //         </Col>
        //         <Col span={1}>
        //             <div style={{width: "100%", textAlign: "center"}}>
        //
        //             </div>
        //         </Col>
        //         <Col span={8} style={{width: "100%", alignContent: "center"}}>
        //             <div style={{width: "100%", textAlign: "center"}}>
        //                 Наименование этапа
        //
        //             </div>
        //         </Col>
        //         <Col span={4}>
        //             <div style={{width: "100%", textAlign: "center"}}>
        //                 Продолжительность
        //             </div>
        //         </Col>
        //
        //         <Col span={2}>
        //             <div style={{width: "100%", textAlign: "center"}}>
        //
        //             </div>
        //         </Col>
        //         <Col span={3}>
        //             <div style={{width: "100%", textAlign: "center"}}>
        //                 Стоимость
        //             </div>
        //         </Col>
        //         <Col span={3}>
        //             <Space.Compact direction={"vertical"} style={{width: "100%", textAlign: "center"}}>
        //                 <> Итоговая стоимость
        //                 </>
        //                 <>(с вычетом аванса)</>
        //             </Space.Compact>
        //         </Col>
        //
        //
        //     </Row>
    );
};

export default StagesListHeader;
