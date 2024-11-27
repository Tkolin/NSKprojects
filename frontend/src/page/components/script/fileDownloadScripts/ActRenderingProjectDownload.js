import { useMutation } from "@apollo/client";
import { Button, notification, Popconfirm, Space, Typography } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { DOWNLOAD_FILE } from "../../../../graphql/mutations/file";
import { ACT_RENDERING_PROJECT_DOWNLOAD } from "../../../../graphql/mutations/project";
import CustomMenuButton from "../../../ProjectTable/components/ProjectTableComponent/components/ColumnRenderManager/components/ColumnToolRenderManager/components/MenuManager/components/CustomMenuButton";
import { CustomDatePicker } from "../../FormattingDateElementComponent";

const { Text, Link } = Typography;

const ActRenderingProjectDownload = ({
  projectId,
  stageNumber,
  text,
  onUpdated,
}) => {
  const LaravelURL = process.env.REACT_APP_API_URL;

  const openNotification = (placement, type, message) => {
    notification[type]({
      message: message,
      placement,
    });
  };
  const [downloadProjectActRendering, { loading }] = useMutation(
    ACT_RENDERING_PROJECT_DOWNLOAD,
    {
      onCompleted: (data) => {
        downloadFile({
          variables: { id: data.projectActRenderingFileDownload.url },
        });
        openNotification("topRight", "success", `Акт сгенерирован.`);
        onUpdated && onUpdated();
      },
      onError: (error) => {
        openNotification(
          "topRight",
          "error",
          "Ошибка при загрузке: " + error.message
        );
      },
    }
  );
  const [downloadFile, { loading: loadingToDownload }] = useMutation(
    DOWNLOAD_FILE,
    {
      onCompleted: (data) => {
        console.log(data.downloadFile.url);
        handleDownload(data.downloadFile.url);
        openNotification("topRight", "success", "Загрузка начата!");
      },
      onError: (error) => {
        openNotification(
          "topRight",
          "error",
          "Ошибка при загрузке: " + error.message
        );
      },
    }
  );
  const [selectedDateAct, setSelectedDateAct] = useState();

  const handleDownload = async (downloadedFileUrl) => {
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
  return (
    <Popconfirm
      style={{
        width: "200px",
      }}
      placement="topLeft"
      description={
        <Space direction={"vertical"} style={{ width: "200px" }}>
          <CustomDatePicker
            size={"small"}
            placement={"Выберите дату..."}
            style={{ width: "200px", marginTop: 15 }}
            onChange={(value) => {
              value
                ? setSelectedDateAct(value && dayjs(value).format("YYYY-MM-DD"))
                : setSelectedDateAct(null);
            }}
          />

          <Button
            block
            disabled={!setSelectedDateAct}
            loading={loading}
            onClick={() =>
              downloadProjectActRendering({
                variables: {
                  id: projectId,
                  stageNumber: stageNumber,
                  dateGenerated: selectedDateAct,
                },
              })
            }
            style={{ width: "200px", marginTop: 15 }}
          >
            Сгенерировать файл
          </Button>
        </Space>
      }
      okButtonProps={{
        style: {
          display: "none",
        },
      }}
      showCancel={false}
      children={<CustomMenuButton>Сгенерировать Акт</CustomMenuButton>}
    />
  );
};

export default ActRenderingProjectDownload;
