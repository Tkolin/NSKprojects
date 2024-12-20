import { useMutation, useQuery } from "@apollo/client";
import {
  Alert,
  Card,
  Col,
  Modal,
  notification,
  Progress,
  Row,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import Link from "antd/es/typography/Link";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { PROJECT_TASK_UP_MUTATION } from "../../../../../../../graphql/mutations/project";
import { PROJECT_TASKS_QUERY } from "../../../../../../../graphql/queries/all";
import StartDelayForm from "../../../../../../StartDelayForm";

const openNotification = (placement, type, message) => {
  notification[type]({
    message: message,
    placement,
  });
};

const { Text } = Typography;
const TableProjectTasksManagment = ({ setEditModalStatus, projectId }) => {
  const [delayModalStatus, setDelayModalStatus] = useState(null);
  const { data, loading, refetch } = useQuery(PROJECT_TASKS_QUERY, {
    variables: {
      projectId: projectId,
    },
  });
  useEffect(() => {
    refetch();
  }, []);
  const stopTask = (taskId) => {
    setDelayModalStatus(taskId);
  };
  const columnsTasks = [
    {
      title: (
        <Space>
          <Tooltip title={"Список задач"}>
            <Text style={{ marginRight: 10 }}>Список Задач на проекте</Text>
          </Tooltip>
        </Space>
      ),
      children: [
        {
          width: "60%",
          title: "Основная информация",
          key: "task",
          align: "left",
          render: (text, record) => (
            <Space.Compact
              direction={"vertical"}
              style={{ alignContent: "start", width: "100%" }}
            >
              <Text strong>{record?.task?.name}</Text>
              {record.status !== "COMPLETED" && (
                <Link onClick={() => stopTask(record.id)} type="danger">
                  Приостоновить задачу
                </Link>
              )}
              <Row style={{ width: "100%" }}>
                <Col span={12}>
                  <Space.Compact direction={"vertical"}>
                    <CustomProgressBar projectTask={record} />
                  </Space.Compact>
                </Col>
                <Col span={12}>
                  <Text strong>
                    {record?.date_start &&
                      dayjs(record?.date_start).format("DD.MM.YYYY") +
                        "г."}{" "}
                    -{dayjs(record?.date_end).format("DD.MM.YYYY") + "г."}(
                    {record.duration})
                  </Text>
                </Col>
              </Row>
            </Space.Compact>
          ),
        },
        {
          width: "20%",

          title: "Исполнитель",
          key: "task",
          align: "left",
          render: (text, record) => (
            <Space.Compact
              direction={"vertical"}
              style={{ alignContent: "start" }}
            >
              <Text strong>
                {record?.executor?.passport?.last_name}{" "}
                {record?.executor?.passport?.first_name}{" "}
                {record?.executor?.passport?.patronymic}
              </Text>
            </Space.Compact>
          ),
        },
        {
          width: "20%",
          title: "Статус",
          key: "task",
          align: "left",
          render: (text, record) => <StatusRender projectTask={record} />,
        },
      ],
    },
  ];
  return (
    <div>
      <Modal
        key={delayModalStatus}
        open={delayModalStatus}
        onCancel={() => setDelayModalStatus(null)}
        footer={null}
        width={"max-content"}
        children={
          <Card title={"Статусы задач"}>
            <StartDelayForm
              onCompleted={() => {
                setDelayModalStatus(null);
                refetch && refetch();
              }}
              projectId={projectId}
              selectedTasksId={delayModalStatus}
            />
          </Card>
        }
      />
      <Table
        style={{ margin: 0, width: "100%" }}
        size={"small"}
        loading={loading}
        columns={columnsTasks}
        dataSource={data?.projectTasks?.filter((row) => row?.executor?.id > 0)}
        pagination={false}
      />
    </div>
  );
};

export default TableProjectTasksManagment;
const CustomProgressBar = ({ projectTask, ...props }) => {
  const progress = dayjs().diff(dayjs(projectTask.date_start), "day"); // дни выполнения
  const totalDuration = dayjs(projectTask.date_end).diff(
    dayjs(projectTask.date_start),
    "day"
  ); // общая продолжительность
  const percentComplete = Math.min((progress / totalDuration) * 100, 100); // процент выполнения

  switch (projectTask.status) {
    case "NOT_EXECUTOR":
      return "Ошибка";
    case "AWAITING":
      return (
        <>
          {progress < -3 ? (
            <Alert
              style={{ padding: 2 }}
              type="info"
              showIcon
              message={`До начала : ${Math.abs(progress)} д.`}
            />
          ) : progress >= -3 && progress <= 0 ? (
            <Alert
              style={{ padding: 2 }}
              type="warning"
              showIcon
              message={`До начала: ${Math.abs(progress)} д.`}
            />
          ) : (
            <Alert
              style={{ padding: 2 }}
              type="error"
              showIcon
              message={`Просрочка на: ${Math.abs(progress)} д.`}
            />
          )}
        </>
      );
    case "WORKING":
      return (
        <>
          {progress >= 0 ? (
            <>
              В работе: {Math.abs(progress)} д.
              <Progress
                steps={5}
                percent={Math.trunc(percentComplete, 3)}
                size={[28, 14]}
              />
            </>
          ) : progress >= totalDuration - 4 && progress <= totalDuration ? (
            <>
              Скоро завершение задачи: {Math.abs(progress)} д.
              <Progress
                steps={5}
                status="warning"
                percent={percentComplete}
                size={[28, 14]}
              />
            </>
          ) : (
            <>
              Задача просрочена на: {Math.abs(progress)} д.
              <Progress
                steps={5}
                status="error"
                percent={percentComplete}
                size={[28, 14]}
              />
            </>
          )}
        </>
      );
    case "COMPLETED":
      return (
        <>
          Задача выполнена
          <Progress steps={5} percent={100} size={[28, 14]} />
        </>
      );
    default:
      return "Неизвестный статус";
  }
};

const StatusRender = ({ projectTask = {} }) => {
  const [upMutate, { loading: loadingSave }] = useMutation(
    PROJECT_TASK_UP_MUTATION,
    {
      onCompleted: () => {
        openNotification("topRight", "success", `Статус задачи повышен`);
      },
      onError: (error) => {
        openNotification("topRight", "error", `Ошибка: ${error.message}`);
      },
    }
  );

  const handleStatusUp = () => {
    if (projectTask?.id) {
      upMutate({ variables: { taskId: projectTask.id } });
    } else {
      openNotification("topRight", "error", "Задача не найдена");
    }
  };

  const handleStatusDown = () => {
    console.log("Уменьшение статуса задачи");
  };

  const DefaultLink = ({ children }) => {
    return <Link onClick={handleStatusUp}>{children}</Link>;
  };

  if (!projectTask || !projectTask.status) {
    return (
      <Alert
        type="error"
        message="Задача не определена или статус отсутствует"
      />
    );
  }

  const progress = projectTask.date_start
    ? dayjs(projectTask.date_start).diff(dayjs(), "day")
    : null;

  if (projectTask.is_delay) {
    switch (projectTask.status) {
      case "AWAITING":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Alert type="warning" message="Есть задержка в зависимых задачах" />
            <DefaultLink>Начать выполнение задачи</DefaultLink>
          </div>
        );
      case "WORKING":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Alert type="error" message="Задержка посреди рабочего процесса" />
            <DefaultLink>Завершить задачу</DefaultLink>
          </div>
        );
      default:
        return <Alert type="info" message="Задержка. Статус не определён." />;
    }
  }

  switch (projectTask.status) {
    case "NOT_EXECUTOR":
      return <DefaultLink>Исполнитель не назначен</DefaultLink>;

    case "AWAITING":
      return (
        <>
          Ожидание
          <br />
          {dayjs(projectTask.date_start).isAfter(dayjs().subtract(5, "day")) ? (
            <DefaultLink>Начать выполнение задачи</DefaultLink>
          ) : (
            <DefaultLink>Завершить досрочно</DefaultLink>
          )}
        </>
      );

    case "WORKING":
      return (
        <>
          В работе
          <br />
          {dayjs(projectTask.date_end).isBefore(dayjs().subtract(3, "day")) ? (
            <DefaultLink>Завершить задачу</DefaultLink>
          ) : (
            <DefaultLink>Завершить досрочно</DefaultLink>
          )}
        </>
      );

    case "COMPLETED":
      return <>Задача выполнена</>;

    default:
      return <Alert type="warning" message="Неизвестный статус задачи" />;
  }
};
