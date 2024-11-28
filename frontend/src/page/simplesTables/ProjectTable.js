import { useQuery } from "@apollo/client";
import { Form, Input, notification, Space, Table } from "antd";
import React, { useState } from "react";
import { StyledButtonGreen } from "../components/style/ButtonStyles";

import dayjs from "dayjs";
import { PROJECTS_QUERY } from "../../graphql/queries/all";
import { formatToRub } from "../../utils/MoneyFormater";
const { Search } = Input;

const ProjectTable = () => {
  // Состояния

  const [equipmentTypqModalStatus, setProjectStatus] = useState(false);

  const [formSearch] = Form.useForm();
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  // Данные
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const [search, setSearch] = useState("");

  const { loading, error, data, refetch } = useQuery(PROJECTS_QUERY, {
    variables: {
      queryOptions: { page, limit, search, sortField, sortOrder },
    },
  });

  // Функции уведомлений
  const openNotification = (placement, type, message) => {
    notification[type]({
      message: message,
      placement,
    });
  };

  const onSearch = (value) => {
    setSearch(value);
  };

  // Обработка загрузки и ошибок
  if (error) return `Ошибка! ${error.message}`;

  // Формат таблицы
  const columns = [
    {
      title: "№",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Наименование проекта",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Заказчик",
      key: "organization_customer",
      render: (record) =>
        record?.organization_customer?.full_name ??
        record?.organization_customer?.name,
    },
    {
      title: "Дата подписания (Договора)",
      key: "date_signing",
      render: (record) =>
        record?.date_signing
          ? dayjs(record?.date_signing).format("DD.MM.YYYY") + "г."
          : "отсутствует",
    },
    {
      title: "Дата получения ИРД (на 1 этап)",
      key: "date_first_ird_completed",
      render: (record) =>
        record?.date_first_ird_completed
          ? dayjs(record?.date_first_ird_completed).format("DD.MM.YYYY") + "г."
          : "отсутствует",
    },
    {
      title: "Про-сть",
      dataIndex: "duration",
      key: "duration",
    },

    {
      title: "Дата окончания (по плану)",
      key: "date_end_compute",
      render: (record) => {
        if (!record?.date_start || !record?.duration) {
          return "не рассчитана";
        }

        return (
          dayjs(record.date_start)
            .add(record.duration, "day")
            .format("DD.MM.YYYY") + " г."
        );
      },
    },
    {
      title: "Дата окончания (по факту)",
      key: "date_end_fact",
      render: (record) =>
        record?.date_end_fact
          ? dayjs(record?.date_end_fact).format("DD.MM.YYYY") + "г."
          : "не рассчитана",
    },
    {
      title: "Руководитель",
      key: "leader",
      render: (record) =>
        record.leader
          ? record?.leader.passport.last_name +
            " " +
            record?.leader.passport.first_name +
            " " +
            record?.leader.passport.patronymic
          : "отсутствует",
    },
    {
      title: "Стоимость проекта",
      key: "price",
      render: (record) => formatToRub(record.price),
    },
    {
      title: "Количество этапов",
      key: "project_stages.length",
      render: (record) => record?.project_stages.length,
    },
    {
      title: "Аванс",
      key: "prepayment",
      render: (record) => record?.prepayment + "%",
    },
    {
      title: "Фактическое закрытие проекта",
      key: "date_end",
      render: (record) =>
        record.date_end
          ? dayjs(record.date_end).format("DD.MM.YYYY") + "г."
          : "в работе",
    },
    {
      title: "Статус",
      key: "status",
      render: (record) => record?.status.name,
    },
  ];

  const onChange = (sorter) => {
    setSortField(sorter?.field ?? "");
    setSortOrder(
      sorter?.order === "descend"
        ? "desc"
        : sorter?.order === "ascend"
        ? "asc"
        : ""
    );
  };

  return (
    <>
      <Form form={formSearch} layout="horizontal">
        <Form.Item label="Поиск:" name="search">
          <Space>
            <Search placeholder="Найти..." allowClear onSearch={onSearch} />
            <StyledButtonGreen
              loading={loading}
              data-permission={"create-project"}
              style={{ marginBottom: 0 }}
              onClick={() =>
                setProjectStatus({
                  equipmentType_id: null,
                  mode: "add",
                })
              }
            >
              Создать новую запись
            </StyledButtonGreen>
          </Space>
        </Form.Item>
      </Form>
      <Table
        data-permission={"read-project"}
        size={"small"}
        sticky={{
          offsetHeader: "64px",
        }}
        loading={loading}
        dataSource={data?.projects?.items?.map((org, index) => ({
          ...org,
          key: index,
        }))}
        columns={columns}
        onChange={(pagination, filters, sorter, extra) => onChange(sorter)}
        pagination={{
          total: data?.projects?.count,
          current: page,
          pageSize: limit,
          onChange: (page, limit) => {
            setPage(page);
            setLimit(limit);
          },
          onShowSizeChange: (current, size) => {
            setPage(1);
            setLimit(size);
          },
          showSizeChanger: true,
          pageSizeOptions: ["10", "50", "100", "200"],
        }}
      />
    </>
  );
};

export default ProjectTable;
