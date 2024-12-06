import { useMutation, useQuery } from "@apollo/client";
import { Form, Input, Modal, Space, Table, Typography } from "antd";
import { format } from "date-fns";
import { nanoid } from "nanoid";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { DELETE_CONTACT_MUTATION } from "../../graphql/mutations/contact";
import { ROLES_TABLE } from "../../graphql/queries/all";
import { NotificationContext } from "../../NotificationProvider";
import { StyledButtonGreen } from "../components/style/ButtonStyles";
import ContactForm from "../simplesForms/ContactForm";
const { Text } = Typography;
const { Search } = Input;

const RoleTable = () => {
  // Состояния
  const { openNotification } = useContext(NotificationContext);

  const [formSearch] = Form.useForm();
  const [contactModalStatus, setContactModalStatus] = useState(null);
  const [userRoleModalStatus, setUserRoleModalStatus] = useState(null);

  // Данные
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const [currentSort, setCurrentSort] = useState({});

  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const [search, setSearch] = useState("");

  const {
    loading: loading,
    error: error,
    data: data,
    refetch: refetch,
  } = useQuery(ROLES_TABLE, {
    variables: {
      queryOptions: { page, limit, search, sortField, sortOrder },
    },
    onError: (error) => {
      openNotification(
        "topRight",
        "error",
        "Ошибка при загрузке учётных записей: " + error.message
      );
    },
  });

  // Функции уведомлений

  // Мутация для удаления
  const [deleteContact] = useMutation(DELETE_CONTACT_MUTATION, {
    onCompleted: () => {
      refetch();
      openNotification("topRight", "success", "Данные успешно удалены!");
    },
    onError: (error) => {
      openNotification(
        "topRight",
        "error",
        "Ошибка при удалении данных: " + error.message
      );
    },
  });

  // Обработчик событий
  const handleDelete = (contactId) => {
    deleteContact({ variables: { id: contactId } });
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
      title: "name",
      key: "name",
      dataIndex: "name",
      width: "10%",
    },
    {
      title: "description",
      dataIndex: "email",
      key: "email",
      width: "20%",
    },
    {
      title: "permission",
      dataIndex: "permission",
      key: "permission",
      width: "60%",
      render: (text, record) =>
        record?.permissions.length > 0 ? (
          record?.permissions?.map((row) => <>{row.name}, </>)
        ) : (
          <Text type={"danger"}>Полита безопасности отсутствует</Text>
        ),
    },
    {
      title: "Управление",
      key: "edit",
      ellipsis: true,
      width: "10%",
      render: (text, record) => (
        <Space>
          <>В разработке</>
          <Link onClick={() => setUserRoleModalStatus({ id: record.id })}>
            Изменить права доступа
          </Link>
        </Space>
        // <DeleteAndEditStyledLinkManagingDataTable
        //     title={"Удаление контакта"}
        //     description={"Вы уверены, что нужно удалить этот контакт?"}
        //     handleEdit={() => {
        //         setContactModalStatus({contact: record, mode: "edit"})
        //     }}
        //     handleDelete={() => handleDelete(record.id)}
        // />
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
              loading={loading}
              style={{ marginBottom: 0 }}
              onClick={() =>
                setContactModalStatus({ contact: null, mode: "add" })
              }
            >
              Создать новую запись
            </StyledButtonGreen>
          </Space>
        </Form.Item>
      </Form>
      <Table
        size={"small"}
        sticky={{
          offsetHeader: "64px",
        }}
        loading={loading}
        dataSource={data?.roles?.items?.map((row) => ({ ...row, key: row.id }))}
        columns={columns}
        onChange={(pagination, filters, sorter, extra) => onChange(sorter)}
        pagination={{
          total: data?.roles?.count,
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
        key={contactModalStatus?.mode || contactModalStatus?.contact_id || null}
        open={contactModalStatus}
        onCancel={() => setContactModalStatus(null)}
        footer={null}
        width={"600px"}
        title={"Организация"}
        children={
          <ContactForm
            onCompleted={() => setContactModalStatus(null)}
            initialObject={
              contactModalStatus?.contact_id
                ? { id: contactModalStatus?.contact_id }
                : null
            }
          />
        }
      />
      <Modal
        key={[userRoleModalStatus?.id, nanoid()]}
        open={userRoleModalStatus}
        onCancel={() => setContactModalStatus(null)}
        footer={null}
        width={"600px"}
        title={"Список прав"}
        children={
          <div></div>
          // <UserRolesManager
          //   onCompleted={() => setContactModalStatus(null)}
          //   initialObject={
          //     userRoleModalStatus?.id ? { id: userRoleModalStatus?.id } : null
          //   }
          // />
        }
      />
    </div>
  );
};
export default RoleTable;
