import { useQuery } from "@apollo/client";
import { Alert, Form, Input, notification, Select, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import { StyledButtonGreen } from "../components/style/ButtonStyles";

import { Option } from "antd/es/mentions";
import dayjs from "dayjs";
import { PROJECTS_QUERY } from "../../graphql/queries/all";
import { STATUS_PROJECTS_QUERY } from "../../graphql/queries/queriesSpecial";
import { formatToRub } from "../../utils/MoneyFormater";
import ColumnDurationRender from "../ProjectTable/components/ProjectTableComponent/components/ColumnRenderManager/components/ColumnDurationRender";
const { Search } = Input;

const ProjectTable = ({ columnKey = "v1" }) => {
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

  // Формат таблицы
  const columns = {
    v1: [
      {
        title: "№",
        dataIndex: "number_natural", // Используем поле number
        key: "number_natural",
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
            ? dayjs(record?.date_first_ird_completed).format("DD.MM.YYYY") +
              "г."
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
    ],
    v2: [
      {
        title: "№",
        width: "30px",
        dataIndex: "number_natural", // Используем поле number
        key: "number_natural",
      },
      {
        title: "Тип",
        key: "type_group",
        width: "60px",
        render: (record) => record?.type_project_document?.group?.code,
      },
      {
        title: "Наименование проекта",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Статусы",
        dataIndex: "statuses",
        key: "statuses",
      },
      // {
      //   title: "Заказчик",
      //   key: "organization_customer",
      //   render: (record) =>
      //     record?.organization_customer?.full_name ??
      //     record?.organization_customer?.name,
      // },
      {
        title: "Заказчик",
        key: "organization_customer_short",
        render: (record) => record?.organization_customer?.name,
      },
      {
        title: "Продолжительность (по договору)",
        key: "date_signing",
        render: (record) => {
          const status =
            record?.project_delays?.length <= 0
              ? -1
              : record?.project_delays.filter((row) => !row.date_end).length;
          return (
            <div>
              <span class={status > 0 ? "red" : status === 0 ? "yellow" : ""}>
                {record?.date_signing
                  ? dayjs(record?.date_signing).format("DD.MM.YYYY") + "г."
                  : "отсутствует"}
              </span>
              <br />
              <span class={status > 0 ? "red" : status === 0 ? "yellow" : ""}>
                {record?.date_signing
                  ? dayjs(record?.date_signing)
                      .add(record.duration, "day")
                      .format("DD.MM.YYYY") + "г."
                  : "отсутствует"}
              </span>
              <br />
              <span class={status > 0 ? "red" : status === 0 ? "yellow" : ""}>
                {record?.duration && "(" + record.duration + " дней)"}
              </span>
              <br />
              <span class={status > 0 ? "red" : status === 0 ? "yellow" : ""}>
                {status > 0
                  ? "(" +
                    status +
                    " актив. задержек из " +
                    record?.project_delays?.length +
                    ")"
                  : ""}
              </span>
            </div>
          );
        },
      },
      {
        title: "ИРД/АВАНС",
        key: "date_first_ird_completed",
        render: (record) => {
          const getStatusClass = (date) => {
            if (!date || !record?.date_signing) return "default";
            const signingDate = dayjs(record.date_signing);
            const targetDate = dayjs(date);

            const diffDays = targetDate.diff(signingDate, "day");

            if (diffDays > 5) return "green"; // В рамках договора
            if (diffDays >= 0) return "yellow"; // Срок подошёл
            return "red"; // Задержка более 5 дней
          };

          const formatDateWithClass = (date) => {
            return (
              <span class={getStatusClass(date)}>
                {date ? dayjs(date).format("DD.MM.YYYY") + "г." : "отсутствует"}
              </span>
            );
          };

          return (
            <div>
              <span class={getStatusClass(record?.date_first_ird_completed)}>
                {record?.date_first_ird_completed
                  ? dayjs(record?.date_first_ird_completed).format(
                      "DD.MM.YYYY"
                    ) + "г."
                  : "отсутствует"}
              </span>
              <br />
              <span class={getStatusClass(record?.date_first_ird_completed)}>
                {record?.date_first_ird_completed
                  ? dayjs(record?.date_first_ird_completed).format(
                      "DD.MM.YYYY"
                    ) + "г."
                  : "отсутствует"}
              </span>
            </div>
          );
        },
      },
      {
        title: "Продолжительность (факт)",
        key: "date_start",
        minWidth: 60,
        render: (record) => {
          const getStatusClass = (date) => {
            if (!date || !record?.date_signing) return "default";
            const signingDate = dayjs(record.date_signing);
            const startDate = dayjs(date);

            const diffDays = startDate.diff(signingDate, "day");

            if (diffDays > 5) return "green"; // В рамках договора
            if (diffDays >= 0) return "yellow"; // Срок подошёл
            return "red"; // Задержка более 5 дней
          };

          const formatDateWithClass = (date) => {
            return (
              <div>
                <span class={getStatusClass(date)}>
                  {date
                    ? dayjs(date).format("DD.MM.YYYY") + "г."
                    : "отсутствует"}
                </span>
                <br />
                <span>
                  {record?.date_end_fact
                    ? dayjs(record?.date_end_fact).format("DD.MM.YYYY") + "г."
                    : "отсутствует"}
                </span>
              </div>
            );
          };

          return formatDateWithClass(record?.date_start);
        },
      },
      // {
      //   title: "Про-сть",
      //   dataIndex: "duration",
      //   key: "duration",
      // },
      // {
      //   title: "Дата окончания (по факту)",
      //   key: "date_end_fact",
      //   render: (record) =>
      // record?.date_end_fact
      //   ? dayjs(record?.date_end_fact).format("DD.MM.YYYY") + "г."
      //   : "не рассчитана",
      // },

      {
        title: "Аванс, руб (%)",
        key: "prepayment",
        render: (record) =>
          formatToRub((record.price / 100) * record.prepayment) +
          " (" +
          record.prepayment +
          "%)",
      },
      {
        title: "Стоимость проекта",
        key: "price",
        render: (record) => formatToRub(record.price),
      },
      {
        title: "Этап в работе",
        key: "actual_stage",
        minWidth: 80,
        render: (record) => (
          <Space.Compact direction="vertical">
            <div>{record.date}</div>
            <ColumnDurationRender
              record={record}
              option={{
                projectDuration: false,
                projectCurrentStageInfo: true,
                anyStageStatus: true,
              }}
            />
          </Space.Compact>
        ),
      },
      {
        title: "Статус",
        key: "status",
        render: (record) => record?.status.name,
      },
    ],
  };

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
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("ALL");
  const handleBlurSelectedStatusFilter = () => {
    if (!selectedStatusFilter) {
      console.error("Выберите значение из списка!");
    }
  };
  const handleChangeSelectedStatusFilter = (selectedValue) => {
    setSelectedStatusFilter(selectedValue);
  };

  const [selectedDelayFilter, setSelectedDelayFilter] = useState("ALL");
  const handleBlurSelectedDelayFilter = () => {
    if (!selectedDelayFilter) {
      console.error("Выберите значение из списка!");
    }
  };
  const handleChangeSelectedDelayFilter = (selectedValue) => {
    setSelectedDelayFilter(selectedValue);
  };
  const [selectedArchivedFilter, setSelectedArchivedFilter] = useState("ALL");

  const handleBlurSelectedArchivedFilter = () => {
    if (!selectedArchivedFilter) {
      console.error("Выберите значение из списка!");
    }
  };
  const handleChangeSelectedArchivedFilter = (selectedValue) => {
    setSelectedArchivedFilter(selectedValue);
  };
  const {
    loading: loadingStatus,
    error: errorStatus,
    data: dataStatus,
    refetch: refetchStatus,
  } = useQuery(STATUS_PROJECTS_QUERY, {
    variables: {
      projectStatuses: [selectedStatusFilter],
    },
  });

  useEffect(() => {
    console.log(
      "selectedStatusFilter, selectedDelayFilter",
      selectedStatusFilter,
      selectedDelayFilter
    );
  }, [selectedStatusFilter, selectedDelayFilter]);
  const { loading, error, data, refetch } = useQuery(PROJECTS_QUERY, {
    variables: {
      queryOptions: { page, limit, search, sortField, sortOrder },
      projectExtraFilters: {
        delay_mode:
          selectedStatusFilter !== "WORKING"
            ? selectedDelayFilter || "ALL"
            : "ALL",
        status_key: selectedStatusFilter || "ALL",
      },
    },
  });
  const options_status = [
    {
      key: "ALL",
      name: "Все",
    },
    {
      key: "DESIGN_REQUEST",
      name: "Запрос на проектирование",
    },
    {
      key: "APPROVAL_KP",
      name: "Согласование КП",
    },
    {
      key: "APPROVAL_AGREEMENT",
      name: "Согласование договора",
    },

    {
      key: "WAITING_START_WORK",
      name: "Подготовка к работе",
    },
    {
      key: "WORKING",
      name: "В работе",
    },
    {
      key: "ARCHIVE",
      name: "Не актуален",
    },
    {
      key: "COMPLETED",
      name: "Завершён",
    },
  ];
  const options_delay = [
    {
      key: "ALL",
      name: "Все",
    },
    {
      key: "DELAY",
      name: "С задержками",
    },
    {
      key: "NO_DELAY",
      name: "Без задержек",
    },
    {
      key: "END_DELAY",
      name: "С закрытыми задержками",
    },
  ];
  const options_post_work = [
    {
      key: "ARCHIVE",
      name: "Архив",
      disabled: true,
    },
    {
      key: "DROP",
      name: "С задержками",
      disabled: true,
    },
    {
      key: "...",
      name: "...",
      disabled: true,
    },
  ];
  // Обработка загрузки и ошибок
  if (error) return `Ошибка! ${error.message}`;

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
            Статус проекта:
            <Select
              placeholder="Выберите статус"
              value={selectedStatusFilter}
              defaultValue={"ALL"}
              onChange={handleChangeSelectedStatusFilter}
              onBlur={handleBlurSelectedStatusFilter}
              style={{ minWidth: 200 }}
              allowClear
            >
              {options_status.map((row) => (
                <Option value={row.key}>{row.name}</Option>
              ))}
            </Select>
            {
              <Alert
                message={
                  "Итого в группе: " +
                  formatToRub(
                    dataStatus?.projectsStatistic.reduce(
                      (acc, row) => acc + (row.total_price || 0),
                      0
                    ) || 0
                  )
                }
              ></Alert>
            }
            {selectedStatusFilter === "WORKING" && (
              <Space>
                <span>Задержки:</span>
                <Select
                  placeholder="Задержки"
                  disabled={selectedStatusFilter !== "WORKING"}
                  value={selectedDelayFilter}
                  defaultValue={"ALL"}
                  onChange={handleChangeSelectedDelayFilter}
                  onBlur={handleBlurSelectedDelayFilter}
                  style={{ minWidth: 200 }}
                  allowClear
                >
                  {options_delay.map((row) => (
                    <Option value={row.key}>{row.name}</Option>
                  ))}
                </Select>
              </Space>
            )}
            {selectedStatusFilter === "END_DELAY" && (
              <Space>
                <span>Варианты:</span>
                <Select
                  placeholder="Варианты"
                  value={selectedArchivedFilter}
                  defaultValue={"ALL"}
                  onChange={handleChangeSelectedArchivedFilter}
                  onBlur={handleBlurSelectedArchivedFilter}
                  style={{ minWidth: 200 }}
                  allowClear
                >
                  {options_post_work.map((row) => (
                    <Option value={row.key}>{row.name}</Option>
                  ))}
                </Select>
              </Space>
            )}
          </Space>
        </Form.Item>
      </Form>
      <Table
        tableLayout="auto"
        data-permission={"read-project"}
        size={"small"}
        sticky={{
          offsetHeader: "64px",
        }}
        loading={loading}
        dataSource={data?.projects?.items?.map((row, index) => ({
          ...row,
          key: index + row.id,
          number_natural: index + 1 + (page - 1) * 10,
        }))}
        columns={columns[columnKey]}
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
