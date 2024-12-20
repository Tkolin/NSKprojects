import { EditOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import { Button, notification, Space, Table, Tooltip, Typography } from "antd";
import Link from "antd/es/typography/Link";
import { nanoid } from "nanoid";
import React, { useEffect } from "react";
import { ALLOW_NEXT_PAYMENT_EXECUTOR_CONTRACT } from "../../../../../../../graphql/mutations/executorOrder";
import { DOWNLOAD_FILE } from "../../../../../../../graphql/mutations/file";
import { EXECUTOR_ORDERS_PROJECT_QUERY } from "../../../../../../../graphql/queries/queriesSpecial";
import { StyledButtonGreen } from "../../../../../../components/style/ButtonStyles";
import { UploadFilePopconfirm } from "../../../../../../components/UploadFile";

const openNotification = (placement, type, message) => {
  notification[type]({
    message: message,
    placement,
  });
};
function formatToRub(value) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
const { Text } = Typography;
const TablePaymentExecutorOrdersComponent = ({
  setEditModalStatus,
  projectId,
  options,
}) => {
  useEffect(() => {
    refetch();
  }, []);
  const { data, loading, error, refetch } = useQuery(
    EXECUTOR_ORDERS_PROJECT_QUERY,
    {
      variables: {
        projectId: projectId,
      },
    }
  );

  const [downloadFileMutation, { loading: loadingDownload }] = useMutation(
    DOWNLOAD_FILE,
    {
      onCompleted: (data) => {
        handleDownloadClick(data.downloadFile.url);
      },
      onError: (error) => {
        openNotification(
          "topRight",
          "error",
          "Ошибка при загрузке: " + error.message
        );
      },
    }
  );
  const [allowNextPayment, { loading: loadingAllowNextPayment }] = useMutation(
    ALLOW_NEXT_PAYMENT_EXECUTOR_CONTRACT,
    {
      onCompleted: (data) => {
        refetch();
        openNotification("topRight", "success", "Договор отправленн на оплату");
      },
      onError: (error) => {
        openNotification(
          "topRight",
          "error",
          "Ошибка при одобрении: " + error.message
        );
      },
    }
  );
  const handleAllowNextPayment = (orderId) => {
    allowNextPayment({ variables: { orderId } });
  };
  const LaravelURL = process.env.REACT_APP_API_URL;
  const downloadFile = (fileId) => {
    downloadFileMutation({ variables: { id: fileId } });
  };
  const handleDownloadClick = async (downloadedFileUrl) => {
    try {
      const link = document.createElement("a");
      console.log(link);
      link.href = `${LaravelURL}${downloadedFileUrl}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Ошибка при скачивании файла:", error);
    }
  };
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
          width: "15%",
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
          width: "15%",
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
                <Text strong>Общая сумма: {formatToRub(totalPrice)}</Text>
                {/* TODO:Добавить проверку */}
                <Text strong>
                  Аванс/Основная сумма/Постоплата:
                  <br />
                  <span>{formatToRub(totalPrice * 0.3)}</span>/
                  <span>{formatToRub(totalPrice * 0.3)}</span>/
                  <span>{formatToRub(totalPrice * 0.4)}</span>
                </Text>
              </Space.Compact>
            );
          },
        },
        // {
        //   width: "15%",
        //   title: "test",
        //   key: "task",
        //   align: "left",
        //   render: (text, record) => {
        //     return <>{record?.is_project_prepayment}</>;
        //   },
        // },
        {
          width: "15%",
          title: "Неообходимость оплачивать",
          key: "task",
          align: "left",
          render: (text, record) => {
            const renderButton = () => {
              if (!record?.signed_file_id) {
                return (
                  <Button type="text" disabled>
                    Договор не подписан
                  </Button>
                );
              }
              if (!record?.is_project_prepayment) {
                return (
                  <Button type="text" disabled>
                    Аванс не получен
                  </Button>
                );
              }

              if (!record?.payment_file_completed?.includes("PREPAYMENT")) {
                return (
                  <UploadFilePopconfirm
                    key={nanoid()}
                    options={{ datePicker: true }}
                    onUpdated={() => refetch()}
                    action={
                      "project/upload/executor_order_payment/page?executorOrderId=" +
                      record.id +
                      "&status=PREPAYMENT"
                    }
                  >
                    <Button danger>Подтвердите оплату аванса</Button>
                  </UploadFilePopconfirm>
                );
              }
              if (!record.is_tasks_completed) {
                return (
                  <Button type="text" disabled>
                    В работе
                  </Button>
                );
              }
              if (!record?.is_possible_mainpayment) {
                return (
                  <Button type="text" disabled>
                    Ждёт одобрения на оплату
                  </Button>
                );
              }
              if (!record?.payment_file_completed?.includes("PAYMENT")) {
                return (
                  <UploadFilePopconfirm
                    key={nanoid()}
                    options={{ datePicker: true }}
                    onUpdated={() => refetch()}
                    action={
                      "project/upload/executor_order_payment/page?executorOrderId=" +
                      record.id +
                      "&status=PAYMENT"
                    }
                  >
                    <Button danger>Подтвердите оплату основной суммы</Button>
                  </UploadFilePopconfirm>
                );
              }
              if (!record.project_completed)
                return (
                  <Text type="text" danger disabled>
                    Ожидает завершения проекта
                  </Text>
                );
              if (!record?.is_possible_postpayment) {
                return (
                  <Button type="text" disabled>
                    Ждёт одобрения на оплату
                  </Button>
                );
              }
              if (!record?.payment_file_completed?.includes("POSTPAYMENT")) {
                return (
                  <UploadFilePopconfirm
                    key={nanoid()}
                    options={{ datePicker: true }}
                    onUpdated={() => refetch()}
                    action={
                      "project/upload/executor_order_payment/page?executorOrderId=" +
                      record.id +
                      "&status=POSTPAYMENT"
                    }
                  >
                    <Button danger type="text">
                      Подтвердите постоплату
                    </Button>
                  </UploadFilePopconfirm>
                );
              }

              return (
                <Button type="text" disabled>
                  Ожидание завершения проекта
                </Button>
              );
            };

            return (
              <Space
                direction="vertical"
                style={{ alignContent: "start", width: "100%" }}
              >
                {renderButton()}
              </Space>
            );
          },
        },
        {
          width: "15%",
          title: "Одобрение на оплату",
          key: "pre_task",
          align: "left",
          render: (text, record) => {
            return (
              <Space direction="vertical">
                {record?.is_project_prepayment ? (
                  <span style={{ color: "#52c41a" }}>
                    Аванс по проекту оплачен
                  </span>
                ) : (
                  <span style={{ color: "#faad14" }}>
                    Аванс по проекту не оплачен
                  </span>
                )}
                {record?.is_all_tasks_payment ? (
                  <span style={{ color: "#52c41a" }}>
                    Все задачи оплачены заказчиком
                  </span>
                ) : (
                  <span style={{ color: "#faad14" }}>
                    Не все задачи оплачены заказчиком
                  </span>
                )}
                {record?.is_possible_mainpayment ? (
                  <span style={{ color: "#52c41a" }}>
                    Оплата основной части договора разрешена
                  </span>
                ) : (
                  <span style={{ color: "#f5222d" }}>
                    Оплата основной части договора не разрешена
                  </span>
                )}
                {record?.is_possible_postpayment ? (
                  <span style={{ color: "#52c41a" }}>Постоплата разрешена</span>
                ) : (
                  <span style={{ color: "#f5222d" }}>
                    Постоплата не разрешена
                  </span>
                )}
                {record?.is_possible_mainpayment ? (
                  !record?.is_possible_postpayment && (
                    <Button
                      onClick={() => handleAllowNextPayment(record.id)}
                      loading={loadingAllowNextPayment}
                    >
                      Одобрить постоплату
                    </Button>
                  )
                ) : (
                  <Button
                    onClick={() => handleAllowNextPayment(record.id)}
                    loading={loadingAllowNextPayment}
                  >
                    Одобрить оплату основной суммы
                  </Button>
                )}
              </Space>
            );
          },
        },
        {
          width: "15%",
          title: "Подтвер. платёж файлы",
          key: "paycheck",
          align: "left",
          render: (text, record) => (
            <Space
              direction={"vertical"}
              style={{ alignContent: "start", width: "100%" }}
            >
              {record?.payment_file_completed.includes("PREPAYMENT") &&
              record?.executor_order_payments?.find(
                (row) => row.type_payment === "PREPAYMENT"
              )?.file_id ? (
                <StyledButtonGreen
                  onClick={() =>
                    downloadFile(
                      record?.executor_order_payments?.find(
                        (row) => row.type_payment === "PREPAYMENT"
                      )?.file_id
                    )
                  }
                >
                  Скачать
                </StyledButtonGreen>
              ) : (
                <Button type={"text"} disabled>
                  Нет файла
                </Button>
              )}
              {record?.payment_file_completed.includes("PAYMENT") &&
              record?.executor_order_payments?.find(
                (row) => row.type_payment === "PAYMENT"
              )?.file_id ? (
                <StyledButtonGreen
                  onClick={() =>
                    downloadFile(
                      record?.executor_order_payments?.find(
                        (row) => row.type_payment === "PAYMENT"
                      )?.file_id
                    )
                  }
                >
                  Скачать
                </StyledButtonGreen>
              ) : (
                <Button type={"text"} disabled>
                  Нет файла
                </Button>
              )}
              {record?.payment_file_completed.includes("POSTPAYMENT") &&
              record?.executor_order_payments?.find(
                (row) => row.type_payment === "POSTPAYMENT"
              )?.file_id ? (
                <StyledButtonGreen
                  onClick={() =>
                    downloadFile(
                      record?.executor_order_payments?.find(
                        (row) => row.type_payment === "POSTPAYMENT"
                      )?.file_id
                    )
                  }
                >
                  Скачать
                </StyledButtonGreen>
              ) : (
                <Button type={"text"} disabled>
                  Нет файла
                </Button>
              )}
            </Space>
          ),
        },
        {
          width: "15%",
          title: "Чек исполнителя",
          key: "order_payment_download",
          align: "left",
          render: (text, record) => (
            <Space
              direction={"vertical"}
              style={{ alignContent: "start", width: "100%" }}
            >
              {record?.payment_file_completed.includes("PREPAYMENT") ? (
                record?.executor_order_payments?.find(
                  (row) => row.type_payment === "PREPAYMENT"
                )?.paycheck_file_id ? (
                  <StyledButtonGreen
                    onClick={() =>
                      downloadFile(
                        record?.executor_order_payments?.find(
                          (row) => row.type_payment === "PREPAYMENT"
                        )?.paycheck_file_id
                      )
                    }
                  >
                    Скачать
                  </StyledButtonGreen>
                ) : (
                  <UploadFilePopconfirm
                    key={nanoid()}
                    options={{ datePicker: false }}
                    onUpdated={() => refetch()}
                    action={
                      "project/upload/executor_order_payment_paycheck/page?executorOrderPaymentId=" +
                      record?.executor_order_payments?.find(
                        (row) => row.type_payment === "PREPAYMENT"
                      )?.id
                    }
                  >
                    <Button type={"text"}>Прикрепите чек</Button>
                  </UploadFilePopconfirm>
                )
              ) : (
                <Button type={"text"} disabled>
                  Не произведена оплата
                </Button>
              )}
              {record?.payment_file_completed.includes("PAYMENT") ? (
                record?.executor_order_payments?.find(
                  (row) => row.type_payment === "PAYMENT"
                )?.paycheck_file_id ? (
                  <StyledButtonGreen
                    onClick={() =>
                      downloadFile(
                        record?.executor_order_payments?.find(
                          (row) => row.type_payment === "PAYMENT"
                        )?.paycheck_file_id
                      )
                    }
                  >
                    Скачать
                  </StyledButtonGreen>
                ) : (
                  <UploadFilePopconfirm
                    key={nanoid()}
                    options={{ datePicker: false }}
                    onUpdated={() => refetch()}
                    action={
                      "project/upload/executor_order_payment_paycheck/page?executorOrderPaymentId=" +
                      record?.executor_order_payments?.find(
                        (row) => row.type_payment === "PAYMENT"
                      )?.id
                    }
                  >
                    <Button type={"text"}>Прикрепите чек</Button>
                  </UploadFilePopconfirm>
                )
              ) : (
                <Button type={"text"} disabled>
                  Не произведена оплата
                </Button>
              )}
              {record?.payment_file_completed.includes("POSTPAYMENT") ? (
                record?.executor_order_payments?.find(
                  (row) => row.type_payment === "POSTPAYMENT"
                )?.paycheck_file_id ? (
                  <StyledButtonGreen
                    onClick={() =>
                      downloadFile(
                        record?.executor_order_payments?.find(
                          (row) => row.type_payment === "POSTPAYMENT"
                        )?.paycheck_file_id
                      )
                    }
                  >
                    Скачать
                  </StyledButtonGreen>
                ) : (
                  <UploadFilePopconfirm
                    key={nanoid()}
                    options={{ datePicker: false }}
                    onUpdated={() => refetch()}
                    action={
                      "project/upload/executor_order_payment_paycheck/page?executorOrderPaymentId=" +
                      record?.executor_order_payments?.find(
                        (row) => row.type_payment === "POSTPAYMENT"
                      )?.id
                    }
                  >
                    <Button type={"text"}>Прикрепите чек</Button>
                  </UploadFilePopconfirm>
                )
              ) : (
                <Button type={"text"} disabled>
                  Не произведена оплата
                </Button>
              )}
            </Space>
          ),
        },
        // {
        //   width: "20%",

        //   title: "Исполнитель",
        //   key: "task",
        //   align: "left",
        //   render: (text, record) => (
        //     <Space.Compact
        //       direction={"vertical"}
        //       style={{ alignContent: "start" }}
        //     >
        //       <Text strong>
        //         {record?.executor?.passport?.lastname}{" "}
        //         {record?.executor?.passport?.firstname}{" "}
        //         {record?.executor?.passport?.patronymic}
        //       </Text>
        //     </Space.Compact>
        //   ),
        // },
        {
          width: "15%",
          title: "Этапность",
          key: "task",
          align: "left",
          render: (text, record) => {
            const totalPrice =
              record?.project_tasks?.reduce(
                (sum, task) => sum + (task.price || 0),
                0
              ) || 0;
            return (
              <Space
                direction="vertical"
                style={{ alignContent: "start", width: "100%" }}
              >
                <Text
                  strong
                  style={{
                    whiteSpace: "nowrap",
                    lineHeight: "32px",
                    color: !record?.signed_file_id
                      ? "#faad14"
                      : record?.payment_file_completed.includes("PREPAYMENT") &&
                        record?.executor_order_payments?.find(
                          (row) => row.type_payment === "PREPAYMENT"
                        )?.file_id
                      ? "#52c41a"
                      : "#f5222d",
                  }}
                >
                  Аванс: {formatToRub(totalPrice * 0.3)}
                </Text>
                <Text
                  strong
                  style={{
                    whiteSpace: "nowrap",
                    lineHeight: "32px",
                    color: !record?.signed_file_id
                      ? "#121212"
                      : !record.is_tasks_completed
                      ? "#faad14"
                      : record?.payment_file_completed.includes("PAYMENT") &&
                        record?.executor_order_payments?.find(
                          (row) => row.type_payment === "PAYMENT"
                        )?.file_id
                      ? "#52c41a"
                      : "#f5222d",
                  }}
                >
                  Основаная сумма: {formatToRub(totalPrice * 0.3)}
                </Text>
                <Text
                  strong
                  style={{
                    whiteSpace: "nowrap",
                    lineHeight: "32px",
                    color: !(
                      record.is_tasks_completed && record?.signed_file_id
                    )
                      ? "#121212"
                      : !record.project_completed
                      ? "#faad14"
                      : record?.payment_file_completed.includes(
                          "POSTPAYMENT"
                        ) &&
                        record?.executor_order_payments?.find(
                          (row) => row.type_payment === "POSTPAYMENT"
                        )?.file_id
                      ? "#52c41a"
                      : "#f5222d",
                  }}
                >
                  Постоплата: {formatToRub(totalPrice * 0.4)}
                </Text>
              </Space>
            );
          },
        },
      ],
    },
  ];
  const getNameOrder = (executorOrders) => {
    return "";
  };
  const filterAndSortOrders = (orders) => {
    if (!orders) return;

    const getButtonPriority = (record) => {
      if (!record?.payment_file_completed?.includes("PREPAYMENT")) {
        return record.is_possible_mainpayment ? 1 : 2; // 1: Одобрено, 2: Не одобрено
      }
      if (!record?.payment_file_completed?.includes("PAYMENT")) {
        return record.is_possible_mainpayment ? 3 : 4; // 3: Одобрено, 4: Не одобрено
      }
      if (
        !record?.payment_file_completed?.includes("POSTPAYMENT") &&
        record.project_completed
      ) {
        return record.is_possible_postpayment ? 5 : 6; // 5: Одобрено, 6: Не одобрено
      }
      return 7;
    };

    // Сортировка заказов по приоритету
    const sortedOrders = [...orders]?.sort((a, b) => {
      const priorityA = getButtonPriority(a);
      const priorityB = getButtonPriority(b);

      if (priorityA !== priorityB) {
        return priorityA - priorityB; // Сравнение приоритетов
      }
      // Если приоритеты одинаковы, сортируем по `updated_at` (последнее обновление)
      return new Date(a.updated_at) - new Date(b.updated_at);
    });

    return sortedOrders;
  };

  return (
    <Table
      style={{ margin: 0, width: "100%" }}
      size={"small"}
      columns={columnsTasks}
      loading={loading}
      dataSource={filterAndSortOrders(data?.executorOrders)}
      pagination={false}
    />
  );
};

export default TablePaymentExecutorOrdersComponent;
