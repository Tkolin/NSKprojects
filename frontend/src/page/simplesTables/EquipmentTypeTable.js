import { useMutation, useQuery } from "@apollo/client";
import {
  Divider,
  Form,
  Input,
  Modal,
  notification,
  Space,
  Table,
  Tabs,
} from "antd";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { StyledButtonGreen } from "../components/style/ButtonStyles";

import { SettingOutlined } from "@ant-design/icons";
import Link from "antd/es/typography/Link";
import { DELETE_EQUIPMENT_TYPE_MUTATION } from "../../graphql/mutations/equipment";
import { EQUIPMENT_TYPES_QUERY } from "../../graphql/queries/all";
import EquipmentTypeParametersStructureForm from "../EquipmentTypeParametersStructureForm";
import EquipmentTypeForm from "../simplesForms/EquipmentTypeForm";
const { Search } = Input;

const EquipmentTypeTable = () => {
  // Состояния
  const [equipmentTypeModalStatus, setEquipmentTypeModalStatus] =
    useState(false);
  const [
    equipmentTypeParametersModalStatus,
    setEquipmentTypeParametersModalStatus,
  ] = useState(null);
  const [formSearch] = Form.useForm();
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  // Данные
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [search, setSearch] = useState("");

  const {
    loading: loading,
    error: error,
    data: data,
    refetch: refetch,
  } = useQuery(EQUIPMENT_TYPES_QUERY, {
    variables: {
      queryOptions: { page, limit, search, sortField, sortOrder },
    },
  });

  useEffect(() => {
    refetch();
  }, []);

  // Функции уведомлений
  const openNotification = (placement, type, message) => {
    notification[type]({
      message: message,
      placement,
    });
  };

  // Мутация для удаления
  const [deleteEquipmentType] = useMutation(DELETE_EQUIPMENT_TYPE_MUTATION, {
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
  const handleDelete = (equipmentTypeId) => {
    deleteEquipmentType({ variables: { id: equipmentTypeId } });
  };
  const onSearch = (value) => {
    setSearch(value);
  };

  // Обработка загрузки и ошибок
  if (error) return `Ошибка! ${error.message}`;

  // Формат таблицы
  const columns = [
    {
      title: "Название классификатора",
      dataIndex: "name",
      key: "name",
      sorter: true,
      ellipsis: true,
    },
    {
      title: "Группа",
      key: "group_name",
      sorter: true,
      ellipsis: true,
      render: (record) => record?.group?.name,
    },
    {
      title: "Сфера применения",
      key: "type_activity_name",
      sorter: true,
      ellipsis: true,
      render: (record) => record?.type_activity?.name,
    },
    {
      title: "Действия",
      dataIndex: "action",
      key: "action",
      sorter: true,
      render: (record) => (
        <Space.Compact direction="vertical">{record?.id}</Space.Compact>
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
    <>
      <Form form={formSearch} layout="horizontal">
        <Form.Item label="Поиск:" name="search">
          <Space>
            <Search placeholder="Найти..." allowClear onSearch={onSearch} />
            <StyledButtonGreen
              loading={loading}
              data-permission={"create-equipmentType"}
              style={{ marginBottom: 0 }}
              onClick={() =>
                setEquipmentTypeModalStatus({
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
        data-permission={"read-equipmentType"}
        size={"small"}
        sticky={{
          offsetHeader: "64px",
        }}
        loading={loading}
        dataSource={data?.equipmentTypes?.items?.map((org, index) => ({
          ...org,
          key: index,
        }))}
        columns={columns}
        onChange={(pagination, filters, sorter, extra) => onChange(sorter)}
        pagination={{
          total: data?.equipmentTypes?.count,
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
        expandable={{
          expandedRowKeys,
          onExpand: (expanded, record) => {
            const keys = expanded ? [record.key] : [];
            setExpandedRowKeys(keys);
          },
          expandedRowRender: (record) => (
            <Space
              direction={"vertical"}
              align={"start"}
              style={{
                width: "100%",
                padding: "20px 70px 20px 20px",
                borderRadius: "10px",
                backgroundColor: "#fff",
              }}
            >
              <Tabs
                size={"small"}
                type="card"
                accordion
                style={{
                  width: "100%",
                }}
                items={[
                  {
                    key: "0",
                    label: "Технические параметры",
                    icon: <SettingOutlined />,
                    children: (
                      <div>
                        <Space.Compact
                          direction="vertical"
                          style={{ textAlign: "center" }}
                        >
                          <Divider style={{ marginBottom: "0px" }}>
                            Технические параметры
                          </Divider>
                          <Link
                            onClick={() =>
                              setEquipmentTypeParametersModalStatus(record.id)
                            }
                          >
                            Изменить {record.id}
                          </Link>
                        </Space.Compact>

                        <div>
                          <ul>
                            {record?.parameters.length > 0
                              ? record?.parameters?.map((row) => (
                                  <li>
                                    {row.name} - ({row?.unit?.name_latex})
                                  </li>
                                ))
                              : "Параметры отсутвуют "}
                          </ul>
                        </div>
                      </div>
                    ),
                  },
                ]}
              />
            </Space>
          ),
        }}
      />
      <Modal
        key={nanoid()}
        open={equipmentTypeModalStatus}
        onCancel={() => setEquipmentTypeModalStatus(null)}
        footer={null}
        width={"max-content"}
        children={
          <EquipmentTypeForm
            cardProps={{ title: "Класс оборудования" }}
            onCompleted={() => {
              refetch();
              setEquipmentTypeModalStatus(null);
            }}
            initialObject={
              equipmentTypeModalStatus?.equipmentType_id
                ? { id: equipmentTypeModalStatus?.equipmentType_id }
                : null
            }
          />
        }
      />
      <Modal
        key={nanoid()}
        open={equipmentTypeParametersModalStatus}
        onCancel={() => setEquipmentTypeParametersModalStatus(null)}
        footer={null}
        width={"max-content"}
        children={
          <EquipmentTypeParametersStructureForm
            cardProps={{ title: "Характеристики оборудования" }}
            onCompleted={() => {
              refetch();
              setEquipmentTypeParametersModalStatus(null);
            }}
            equipmentTypeId={equipmentTypeParametersModalStatus}
          />
        }
      />
    </>
  );
};

export default EquipmentTypeTable;
