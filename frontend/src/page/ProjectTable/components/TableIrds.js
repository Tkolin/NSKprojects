import {Space, Table, Tooltip, Typography} from "antd";
import React from "react";
import IrdsProjectFileDownload from "../../components/script/fileDownloadScripts/IrdsProjectFileDownload";
import {DownloadOutlined, EditOutlined} from "@ant-design/icons";
import Link from "antd/es/typography/Link";


const {Text} = Typography;

const TableIrds = ({setEditModalStatus, project}) => {
    const columnsIrds = [{
        title:
            <Space>
                <Tooltip title={"Список ИРД"}>

                    <Text style={{marginRight: 10}}>Список ИРД</Text>
                    <IrdsProjectFileDownload style={{color: "green"}} text={<DownloadOutlined/>}
                                             projectId={project?.id}/>
                </Tooltip>
                <Link type={"warning"}>

                    <EditOutlined onClick={() => setEditModalStatus && setEditModalStatus()}/>
                </Link>
            </Space>,
        children: [
            {
                width: '45%',

                title: 'Основная информация',
                dataIndex: 'ird',
                key: 'ird',
                align: "left",
                render: (text, record) => (
                    <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                        <Text strong>{record?.ird?.name}</Text>
                    </Space.Compact>
                ),
            },
            {
                width: '40%',

                title: 'Статус получения',
                dataIndex: 'status_confirm',
                key: 'status_confirm',
                align: "left",
                render: (text, record) => (
                    record.received_date ? (
                            <Text strong>{record?.received_date}</Text>
                        )
                        :
                        <Text strong style={{color: "#ff4d4f"}}>Не получено</Text>
                ),
            },
            {
                width: '15%',

                title: 'Файл',
                dataIndex: 'ird_download',
                key: 'ird_download',
                align: "left",
                render: (text, record) => (
                    <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                    </Space.Compact>
                ),
            }]
    }
    ];
    return (
        <Table
            style={{margin: 0, width: "100%"}}

            size={"small"}
            columns={columnsIrds}
            dataSource={project.project_irds}
            pagination={false}
        />);
}
export default TableIrds;