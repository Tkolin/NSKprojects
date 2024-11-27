import { useMutation, useQuery } from "@apollo/client";
import { Button, Form, Input, Modal, notification, Space, Table } from "antd";
import React, { useState } from "react";
import { DELETE_ORGANIZATION_MUTATION } from "../../graphql/mutations/organization";
import { StyledButtonGreen } from "../components/style/ButtonStyles";

import { SUPPLIERS_QUERY } from "../../graphql/queries/all";
import OrganizationForm from "../simplesForms/OrganizationForm";
const { Search } = Input;

const SupplierTable = () => {
  // Состояния

  const [organizationModalStatus, setOrganizationModalStatus] = useState(false);
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
  const [deleteOrganization] = useMutation(DELETE_ORGANIZATION_MUTATION, {
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
  const handleDelete = (organizationId) => {
    deleteOrganization({ variables: { id: organizationId } });
  };
  const getLinkToForm = (organizationId) => {
    console.log("getLinkToForm", organizationId);
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
              data-permission={"create-organization"}
              style={{ marginBottom: 0 }}
              onClick={() =>
                setOrganizationModalStatus({
                  organization_id: null,
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
        data-permission={"read-organization"}
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
        // expandable={{
        //   expandedRowKeys,
        //   onExpand: (expanded, record) => {
        //     const keys = expanded ? [record.key] : [];
        //     setExpandedRowKeys(keys);
        //   },
        //   expandedRowRender: (record) => (
        //     <Row>
        //       <Col span={12}>
        //         <Descriptions size={"small"} column={1}>
        //           <Descriptions.Item label="Полное наименование">
        //             {record.full_name}
        //           </Descriptions.Item>
        //           <Descriptions.Item label="Юридический адрес">
        //             {record.address_legal} {record.office_number_legal}
        //           </Descriptions.Item>
        //           <Descriptions.Item label="Почтовый адрес">
        //             {record.address_mail} {record.office_number_mail}
        //           </Descriptions.Item>
        //           <Descriptions.Item label="Электронный адресс">
        //             {record.email}
        //           </Descriptions.Item>
        //           <Descriptions.Item label="Факс">
        //             {record.fax_number}
        //           </Descriptions.Item>
        //           <Descriptions.Item label="ИНН">
        //             {record.INN}
        //           </Descriptions.Item>
        //           <Descriptions.Item label="ОГРН">
        //             {record.OGRN}
        //           </Descriptions.Item>
        //           <Descriptions.Item label="ОКПО">
        //             {record.OKPO}
        //           </Descriptions.Item>
        //           <Descriptions.Item label="КПП">
        //             {record.KPP}
        //           </Descriptions.Item>
        //           <Descriptions.Item label="БИК">
        //             {record?.bik?.BIK} - {record?.bik?.name}
        //           </Descriptions.Item>
        //           <Descriptions.Item label="Расчетный счет">
        //             {record.payment_account}
        //           </Descriptions.Item>
        //         </Descriptions>
        //       </Col>
        //       <Col span={12}>
        //         <OrganizationContactsCompactTable data={record?.employees} />
        //       </Col>
        //     </Row>
        //   ),
        // }}
      />
      <Modal
        key={
          organizationModalStatus?.mode ||
          organizationModalStatus?.organization_id ||
          null
        }
        open={organizationModalStatus}
        onCancel={() => setOrganizationModalStatus(null)}
        footer={null}
        width={"max-content"}
        children={
          <OrganizationForm
            cardProps={{ title: "Организация" }}
            onCompleted={() => {
              refetch();
              setOrganizationModalStatus(null);
            }}
            initialObject={
              organizationModalStatus?.organization_id
                ? { id: organizationModalStatus?.organization_id }
                : null
            }
          />
        }
      />
    </>
  );
};

export default SupplierTable;
