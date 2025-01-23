import { useQuery } from "@apollo/client";
import { Alert, Button, Form, Input, notification, Space, Table } from "antd";
import React, { useState } from "react";
import { PERMISSIONS_QUERY } from "../../graphql/queries/queriesUser";
import { StyledButtonGreen } from "../components/style/ButtonStyles";

const { Search } = Input;

const PermissionTable = () => {
  // Состояния
  const [formSearch] = Form.useForm();
  const [permissionModalStatus, setPermissionModalStatus] = useState(null);

  // Данные
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  const [currentSort, setCurrentSort] = useState({});

  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const [search, setSearch] = useState("");

  const {
    loading: loading,
    error: error,
    data: data,
    refetch: refetch,
  } = useQuery(PERMISSIONS_QUERY, {
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
  const onSearch = (value) => {
    setSearch(value);
  };

  // Формат таблицы
  const columns = [
    {
      title: "Технический ключ",
      dataIndex: "name_key",
      key: "name_key",
      sorter: true,
      ellipsis: true,
    },
    {
      title: "Наименование",
      dataIndex: "name",
      key: "name",
      sorter: true,
      ellipsis: true,
    },
    {
      title: "Описание",
      dataIndex: "description",
      key: "description",
      sorter: true,
      ellipsis: true,
    },
    {
      title: "Группа",
      key: "group_key",
      dataIndex: "group_key",

      sorter: true,
      ellipsis: true,
      render: (text, record) => <span>{record.group?.name}</span>,
    },
    {
      title: "Управление",
      key: "edit",
      ellipsis: true,
      width: 100,
      render: (text, record) => (
        <Button
          type="link"
          onClick={() =>
            setPermissionModalStatus({ permission: record, mode: "edit" })
          }
        >
          Изменить
        </Button>
      ),
    },
  ];
  const onChange = (pagination, filters, sorter) => {
    if (sorter.field !== undefined && currentSort !== sorter) {
      setCurrentSort(sorter);
      if (sortField !== sorter.field) {
        setSortField(sorter.field);
        setSortOrder("asc");
      } else {
        setSortField(sortField);
        switch (sortOrder) {
          case "asc":
            setSortOrder("desc");
            break;
          case "desc":
            setSortOrder("");
            break;
          case "":
            setSortOrder("asc");
            break;
        }
      }
    } else console.log("Фильтры сохранены");
  };
  return (
    <div>
      <Form form={formSearch} layout="horizontal">
        <Form.Item label="Поиск:" name="search">
          <Space>
            <Search placeholder="Найти..." allowClear onSearch={onSearch} />
            <StyledButtonGreen
              data-permission={"create-permission"}
              loading={loading}
              disabled
              style={{ marginBottom: 0 }}
              onClick={() =>
                setPermissionModalStatus({ permission: null, mode: "add" })
              }
            >
              Создать новую запись
            </StyledButtonGreen>
          </Space>
        </Form.Item>
      </Form>
      <Alert message={"Данные для справки"}></Alert>
      <Table
        size={"small"}
        sticky={{
          offsetHeader: 0,
        }}
        loading={loading}
        dataSource={data?.permissions?.items}
        columns={columns}
        onChange={onChange}
        pagination={{
          total: data?.permissions?.count,
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
          pageSizeOptions: ["50", "100", "200", "500"],
        }}
      />
      {/* <PermissionModalForm
        key={permissionModalStatus?.permission?.id ?? nanoid()}
        onClose={() => {
          setPermissionModalStatus(null);
        }}
        object={permissionModalStatus?.permission ?? null}
        mode={permissionModalStatus?.mode ?? null}
      /> */}
    </div>
  );
};
export default PermissionTable;
