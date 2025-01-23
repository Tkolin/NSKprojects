import { Table } from "antd";
import React from "react";

export default function MyCheckboxList({
  dataSource = [],
  value = [],
  onChange,
}) {
  // value — это список ключей (name_key) выбранных разрешений
  // onChange — колбэк для поднятия новых выбранных значений наверх

  const rowSelection = {
    selectedRowKeys: value, // какие ключи сейчас выбраны
    onChange: (selectedKeys) => {
      onChange?.(selectedKeys); // сообщаем наверх
    },
  };

  const columns = [
    { title: "Имя", dataIndex: "name", key: "name" },
    { title: "Ключ", dataIndex: "name_key", key: "name_key" },
  ];

  return (
    <Table
      size="small"
      rowKey="name_key"
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      rowSelection={rowSelection}
    />
  );
}
