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
import dayjs from "dayjs";
import React, { useState } from "react";
import {
  GENERATED_DELAY_CUSTOMER_MUTATION,
  STOP_DELAY_MUTATION,
} from "../../../../../../../graphql/mutationsDelay";
import { DOWNLOAD_FILE } from "../../../../../../../graphql/mutationsFile";
import { PROJECT_DELAYS_QUERY } from "../../../../../../../graphql/queries";
import { CONTACTS_BY_ORGANIZATION } from "../../../../../../../graphql/queriesSpecial";
import { CustomDatePicker } from "../../../../../../components/FormattingDateElementComponent";

const { Text } = Typography;

const openNotification = (placement, type, message) => {
  notification[type]({
    message: message,
    placement,
  });
};

const TableProjectTasksDelayManagment = ({ projectId }) => {
  const [selectedDateContract, setSelectedDateContract] = useState();
  const [selectedDateStopDelay, setSelectedDateStopDelay] = useState();
  const [downloadFileLoading, setDownloadFileLoading] = useState(false);
  const LaravelURL = process.env.REACT_APP_API_URL;

  const {
    data: dataProjectDelay,
    loading: loadingProjectDelay,
    refetch: refetchProjectDelay,
  } = useQuery(PROJECT_DELAYS_QUERY, {
    variables: { projectId },
    onCompleted: (result) => console.log(result),
  });

  const { data: dataContacts, loading: loadingContacts } = useQuery(
    CONTACTS_BY_ORGANIZATION,
    {
      variables: {
        organizationId: dataProjectDelay?.organization_customer?.id,
      },
    }
  );

  const [generateDelayMutate, { loading: loadingGeneratedDelay }] = useMutation(
    GENERATED_DELAY_CUSTOMER_MUTATION,
    {
      onCompleted: (data) => {
        openNotification(
          "topRight",
          "success",
          "Файл успешно сгенерирован, начало загрузки... "
        );
        downloadFile({ variables: { id: data.generatedDelayCustomerMessage } });
        refetchProjectDelay();
      },
      onError: (error) => {
        openNotification(
          "topRight",
          "error",
          `Ошибка генерации: ${error.message}`
        );
      },
    }
  );
  const [stopDelay, { loading: loadingStopDelay }] = useMutation(
    STOP_DELAY_MUTATION,
    {
      onCompleted: (data) => {
        openNotification("topRight", "success", "Задержка успешно завершена");
        refetchProjectDelay();
      },
      onError: (error) => {
        openNotification(
          "topRight",
          "error",
          `Ошибка генерации: ${error.message}`
        );
      },
    }
  );

  const [downloadFile] = useMutation(DOWNLOAD_FILE, {
    onCompleted: (data) => {
      handleDownloadClick(data.downloadFile.url);
      openNotification("topRight", "success", "Файл успешно загружен");
      setDownloadFileLoading(false);
    },
    onError: (error) => {
      openNotification(
        "topRight",
        "error",
        `Ошибка загрузки файла: ${error.message}`
      );
      setDownloadFileLoading(false);
    },
  });
  const handleDownloadClick = async (downloadedFileUrl) => {
    try {
      const link = document.createElement("a");
      console.log(link);
      link.href = `${LaravelURL}${downloadedFileUrl}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Ошибка при скачивании файла:", error);
    }
  };
  const handleGenerateFile = (delayId) => {
    generateDelayMutate({
      variables: {
        delayId,
        dateFixed: dayjs(selectedDateContract).format("YYYY-MM-DD"),
      },
    });
  };
  const handleStopDelay = (delayId) => {
    stopDelay({
      variables: {
        delayId,
        dateStop: dayjs(selectedDateStopDelay).format("YYYY-MM-DD"),
      },
    });
  };

  const columnsTasks = [
    {
      title: (
        <Space>
          <Tooltip title={"Список задач"}>
            <Text style={{ marginRight: 10 }}>Список задержек на проекте</Text>
          </Tooltip>
        </Space>
      ),
      children: [
        {
          title: "Статус",
          key: "status",
          align: "left",
          render: (text, record) => (
            <Space.Compact direction="vertical">
              {record.delay_type.name}
              <span>{record.delay_type.key}</span>
              <div style={{ color: record.date_end ? "green" : "red" }}>
                {dayjs(record.date_start).format("DD.MM.YY")}
                <span> - </span>
                {record.date_end
                  ? dayjs(record.date_end).format("DD.MM.YY")
                  : "Не закрыто"}
              </div>
            </Space.Compact>
          ),
        },
        {
          title: "Действия",
          key: "actions",
          align: "left",
          render: (text, record) => {
            return (
              !record.date_end && (
                <Space.Compact direction="vertical">
                  <Popconfirm
                    title={
                      <Space direction="vertical" style={{ width: "200px" }}>
                        <CustomDatePicker
                          size="small"
                          placeholder="Выберите дату..."
                          onChange={(value) =>
                            setSelectedDateContract(
                              value ? dayjs(value).format("YYYY-MM-DD") : null
                            )
                          }
                        />
                      </Space>
                    }
                    onConfirm={() => handleGenerateFile(record.id)}
                    okText="Сгенерировать"
                    cancelText="Отмена"
                  >
                    <Button loading={loadingGeneratedDelay}>
                      Сгенерировать
                    </Button>
                  </Popconfirm>

                  <Popconfirm
                    title={
                      <Space direction="vertical" style={{ width: "200px" }}>
                        <CustomDatePicker
                          size="small"
                          placeholder="Выберите дату..."
                          onChange={(value) =>
                            setSelectedDateStopDelay(
                              value ? dayjs(value).format("YYYY-MM-DD") : null
                            )
                          }
                        />
                      </Space>
                    }
                    onConfirm={() => handleStopDelay(record.id)}
                    okText="Сгенерировать"
                    cancelText="Отмена"
                  >
                    <Button loading={loadingStopDelay}>
                      Завершить задержку
                    </Button>
                  </Popconfirm>
                </Space.Compact>
              )
            );
          },
        },
      ],
    },
  ];

  return (
    <Table
      loading={loadingProjectDelay}
      style={{ margin: 0, width: "100%" }}
      size="small"
      columns={columnsTasks}
      dataSource={dataProjectDelay?.projectDelay}
      pagination={false}
    />
  );
};

export default TableProjectTasksDelayManagment;
