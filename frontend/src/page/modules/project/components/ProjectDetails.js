import React from 'react';
import {Row, Col, Input, Form, DatePicker, Descriptions, Collapse, Typography} from 'antd';
import dayjs from "dayjs";

 import moment from "moment/moment";
import PaymentInvoiceProjectDownload from "../../../../components/script/PaymentInvoiceProjectDownload";
import ActRenderingProjectDownload from "../../../../components/script/ActRenderingProjectDownload";
import TaskExecutorContractDownload from "../../../../components/script/TaskExecutorContractDownload";
import IrdsProjectFileDownload from "../../../../components/script/IrdsProjectFileDownload";
import StagesProjectFileDownload from "../../../../components/script/StagesProjectFileDownload";
import ProjectFileDownload from "../../../../components/script/ProjectFileDownload";
const {RangePicker} = DatePicker;
const {Text} = Typography;


const ProjectDetails = ({project, totalToPercent, totalToDuration}) => {

    return (
        <Row>
            <>
                Список ИРД
                <ProjectFileDownload projectId={project?.id}/>
            </>
            <>
                Список ИРД
                <IrdsProjectFileDownload projectId={project?.id}/>
            </>
            <>
                График этапов
                <StagesProjectFileDownload projectId={project?.id}/>
            </>
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
