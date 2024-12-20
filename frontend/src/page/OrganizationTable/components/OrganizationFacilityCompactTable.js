import React, { useState } from "react";

import { Modal, notification, Space, Table, Tooltip, Typography } from "antd";

import { PlusOutlined } from "@ant-design/icons";
import Link from "antd/es/typography/Link";
import { format } from "date-fns";
import { EditStyledLinkManagingDataTable } from "../../components/style/TableStyles";

import ContactForm from "../../simplesForms/ContactForm";

const { Text } = Typography;

const OrganizationFacilityCompactTable = ({ organizationId }) => {
  const [contactModalStatus, setContactModalStatus] = useState(false);

  // Состояния
  const [selectedContact, setSelectedContact] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const data = 0;
  const refetch = () => {};
  // Функции уведомлений
  const openNotification = (placement, type, message) => {
    notification[type]({
      message: message,
      placement,
    });
  };

  // Обработка загрузки и ошибок
  const formatDate = (date) => {
    return format(new Date(date), "dd.MM.yyyy");
  };
  // Формат таблицы
  const columns = [
    {
      title: (
        <Space>
          <Tooltip title={"Список контактов"}>
            <Text style={{ marginRight: 10 }}>Список Сотрудников</Text>
          </Tooltip>
          <Link type={"warning"}>
            <PlusOutlined
              onClick={() =>
                setContactModalStatus({
                  mode: "add",
                })
              }
            />
          </Link>
        </Space>
      ),
      children: [
        {
          width: "35%",
          title: "ФИО",
          dataIndex: "FIO",
          key: "FIO",
          align: "left",
          render: (text, record) => (
            <Space.Compact
              direction={"vertical"}
              style={{ alignContent: "start" }}
            >
              <Text strong>
                {record?.last_name} {record?.first_name} {record?.patronymic}
              </Text>
            </Space.Compact>
          ),
        },
        {
          width: "30%",
          title: "Контактные данные",
          dataIndex: "FIO",
          key: "FIO",
          align: "left",
          render: (text, record) => (
            <Space.Compact
              direction={"vertical"}
              style={{ alignContent: "start" }}
            >
              <Text strong>
                Телефон:{" "}
                {record?.work_phone
                  ? record?.work_phone
                  : record?.mobile_phone
                  ? record?.mobile_phone + " (Личный)"
                  : "Отсутствует"}
              </Text>
              <Text strong>
                e-mail:{" "}
                {record?.work_email
                  ? record?.work_email
                  : record?.email
                  ? record?.email + " (Личный)"
                  : "Отсутствует"}
              </Text>
            </Space.Compact>
          ),
        },
        {
          width: "10%",

          title: "Дата рождения",
          dataIndex: "birth_day",
          key: "birth_day",
          align: "left",
          render: (text, record) => (
            <Space.Compact
              direction={"vertical"}
              style={{ alignContent: "start" }}
            >
              <Text strong>
                {record?.birth_day && formatDate(record?.birth_day)}
              </Text>
            </Space.Compact>
          ),
        },
        {
          width: "15%",

          title: "Должноость",
          dataIndex: "position",
          key: "position",
          align: "left",
          render: (text, record) => (
            <Space.Compact
              direction={"vertical"}
              style={{ alignContent: "start" }}
            >
              <Text strong>{record?.position?.name}</Text>
            </Space.Compact>
          ),
        },
        {
          title: "Управление",
          key: "edit",
          width: "10%",
          render: (text, record) => (
            <EditStyledLinkManagingDataTable
              handleEdit={() =>
                setContactModalStatus({ contact_id: record.id, mode: "edit" })
              }
            />
          ),
        },
      ],
    },
  ];

  return (
    <div>
      <Table
        size={"small"}
        // loading={!data}
        dataSource={data && data}
        columns={columns}
        pagination={false}
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
            onCompleted={() => {
              setContactModalStatus(null);
            }}
            initialObject={
              contactModalStatus?.contact_id
                ? { id: contactModalStatus?.contact_id }
                : null
            }
          />
        }
      />
    </div>
  );
};
export default OrganizationFacilityCompactTable;
