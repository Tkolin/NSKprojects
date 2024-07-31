import {
    Button,
    Divider,
    Space,
    Tooltip,
    Typography,
} from "antd";
import Link from "antd/es/typography/Link";
import {
    DeleteOutlined
} from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import {facilitiesToFullCode} from "../../../components/script/rebuildData/ProjectRebuilderQuery";
import dayjs from "dayjs";
import React from "react";

import {ColumnMenuToolRender} from "./components/ColumnMenuToolRender";
import {ColumnRequestMenuToolRender} from "./components/ColumnRequestMenuToolRender";
import {ColumnKpMenuToolRender} from "./components/ColumnKpMenuToolRender";
 
import {ColumnContractMenuToolRender} from "./components/ColumnContractMenuToolRender";
 

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

    options.includes('tool') && columns.push(columnMenuToolComponent({
        width: "50px", expandable
    }));
 
    options.includes('contract_tools') && columns.push(columnContractMenuToolComponent({
        onUpdated: () => onUpdated(),
        expandable: expandable,
        width: "50px"
    }));
 
    options.includes('request_tools') && columns.push(columnRequestMenuToolComponent({
        onUpdated: () => onUpdated(),
        width: "50px"
    }));
    options.includes('kp_tools') && columns.push(columnKpMenuToolComponent({
        onUpdated: () => onUpdated(),
        width: "50px"
    }));
    options.includes('main') && columns.push(columnMainDataComponent({
        width: calculateColumnWidth('main', countColumns),
        onUpdated: () => onUpdated()
    }));
    options.includes('customer') && columns.push(columnCustomerComponent({width: calculateColumnWidth('customer', countColumns)}));
    options.includes('progress') && columns.push(columnProgressComponent({width: calculateColumnWidth('progress', countColumns)}));
    options.includes('status') && columns.push(columnStatusComponent({width: calculateColumnWidth('status', countColumns)}));
    options.includes('price') && columns.push(columnPriceComponent({width: calculateColumnWidth('price', countColumns)}));
    options.includes('request_control') && columns.push(columnPriceComponent({width: calculateColumnWidth('price', countColumns)}));

    return columns;
}

const columnProgressComponent = (width = "8%") => ({
    title: 'Прогресс',
    dataIndex: 'progress',
    key: 'progress',
    width: width,
    align: "topLeft",
    render: (text, record) => {
        switch (record.status) {
            case 'APPROVAL_KP':
                return (
                    <Space direction="vertical">
                        <Text>Проверка писем</Text>
                        <Text>Либо ждём ответа, либо составляем письмо</Text>
                        <Text>Дата последнего письма</Text>
                        <Text type="warning">если мы не ответили</Text>
                        <Text type="danger">если с последнего письма больше Х дней</Text>
                    </Space>
                );
            case 'APPROVAL_AGREEMENT':
                return (
                    <Space direction="vertical">
                        <Text>(если все данные верны)</Text>
                        <Text>Этапы - галочка</Text>
                        <Text>Ирд - галочка</Text>
                        <Text type="warning">если данные не заполнены</Text>
                        <Text type="danger">если данные не верны</Text>
                    </Space>
                );
            case 'WAITING_SOURCE':
                return (
                    <Space direction="vertical">
                        <Text>(Кол-во полученного ирд)</Text>
                        <Text>Ирд - кол-во / дата последнего</Text>
                        <Link>Кнопка приступить к работе</Link>
                        <Text type="warning">если ирд получено</Text>
                        <Text type="danger">если срок получения ирд превысил х дней</Text>
                    </Space>
                );
            case 'WORKING':
                return (
                    <Space direction="vertical">
                        <Text>Этап - в работе</Text>
                        <Text>Задачи - в работе</Text>
                        <Text type="warning"> - </Text>
                        <Text type="danger"> - </Text>
                    </Space>
                );
            default:
                return null;
        }
    }
})
const columnMenuToolComponent = ({width, options, expandable}) => {
    return {
        key: 'menu-options',
        width: width,
        render: (text, record) => <>
 
            <ColumnMenuToolRender text={text} record={record}
 
                                  expandable={expandable} options={options}/>
        </>,
    }
}
 
const columnRequestMenuToolComponent = ({
                                            width, options, onUpdated
                                        }) => {
 
    return {
        key: 'menu-request-options',
        width: width,
        render: (text, record) => <>
 
            <ColumnRequestMenuToolRender text={text} record={record}
                                         onUpdated={() => onUpdated()} options={options}/>
        </>,
    }
}
const columnContractMenuToolComponent = ({
                                             width, options, expandable, onUpdated,
                                             setEditProjectModalStatus, createTemplate
                                         }) => {
    return {
        key: 'menu-contract-options',
        width: width,
        render: (text, record) => <>
            <ColumnContractMenuToolRender text={text} record={record} expandable={expandable}
                                          setEditProjectModalStatus={setEditProjectModalStatus}
                                          createTemplate={createTemplate}
                                          onUpdated={() => onUpdated()} options={options}/>
        </>,
    }
}
const columnKpMenuToolComponent = ({
                                       width, options, onUpdated
                                   }) => {
 
    return {
        key: 'menu-kp-options',
        width: width,
        render: (text, record) => <>
 
            <ColumnKpMenuToolRender text={text} record={record}
                                    onUpdated={() => onUpdated()} options={options}/>
 
        </>,
    }
}

const columnMainDataComponent = ({width = "48%", onUpdated}) =>
    ({
        title: 'Основные данные',
        permission: 'read-project',
        dataIndex: 'main_data',
        key: 'main_data',
        width: width,
        align: "topLeft",
        render:
            (text, record) => {


                return (
                    <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                        <Title level={5} style={{marginTop: 0}}>{record.name}</Title>
                        <Divider style={{margin: "3px"}}/>
                        <Text>{record.number}</Text>
                        <Text>({record.type_project_document?.code ?? ""}) {record.type_project_document?.name ?? ""}</Text>
                        <Divider style={{margin: "3px", marginBottom: 0}}/>
                        {/*<Space.Compact direction={"horizontal"}>*/}
                        {/*    {record?.signed_file_id ? (*/}
                        {/*            <>*/}
                        {/*                <LinkToDownload fileId={record.signed_file_id}>Скачать (подписан)*/}
                        {/*                    от {record.date_signing}</LinkToDownload>*/}
                        {/*            </>*/}
                        {/*        ) :*/}
                        {/*        (*/}
                        {/*            <>*/}
                        {/*                <ProjectFileDownload projectId={record.id} icon={<PlusOutlined/>}>Сгенерировать*/}
                        {/*                    договор</ProjectFileDownload>*/}
                        {/*                {(fileId) ?*/}
                        {/*                    (<>*/}
                        {/*                            <UploadFileProjectContractSigned*/}
                        {/*                                type={"primary"}*/}
                        {/*                                icon={<UploadOutlined/>}*/}
                        {/*                                onUpdated={() => onUpdated()}*/}
                        {/*                                projectId={record.id}>Загрузить*/}
                        {/*                                подписанный файл</UploadFileProjectContractSigned>*/}

                        {/*                            <LinkToDownload*/}
                        {/*                                fileId={fileId}*/}
                        {/*                                icon={<DownloadOutlined/>}>Скачать*/}
                        {/*                                последний вариант</LinkToDownload>*/}
                        {/*                            <Button icon={<MoreOutlined/>}/>*/}
                        {/*                        </>*/}
                        {/*                    ) :*/}
                        {/*                    (*/}
                        {/*                        <>*/}
                        {/*                        </>*/}
                        {/*                    )}*/}

                        {/*            </>*/}
                        {/*        )}*/}

                        {/*</Space.Compact>*/}
                    </Space.Compact>
                )
            }

    })
const columnCustomerComponent = (width = "15%") =>
    ({
        title: 'Данные о заказчике',
        permission: 'read-organization',
        dataIndex:
            'customer_data',
        key:
            'customer_data',
        width:
        width,

        render:
            (text, record) => (
                <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                    {record.organization_customer ?
                        <Title level={5} style={{marginTop: 0}}>{record.organization_customer?.name ?? "?"}</Title>
                        :
                        <Title level={5} style={{marginTop: 0, color: '#ff4d4f'}}>Организация не указана</Title>
                    }
                    <Text strong>Объекты:</Text>
                    {record.facilities && record.facilities?.length > 0 ? (record.facilities?.map(row => (
                            <Tooltip placement={"leftBottom"} title={
                                `${row?.group_facility?.subselection_facility?.selection_facility.name}, ` +
                                `${row?.group_facility?.subselection_facility?.name}, ` +
                                `${row?.group_facility?.name}, ` +
                                `${row?.name}.`
                            }>
                                < Text style={{marginLeft: 8, color: '#1677ff'}} key={row.id}>
                                    {facilitiesToFullCode(row)}
                                </Text>
                            </Tooltip>
                        )))
                        :
                        <Text type="danger">Объекты отсутствуют
                        </Text>
                    }
                    <Text strong>Представители:</Text>
                    {record.delegations && record.delegations?.length > 0 ? (record?.delegations?.map(delegate => (
                            <Link style={{marginLeft: 8}}
                                  key={delegate.id}>{delegate?.last_name ?? ""} {delegate?.first_name ?? ""} {delegate?.patronymic ?? ""}
                            </Link>
                        )))
                        :
                        <Text>Представители отсутствуют</Text>}
                </Space.Compact>
            ),
    })
const columnStatusComponent = (width = "15%") =>
    ({
        title: 'Статус',
        dataIndex: 'status_data',
        key: 'status_data',
        width: width,
        render:
            (text, record) => (
                <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                    <Text strong>Статус:</Text>
                    <Text>{record.status?.name}</Text>
                    <Text strong>Сроки:</Text>
                    {
                        record.date_signing ?
 
                            <Text>Дата подписания договора: {dayjs(record?.date_signing).format("DD.MM.YYYY")}</Text>
                            :
                            <Text type="danger">Не подписан</Text>
                    }
                    {record.status_id === "WORK" ?

                        <Text>Дата начала: {dayjs(record?.date_start).format("DD.MM.YYYY")}</Text>
                        : <Text>Проект не в работе</Text>}

 
                </Space.Compact>
            ),
    })
const columnPriceComponent = (width = "10%") =>
    ({
        title: 'Стоимость',
        permission: 'read-project-economy',
        dataIndex: 'price_data',
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

    })
const columnRequestControllerComponent = (width = "10%") =>
    ({
        permission: 'update-request',
        dataIndex: 'request_controller',
        key: 'request_controller',
        width: width,
        render:
            (text, record) => (
                <Space.Compact direction={"vertical"} style={{alignContent: "top"}}>
                    <Button icon={<DeleteOutlined/>}/>
                    <Button icon={<DeleteOutlined/>}/>


                </Space.Compact>
            ),

    })
export default GetColumns;