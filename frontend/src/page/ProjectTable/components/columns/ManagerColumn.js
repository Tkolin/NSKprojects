import {

    Space,
    Typography,
} from "antd";
import React from "react";

import ColumnMenuToolRender from "./ColumnMenuToolRender";
import ColumnRequestMenuToolRender from "./ColumnRequestMenuToolRender";
import ColumnKpMenuToolRender from "./ColumnKpMenuToolRender";
import ColumnContractMenuToolRender from "./ColumnContractMenuToolRender";
import ColumnMainDataRender from "./ColumnMainDataRender";
import ColumnCustomerRender from "./ColumnCustomerRender";
import ColumnStatusRender from "./ColumnStatusRender";
import ColumnProgressRender from "./ColumnProgressRender";
import ColumnWorkingMenuToolRender from "./ColumnWorkingMenuToolRender";


const formatCurrency = (amount) => {
    return amount.toLocaleString('ru-RU', {style: 'currency', currency: 'RUB'});
};
const {Text} = Typography;

const GetColumns = ({

                        options,
                        onUpdated,
                        expandable,

                    }
) => {
    console.log(options, "options");
    if (!options || options.length < 1)

        return [];
    // Определяем базовые ширины для столбцов
    const baseWidths = {
        tool: 32, // пиксели
        main: 50, // процентов
        customer: 15, // процентов
        progress: 5, // процентов
        status: 10, // процентов
        price: 15 // процентов
    };

    // Считаем, сколько процентов осталось после базового распределения
    const calculateRemainingWidth = (countColumns) => {
        const totalBaseWidth = Object.keys(baseWidths).reduce((total, key) => {
            if (options.includes(key)) {
                return total + (baseWidths[key] ?? 0);
            }
            return total;
        }, 0);

        return 100 - totalBaseWidth;
    };

    // Рассчитываем ширину каждого столбца
    const calculateColumnWidth = (type, countColumns) => {
        if (type === 'tool') return `${baseWidths.tool}px`;
        if (baseWidths[type]) return `${baseWidths[type]}%`;
        return `${calculateRemainingWidth(countColumns) / (countColumns - Object.keys(baseWidths).filter(key => options?.includes(key))?.length)}%`;
    };

    // Генерируем столбцы
    const columns = [];
    const countColumns = options?.length;

    options.includes('tool') &&
    columns.push(columnMenuToolComponent({
        width: "50px", expandable
    }));

    options.includes('request_tools') &&
    columns.push(columnRequestMenuToolComponent({
        onUpdated: () => onUpdated(),
        width: "50px"
    }));

    options.includes('kp_tools') &&
    columns.push(columnKpMenuToolComponent({
        onUpdated: () => onUpdated(),
        width: "50px"
    }));

    options.includes('contract_tools') &&
    columns.push(columnContractMenuToolComponent({
        onUpdated: () => onUpdated(),
        expandable,
        width: "50px"
    }));

    options.includes('working_tools') &&
    columns.push(columnWorkingMenuToolComponent({
        onUpdated: () => onUpdated(),
        expandable,
        width: "50px"
    }));

    options.includes('main') &&
    columns.push(columnMainDataComponent({
        onUpdated: () => onUpdated()
    }));

    options.includes('customer') &&
    columns.push(columnCustomerComponent({width: calculateColumnWidth('customer', countColumns)}));

    options.includes('progress') &&
    columns.push(columnProgressComponent({width: calculateColumnWidth('progress', countColumns)}));

    // options.includes('status') &&
    // columns.push(columnStatusComponent({width: calculateColumnWidth('status', countColumns)}));

    options.includes('price') &&
    columns.push(columnPriceComponent({width: calculateColumnWidth('price', countColumns)}));

    options.includes('request_control') &&
    columns.push(columnPriceComponent({width: calculateColumnWidth('price', countColumns)}));

    return columns;
}

const columnProgressComponent = ({width}) =>
    ({
        key: 'progress',
        width: width,
        render: (text, record) => <ColumnProgressRender record={record} text={text}/>
    });
const columnMenuToolComponent = ({width, options, expandable}) =>
    ({
        key: 'menu-options',
        width: width,
        render: (text, record) =>
            <ColumnMenuToolRender text={text} record={record}
                                  expandable={expandable} options={options}/>
    });
const columnRequestMenuToolComponent = ({width, options, onUpdated}) =>
    ({
        key: 'menu-request-options',
        width: width,
        render: (text, record) =>
            <ColumnRequestMenuToolRender text={text} record={record}
                                         onUpdated={() => onUpdated()} options={options}/>
    });
const columnContractMenuToolComponent = ({
                                             width, options, expandable, onUpdated,
                                             setEditProjectModalStatus, createTemplate
                                         }) =>
    ({
        key: 'menu-contract-options',
        width: width,
        render: (text, record) =>
            <ColumnContractMenuToolRender text={text} record={record} expandable={expandable}
                                          setEditProjectModalStatus={setEditProjectModalStatus}
                                          createTemplate={createTemplate}
                                          onUpdated={() => onUpdated()} options={options}/>
    });
const columnKpMenuToolComponent = ({width, options, onUpdated}) =>
    ({
        key: 'menu-kp-options',
        width: width,
        render: (text, record) =>
            <ColumnKpMenuToolRender text={text} record={record}
                                    onUpdated={() => onUpdated()} options={options}/>
    });
const columnWorkingMenuToolComponent =  ({
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

export default GetColumns;