import { useMutation } from "@apollo/client";
import { notification, Typography } from "antd";
import { TASK_EXECUTOR_CONTRACT_DOWNLOAD } from "../../../../graphql/mutations/project";
const { Text, Link } = Typography;

const TaskExecutorContractDownload = ({ projectTasksIds, text }) => {
  const LaravelURL = process.env.REACT_APP_API_URL;

  const openNotification = (placement, type, message) => {
    notification[type]({
      message: message,
      placement,
    });
  };

  const [downloadTaskExecutorContract] = useMutation(
    TASK_EXECUTOR_CONTRACT_DOWNLOAD,
    {
      onCompleted: (data) => {
        console.log("onCompleted data", data);
        handleDownloadClick(data?.taskExecutorContractFileDownload?.url);
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

  const handleDownload = () => {
    console.log("projectTasksIds", projectTasksIds);
    downloadTaskExecutorContract({
      variables: { projectTasksIds: projectTasksIds },
    });
  };

  const handleDownloadClick = async (downloadedFileUrl) => {
    console.log("handleDownloadClick");

    try {
      const link = document.createElement("a");
      console.log(link);

      link.href = `${LaravelURL}download-taskExecutorContract/${downloadedFileUrl}`;
      link.download = "${downloadedFileUrl}";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Ошибка при скачивании файла:", error);
    }
  };

  return <Link onClick={handleDownload}>{text ?? "скачать"}</Link>;
};

export default TaskExecutorContractDownload;
