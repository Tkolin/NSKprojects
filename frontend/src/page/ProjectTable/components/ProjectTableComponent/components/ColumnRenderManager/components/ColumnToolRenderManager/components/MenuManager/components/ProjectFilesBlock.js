import { FileOutlined } from "@ant-design/icons";
import { Divider, Tooltip } from "antd";
import React from "react";
import CustomMenuButton from "./CustomMenuButton";

const ProjectFilesBlock = ({ project, onUpdated }) => {
  const handleDownloadClick = async (downloadedFileUrl) => {
    try {
      const link = document.createElement("a");
      console.log(link);

      link.href = downloadedFileUrl;
      link.target = "_blank";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Ошибка при скачивании файла:", error);
    }
  };

  return (
    <>
      <Divider style={{ margin: "5px" }} orientation={"left"}>
        Файлы
      </Divider>
      <Tooltip title={"Удаление недоступно (администратор)"}>
        <CustomMenuButton
          disabled={project.start_file_url}
          onClick={() => handleDownloadClick(project.start_file_url)}
          icon={<FileOutlined />}
        >
          Скачать первичные файлы
        </CustomMenuButton>
      </Tooltip>
    </>
  );
};
export default ProjectFilesBlock;
