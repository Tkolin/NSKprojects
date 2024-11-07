import { Divider, Space, Typography } from "antd";
import React from "react";

import Link from "antd/es/typography/Link";
import dayjs from 'dayjs';
import LinkToDownload from "../../../../../components/script/LinkToDownload";
import ColumnCustomerRender from "./components/ColumnCustomerRender";
import ColumnDurationRender from "./components/ColumnDurationRender";
import ColumnMainDataRender from "./components/ColumnMainDataRender";
import ColumnMoneyRender from "./components/ColumnMoneyRender";
import ColumnProgressRender from "./components/ColumnProgressRender";
import ColumnStatusRender from "./components/ColumnStatusRender";
import ColumnToolRenderManager from "./components/ColumnToolRenderManager";

const formatCurrency = (amount) => {
  return amount.toLocaleString("ru-RU", { style: "currency", currency: "RUB" });
};
const { Text } = Typography;

const getColumn = ({ options = {}, onUpdated, expandableTableProps }) => {
  if (!options) return null;
  const columns = [];
  //  Добавление элементов в колонку инструментов
  if (options.tool)
    columns.push(
      columnMenuComponent({
        options: options.tool,
        onUpdated,
        expandableTableProps: expandableTableProps,
      })
    );

  //  Добавление остальных колонок согласно параметрам
  if (options.columns) {
    options.columns.includes("progress") && columns.push(columnProgressComponent());
    options.columns.includes("money") && columns.push(columnMoneyComponent());
    columns.push(columnMainDataComponent());
    options.columns.includes("files") && columns.push(columnFiles());
    options.columns.includes("duration") && columns.push(columnDurationComponent());

  }
  return columns;
};
export default getColumn;
const columnMoneyComponent = () => ({
  key: "money",
  width: "30%",
  render: (text, record) => <ColumnMoneyRender record={record} text={text} />,
});
const columnProgressComponent = () => ({
  key: "progress",
  width: "30%",
  render: (text, record) => (
    <ColumnProgressRender record={record} text={text} />
  ),
});
const columnDurationComponent = () => ({
  key: "duration_data",
  width: "30%",
  render: (text, record) => (
    <ColumnDurationRender record={record} text={text} />
  ),
});
const columnMenuComponent = ({ options, onUpdated, expandableTableProps }) => ({
  key: "options",
  width: "48px",
  render: (text, record) => (
    <ColumnToolRenderManager
      record={record}
      options={options}
      onUpdated={onUpdated}
      expandableTableProps={expandableTableProps}
    />
  ),
});

const columnMainDataComponent = () => ({
  key: "main_data",
  render: (text, record) => (
    <ColumnMainDataRender text={text} record={record} />
  ),
});
const columnCustomerComponent = () => ({
  key: "customer_data",
  render: (text, record) => (
    <ColumnCustomerRender text={text} record={record} />
  ),
});
const columnStatusComponent = (status) => ({
  key: "status_data",
  render: (text, record) => (
    <ColumnStatusRender render={record} status={status} text={text} />
  ),
});
const columnPriceComponent = () => ({
  key: "price_data",
  render: (text, record) => (
    <Space.Compact direction={"vertical"} style={{ alignContent: "start" }}>
      <Text strong>Полная стоимость:</Text>
      <Text>{record.price ? formatCurrency(record.price) : ""} ₽</Text>
      <Text strong>Аванс:</Text>
      <Text>
        {record.prepayment}% (
        {record.price &&
          record.prepayment &&
          formatCurrency((record.price / 100) * record.prepayment)}{" "}
        ₽)
      </Text>
    </Space.Compact>
  ),
});
const columnFiles = () => ({
  key: "files_data",
  render: (text, record) => (
    <Space.Compact direction={"vertical"} style={{ alignContent: "start" }}>
      <Divider>Основные документы</Divider>

      {record.kp_file_id ? (
        <LinkToDownload fileId={record.kp_file_id}>
          <Link strong>Скачать кп подписан: {record.kp_file_id}</Link>
        </LinkToDownload>
      ) : (
        <Text   style={{ color: "red" }}>Отсутвует</Text>
      )}
      {record.kp_file_id ? (
        <LinkToDownload fileId={record.kp_file_id}>
          <Link strong>Скачать договор подписан: {dayjs(record.date_signing).format("DD.MM.YYYY")}</Link>
        </LinkToDownload>
      ) : (
        <Text   style={{ color: "red" }}>Отсутвует</Text>
      )}
      {record.prepayment_file_id ? (
        <LinkToDownload fileId={record.prepayment_file_id}>
          <Link strong>Факт аванса: {record.prepayment_file_id}</Link>
        </LinkToDownload>
      ) : ( 
        <Text   style={{ color: "red" }}>Отсутвует документ подтверждающий аванс</Text>
      )}
      <Divider>По этапам</Divider>
      {record?.project_stages?.map((row) => (
        <Space direction="horizontal">
          Этап №{row.number}
          <Space direction="vertical"></Space>
          {row.work_act_singing_file_id ? (
            <LinkToDownload fileId={row.work_act_singing_file_id}>
              <Link strong>Выполненых работ</Link>
            </LinkToDownload>
          ) : (
            <Text style={{ color: "red" }}>Акт отсутвует в системе</Text>
          )}
          {row.payment_file_id ? (
            <LinkToDownload fileId={row.payment_file_id}>
              <Link strong>Факт оплаты </Link>
            </LinkToDownload>
          ) : (
            <Text style={{ color: "red" }}>
              Факт оплаты отсутвует в системе
            </Text>
          )}
        </Space>
      ))}
    </Space.Compact>
  ),
});
