import {Space, Table, Tooltip, Typography} from "antd";
import React from "react";
import StagesProjectFileDownload from "../../../components/script/fileDownloadScripts/StagesProjectFileDownload";
import {DownloadOutlined, EditOutlined} from "@ant-design/icons";
import Link from "antd/es/typography/Link";
import {
    rebuildProjectResultQuery,
    rebuildStagesResultQuery
} from "../../../components/script/rebuildData/ProjectRebuilderQuery";
import PaymentInvoiceProjectDownload
    from "../../../components/script/fileDownloadScripts/PaymentInvoiceProjectDownload";
import ActRenderingProjectDownload from "../../../components/script/fileDownloadScripts/ActRenderingProjectDownload";

const {Text} = Typography;

const TableStagesComponent = ({setEditModalStatus, project}) => {
    const columnsStages = [{
        title:
            <Space>
                <Tooltip title={"График выполнения работ"}>
                    <Text style={{marginRight: 10}}>Список Этапов</Text>
                    {project.date_signing && (
                        <StagesProjectFileDownload style={{color: "green"}} text={<DownloadOutlined/>}
                                                   projectId={project.id}/>)}
                </Tooltip>
                <Link type={"warning"}>
                    <EditOutlined
                        onClick={() => setEditModalStatus && setEditModalStatus()}/>
                </Link>
            </Space>,
        children: [
            {
                title: '№',
                dataIndex: 'number',
                key: 'number',
                align: "left",
            },
            {
                title: 'Наименование этапа',
                dataIndex: 'stage',
                key: 'stage',
                align: "left",
                render: (text, record) => (
                    <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                        <Text>{record?.stage?.name}</Text>
                    </Space.Compact>
                ),
            },
            ...(project.date_signing ?
            [{
                title: 'Счёт на оплату',
                dataIndex: 'payment',
                key: 'payment',
                align: "left",
                render: (text, record) => (
                    <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                        {record?.type === "prepayment" ?
                            <PaymentInvoiceProjectDownload isPrepayment={true}
                                                           projectId={project?.id} type="acts"/>
                            :
                            <PaymentInvoiceProjectDownload stageNumber={record.number}
                                                           projectId={project?.id} type="acts"/>
                        }
                    </Space.Compact>
                ),
            },
            {
                title: 'Акт работ',
                dataIndex: 'act',
                key: 'act',
                align: "left",
                render: (text, record) => (
                    <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                        {record?.type === "prepayment" ?
                            ("-")
                            :
                            <ActRenderingProjectDownload stageNumber={record.number}
                                                         projectId={project?.id} type="acts"/>
                        }
                    </Space.Compact>
                ),
            }] : [])
            // {
            //     dataIndex: 'act',
            //     key: 'act',
            //     align: "left",
            //     render: (text, record) => (
            //         <Tooltip title={"Назначение сотрудников"}>
            //             <Link>
            //                 <TeamOutlined onClick={() => setEmployeeToStageModalStatus({
            //                     tasks: CreateNewProject.project_tasks?.filter(row => row.stage_number === record.number) ?? null,
            //                     projectId: CreateNewProject.id,
            //                     stageNumber: record.number,
            //                     mode: "edit"
            //                 })}/>
            //             </Link>
            //         </Tooltip>
            //     ),
            // },
        ]
    }
    ];
    return (
        <Table
            style={{margin: 0, width: "100%"}}

            size={"small"}
            columns={columnsStages}
            dataSource={project?.project_stages ? [{
                number: 0,
                type: "prepayment",
                stage: {name: "Аванс"}
            }, ...project?.project_stages] : [{}]}
            pagination={false}
        />
    );
}
export default TableStagesComponent;