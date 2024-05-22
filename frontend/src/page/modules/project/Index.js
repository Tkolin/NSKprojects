import React from 'react';
import {Anchor, Col, Divider, Row} from 'antd';
import {StyledBlockBig, StyledBlockLarge, StyledBlockRegular} from "../../../components/style/BlockStyles";
import StagesProjectForm from "./components/StagesProjectForm";

import ProjectForm from "../../../components/form/modelsForms/ProjectForm";
import {shallow} from "zustand/shallow";
import {useProjectStore} from "./Store";
import IrdsProjectForm from "./components/IrdsProjectForm";
// import IrdsProjectForm from "./components/IrdsProjectForm";

const selector = (store) => ({
    project: store.project,

});
const Index = () => {
    const store = useProjectStore(selector, shallow);

    return (
        <Row>
            <Col span={20}>
                <div
                    id="part-1"
                    style={{height: '100vh', marginTop: "32px"}}
                >
                    <StyledBlockRegular label={"Основные данные об проекте"}>
                        <ProjectForm/>
                    </StyledBlockRegular>
                </div>
                <div
                    id="part-2"
                    style={{height: '100vh',}}
                >
                    <StyledBlockLarge label={"Этапы"}>
                        <StagesProjectForm/>
                    </StyledBlockLarge>
                </div>

                <div
                    id="part-3"
                    style={{
                        height: '100vh',
                        background: 'rgba(0,0,255,0.02)',
                    }}
                ><StyledBlockLarge label={"Список ИРД"}>
                    <IrdsProjectForm/>
                </StyledBlockLarge></div>

                <div
                    id="part-5"
                    style={{
                        height: '100vh',
                        background: 'rgba(0,0,255,0.02)',
                    }}
                >
                    {/*<StyledBlockBig bordered size={"small"} label={"Сформированная документация:"}>*/}
                    {/*<ul>*/}
                    {/*    <Divider>Основные</Divider>*/}
                    {/*    <li>*/}
                    {/*        <ProjectFileDownload projectId={project.id} text={'Договор с заказчиком'}/>*/}
                    {/*    </li>*/}
                    {/*    <li>*/}
                    {/*        <StagesProjectFileDownload projectId={project.id} text={'График работ'}/>*/}
                    {/*    </li>*/}
                    {/*    <li>*/}
                    {/*        <IrdsProjectFileDownload projectId={project.id} text={'Список ИРД'}/>*/}
                    {/*    </li>*/}
                    {/*    <Divider>Акты выполненных работ</Divider>*/}
                    {/*    <li>*/}
                    {/*        <PaymentInvoiceProjectDownload projectId={project.id} isPrepayment={true}*/}
                    {/*                                       text={'Аванс'}/>*/}
                    {/*    </li>*/}
                    {/*    {project?.project_stages?.map((psid, index) => (*/}
                    {/*        <li key={index}>*/}
                    {/*            <PaymentInvoiceProjectDownload stageNumber={psid.number}*/}
                    {/*                                           projectId={project.id}*/}
                    {/*                                           text={`Этап №${psid.number} (${psid.stage.name})`}*/}
                    {/*                                           type="acts"/>*/}
                    {/*        </li>*/}
                    {/*    ))}*/}
                    {/*    <Divider>Счета на оплату</Divider>*/}
                    {/*    {project?.project_stages?.map((psid, index) => (*/}
                    {/*        <li key={index}>*/}
                    {/*            <ActRenderingProjectDownload stageNumber={psid.number}*/}
                    {/*                                         text={`Этап №${psid.number} (${psid.stage.name})`}*/}
                    {/*                                         projectId={project.id} type="acts"/>*/}
                    {/*        </li>*/}
                    {/*    ))}*/}
                    {/*</ul>*/}

                    {/*</StyledBlockBig>*/}
                </div>


                <div
                    id="part-5"
                    style={{
                        height: '100vh',
                        background: 'rgba(0,0,255,0.02)',
                    }}
                ></div>

            </Col>
            <Col span={4}>
                <Anchor
                    targetOffset={"32px"}
                    replace
                    items={[
                        {
                            key: 'part-1',
                            href: '#part-1',
                            title: 'Основных данные',
                        },
                        {
                            key: 'part-2',
                            href: '#part-2',
                            title: 'Этапы',
                        },
                        {
                            key: 'part-3',
                            href: '#part-3',
                            title: 'Ирд',
                        },
                        // {
                        //     key: 'part-4',
                        //     href: '#part-4',
                        //     title: 'Задания',
                        // },
                        {
                            key: 'part-5',
                            href: '#part-5',
                            title: 'Документы',
                        },
                    ]}
                />
            </Col>
        </Row>
    )
        ;

};

export default Index;
