import { EditOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { Button, notification, Space, Table, Tooltip, Typography } from "antd";
import Link from "antd/es/typography/Link";
import React, { useEffect } from "react";
import { EXECUTOR_ORDERS_PROJECT_QUERY } from "../../../../../../../graphql/queriesSpecial";
import { UploadFilePopconfirm } from "../../../../../../components/UploadFile";

const openNotification = (placement, type, message) => {
  notification[type]({
    message: message,
    placement,
  });
};

const { Text } = Typography;
const TablePaymentExecutorOrdersComponent = ({
  setEditModalStatus,
  projectId,
}) => {
  const {
    data: executorOrders,
    loading: loading,
    error: error,
    refetch: refetch,
  } = useQuery(EXECUTOR_ORDERS_PROJECT_QUERY, {
    variables: {
      projectId: projectId,
    },
  });

  useEffect(() => {
    console.log(executorOrders);
  }, [executorOrders]);

  const columnsTasks = [
    {
      title: (
        <Space>
          <Tooltip title={"Список задач"}>
            <Text style={{ marginRight: 10 }}>Список счетов на оплату</Text>
          </Tooltip>
          <Link type={"warning"}>
            <EditOutlined
              onClick={() => setEditModalStatus && setEditModalStatus()}
            />
          </Link>
        </Space>
      ),
      children: [
        {
          width: "30%",
          title: "Основная информация",
          key: "task",
          align: "left",
          render: (text, record) => (
            <Space.Compact
              direction={"vertical"}
              style={{ alignContent: "start", width: "100%" }}
            >
              <Text strong>{record?.number}</Text>
              <Text strong>
                {record.executor.passport.last_name}{" "}
                {record.executor.passport.first_name}{" "}
                {record.executor.passport.patronymic}
              </Text>
              {/*{record.project_tasks.map(row=><>{row?.task?.name}</>)}*/}
            </Space.Compact>
          ),
        },
        {
          width: "30%",
          title: "Суммы",
          key: "task",
          align: "left",
          render: (text, record) => {
            const totalPrice =
              record?.project_tasks?.reduce(
                (sum, task) => sum + (task.price || 0),
                0
              ) || 0;
            return (
              <Space.Compact
                direction={"vertical"}
                style={{ alignContent: "start", width: "100%" }}
              >
                <Text strong>Общая сумма: {totalPrice}</Text>
                {/* TODO:Добавить проверку */}
                <Text strong>
                  Платежи: <span>{totalPrice * 0.3}</span>/
                  <span>{totalPrice * 0.3}</span>/
                  <span>{totalPrice * 0.4}</span>
                </Text>
              </Space.Compact>
            );
          },
        },
        {
          width: "60%",
          title: "Статус",
          key: "task",
          align: "left",
          render: (text, record) => (
            <Space
              direction={"vertical"}
              style={{ alignContent: "start", width: "100%" }}
            >
              {!record?.signed_file_id ? (
                <Text type={"danger"}>Договор не подписан</Text>
              ) : !record?.payment_file_completed?.includes("PREPAYMENT") ? (
                <UploadFilePopconfirm
                  options={{ datePicker: true }}
                  onUpdated={() => refetch()}
                  action={
                    "project/upload/executor_order_payment/page?executorOrderId=" +
                    record.id +
                    "&status=PREPAYMENT"
                  }
                >
                  <Button type={"text"}>Подтвердить оплату аванса</Button>
                </UploadFilePopconfirm>
              ) : !record?.payment_file_completed?.includes("MAINPAYMENT") ? (
                record.is_tasks_completed ? (
                  <UploadFilePopconfirm
                    options={{ datePicker: true }}
                    onUpdated={() => refetch()}
                    action={
                      "project/upload/executor_order_payment/page?executorOrderId=" +
                      record.id +
                      "&status=MAINPAYMENT"
                    }
                  >
                    <Button warring type={"text"}>
                      Подтвердить оплату основной суммы
                    </Button>
                  </UploadFilePopconfirm>
                ) : (
                  <Button type={"text"} disabled>
                    В работе
                  </Button>
                )
              ) : !record?.payment_file_completed?.includes("POSTPAYMENT") &&
                record.project_completed ? (
                <UploadFilePopconfirm
                  options={{ datePicker: true }}
                  onUpdated={() => refetch()}
                  action={
                    "project/upload/executor_order_payment/page?executorOrderId=" +
                    record.id +
                    "&status=POSTPAYMENT"
                  }
                >
                  <Button warring type={"text"}>
                    Подтвердить постоплату
                  </Button>
                </UploadFilePopconfirm>
              ) : (
                <Button type={"text"} disabled>
                  Ожидание завершения проекта
                </Button>
              )}
              {/*<Text strong>{record?.project_tasks}</Text>*/}
              {/*{record.project_tasks.map(row=><>{row?.task?.name}</>)}*/}
            </Space>
          ),
        },
        // {
        //     width: '20%',
        //
        //     title: 'Исполнитель',
        //     key: 'task',
        //     align: "left",
        //     render: (text, record) => (
        //         <Space.Compact direction={"vertical"} style={{alignContent: "start"}}>
        //             <Text
        //                 strong>{record?.executor?.passport?.lastname} {record?.executor?.passport?.firstname} {record?.executor?.passport?.patronymic}</Text>
        //         </Space.Compact>
        //     ),
        // },
        // {
        //     width: '20%',
        //     title: 'Статус',
        //     key: 'task',
        //     align: "left",
        //     render: (text, record) => <StatusRender projectTask={record}/>
        // },
      ],
    },
  ];
  const getNameOrder = (executorOrders) => {
    return "";
  };
  const filterAndSortOrders = (orders) => {
    if (!orders) return;
    // Функция для определения приоритета кнопки
    const getButtonPriority = (record) => {
      if (!record?.payment_file_completed?.includes("PREPAYMENT")) {
        return 1; // Аванс
      }
      if (!record?.payment_file_completed?.includes("MAINPAYMENT")) {
        return 2; // Основная оплата
      }
      if (
        !record?.payment_file_completed?.includes("POSTPAYMENT") &&
        record.project_completed
      ) {
        return 3; // Постоплата
      }
      return 4; // Остальные
    };

    const sortedOrders = [...orders]?.sort((a, b) => {
      // Сортировка по приоритету кнопок
      const priorityA = getButtonPriority(a);
      const priorityB = getButtonPriority(b);

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
    });
    return sortedOrders;
  };
  return (
    <Table
      style={{ margin: 0, width: "100%" }}
      size={"small"}
      columns={columnsTasks}
      loading={loading}
      dataSource={filterAndSortOrders(executorOrders?.executorOrders)}
      pagination={false}
    />
  );
};

export default TablePaymentExecutorOrdersComponent;
