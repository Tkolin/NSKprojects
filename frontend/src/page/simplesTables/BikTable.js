import { useMutation, useQuery } from "@apollo/client";
import { Form, Input, Modal, Space, Table } from "antd";

import { format } from "date-fns";
import { nanoid } from "nanoid";
import React, { useContext, useState } from "react";
import { DELETE_BIK_MUTATION } from "../../graphql/mutations/bik";
import { BIKS_QUERY } from "../../graphql/queries/all";
import { NotificationContext } from "../../NotificationProvider";
import { StyledButtonGreen } from "../components/style/ButtonStyles";
import { DeleteAndEditStyledLinkManagingDataTable } from "../components/style/TableStyles";
import BikForm from "../simplesForms/BikForm";
const { Search } = Input;
const BikTable = () => {
  // Состояния
  const { openNotification } = useContext(NotificationContext);

  const [formSearch] = Form.useForm();
  const [BikModalStatus, setBikModalStatus] = useState(null);

  // Данные
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [currentSort, setCurrentSort] = useState({});

  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const [search, setSearch] = useState("");
  // id;
  // name;
  // BIK;
  // city;
  // correspondent_account;
  const {
    loading: loading,
    error: error,
    data: data,
    refetch,
  } = useQuery(BIKS_QUERY, {
    variables: {
      queryOptions: { page, limit, search, sortField, sortOrder },
    },
  });

  // Функции уведомлений

  // Мутация для удаления
  const [deleteBik] = useMutation(DELETE_BIK_MUTATION, {
    onCompleted: () => {
      refetch();
      openNotification("topRight", "success", "Данные успешно удалены!");
    },
    onError: (error) => {
      refetch();
      openNotification(
        "topRight",
        "error",
        "Ошибка при удалении данных: " + error.message
      );
    },
  });

  // Обработчик событий
  const handleDelete = (BikId) => {
    deleteBik({ variables: { id: BikId } });
  };
  const onSearch = (value) => {
    setSearch(value);
  };

  // Обработка загрузки и ошибок
  if (error) return `Ошибка! ${error.message}`;

  // Функция для форматирования даты
  const formatDate = (date) => {
    return format(new Date(date), "dd.MM.yyyy");
  };
  // Формат таблицы
  const columns = [
    {
      title: "Наименование",
      dataIndex: "name",
      key: "name",
      sorter: true,
      ellipsis: false,
    },
    {
      title: "БИК",
      dataIndex: "BIK",
      key: "BIK",
      sorter: true,
      ellipsis: false,
    },
    {
      title: "Город",
      dataIndex: "city",
      key: "city",
      sorter: true,
      ellipsis: false,
    },
    {
      title: "Счет",
      dataIndex: "correspondent_account",
      key: "correspondent_account",
      sorter: true,
      ellipsis: false,
    },

    {
      title: "Управление",
      key: "edit",
      ellipsis: true,
      width: 100,
      render: (text, record) => (
        <DeleteAndEditStyledLinkManagingDataTable
          updatePermission={"update-Bik"}
          deletePermission={"delete-Bik"}
          title={"Удаление контакта"}
          description={"Вы уверены, что нужно удалить этот контакт?"}
          handleEdit={() => {
            setBikModalStatus({ Bik: record, mode: "edit" });
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
        <Form.Item label="Поиск:" name="search">
          <Space>
            <Search placeholder="Найти..." allowClear onSearch={onSearch} />
            <StyledButtonGreen
              data-permission={"create-Bik"}
              style={{ marginBottom: 0 }}
              onClick={() => setBikModalStatus({ Bik: null, mode: "add" })}
            >
              Создать новую запись
            </StyledButtonGreen>
          </Space>
        </Form.Item>
      </Form>
      <Table
        data-permission={"read-Bik"}
        size={"small"}
        sticky={{
          offsetHeader: "64px",
        }}
        loading={loading}
        dataSource={data?.biks?.items?.map((row) => ({
          ...row,
          key: row.id,
        }))}
        columns={columns}
        onChange={(pagination, filters, sorter, extra) => onChange(sorter)}
        pagination={{
          total: data?.biks?.count,
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
      <Modal
        key={nanoid()}
        open={BikModalStatus?.mode === "add" || BikModalStatus?.mode === "edit"}
        onCancel={() => setBikModalStatus(null)}
        footer={null}
        width={"max-content"}
        title={"Бик"}
        styles={{ header: { textAlign: "center" } }}
      >
        {BikModalStatus?.mode === "edit" ? (
          BikModalStatus?.Bik && (
            <BikForm
              data-permission={"update-Bik"}
              onCompleted={() => {
                setBikModalStatus(null);
                refetch();
              }}
              initialObject={BikModalStatus?.Bik}
              localObject={BikModalStatus?.Bik}
            />
          )
        ) : (
          <BikForm
            data-permission={"create-Bik"}
            onCompleted={() => {
              setBikModalStatus(null);
              refetch();
            }}
          />
        )}
      </Modal>
    </div>
  );
};
export default BikTable;
