import { EditOutlined } from "@ant-design/icons";
import { Space, Table, Tooltip, Typography } from "antd";
import Link from "antd/es/typography/Link";
import React from "react";

import ActRenderingProjectDownload from "../../../../../../components/script/fileDownloadScripts/ActRenderingProjectDownload";
import PaymentInvoiceProjectDownload from "../../../../../../components/script/fileDownloadScripts/PaymentInvoiceProjectDownload";

const {Text} = Typography;

const TableStagesComponent = ({setEditModalStatus, project, options}) => {
    const columnsStages = [{
        title:
            <Space>
                <Tooltip title={"Список ИРД"}>
                    <Text style={{marginRight: 10}}>Список этапы</Text>
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
            ...(options?.includes("acts") ?
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
                }] : []),

            ...(options?.includes('payments') ? [
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

        ]
    }
    ];
    return (
        <Table
            style={{display: "flex", flexDirection: "column", marginInline: "none"}}
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