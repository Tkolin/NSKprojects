import { useQuery } from "@apollo/client";
import { Space, Table, Typography } from "antd";
import React from "react";
import { CHECK_STATUS_PROJECT_QUERY } from "../../../../../../../graphql/queries/all";

const { Text } = Typography;

const TableNotificationsComponent = ({ projectId }) => {
  const { data, loading } = useQuery(CHECK_STATUS_PROJECT_QUERY, {
    variables: { projectId: projectId },
  });

  const columnsExecutors = [
    {
      children: [
        {
          title: "Уведомления",
          width: "45%",
          key: "executor",
          align: "left",
          render: (text, record) => (
            <Space.Compact
              direction={"vertical"}
              style={{ alignContent: "start" }}
            >
              <Text strong>{record.title}</Text>
              <Text>{record.content}</Text>
            </Space.Compact>
          ),
        },
      ],
    },
  ];
  return (
    <>
      <Table
        style={{ margin: 0, width: "max-content" }}
        size={"small"}
        loading={loading}
        columns={columnsExecutors}
        dataSource={data?.checkStatusProject}
        pagination={false}
      />
    </>
  );
};
export default TableNotificationsComponent;
