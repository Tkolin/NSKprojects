import {Button, Popconfirm, Row, Space, Tooltip, Typography} from "antd";
import Link from "antd/es/typography/Link";
import {
    DeleteOutlined,
    EditOutlined, MinusOutlined, PlusOutlined,
    PushpinFilled,
    PushpinOutlined,
    ReconciliationOutlined,
    UserOutlined
} from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import ProjectFileDownload from "../../components/script/fileDownloadScripts/ProjectFileDownload";
import {facilitiesToFullCode} from "../../components/script/rebuildData/ProjectRebuilderQuery";
import dayjs from "dayjs";
import React from "react";
import {StyledButtonGreen} from "../../components/style/ButtonStyles";

const formatCurrency = (amount) => {
    return amount.toLocaleString('ru-RU', {style: 'currency', currency: 'RUB'});
};
const {Text} = Typography;

const columnProgress = (status) => {
    switch (status) {
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
// DESIGN_REQUEST,Запрос на проектирование
// APPROVAL_KP,Согласование КП
// APPROVAL_AGREEMENT,Согласование договора
// WAITING_SOURCE,Ожидание исходных материалов
// WORKING,В работе


export const GetRequestColumns = ({
                                      status = "all",
                                      permissions,
                                      setEditModalStatus,
                                      setProjectTasksModalStatus,
                                      createTemplate
                                  }) => {
    const columns = [{
        title: 'Письмо',
        dataIndex: 'message',
        key: 'message',
        width: "10%",
        align: "left",
        render: (text, record) => (
            <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                <Link>Перейти к письмам</Link>
                <Link type={"success"}>Сгенерировать шаблон письма</Link>
                <Link type={"danger"}>Сформировать КП</Link>
            </Space.Compact>),
    },
        // {
        //     key: 'edit',
        //     width: "2%",
        //     render: (text, record) => (
        //         <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
        //             <Link>
        //                 <Tooltip title={"Изменить данные проекта"}>
        //                     <EditOutlined
        //                         onClick={() => {
        //                             setEditModalStatus({
        //                                 type: "project",
        //                                 project: record
        //                             })
        //                             console.log("dsa");
        //                         }}/>
        //                 </Tooltip>
        //
        //             </Link>
        //             <Link type={"secondary"}>
        //                 <Tooltip title={"Удаление недоступно (администратор)"}>
        //
        //                     <DeleteOutlined/>
        //                 </Tooltip>
        //             </Link>
        //             <div>
        //                 {!(record.project_stages.find(row => {
        //                     return (row.date_end && row.date_start)
        //                 })) ? (
        //                     <Link type={"danger"}>
        //                         <Tooltip title={"Недостаточно данных об этапах, для создания задач"}>
        //                             <ReconciliationOutlined/>
        //                         </Tooltip>
        //                     </Link>
        //                 ) : (
        //                     <Link>
        //                         <Tooltip title={"Создать задачи"}>
        //                             <ReconciliationOutlined onClick={() => {
        //                                 setProjectTasksModalStatus({
        //                                     project_id: record.id,
        //                                     mode: "create",
        //                                 })
        //                             }}/>
        //                         </Tooltip>
        //                     </Link>
        //                 )}
        //             </div>
        //             <div>
        //                 {record.id === record?.type_project_document?.template_project_id ?
        //                     (
        //                         <Row style={{margin: 'auto'}}>
        //                             <Tooltip title={"Является шаблоном"}>
        //                                 <Link type={"secondary"}>
        //                                     <PushpinFilled/>
        //                                 </Link>
        //                             </Tooltip>
        //                         </Row>)
        //                     :
        //                     <Row style={{margin: 'auto'}}>
        //                         <Tooltip title={"Установить как шаблон"}>
        //                             <Popconfirm
        //                                 title={"Создание шаблона на основе этого проекта"}
        //                                 description={"Вы уверены? это изменит существующий шаблон!"}
        //                                 onConfirm={() => createTemplate(record.id, record?.type_project_document?.id)}
        //                                 icon={
        //                                     <Text type={"danger"}>
        //                                         <PushpinOutlined/>
        //                                     </Text>
        //                                 }
        //                             >
        //                                 <Link>
        //                                     <PushpinOutlined/>
        //                                 </Link>
        //                             </Popconfirm>
        //                         </Tooltip>
        //
        //                     </Row>
        //
        //                 }
        //             </div>
        //         </Space.Compact>
        //     ),
        // },
        {
            title: 'Основные данные',
            permission: 'read-project',
            dataIndex: 'main_data',
            key: 'main_data',
            width: "48%",
            align: "left",
            render:
                (text, record) => (
                    <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                        <Title level={5} style={{marginTop: 0}}>{record.name}</Title>
                        <Text>Дата предложения: {new Date().getFullYear()} </Text>
                    </Space.Compact>
                ),
        },
        {
            title: 'Данные о заказчике',
            permission: 'read-organization',
            dataIndex:
                'customer_data',
            key:
                'customer_data',
            width:
                "15%",
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
        },
        {
            title: 'Управление',
            permission: 'read-organization',
            dataIndex:
                'activity',
            key:
                'activity',
            width:
                "15%",
            align:
                "left",
            render:
                (text, record) => (
                    <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>

                        <StyledButtonGreen   icon={<PlusOutlined/>}> Принять</StyledButtonGreen>
                        <Button  danger icon={<MinusOutlined/>}> Отказаться</Button>
                    </Space.Compact>
                ),
        },
    ];
    return columns;
}
export const GetFullColumns = (
                                    permissions,
                                   setEditModalStatus,
                                   setProjectTasksModalStatus,
                                   createTemplate
                               ) => {
    const columns = [{
        title: 'Прогресс',
        dataIndex: 'progress',
        key: 'progress',
        width: "10%",
        align: "left",
        render: (text, record) => columnProgress(record?.status?.name_key),
    },
        {
            key: 'edit',
            width: "2%",
            render: (text, record) => (
                <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                    <Link>
                        <Tooltip title={"Изменить данные проекта"}>
                            <EditOutlined
                                onClick={() => {
                                    setEditModalStatus({
                                        type: "project",
                                        project: record
                                    })
                                    console.log("dsa");
                                }}/>
                        </Tooltip>

                    </Link>
                    <Link type={"secondary"}>
                        <Tooltip title={"Удаление недоступно (администратор)"}>

                            <DeleteOutlined/>
                        </Tooltip>
                    </Link>
                    <div>
                        {!(record.project_stages.find(row => {
                            return (row.date_end && row.date_start)
                        })) ? (
                            <Link type={"danger"}>
                                <Tooltip title={"Недостаточно данных об этапах, для создания задач"}>
                                    <ReconciliationOutlined/>
                                </Tooltip>
                            </Link>
                        ) : (
                            <Link>
                                <Tooltip title={"Создать задачи"}>
                                    <ReconciliationOutlined onClick={() => {
                                        setProjectTasksModalStatus({
                                            project_id: record.id,
                                            mode: "create",
                                        })
                                    }}/>
                                </Tooltip>
                            </Link>
                        )}
                    </div>
                    <div>
                        {record.id === record?.type_project_document?.template_project_id ?
                            (
                                <Row style={{margin: 'auto'}}>
                                    <Tooltip title={"Является шаблоном"}>
                                        <Link type={"secondary"}>
                                            <PushpinFilled/>
                                        </Link>
                                    </Tooltip>
                                </Row>)
                            :
                            <Row style={{margin: 'auto'}}>
                                <Tooltip title={"Установить как шаблон"}>
                                    <Popconfirm
                                        title={"Создание шаблона на основе этого проекта"}
                                        description={"Вы уверены? это изменит существующий шаблон!"}
                                        onConfirm={() => createTemplate(record.id, record?.type_project_document?.id)}
                                        icon={
                                            <Text type={"danger"}>
                                                <PushpinOutlined/>
                                            </Text>
                                        }
                                    >
                                        <Link>
                                            <PushpinOutlined/>
                                        </Link>
                                    </Popconfirm>
                                </Tooltip>

                            </Row>

                        }
                    </div>
                </Space.Compact>
            ),
        },
        {
            title: 'Основные данные',
            permission: 'read-project',
            dataIndex: 'main_data',
            key: 'main_data',
            width: "48%",
            align: "left",
            render:
                (text, record) => (
                    <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
                        <Title level={5} style={{marginTop: 0}}>{record.name}</Title>
                        <Text>{record.number}</Text>
                        <Text>({record.type_project_document?.code ?? ""}) {record.type_project_document?.name ?? ""}</Text>
                        <ProjectFileDownload text={"Скачать договор"} projectId={record.id}/>
                    </Space.Compact>
                ),
        },
        {
            title: 'Данные о заказчике',
            permission: 'read-organization',
            dataIndex:
                'customer_data',
            key:
                'customer_data',
            width:
                "15%",
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
        },
        {
            title: 'Статус',
            dataIndex: 'status_data',
            key: 'status_data',
            width: "15%",
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
        },
        {
            title: 'Стоимость',
            permission: 'read-project-economy',
            dataIndex: 'price_data',
            key: 'price_data',
            width: "10%",
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
        },
    ];
    return columns;
}