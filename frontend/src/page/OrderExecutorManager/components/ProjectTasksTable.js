import { Space, Table, Typography } from "antd";
import dayjs from "dayjs";

const { Text } = Typography;

export const ProjectTasksTable = ({ projectTasks }) => {
  const formatCurrency = (amount) => {
    return amount.toLocaleString("ru-RU", {
      style: "currency",
      currency: "RUB",
    });
  };
  const getDateRange = (record) => {
    if (!record) return "Нет данных";

    const dateStart = record.date_start ? dayjs(record.date_start) : null;
    const dateEnd = record.date_end ? dayjs(record.date_end) : null;
    const dateNow = dayjs();

    const dateStartText = dateStart
      ? dateStart.format("DD.MM.YYYY")
      : "Нет данных";
    const dateEndText = dateEnd
      ? dateEnd.format("DD.MM.YYYY") + "г."
      : "Нет данных";

    let suffix = "";

    if (dateStart && dateStart.isAfter(dateNow)) {
      const daysUntilStart = dateStart.diff(dateNow, "day");
      suffix = `до начала: ${daysUntilStart} дня`;
    } else if (
      dateStart &&
      dateEnd &&
      dateStart.isBefore(dateNow) &&
      dateEnd.isAfter(dateNow)
    ) {
      const daysSinceStart = dateNow.diff(dateStart, "day");
      const daysUntilEnd = dateEnd.diff(dateNow, "day");
      suffix = `прошло времени: ${daysSinceStart} дня, осталось: ${daysUntilEnd} дней`;
    } else if (dateEnd && dateEnd.isBefore(dateNow)) {
      const daysSinceEnd = dateNow.diff(dateEnd, "day");
      suffix = `закончилось: ${daysSinceEnd} дней назад`;
    }

    return `${dateStartText} - ${dateEndText} (${suffix})`;
  };

  const columns = [
    {
      title: "Договор",
      width: "10%",
      key: "status",
      render: (record, text) => (
        <Text>
          {record?.executor_orders?.length ? (
            record.executor_orders.map((second_row) => (
              <>{second_row?.number}</>
            ))
          ) : (
            <> - </>
          )}
        </Text>
      ),
    },
    {
      title: "Задача",
      key: "task",
      width: "100%",
      render: (record, text) => (
        <Space.Compact direction={"vertical"}>
          <Text>{record?.task?.name}</Text>
          <Text>
            <strong>{getDateRange(record)}</strong>
          </Text>
          <Text>
            {record.price
              ? formatCurrency(record.price)
              : "Стоимость не указана !"}
          </Text>
        </Space.Compact>
      ),
    },
  ];
  return (
    <Table
      pagination={false}
      size={"small"}
      rowClassName={(record) =>
        record?.file_path ? "my-ant-table-row-danger" : ""
      }
      columns={columns}
      dataSource={projectTasks.sort(
        (a, b) => new Date(a.date_start) - new Date(b.date_start)
      )}
    />
  );
};
