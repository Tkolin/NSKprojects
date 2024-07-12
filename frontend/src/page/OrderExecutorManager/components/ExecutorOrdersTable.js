import {Space, Table, Typography} from "antd";
import {useEffect} from "react";

const {Text} = Typography;

export const ExecutorOrdersTable = ({executorOrders}) => {
    useEffect(() => {
        console.log("executorOrders", executorOrders);
    }, [executorOrders]);
    const columns = [
        {
        title: "",
        key: "orderNumber",
        render: (record, text) => (
            <Space.Compact direction={"vertical"}>
                <Text><strong>{record.order_number ?? "-"}</strong></Text>
                <Text  type={"secondary"}>Сгенерирован: {record.date_generate}</Text>
                <Text  type={"secondary"}>Дата документа: {record.date_order}</Text>
            </Space.Compact>)
    }, {
        title: "Файл",
        key: "orderNumber",
        render: (record, text) => (
            <Space.Compact>
                {record?.file_id ?
                    (
                        <Space.Compact direction={"vertical"}>
                            <Text>Скачать файл</Text>
                            <Text type={"secondary"}>{record.date_order}</Text>

                        </Space.Compact>
                    ) : (<>Файла нет надо загрузить</>)}
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