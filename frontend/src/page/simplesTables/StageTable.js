import { useMutation, useQuery } from "@apollo/client";
import { Divider, Form, notification, Space, Table } from "antd";
import Search from "antd/es/input/Search";
import Title from "antd/es/typography/Title";
import { nanoid } from "nanoid";
import React, { useState } from "react";
import { DELETE_STAGE_MUTATION } from "../../graphql/mutations/stage";
import { STAGES_QUERY } from "../../graphql/queries/all";
import StageModalForm from "../components/modal/StageModalForm";
import { StyledButtonGreen } from "../components/style/ButtonStyles";
import { DeleteAndEditStyledLinkManagingDataTable } from "../components/style/TableStyles";

const StageTable = () => {
  // Состояния
  const [formSearch] = Form.useForm();
  const [stageModalStatus, setStageModalStatus] = useState(null);

  // Данные
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [currentSort, setCurrentSort] = useState({});

  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const [search, setSearch] = useState("");

  const {
    loading,
    error,
    data,
    refetch: refetch,
  } = useQuery(STAGES_QUERY, {
    variables: {
      queryOptions: {
        page,
        limit,
        search,
        sortField,
        sortOrder,
      },
    },
  });

  // Функции уведомлений
  const openNotification = (placement, type, message) => {
    notification[type]({
      message: message,
      placement,
    });
  };

  // Мутация для удаления
  const [deleteStage] = useMutation(DELETE_STAGE_MUTATION, {
    onCompleted: () => {
      openNotification("topRight", "success", "Данные успешно удалены!");
      refetch();
    },
    onError: (error) => {
      openNotification(
        "topRight",
        "error",
        "Ошибка при удалении данных: " + error.message
      );
      refetch();
    },
  });

  // Обработчик событий
  const handleDelete = (stageId) => {
    deleteStage({ variables: { id: stageId } });
  };
  const onSearch = (value) => {
    setSearch(value);
  };
  // Обработка загрузки и ошибок
  if (error) return `Ошибка! ${error.message}`;

  // Формат таблицы
  const columns = [
    {
      title: "Наименование",
      dataIndex: "name",
      key: "name",

      sorter: true,
      ellipsis: true,
    },
    {
      title: "Управление",
      key: "edit",
      ellipsis: true,
      width: 100,
      render: (text, record) => (
        <DeleteAndEditStyledLinkManagingDataTable
          title={"Удаление этапа"}
          description={"Вы уверены, что нужно удалить этот этап?"}
          handleEdit={() => {
            setStageModalStatus({ stage: record, mode: "edit" });
          }}
          handleDelete={() => handleDelete(record.id)}
        />
      ),
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
    <div>
      <Form form={formSearch} layout="horizontal">
        <Divider style={{ marginTop: 0 }}>
          <Title style={{ marginTop: 0 }} level={2}>
            Справочник наименования этапов
          </Title>
        </Divider>
        <Form.Item label="Поиск:" name="search">
          <Space>
            <Search placeholder="Найти..." allowClear onSearch={onSearch} />
            <StyledButtonGreen
              loading={loading}
              style={{ marginBottom: 0 }}
              onClick={() => setStageModalStatus({ stage: null, mode: "add" })}
              data-permission={"create-stage"}
            >
              Создать новую запись
            </StyledButtonGreen>
          </Space>
        </Form.Item>
      </Form>
      <Table
        size={"small"}
        sticky={{
          offsetHeader: 0,
        }}
        loading={loading}
        dataSource={data?.stages?.items}
        columns={columns}
        onChange={(pagination, filters, sorter, extra) => onChange(sorter)}
        pagination={{
          total: data?.stages?.count,
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
          pageSizeOptions: ["10", "50", "100"],
        }}
      />
      <StageModalForm
        key={stageModalStatus?.stage?.id ?? nanoid()}
        onClose={() => {
          setStageModalStatus(null);
          refetch();
        }}
        object={stageModalStatus?.stage ?? null}
        mode={stageModalStatus?.mode ?? null}
      />
    </div>
  );
};
export default StageTable;
