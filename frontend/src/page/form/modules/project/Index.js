import React from 'react';
import {Anchor, Col, Row} from 'antd';
import {StyledBlockLarge, StyledBlockRegular} from "../../../style/BlockStyles";
import StagesProjectForm from "./components/StagesProjectForm";

import ProjectForm from "../../modelsForms/ProjectForm";
import {shallow} from "zustand/shallow";
import {useProjectStore} from "./Store";

const selector = (store) => ({
    project: store.project,

});
const Index = () => {
    const store = useProjectStore(selector, shallow);

    return (
        <Row>
            <Col span={16}>
                <div
                    id="part-1"
                    style={{
                        height: '100vh',
                        background: 'rgba(255,0,0,0.02)',
                    }}
                >
                    <StyledBlockRegular label={"Основные данные об проекте"}>
                        <ProjectForm initialObject={store?.project?.id}/>
                    </StyledBlockRegular>
                </div>
                <div
                    id="part-2"
                    style={{
                        height: '100vh',
                        background: 'rgba(0,255,0,0.02)',
                    }}
                ><StyledBlockLarge label={"Этапы"}>
                    <StagesProjectForm/>
                </StyledBlockLarge></div>

                {/*<div*/}
                {/*    id="part-3"*/}
                {/*    style={{*/}
                {/*        height: '100vh',*/}
                {/*        background: 'rgba(0,0,255,0.02)',*/}
                {/*    }}*/}
                {/*><StyledBlockLarge label={"Список ИРД"}>*/}
                {/*    <IrdsProjectForm/>*/}
                {/*</StyledBlockLarge></div>*/}

                {/*<div*/}
                {/*    id="part-4"*/}
                {/*    style={{*/}
                {/*        height: '100vh',*/}
                {/*        background: 'rgba(0,0,255,0.02)',*/}
                {/*    }}*/}
                {/*><StyledBlockBig bordered size={"small"} label={"Сформированная документация:"}>*/}
                {/*    <ul>*/}
                {/*        <Divider>Основные</Divider>*/}
                {/*        <li>*/}
                {/*            <ProjectFileDownload projectId={project.id} text={'Договор с заказчиком'}/>*/}
                {/*        </li>*/}
                {/*        <li>*/}
                {/*            <StagesProjectFileDownload projectId={project.id} text={'График работ'}/>*/}
                {/*        </li>*/}
                {/*        <li>*/}
                {/*            <IrdsProjectFileDownload projectId={project.id} text={'Список ИРД'}/>*/}
                {/*        </li>*/}
                {/*        <Divider>Акты выполненных работ</Divider>*/}
                {/*        <li>*/}
                {/*            <PaymentInvoiceProjectDownload projectId={project.id} isPrepayment={true}*/}
                {/*                                           text={'Аванс'}/>*/}
                {/*        </li>*/}
                {/*        {project?.project_stages?.map((psid, index) => (*/}
                {/*            <li key={index}>*/}
                {/*                <PaymentInvoiceProjectDownload stageNumber={psid.number}*/}
                {/*                                               projectId={project.id}*/}
                {/*                                               text={`Этап №${psid.number} (${psid.stage.name})`}*/}
                {/*                                               type="acts"/>*/}
                {/*            </li>*/}
                {/*        ))}*/}
                {/*        <Divider>Счета на оплату</Divider>*/}
                {/*        {project?.project_stages?.map((psid, index) => (*/}
                {/*            <li key={index}>*/}
                {/*                <ActRenderingProjectDownload stageNumber={psid.number}*/}
                {/*                                             text={`Этап №${psid.number} (${psid.stage.name})`}*/}
                {/*                                             projectId={project.id} type="acts"/>*/}
                {/*            </li>*/}
                {/*        ))}*/}
                {/*    </ul>*/}

                {/*</StyledBlockBig>   </div>*/}


                <div
                    id="part-5"
                    style={{
                        height: '100vh',
                        background: 'rgba(0,0,255,0.02)',
                    }}
                ></div>

            </Col>
            <Col span={8}>
                <Anchor
                    replace
                    items={[
                        {
                            key: 'part-1',
                            href: '#part-1',
                            title: 'Заполнения основных данных',
                        },
                        {
                            key: 'part-2',
                            href: '#part-2',
                            title: 'Заполнение Этапы',
                        },
                        {
                            key: 'part-3',
                            href: '#part-3',
                            title: 'Заполнение Ирд',
                        },
                        {
                            key: 'part-4',
                            href: '#part-4',
                            title: 'Техническое задание',
                        },
                        {
                            key: 'part-5',
                            href: '#part-5',
                            title: 'Документы',
                        },
                    ]}
                />
            </Col>
        </Row>
    );

};

export default Index;
