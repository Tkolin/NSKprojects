import {
  DownloadOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Col, Divider, Row, Tooltip } from "antd";
import React from "react";
import ProjectContractFileGenerated from "../../../../../../../../../../components/script/fileGenerated/ProjectContractFileGenerated";
import LinkToDownload from "../../../../../../../../../../components/script/LinkToDownload";
import { UploadFilePopconfirm } from "../../../../../../../../../../components/UploadFile";
import CustomMenuButton from "./CustomMenuButton";

const customLinkProps = {
  type: "text",
  style: { width: "100%" },
  size: "large",
};

const ContractDocumentBlock = ({ record, onUpdated }) => {
  const getFileId = (arrayFile, isStamp = false) => {
    const maxNumberRecord = arrayFile
      .filter((row) => row.type === (isStamp ? "CONTRACT_STAMP" : "CONTRACT"))
      .reduce((max, current) => {
        return current.number > (max?.number || 0) ? current : max;
      }, null);
    return maxNumberRecord?.file_id ?? null;
  };
  const contractFileId = getFileId(record?.project_contract_history, false);
  const stampContractFileId = getFileId(record?.project_contract_history, true);
  const permissions = JSON.parse(localStorage.getItem("userPermissions")).map(
    (row) => row.name_key
  );
  if (!permissions.includes("download-file-projectContract")) return null;
  return record?.contract_file_id ? (
    <>
      <Divider style={{ margin: "5px" }} orientation={"left"}>
        Договор проекта
      </Divider>
      <LinkToDownload fileId={record.contract_file_id}>
        <CustomMenuButton icon={<DownloadOutlined />}>
          Скачать (подписан) от {record.date_signing}
        </CustomMenuButton>
      </LinkToDownload>
    </>
  ) : (
    <div>
      <Divider style={{ margin: "5px" }} orientation={"left"}>
        Формирование договора
      </Divider>
      <ProjectContractFileGenerated
        projectId={record.id}
        icon={<PlusOutlined />}
        children={<CustomMenuButton children={"Сгенерировать договор"} />}
      />

      {(contractFileId || stampContractFileId) && (
        <>
          <UploadFilePopconfirm
            options={{ datePicker: true }}
            title={"Укажите дату подписания"}
            onUpdated={() => onUpdated()}
            action={
              "project/upload/project_contract/page?projectId=" + record.id
            }
            children={
              <CustomMenuButton
                className={"danger_text_btn"}
                icon={<UploadOutlined />}
                children={"Прикрепить договор"}
              />
            }
          />
          <Row direction={"horizontal"} style={{ width: "100%" }}>
            <Col span={12}>
              <Tooltip title={"DOCX пример"}>
                <LinkToDownload
                  disabled={!contractFileId}
                  fileId={contractFileId}
                  children={
                    <CustomMenuButton
                      disabled={!stampContractFileId}
                      icon={<FileWordOutlined style={{ color: "#1677ff" }} />}
                      children={
                        <>
                          .docx
                          <DownloadOutlined />
                        </>
                      }
                    />
                  }
                />
              </Tooltip>
            </Col>
            <Col span={12}>
              <Tooltip title={"PDF с печатями"}>
                <LinkToDownload
                  disabled={!stampContractFileId}
                  fileId={stampContractFileId}
                  children={
                    <CustomMenuButton
                      disabled={!stampContractFileId}
                      icon={<FilePdfOutlined style={{ color: "#d9363e" }} />}
                      children={
                        <>
                          .pdf
                          <DownloadOutlined />
                        </>
                      }
                    />
                  }
                />
              </Tooltip>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};
export default ContractDocumentBlock;
