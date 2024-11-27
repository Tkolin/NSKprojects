import { useMutation, useQuery } from "@apollo/client";
import { Button, Divider, Modal, notification, Popconfirm, Space } from "antd";
import React, { useEffect, useState } from "react";

import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";

import dayjs from "dayjs";

import { nanoid } from "nanoid";
import { DOWNLOAD_FILE } from "../../../../../../../../../../../graphql/mutations/file";
import { GENERATED_DELAY_CUSTOMER_MUTATION } from "../../../../../../../../../../../graphql/mutations/projectDelay";
import { CONTACTS_BY_ORGANIZATION } from "../../../../../../../../../../../graphql/queries/queriesSpecial";
import { CustomDatePicker } from "../../../../../../../../../../components/FormattingDateElementComponent";
import LinkToDownload from "../../../../../../../../../../components/script/LinkToDownload";
import { UploadFilePopconfirm } from "../../../../../../../../../../components/UploadFile";
import ContactForm from "../../../../../../../../../../simplesForms/ContactForm";
import CustomMenuButton from "./CustomMenuButton";

const DelayCustomerDocumentBlock = ({ project, onUpdated }) => {
  const { loading: loadingContacts, data: dataContacts } = useQuery(
    CONTACTS_BY_ORGANIZATION,
    { variables: { organizationId: project?.organization_customer?.id } }
  );
  useEffect(() => {
    console.log("KPDocumentBlock", project);
  }, [project]);
  const openNotification = (placement, type, message) => {
    notification[type]({
      message: message,
      placement,
    });
  };
  const LaravelURL = process.env.REACT_APP_API_URL;

  const [downloadFile, { loading: loading }] = useMutation(DOWNLOAD_FILE, {
    onCompleted: (data) => {
      handleDownloadClick(data.downloadFile.url);
    },
    onError: (error) => {
      openNotification(
        "topRight",
        "error",
        "Ошибка при загрузке: " + error.message
      );
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
  const [generateKpMutate, { loading: generateKpLoading }] = useMutation(
    GENERATED_DELAY_CUSTOMER_MUTATION,
    {
      onCompleted: (data) => {
        downloadFile({
          variables: { id: data.generatedDelayCustomerMessage.url },
        });
        openNotification(
          "topRight",
          "success",
          `Коммерческое предложение сгенерировано`
        );
        onUpdated && onUpdated();
      },
      onError: (error) => {
        openNotification(
          "topRight",
          "error",
          `Ошибка при генерации: ` + error.message
        );
      },
    }
  );

  const [selectedDateContract, setSelectedDateContract] = useState();
  const [contactModalStatus, setContactModalStatus] = useState();
  const handleGeneratedKp = () => {
    generateKpMutate({
      variables: {
        delayId: project.id,
        dateFixed: selectedDateContract,
      },
    });
  };
  const permissions = JSON.parse(localStorage.getItem("userPermissions")).map(
    (row) => row.name_key
  );
  if (!permissions.includes("read-project-kp")) return null;
  return (
    <>
      <>
        <Divider style={{ margin: "5px" }} orientation={"left"}>
          Формирование Delay
        </Divider>

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
                    ? setSelectedDateContract(
                        value && dayjs(value).format("YYYY-MM-DD")
                      )
                    : setSelectedDateContract(null);
                }}
              />
              <Button
                block
                disabled={!selectedDateContract}
                loading={generateKpLoading}
                onClick={() => handleGeneratedKp()}
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
          children={<CustomMenuButton>Сгенерировать Delay</CustomMenuButton>}
        />
        <LinkToDownload
          disabled={project?.project_kp_history?.length <= 0}
          fileId={
            project?.project_kp_history?.length > 0 &&
            project?.project_kp_history[project?.project_kp_history?.length - 1]
              .file_id
          }
        >
          <CustomMenuButton
            icon={<DownloadOutlined />}
            disabled={project?.project_kp_history?.length <= 0}
          >
            Скачать последнее Delay
          </CustomMenuButton>
        </LinkToDownload>
        <UploadFilePopconfirm
          options={{ datePicker: true }}
          title={"Укажите дату принятия"}
          onUpdated={() => onUpdated()}
          action={"project/upload/project_kp/page?projectId=" + project.id}
          children={
            <CustomMenuButton
              className={"danger_text_btn"}
              icon={<UploadOutlined />}
              children={"Прикрепить Delay"}
            />
          }
        />

        <Modal
          key={nanoid()}
          open={contactModalStatus}
          onCancel={() => setContactModalStatus(null)}
          footer={null}
          width={"max-content"}
          title={"Контакт"}
          styles={{ header: { textAlign: "center" } }}
        >
          <ContactForm
            onCompleted={() => {
              setContactModalStatus(null);
            }}
          />
        </Modal>
      </>
    </>
  );
};

export default DelayCustomerDocumentBlock;
