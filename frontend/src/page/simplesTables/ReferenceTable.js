import { useMutation, useQuery } from "@apollo/client";
import { Button, Divider, Form, Modal, notification, Space, Table } from "antd";
import Search from "antd/es/input/Search";
import Title from "antd/es/typography/Title";
import React, { useState } from "react";
import { DELETE_REFERENCE_MUTATION } from "../../graphql/mutationsReference";
import { REFERENCES_QUERY } from "../../graphql/queries";
import { StyledButtonGreen } from "../components/style/ButtonStyles";
import { DeleteAndEditStyledLinkManagingDataTable } from "../components/style/TableStyles";

const ReferenceTable = () => {
  // Состояния
  const [formSearch] = Form.useForm();
  const [referenceModalStatus, setReferenceModalStatus] = useState(null);
  const [selectedReferenceContent, setSelectedReferenceContent] = useState(null); // Для хранения данных для модального окна

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
  } = useQuery(REFERENCES_QUERY, {
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
  const [deleteReference] = useMutation(DELETE_REFERENCE_MUTATION, {
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
  const handleDelete = (referenceId) => {
    deleteReference({ variables: { id: referenceId } });
  };

  const onSearch = (value) => {
    setSearch(value);
  };

  // Обработка загрузки и ошибок
  if (error) return `Ошибка! ${error.message}`;

   const showContentModal = (content) => {
    setSelectedReferenceContent(content); 
  };

  // Закрытие модального окна
  const handleCloseModal = () => {
    setSelectedReferenceContent(null);
  };

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
      title: "Описание",
      dataIndex: "description",
      key: "description",
      sorter: true,
      ellipsis: true,
    },
    {
      title: "Значения",
      dataIndex: "content",
      key: "content",
      render: (content) => (
        <Button onClick={() => showContentModal(content)}>Просмотреть</Button>
      ),
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
            setReferenceModalStatus({ reference: record, mode: "edit" });
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
            <Search
              placeholder="Найти..."
              allowClear
              enterButton="Найти"
              onSearch={onSearch}
            />
            <StyledButtonGreen
              loading={loading}
              style={{ marginBottom: 0 }}
              onClick={() =>
                setReferenceModalStatus({ reference: null, mode: "add" })
              }
              data-permission={"create-reference"}
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
        dataSource={data?.references?.items}
        columns={columns}
        onChange={(pagination, filters, sorter, extra) => onChange(sorter)}
        pagination={{
          total: data?.references?.count,
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

      {/* Модальное окно для отображения значений поля 'content' */}
      <Modal
        title="Значения"
        visible={!!selectedReferenceContent}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Закрыть
          </Button>,
        ]}
      >
        <Table
          dataSource={selectedReferenceContent}
          columns={[
            {
              title: "Название",
              dataIndex: "name",
              key: "name",
            },
            {
              title: "Значение",
              dataIndex: "value",
              key: "value",
            },
            {
              title: "Описание",
              dataIndex: "description",
              key: "description",
            },
          ]}
          pagination={false}
        />
      </Modal>
    </div>
  );
};

export default ReferenceTable;
