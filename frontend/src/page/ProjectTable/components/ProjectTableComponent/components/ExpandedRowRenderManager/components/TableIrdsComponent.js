import { EditOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import {
  Alert,
  Button,
  notification,
  Popconfirm,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import Link from "antd/es/typography/Link";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  ACCEPT_IRD_MUTATION,
  RECEIVED_IRD_MUTATION,
  REJECT_IRD_MUTATION,
  VIEWED_IRD_MUTATION,
} from "../../../../../../../graphql/mutations/projectIrd";
import { PROJECT_IRDS_QUERY } from "../../../../../../../graphql/queries/projectIrds";
import { CustomDatePicker } from "../../../../../../components/FormattingDateElementComponent";

const { Text } = Typography;

const TableIrdsComponent = ({ setEditModalStatus, projectId }) => {
  const openNotification = (placement, type, message) => {
    notification[type]({
      message: message,
      placement,
    });
  };
  const { data, loading, refetch } = useQuery(PROJECT_IRDS_QUERY, {
    variables: {
      projectId: projectId,
    },
  });
  useEffect(() => {
    refetch();
  }, []);
  const [viewedProjectIrd, { loading: loadingViewedProjectIrd }] = useMutation(
    VIEWED_IRD_MUTATION,
    {
      onCompleted: (data) => {
        openNotification(
          "topRight",
          "success",
          "Ирд отмечено как просмотренное"
        );
        refetch();
      },
      onError: (error) => {
        openNotification("topRight", "error", "ошибка VIEWED_IRD_MUTATION");
      },
    }
  );
  const [acceptProjectIrd, { loading: loadingAcceptProjectIrd }] = useMutation(
    ACCEPT_IRD_MUTATION,
    {
      onCompleted: (data) => {
        openNotification("topRight", "success", "ИРД одобрено специалистом");
        refetch();
      },
      onError: (error) => {
        openNotification("topRight", "error", "ошибка ACCEPT_IRD_MUTATION");
      },
    }
  );
  const [receivedProjectIrd, { loading: loadingReceivedProjectIrd }] =
    useMutation(RECEIVED_IRD_MUTATION, {
      onCompleted: (data) => {
        openNotification("topRight", "success", "ИРД принято специалистом");
        refetch();
      },
      onError: (error) => {
        openNotification("topRight", "error", "ошибка RECEIVED_IRD_MUTATION");
      },
    });
  const [rejectProjectIrd, { loading: loadingRejectProjectIrd }] = useMutation(
    REJECT_IRD_MUTATION,
    {
      onCompleted: (data) => {
        openNotification("topRight", "success", "ИРД забраковано специалистом");
        refetch();
      },
      onError: (error) => {
        openNotification("topRight", "error", "ошибка REJECT_IRD_MUTATION");
      },
    }
  );
  const [receivedDate, setReceivedDate] = useState();
  const [acceptDate, setAcceptDate] = useState();

  const handleViewed = (projectIrdId) => {
    if (!projectIrdId) throw new Error("Ключ ирд не переданн!");
    viewedProjectIrd({
      variables: { irdIds: [projectIrdId] },
    });
  };
  const handleAccept = (projectIrdId) => {
    if (!projectIrdId || !acceptDate) throw new Error("Ключ ирд не переданн!");
    acceptProjectIrd({
      variables: { irdId: projectIrdId, dateAccept: acceptDate },
    });
  };
  const handleReceived = (projectIrdId) => {
    if (!projectIrdId || !receivedDate)
      throw new Error("Ключ ирд не переданн!");
    receivedProjectIrd({
      variables: { irdId: projectIrdId, dateReceived: receivedDate },
    });
  };
  const handleReject = (projectIrdId) => {
    if (!projectIrdId) throw new Error("Ключ ирд не переданн!");
    rejectProjectIrd({
      variables: { irdId: projectIrdId },
    });
  };

  const columnsIrds = [
    {
      title: (
        <Space>
          <Tooltip title={"Список ИРД"}>
            <Text style={{ marginRight: 10 }}>Список ИРД</Text>
          </Tooltip>

          <Link type={"warning"}>
            <EditOutlined
              onClick={() => setEditModalStatus && setEditModalStatus()}
            />
          </Link>
        </Space>
      ),
      children: [
        {
          width: "5%",

          title: "Просмотренно",
          dataIndex: "is_viewed",
          key: "is_viewed",
          align: "left",
          render: (text, record) => (
            <Space.Compact
              direction={"vertical"}
              style={{ alignContent: "center", textAlign: "center" }}
            >
              {record.is_viewed ? "Да" : "Нет"}
              <Button
                type="link"
                disabled={record.is_viewed || record.acceptance_date}
                onClick={() => handleViewed(record?.id)}
                loading={loadingViewedProjectIrd}
              >
                {record.is_viewed ? "Просмотрено" : "Отметиться"}
              </Button>
            </Space.Compact>
          ),
        },
        {
          width: "5%",
          title: "Брак",
          dataIndex: "is_broken",
          key: "is_broken",
          align: "left",
          render: (text, record) => (
            <Space.Compact
              direction={"vertical"}
              style={{ alignContent: "center", textAlign: "center" }}
            >
              {record.is_broken ? "Да" : "Нет"}
              <Button
                type="link"
                disabled={record.is_broken || record.acceptance_date}
                onClick={() => handleReject(record.id)}
                loading={loadingRejectProjectIrd}
              >
                {record.is_broken ? "Забраковано" : "Забраковать"}
              </Button>
            </Space.Compact>
          ),
        },
        {
          width: "45%",

          title: "Основная информация",
          dataIndex: "ird",
          key: "ird",
          align: "left",
          render: (text, record) => (
            <Space.Compact
              direction={"vertical"}
              style={{ alignContent: "start" }}
            >
              <Text strong>
                {record?.ird?.name}{" "}
                <strong>(Этап №{record?.stage_number})</strong>
              </Text>
            </Space.Compact>
          ),
        },
        {
          width: "40%",

          title: "Статус получения",
          dataIndex: "status_confirm",
          key: "status_confirm",
          align: "left",
          render: (text, record) => (
            <Text strong>
              {record.acceptance_date
                ? "Принято: " +
                  dayjs(record?.acceptance_date).format("DD.MM.YYYY") +
                  " г."
                : record.is_broken
                ? "Забраковано (получено от " +
                  dayjs(record?.received_date).format("DD.MM.YYYY") +
                  " )г."
                : record.received_date
                ? "Не проверенно (получено от " +
                  dayjs(record?.received_date).format("DD.MM.YYYY") +
                  " )г."
                : "Не переданно заказчиком"}
              {record.acceptance_date && (
                <Button
                  danger
                  type="Link"
                  onClick={() => handleReject(record.id)}
                >
                  {" "}
                  отменить{" "}
                </Button>
              )}
              <br />
              {record.is_broken && (
                <Popconfirm
                  title={
                    <Space direction="vertical" style={{ width: "200px" }}>
                      <CustomDatePicker
                        size="small"
                        placeholder="Выберите дату..."
                        onChange={(value) =>
                          setReceivedDate(
                            value ? dayjs(value).format("YYYY-MM-DD") : null
                          )
                        }
                      />
                    </Space>
                  }
                  onConfirm={() => handleReceived(record.id)}
                  okText="Принять"
                  cancelText="Отмена"
                >
                  <Button danger loading={loadingReceivedProjectIrd}>
                    Заменить ИРД
                  </Button>
                </Popconfirm>
              )}
              {!record.acceptance_date &&
                !record.received_date &&
                !record.is_broken && (
                  <Popconfirm
                    title={
                      <Space direction="vertical" style={{ width: "200px" }}>
                        <CustomDatePicker
                          size="small"
                          placeholder="Выберите дату..."
                          onChange={(value) =>
                            setReceivedDate(
                              value ? dayjs(value).format("YYYY-MM-DD") : null
                            )
                          }
                        />
                      </Space>
                    }
                    onConfirm={() => handleReceived(record.id)}
                    okText="Принять"
                    cancelText="Отмена"
                  >
                    <Button loading={loadingReceivedProjectIrd}>
                      Отметить как полученное
                    </Button>
                  </Popconfirm>
                )}
              {!record.acceptance_date && !record.is_broken && (
                <Popconfirm
                  title={
                    <Space direction="vertical" style={{ width: "200px" }}>
                      <CustomDatePicker
                        size="small"
                        placeholder="Выберите дату..."
                        onChange={(value) =>
                          setAcceptDate(
                            value ? dayjs(value).format("YYYY-MM-DD") : null
                          )
                        }
                      />
                    </Space>
                  }
                  onConfirm={() => handleAccept(record.id)}
                  okText="Принять"
                  cancelText="Отмена"
                >
                  <Button loading={loadingAcceptProjectIrd}>
                    Отметить как принятое
                  </Button>
                </Popconfirm>
              )}
            </Text>
          ),
        },
      ],
    },
  ];
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Table
        style={{ margin: 0, width: "100%" }}
        size={"small"}
        loading={loading}
        columns={columnsIrds}
        dataSource={data?.projectIrds}
        pagination={false}
      />
      <Alert
        message="Подсказка по прохождению ИРД"
        description={
          <>
            Ирд может быть забраковано или принято:
            <ui>
              <li>
                1. При получении ирд от заказчика (в первые) необходимо нажать
                на "отметить ка полученное"{" "}
              </li>
              <li>
                2. После чего отобразиться дата получения ирд, следующий шаг -
                проверка ирд специалистом Когда специалист начет проверку, ему
                необходимо отметить, то что он просмотрелл данное ирд
              </li>
              <li>
                3. Во время проверки специалист может забраковать ИРД - после
                чего заказчик должен повторно его предоставить
              </li>
              <li>
                4. После предоставления ИРД заказчиком процедура повторяеться с
                пункта 2
              </li>
              <li>
                5. Если ИРД устраивает специалиста он отмечает его как принятое,
                после чего действия с ИРД заканчиваються
              </li>
            </ui>
          </>
        }
        type="info"
        showIcon
      />{" "}
    </Space>
  );
};
export default TableIrdsComponent;
