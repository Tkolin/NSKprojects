import { useMutation, useQuery } from "@apollo/client";
import { Button, notification, Space, Table, Tooltip, Typography } from "antd";
import dayjs from "dayjs";
import React from "react";
import { STOP_DELAY_MUTATION } from "../../../../../../../graphql/mutationsDelay";
import { PROJECT_DELAYS_QUERY } from "../../../../../../../graphql/queries";

const openNotification = (placement, type, message) => {
  notification[type]({
    message: message,
    placement,
  });
};

const { Text } = Typography;
const TableProjectTasksDelayManagment = ({ projectId }) => {
  const { data, loading, error, refetch } = useQuery(PROJECT_DELAYS_QUERY, {
    variables: {
      projectId: projectId,
    },
    onCompleted: (result) => {
      console.log(result);
    },
  });
  const [stopDelayMutation] = useMutation(STOP_DELAY_MUTATION, {
    onCompleted: (data) => {
        refetch();
      console.log("topRight", "success", `Задержка остановлена`);
    },
    onError: (error) => {
      console.log(
        "topRight",
        "error",
        `Ошибка при остановке задержки: ${error.message}`
      );
    },
  });

  function stopDelay(id) {
    stopDelayMutation({
      variables: { id: id, date_end: dayjs().add(1, 'month').format("YYYY-MM-DD")
        , offset_mode: "tasks" },
    });
  }
  const columnsTasks = [
    {
      title: (
        <Space>
          <Tooltip title={"Список задач"}>
            <Text style={{ marginRight: 10 }}>Список Задержек на проекте</Text>
          </Tooltip>
        </Space>
      ),
      children: [
        {
          width: "100%",
          title: "Статус",
          key: "status",
          align: "left",
          render: (text, record) => (
            <div style={{ color: record.date_end ?  "green" : "red"  }}>
              {dayjs(record.date_start).format("DD.MM.YY")}
              <span> - </span>
              {record.date_end
                ? dayjs(record.date_end).format("DD.MM.YY")
                : "Не закрыто"}
            </div>
          ),
        },
        {
          width: "100%",
          title: "Действия",
          key: "actions",
          align: "left",
          render: (text, record) => (
            <Button onClick={() => stopDelay(record.id)} disabled={record.date_end}>
              Продолжить работу
            </Button>
          ),
        },
      ],
    },
  ];
  return (
    <Table
    loading={loading}
      style={{ margin: 0, width: "100%" }}
      size={"small"}
      columns={columnsTasks}
      dataSource={data?.projectDelay}
      pagination={false}
    />
  );
};

export default TableProjectTasksDelayManagment;
