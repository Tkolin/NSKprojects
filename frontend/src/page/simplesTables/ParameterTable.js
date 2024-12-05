import { useQuery } from "@apollo/client";
import { Divider, Form, Input, Modal, notification, Space, Table } from "antd";
import Title from "antd/es/skeleton/Title";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { PARAMETERS_QUERY } from "../../graphql/queries/all";
import { StyledButtonGreen } from "../components/style/ButtonStyles";
import { DeleteAndEditStyledLinkManagingDataTable } from "../components/style/TableStyles";
import ParameterForm from "../simplesForms/ParameterForm";
const { Search } = Input;
const ParameterTable = () => {
  // Состояния
  const [formSearch] = Form.useForm();
  const [parameterModalStatus, setParameterModalStatus] = useState(null);
  useEffect(() => {
    console.log("setParameterModalStatus", parameterModalStatus);
  }, [parameterModalStatus]);
  // Данные
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [currentSort, setCurrentSort] = useState({});

  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const [search, setSearch] = useState("");

  const {
    loading: loading,
    error: error,
    data: data,
    refetch: refetch,
  } = useQuery(PARAMETERS_QUERY, {
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
  // const [deleteParameter] = useMutation(DELETE_IRD_MUTATION, {
  //   onCompleted: () => {
  //     openNotification("topRight", "success", "Данные успешно удалены!");
  //     refetch();
  //   },
  //   onError: (error) => {
  //     openNotification(
  //       "topRight",
  //       "error",
  //       "Ошибка при удалении данных: " + error.message
  //     );
  //     refetch();
  //   },
  // });

  // Обработчик событий

  const handleDelete = (parameterId) => {
    // deleteParameter({ variables: { id: parameterId } });
  };
  const onSearch = (value) => {
    setSearch(value);
  };

  // Формат таблицы
  const columns = [
    {
      title: "Наименование",
      dataIndex: "name",
      key: "name",
    },
    // {
    //   title: "Наименование LaTex (Приведённое)",
    //   key: "name_latex_render",
    //   render: () => {
    //     "-";
    //   },
    // },
    {
      title: "Наименование LaTex (Не приведённое)",
      key: "name_latex",
      render: (record) => record?.unit?.name,
    },
    {
      title: "Минимум",
      dataIndex: "min",
      key: "min",
    },
    {
      title: "Максимум",
      dataIndex: "max",
      key: "max",
    },
    {
      title: "Группа параметра",
      key: "group_name",
      render: (record) => record?.group?.name,
    },
    {
      title: "Управление",
      key: "edit",
      ellipsis: true,
      width: 100,
      render: (text, record) => (
        <DeleteAndEditStyledLinkManagingDataTable
          title={"Удаление ИРД"}
          description={"Вы уверены, что нужно удалить этот ИРД?"}
          handleEdit={() => {
            setParameterModalStatus({ parameter: record, mode: "edit" });
          }}
          handleDelete={() => handleDelete(record.id)}
        />
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
        <Divider style={{ marginTop: 0 }}>
          <Title style={{ marginTop: 0 }} level={2}>
            Справочник наименования ИРД
          </Title>
        </Divider>
        <Form.Item label="Поиск:" name="search">
          <Space>
            <Search placeholder="Найти..." allowClear onSearch={onSearch} />
            <StyledButtonGreen
              data-permission={"create-parameter"}
              loading={loading}
              style={{ marginBottom: 0 }}
              onClick={() =>
                setParameterModalStatus({ parameter: null, mode: "add" })
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
          offsetHeader: 0,
        }}
        loading={loading}
        dataSource={data?.parameters?.items}
        columns={columns}
        onChange={onChange}
        pagination={{
          total: data?.parameters?.count,
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
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
      />
      <Modal
        key={[nanoid(), parameterModalStatus?.parameter?.id]}
        open={parameterModalStatus}
        onCancel={() => setParameterModalStatus(null)}
        footer={null}
        width={"max-content"}
        title={"Параметр"}
        children={
          <ParameterForm
            onCompleted={(value) => {
              setParameterModalStatus(null);
              refetch();
            }}
            initialObject={
              parameterModalStatus?.parameter?.id
                ? { id: parameterModalStatus?.parameter?.id }
                : null
            }
          />
        }
      />
    </div>
  );
};
export default ParameterTable;
