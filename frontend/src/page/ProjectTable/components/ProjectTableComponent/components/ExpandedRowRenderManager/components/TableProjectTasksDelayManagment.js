import { DownloadOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import {
  Button,
  notification,
  Popconfirm,
  Space,
  Table,
  Tooltip,
  Typography
} from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { GENERATED_DELAY_CUSTOMER_MUTATION } from "../../../../../../../graphql/mutationsDelay";
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
  const [selectedDelegations, setSelectedDelegations] = useState();
  const [generateKpLoading, setGenerateKpLoading] = useState(false);
  const [downloadFileLoading, setDownloadFileLoading] = useState(false);

  const { data, loading, refetch } = useQuery(PROJECT_DELAYS_QUERY, {
    variables: { projectId },
    onCompleted: (result) => console.log(result),
  });

  const { loading: loadingContacts, data: dataContacts } = useQuery(CONTACTS_BY_ORGANIZATION, {
    variables: { organizationId: data?.organization_customer?.id },
  });

  const [generateKpMutate] = useMutation(GENERATED_DELAY_CUSTOMER_MUTATION, {
    onCompleted: (data) => {
      openNotification("topRight", "success", "Файл успешно сгенерирован");
      setGenerateKpLoading(false);
      refetch();
    },
    onError: (error) => {
      openNotification("topRight", "error", `Ошибка генерации: ${error.message}`);
      setGenerateKpLoading(false);
    },
  });

  const [downloadFile] = useMutation(DOWNLOAD_FILE, {
    onCompleted: (data) => {
      const link = document.createElement("a");
      link.href = data.downloadFile.url;
      link.download = "DelayFile";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      openNotification("topRight", "success", "Файл успешно загружен");
      setDownloadFileLoading(false);
    },
    onError: (error) => {
      openNotification("topRight", "error", `Ошибка загрузки файла: ${error.message}`);
      setDownloadFileLoading(false);
    },
  });

  const handleGenerateFile = (delayId) => {
    setGenerateKpLoading(true);
    generateKpMutate({
      variables: {
        delayId, 
        dateFixed: dayjs(selectedDelegations).format("YYYY-MM-DD"),
       },
    });
  };

  const handleDownloadFile = (fileId) => {
    setDownloadFileLoading(true);
    downloadFile({ variables: { id: fileId } });
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
            <div style={{ color: record.date_end ? "green" : "red" }}>
              {dayjs(record.date_start).format("DD.MM.YY")}
              <span> - </span>
              {record.date_end ? dayjs(record.date_end).format("DD.MM.YY") : "Не закрыто"}
            </div>
          ),
        },
        {
          title: "Действия",
          key: "actions",
          align: "left",
          render: (text, record) => (
            <Space>
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
                onConfirm={()=>handleGenerateFile(record.id)}
                okText="Сгенерировать"
                cancelText="Отмена"
              >
                <Button>Сгенерировать</Button>
               </Popconfirm>
              <Button
                icon={<DownloadOutlined />}
                onClick={() => handleDownloadFile(record.file_id)}
                loading={downloadFileLoading}
                disabled={!record.file_id}
              >
                Скачать
              </Button>
            </Space>
          ),
        },
      ],
    },
  ];

  return (
    <Table
      loading={loading}
      style={{ margin: 0, width: "100%" }}
      size="small"
      columns={columnsTasks}
      dataSource={data?.projectDelay}
      pagination={false}
    />
  );
};

export default TableProjectTasksDelayManagment;
