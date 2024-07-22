import {Space, Table, Typography} from "antd";
import {useEffect} from "react";
import LinkToDownload from "../../components/script/fileDownloadScripts/LinkToDownload";
import {UploadFileExecutorOrder} from "../../components/UploadFile";

const {Text} = Typography;

export const ExecutorOrdersTable = ({executorOrders, onUpdated}) => {
    useEffect(() => {
        console.log("executorOrders", executorOrders);
    }, [executorOrders]);
    const columns = [
        {
        title: "Номер договора",
        key: "orderNumber",
        render: (record, text) => (
            <Space.Compact direction={"vertical"}>
                <Text><strong>{record.number ?? "-"}</strong></Text>
                <Text  type={"secondary"}>Сгенерирован: {record.date_generate}</Text>
                <Text  type={"secondary"}>Дата документа: {record.date_order}</Text>
            </Space.Compact>)
    }, {
        title: "Файл",
        key: "orderNumber",
        render: (record, text) => (
            <Space.Compact>
                {record?.signed_file_id ?
                    (
                        <Space.Compact direction={"vertical"}>
                            <LinkToDownload fileId={record.signed_file_id}>Скачать (подписан)</LinkToDownload>
                            <Text type={"secondary"}>{record.date_attachment}</Text>

                        </Space.Compact>
                    ) :
                    (<Space.Compact direction={"vertical"}>
                        <UploadFileExecutorOrder onUpdated={()=>onUpdated()} orderId={record.id}>Загрузить подписанный файл</UploadFileExecutorOrder>
                        <LinkToDownload fileId={record.original_file_id} danger>Скачать (не подписан)</LinkToDownload>
                     </Space.Compact>)}
            </Space.Compact>)
    },]
    return (
        <Table
            size={"small"}
            columns={columns}
            pagination={false}
            // className={}
            dataSource={executorOrders}
        />
    );
}