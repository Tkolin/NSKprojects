import {Space, Typography,} from "antd";
import React from "react";

import ColumnMainDataRender from "./components/ColumnMainDataRender";
import ColumnCustomerRender from "./components/ColumnCustomerRender";
import ColumnStatusRender from "./components/ColumnStatusRender";
import ColumnProgressRender from "./components/ColumnProgressRender";
import ColumnWorkingMenuToolRender from "./components/ColumnToolRender/components/ColumnWorkingMenuToolRender";
import {getToolRender} from "./components/ColumnToolRender";

const formatCurrency = (amount) => {
    return amount.toLocaleString('ru-RU', {style: 'currency', currency: 'RUB'});
};
const {Text} = Typography;

const GetColumn = ({
                       options = {},
                       onUpdated,
                       expandable,
                   }) => {
    if (!options)
        return null;

    const columns = [];
    if (options.tool) {
        console.log("getToolRender", getToolRender());
    }
    if (options.columns) {

    }


    return columns;
}

const columnProgressComponent = ({width}) =>
    ({
        key: 'progress',
        width: width,
        render: (text, record) => <ColumnProgressRender record={record} text={text}/>
    });

const columnWorkingMenuToolComponent = ({
                                            width, options, expandable, onUpdated,
                                            setEditProjectModalStatus, createTemplate
                                        }) =>
    ({
        key: 'menu-working-options',
        width: width,
        render: (text, record) =>
            <ColumnWorkingMenuToolRender text={text} record={record} expandable={expandable}
                                         setEditProjectModalStatus={setEditProjectModalStatus}
                                         createTemplate={createTemplate}
                                         onUpdated={() => onUpdated()} options={options}/>
    });
const columnMainDataComponent = ({width, onUpdated}) =>
    ({
        key: 'main_data',
        width: width,
        render: (text, record) => <ColumnMainDataRender text={text} record={record}/>,
    });
const columnCustomerComponent = ({width}) =>
    ({
        key: 'customer_data',
        width: width,
        render:
            (text, record) =>
                <ColumnCustomerRender text={text} record={record}/>
    });
const columnStatusComponent = ({width, status}) =>
    ({
        key: 'status_data',
        width: width,
        render:
            (text, record) => <ColumnStatusRender render={record} status={status} text={text}/>
    });
const columnPriceComponent = ({width}) =>
    ({
        key: 'price_data',
        width: width,
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

export default GetColumn;