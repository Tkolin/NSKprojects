import {Space, Typography,} from "antd";
import React from "react";

import ColumnMainDataRender from "./components/ColumnMainDataRender";
import ColumnCustomerRender from "./components/ColumnCustomerRender";
import ColumnStatusRender from "./components/ColumnStatusRender";
import ColumnProgressRender from "./components/ColumnProgressRender";
import ColumnToolRenderManager from "./components/ColumnToolRenderManager";
import ColumnMoneyRender from "./components/ColumnMoneyRender";

const formatCurrency = (amount) => {
    return amount.toLocaleString('ru-RU', {style: 'currency', currency: 'RUB'});
};
const {Text} = Typography;

const getColumn = ({
                       options = {},
                       onUpdated,
                       expandableTableProps,
                   }) => {


    if (!options)
        return null;
    const columns = [];
    //  Добавление элементов в колонку инструментов
    if (options.tool)
        columns.push(columnMenuComponent({
            options: options.tool,
            onUpdated,
            expandableTableProps: expandableTableProps
        }));

    //  Добавление остальных колонок согласно параметрам
    if (options.columns) {
        options.columns.includes("name") &&
        columns.push(columnProgressComponent());
        options.columns.includes("money") &&
        columns.push(columnMoneyComponent());
        columns.push(columnMainDataComponent());
    }
    return columns;
}
export default getColumn;
const columnMoneyComponent = () =>
    ({
        key: 'money',
        width: "30%",
        render: (text, record) => <ColumnMoneyRender record={record} text={text}/>
    });
const columnProgressComponent = () =>
    ({
        key: 'progress',
        width: "30%",
        render: (text, record) => <ColumnProgressRender record={record} text={text}/>
    });
const columnMenuComponent = ({
                                 options,
                                 onUpdated,
                                 expandableTableProps
                             }) =>
    ({
        key: 'options',
        width: "48px",
        render: (text, record) => <ColumnToolRenderManager record={record}
                                                           options={options}
                                                           onUpdated={onUpdated}
                                                           expandableTableProps={expandableTableProps}/>
    });


const columnMainDataComponent = () =>
    ({
        key: 'main_data',
        render: (text, record) => <ColumnMainDataRender text={text} record={record}/>,
    });
const columnCustomerComponent = () =>
    ({
        key: 'customer_data',
        render:
            (text, record) =>
                <ColumnCustomerRender text={text} record={record}/>
    });
const columnStatusComponent = (status) =>
    ({
        key: 'status_data',
        render:
            (text, record) => <ColumnStatusRender render={record} status={status} text={text}/>
    });
const columnPriceComponent = () =>
    ({
        key: 'price_data',
        render:
            (text, record) => (
                <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                    <Text strong>Полная стоимость:</Text>
                    <Text>{record.price ? formatCurrency(record.price) : ""} ₽</Text>
                    <Text strong>Аванс:</Text>
                    <Text>{record.prepayment}%
                        ({record.price && record.prepayment && formatCurrency(record.price / 100 * record.prepayment)} ₽)</Text>
                </Space.Compact>
            ),
    });

