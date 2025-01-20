import { useMutation, useQuery } from "@apollo/client";
import { Form, Input, Modal, Space, Table } from "antd";

import { format } from "date-fns";
import { nanoid } from "nanoid";
import React, { useContext, useState } from "react";
import { DELETE_POSITION_MUTATION } from "../../graphql/mutations/position";
import { POSITIONS_QUERY } from "../../graphql/queries/all";
import { NotificationContext } from "../../NotificationProvider";
import { StyledButtonGreen } from "../components/style/ButtonStyles";
import { DeleteAndEditStyledLinkManagingDataTable } from "../components/style/TableStyles";
import PositionForm from "../simplesForms/PositionForm";
const { Search } = Input;
const PositionTable = () => {
  // Состояния
  const { openNotification } = useContext(NotificationContext);

  const [formSearch] = Form.useForm();
  const [PositionModalStatus, setPositionModalStatus] = useState(null);

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
  } = useQuery(POSITIONS_QUERY, {
    variables: {
      queryOptions: { page, limit, search, sortField, sortOrder },
    },
  });

  // Функции уведомлений

  // Мутация для удаления
  const [deletePosition] = useMutation(DELETE_POSITION_MUTATION, {
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
  const handleDelete = (PositionId) => {
    deletePosition({ variables: { id: PositionId } });
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
      title: "ОКПД",
      dataIndex: "okpd_code",
      key: "okpd_code",
      sorter: true,
      ellipsis: false,
    },
    {
      title: "ОКЗ",
      dataIndex: "okz_code",
      key: "okz_code",
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
          updatePermission={"update-Position"}
          deletePermission={"delete-Position"}
          title={"Удаление контакта"}
          description={"Вы уверены, что нужно удалить этот контакт?"}
          handleEdit={() => {
            setPositionModalStatus({ Position: record, mode: "edit" });
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
              data-permission={"create-Position"}
              style={{ marginBottom: 0 }}
              onClick={() =>
                setPositionModalStatus({ Position: null, mode: "add" })
              }
            >
              Создать новую запись
            </StyledButtonGreen>
          </Space>
        </Form.Item>
      </Form>
      <Table
        data-permission={"read-Position"}
        size={"small"}
        sticky={{
          offsetHeader: "64px",
        }}
        loading={loading}
        dataSource={data?.positions?.items?.map((row) => ({
          ...row,
          key: row.id,
        }))}
        columns={columns}
        onChange={(pagination, filters, sorter, extra) => onChange(sorter)}
        pagination={{
          total: data?.positions?.count,
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
        open={
          PositionModalStatus?.mode === "add" ||
          PositionModalStatus?.mode === "edit"
        }
        onCancel={() => setPositionModalStatus(null)}
        footer={null}
        width={"max-content"}
        title={"Бик"}
        styles={{ header: { textAlign: "center" } }}
      >
        {PositionModalStatus?.mode === "edit" ? (
          PositionModalStatus?.Position && (
            <PositionForm
              data-permission={"update-Position"}
              onCompleted={() => {
                setPositionModalStatus(null);
                refetch();
              }}
              initialObject={PositionModalStatus?.Position}
              localObject={PositionModalStatus?.Position}
            />
          )
        ) : (
          <PositionForm
            data-permission={"create-Position"}
            onCompleted={() => {
              setPositionModalStatus(null);
              refetch();
            }}
          />
        )}
      </Modal>
    </div>
  );
};
export default PositionTable;
