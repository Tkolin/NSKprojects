import { useQuery } from "@apollo/client";
import {
  Button,
  Divider,
  Form,
  Input,
  Modal,
  notification,
  Space,
  Table,
  Tabs,
} from "antd";
import React, { useState } from "react";
import { StyledButtonGreen } from "../components/style/ButtonStyles";

import { SettingOutlined } from "@ant-design/icons";
import { nanoid } from "nanoid";
import { Link } from "react-router-dom";
import { SUPPLIERS_QUERY } from "../../graphql/queries/all";
import { DeleteAndEditStyledLinkManagingDataTable } from "../components/style/TableStyles";
import SupplierForm from "../simplesForms/SupplierForm";
const { Search } = Input;

const SupplierTable = () => {
  // Состояния

  const [supplierModalStatus, setSupplierModalStatus] = useState(false);
  const [formSearch] = Form.useForm();
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [
    equipmentTypeSupplierModalStatus,
    setEquipmentTypeSupplierModalStatus,
  ] = useState(false);
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
  } = useQuery(SUPPLIERS_QUERY, {
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

  // Мутация для удаления
  // const [deleteSupplier] = useMutation(DELETE_ORGANIZATION_MUTATION, {
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
  const handleDelete = (supplierId) => {
    // deleteSupplier({ variables: { id: supplierId } });
  };
  const getLinkToForm = (supplierId) => {
    console.log("getLinkToForm", supplierId);
  };
  const onSearch = (value) => {
    setSearch(value);
  };

  // Обработка загрузки и ошибок
  if (error) return `Ошибка! ${error.message}`;

  // Формат таблицы
  const columns = [
    {
      title: "Название поставщика",
      dataIndex: "name",
      key: "name",
      sorter: true,
      ellipsis: true,
    },
    {
      title: "Тип",
      dataIndex: "legal_form",
      key: "legal_form",
      ellipsis: true,
      render: (record) => (
        <Button onClick={() => getLinkToForm(record)}>
          Форма для заполнения
        </Button>
      ),
    },
    {
      title: "Управление",
      key: "edit",
      width: 100,
      render: (text, record) => (
        <DeleteAndEditStyledLinkManagingDataTable
          deletePermission={"delete-supplier"}
          updatePermission={"update-supplier"}
          title={"Удаление организации"}
          description={"Вы уверены, что нужно удалить этого поставщика?"}
          handleEdit={() =>
            setSupplierModalStatus({
              supplier_id: record.id,
              mode: "edit",
            })
          }
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
    <>
      <Form form={formSearch} layout="horizontal">
        <Form.Item label="Поиск:" name="search">
          <Space>
            <Search placeholder="Найти..." allowClear onSearch={onSearch} />
            <StyledButtonGreen
              loading={loading}
              data-permission={"create-supplier"}
              style={{ marginBottom: 0 }}
              onClick={() =>
                setSupplierModalStatus({
                  supplier_id: null,
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
        data-permission={"read-supplier"}
        size={"small"}
        sticky={{
          offsetHeader: "64px",
        }}
        loading={loading}
        dataSource={data?.suppliers?.items?.map((org, index) => ({
          ...org,
          key: index,
        }))}
        columns={columns}
        onChange={(pagination, filters, sorter, extra) => onChange(sorter)}
        pagination={{
          total: data?.suppliers?.count,
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
                    label: "Список постовляемых типов оборудования",
                    icon: <SettingOutlined />,
                    children: (
                      <div>
                        <Space.Compact
                          direction="vertical"
                          style={{ textAlign: "center" }}
                        >
                          <Divider style={{ marginBottom: "0px" }}>
                            Список типов оборудования
                          </Divider>
                          <Link
                            onClick={() =>
                              setEquipmentTypeSupplierModalStatus(record.id)
                            }
                          >
                            Изменить
                          </Link>
                        </Space.Compact>

                        <div>
                          <ul>
                            {record?.equipment_types.length > 0
                              ? record?.equipment_types?.map((row) => (
                                  <li>{row.name}</li>
                                ))
                              : "Оборудование не указано"}
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
      {/* <Modal
        key={nanoid()}
        open={equipmentTypeSupplierModalStatus}
        onCancel={() => setEquipmentTypeSupplierModalStatus(null)}
        footer={null}
        width={"max-content"}
        children={
          <SuppliersEquipmentTypesListForm
            cardProps={{ title: "Класс оборудования" }}
            onCompleted={() => {
              refetch();
              setEquipmentTypeSupplierModalStatus(null);
            }}
            initialObject={
              equipmentTypeSupplierModalStatus?.equipmentType_id
                ? { id: equipmentTypeSupplierModalStatus?.equipmentType_id }
                : null
            }
          />
        }
      /> */}
      <Modal
        key={nanoid()}
        open={supplierModalStatus}
        onCancel={() => setSupplierModalStatus(null)}
        footer={null}
        width={"max-content"}
        children={
          <SupplierForm
            cardProps={{ title: "Поставщик" }}
            onCompleted={() => {
              refetch();
              setSupplierModalStatus(null);
            }}
            initialObject={
              supplierModalStatus?.supplier_id
                ? { id: supplierModalStatus?.supplier_id }
                : null
            }
          />
        }
      />
    </>
  );
};

export default SupplierTable;
