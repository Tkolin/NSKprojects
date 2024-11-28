import { EditOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import {
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
        openNotification("topRight", "success", "ИРД подтвержено специалистом");
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
        openNotification("topRight", "success", "ИРД подтвержено специалистом");
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
        openNotification("topRight", "success", "ИРД подтвержено специалистом");
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
                onClick={() => handleViewed(record?.id)}
                loading={loadingViewedProjectIrd}
              >
                отметить
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
              style={{ alignContent: "start" }}
            >
              {record.is_broken ? "Да" : "Нет"}
              <Button
                type="link"
                onClick={() => handleReject(record.id)}
                loading={loadingRejectProjectIrd}
              >
                +
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
                : record.received_date
                ? "Не проверенно (получено от " +
                  dayjs(record?.received_date).format("DD.MM.YYYY") +
                  " )г."
                : "Не переданно заказчиком"}
              <br />
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
            </Text>
          ),
        },
      ],
    },
  ];
  return (
    <Table
      style={{ margin: 0, width: "100%" }}
      size={"small"}
      loading={loading}
      columns={columnsIrds}
      dataSource={data?.projectIrds}
      pagination={false}
    />
  );
};
export default TableIrdsComponent;
