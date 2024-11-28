import { Space, Typography } from "antd";
import dayjs from "dayjs";
import React from "react";

const { Text } = Typography;

const ColumnMoneyRender = ({ text, record }) => {
  const permissions = JSON.parse(localStorage.getItem("userPermissions")).map(
    (row) => row.name_key
  );
  if (!permissions.includes("read-project-payments")) return null;
  return (
    <Space.Compact direction={"vertical"} style={{ alignContent: "start" }}>
      <Text>
        Стоимость проекта: <strong>{record.price} руб.</strong>
      </Text>
      <Text>
        Аванс: ({record.prepayment} %):{" "}
        <strong>{(record.price / 100) * record.prepayment} руб.</strong>
      </Text>
      <Text>
        Дата подписания договора:{" "}
        <strong>
          {dayjs(record.date_signing).format("DD.MM.YYYY") + "г."}
        </strong>
      </Text>
      <Text>
        На продолжительность: <strong>{record.duration} дней</strong>
      </Text>
    </Space.Compact>
  );
};
export default ColumnMoneyRender;
