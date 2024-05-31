import React from 'react';
import {Row, DatePicker, Descriptions, Collapse, Typography, Space} from 'antd';

import PaymentInvoiceProjectDownload from "../../../../components/script/fileDownloadScripts/PaymentInvoiceProjectDownload";
import ActRenderingProjectDownload from "../../../../components/script/fileDownloadScripts/ActRenderingProjectDownload";
import IrdsProjectFileDownload from "../../../../components/script/fileDownloadScripts/IrdsProjectFileDownload";
import StagesProjectFileDownload from "../../../../components/script/fileDownloadScripts/StagesProjectFileDownload";
import ProjectFileDownload from "../../../../components/script/fileDownloadScripts/ProjectFileDownload";
const {Text} = Typography;


const ProjectDetails = ({project, totalToPercent, totalToDuration}) => {

    return (
        <Row>
            <Space.Compact style={{margin: 15}} direction={"vertical"}>
                <ProjectFileDownload text={"Загрузить Договор"} projectId={project?.id}/>
                <IrdsProjectFileDownload text={"Загрузить Список ирд"} projectId={project?.id}/>
                <StagesProjectFileDownload text={"Загрузить График работ"} projectId={project?.id}/>
            </Space.Compact>
            <Descriptions layout={"vertical"} bordered size={"small"} style={{width: "600px"}}>
                <Descriptions column={1}>
                    <Text>Этапы</Text>
                </Descriptions>
                <Descriptions column={1}>
                    <Text>Акты</Text>
                </Descriptions>
                <Descriptions column={1}>
                    <Text>Счета</Text>
                </Descriptions>
                <>
                    <Descriptions title={'Аванс'}
                                  column={1}>
                        <Text>Аванс</Text>
                    </Descriptions>
                    <Descriptions title={`Акт`} column={1}>
                        <>X</>
                    </Descriptions>
                    <Descriptions title={`Счёт`} column={1}>
                        <PaymentInvoiceProjectDownload isPrepayment={true}
                                                       projectId={project?.id} type="acts"/>
                    </Descriptions>
                </>
                {project?.project_stages?.map(psid => (
                    <>
                        <Descriptions title={`Этап №${psid.number} (${psid.stage.name})`}
                                      column={1}>
                            <Text>Этап {psid.number} {psid.stage.name}</Text>
                        </Descriptions>
                        <Descriptions title={`Акт`} column={1}>
                            <ActRenderingProjectDownload stageNumber={psid.number}
                                                         projectId={project?.id} type="acts"/>
                        </Descriptions>
                        <Descriptions title={`Счёт`} column={1}>
                            <PaymentInvoiceProjectDownload stageNumber={psid.number}
                                                           projectId={project?.id} type="acts"/>
                        </Descriptions>
                    </>

                ))}
            </Descriptions>

            <Collapse style={{width: "550px", marginLeft: 10}}>
                <Collapse.Panel header="Исполнители" key="all-persons">
                    <Descriptions labelStyle={{height: 2333, margin:  0, padding: 0 }} layout={"vertical"} bordered size={"small"} column={2} style={{width: "100%"}}>
                        <Descriptions column={1}>
                            <Text>Исполнитель</Text>
                        </Descriptions>
                        <Descriptions column={1}>
                            <Text>Договор</Text>
                        </Descriptions>
                        {/*{project.project_tasks?.reduce((acc, task) => {*/}
                        {/*    task.executors.forEach((executor) => {*/}
                        {/*        // Добавляем исполнителя в аккумулятор, если его еще нет*/}
                        {/*        if (!acc.some((e) => e.id === executor.executor.id)) {*/}
                        {/*            acc.push(executor?.executor);*/}
                        {/*        }*/}
                        {/*    });*/}
                        {/*    return acc;*/}
                        {/*}, []).map((executor) => (*/}
                        {/*    <>*/}
                        {/*        <Descriptions title={"Исполнитель"}   column={1}>{executor.passport.lastname} {executor.passport.firstname} {executor.passport.patronymic}</Descriptions>*/}
                        {/*        <Descriptions title={"Договор"}  column={1}>*/}
                        {/*            <TaskExecutorContractDownload executorId={executor.id} projectId={project.id} type="acts"/>*/}
                        {/*        </Descriptions>*/}
                        {/*    </>*/}
                        {/*))}*/}
                    </Descriptions>
                </Collapse.Panel>
            </Collapse>

        </Row>
    );
};

export default ProjectDetails;
