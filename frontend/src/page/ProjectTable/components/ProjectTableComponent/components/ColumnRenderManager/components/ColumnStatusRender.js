import { Space, Typography } from "antd";
import dayjs from "dayjs";
const { Text } = Typography;

const ColumnStatusRender = ({ text, record, status }) => {
  return (
    <Space.Compact direction={"vertical"} style={{ alignContent: "start" }}>
      <Text strong>Статус:</Text>
      <Text>{record.status?.name}</Text>
      <Text>Продолжительность: {record.duration} дней</Text>
      <Text strong>Сроки:</Text>
      {record.date_signing ? (
        <Text>
          Дата подписания договора:{" "}
          {dayjs(record?.date_signing).format("DD.MM.YYYY")}
        </Text>
      ) : (
        <Text type="danger">Не подписан</Text>
      )}
      {record.date_start ? (
        <Text>
          Дата начала: {dayjs(record?.date_start).format("DD.MM.YYYY") + "г."}
        </Text>
      ) : (
        <Text>Проект не в работе</Text>
      )}
    </Space.Compact>
  );
};
export default ColumnStatusRender;
