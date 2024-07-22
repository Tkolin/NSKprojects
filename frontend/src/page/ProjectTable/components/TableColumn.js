import {
    Button,
    Card,
    DatePicker,
    Divider,
    Modal,
    notification,
    Popconfirm,
    Row,
    Space,
    Tooltip,
    Typography,
    Upload
} from "antd";
import Link from "antd/es/typography/Link";
import {
    DeleteOutlined, DownloadOutlined,
    EditOutlined, MinusOutlined, MoreOutlined, PlusOutlined,
    PushpinFilled,
    PushpinOutlined,
    ReconciliationOutlined, UploadOutlined,
} from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import ProjectFileDownload from "../../components/script/fileDownloadScripts/ProjectFileDownload";
import {facilitiesToFullCode} from "../../components/script/rebuildData/ProjectRebuilderQuery";
import dayjs from "dayjs";
import React, {useEffect, useState} from "react";
import {StyledButtonGreen} from "../../components/style/ButtonStyles";
import {UploadFileExecutorOrder, UploadFileProjectContractSigned} from "../../components/UploadFile";
import LinkToDownload from "../../components/script/fileDownloadScripts/LinkToDownload";
import {useLazyQuery, useMutation} from "@apollo/client";
import {BIKS_QUERY_BY_ID, PROJECTS_QUERY_BY_ID} from "../../../graphql/queriesByID";
import {CHANGE_TEMPLATE_TYPE_PROJECT} from "../../../graphql/mutationsProject";
import ProjectTasks from "../../DistributionTasksByProject";
import {nanoid} from "nanoid";
import ProjectForm from "../../ProjectForm";
import IrdsProjectForm from "../../IrdToProjectForm";
import StageToProjectForm from "../../StageToProjectForm";
import {ColumnToolRender} from "./columns/ColumnToolRender";

const formatCurrency = (amount) => {
    return amount.toLocaleString('ru-RU', {style: 'currency', currency: 'RUB'});
};
const {Text} = Typography;
// progress
// tool
// main
// customer
// status
// price


export const GetColumns = ({
                               options,
                               columnSizes,
                               permissions,
                               toolProps,

                               onUpdated
                           }
) => {
    //TODO:
    const columns = options.map(row=>row.name);
    const countColumns = options.length;
    options.includes("tool") && columns.push(columnToolComponent({width:"32px", ...toolProps}));
    options.includes("main") && columns.push(columnMainDataComponent({width: "50%", onUpdated: () => onUpdated()}));
    options.includes("customer") && columns.push(columnCustomerComponent({width: "15%"}));
    options.includes("progress") && columns.push(columnProgressComponent({width: "5%"}));
    options.includes("status") && columns.push(columnStatusComponent({width: "10%"}));
    options.includes("price") && columns.push(columnPriceComponent({width: "15%"}));
    return columns;
}
export const GetFullColumns = ({
                                   permissions,
                                   onUpdated
                               }
) => ([

    //columnProgressComponent("5%"),
    //columnToolComponent("20px"),
    columnMainDataComponent({width: "60%", onUpdated: () => onUpdated()}),
    columnCustomerComponent("15%"),
    columnStatusComponent("10%"),
    columnPriceComponent("15%")
])
const columnProgressComponent = (width = "8%") => ({
    title: 'Прогресс',
    dataIndex: 'progress',
    key: 'progress',
    width: width,
    align: "left",
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

const columnToolComponent = ({width = "2%", toolProps}) => {
    return {
        key: 'edit',
        width: width,
        render: (text, record) => <>
            <ColumnToolRender text={text} record={record} {...toolProps}/>
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
        align: "left",
        render:
            (text, record) => {
                const maxNumberRecord = record?.project_contract_history?.reduce((max, current) => {
                    return (current.number > (max?.number || 0)) ? current : max;
                }, null);

                const fileId = maxNumberRecord ? maxNumberRecord.file_id : null;

                return (
                    <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                        <Title level={5} style={{marginTop: 0}}>{record.name}</Title>
                        <Divider style={{margin: "3px"}}/>
                        <Text>{record.number}</Text>
                        <Text>({record.type_project_document?.code ?? ""}) {record.type_project_document?.name ?? ""}</Text>
                        <Divider style={{margin: "3px", marginBottom: 0}}/>
                        <Space.Compact direction={"horizontal"}>
                            {record?.signed_file_id ? (
                                    <>
                                        <LinkToDownload fileId={record.signed_file_id}>Скачать (подписан)
                                            от {record.date_signing}</LinkToDownload>
                                    </>
                                ) :
                                (
                                    <>
                                        <ProjectFileDownload projectId={record.id} icon={<PlusOutlined/>}>Сгенерировать
                                            договор</ProjectFileDownload>
                                        {(fileId) ?
                                            (<>
                                                    <UploadFileProjectContractSigned
                                                        type={"primary"}
                                                        icon={<UploadOutlined/>}
                                                        onUpdated={() => onUpdated()}
                                                        projectId={record.id}>Загрузить
                                                        подписанный файл</UploadFileProjectContractSigned>

                                                    <LinkToDownload
                                                        fileId={fileId}
                                                        icon={<DownloadOutlined/>}>Скачать
                                                        последний вариант</LinkToDownload>
                                                    <Button icon={<MoreOutlined/>}/>
                                                </>
                                            ) :
                                            (
                                                <>
                                                </>
                                            )}

                                    </>
                                )}

                        </Space.Compact>
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
        align:
            "left",
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
        align: "left",
        render:
            (text, record) => (
                <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                    <Text strong>Статус:</Text>
                    <Text>{record.status?.name}</Text>
                    <Text strong>Сроки:</Text>
                    {
                        record.date_signing ?
                            <Text>с {dayjs(record?.date_signing).format("DD.MM.YYYY")}</Text>
                            :
                            <Text type="danger">Не подписан</Text>
                    }
                    {
                        record.date_end ?
                            <Text>по {dayjs(record?.date_end).format("DD.MM.YYYY")}</Text>
                            :
                            <Text type="danger">Не задана дата окончания</Text>
                    }
                    {
                        record.date_end && record.date_signing ?
                            (
                                <Text>{dayjs(record.date_end).diff(dayjs(record.date_signing), 'day')} (дней)</Text>) : null
                    }
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
        align: "left",
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
