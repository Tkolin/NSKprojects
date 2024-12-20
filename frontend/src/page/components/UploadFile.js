import { UploadOutlined } from "@ant-design/icons";
import { gql, useMutation } from "@apollo/client";
import { Alert, Button, message, Popconfirm, Space, Upload } from "antd";
import dayjs from "dayjs";
import React, { cloneElement, useEffect, useRef, useState } from "react";
import { useClickAway } from "react-use";
import { CustomDatePicker } from "./FormattingDateElementComponent";

const UPLOAD_FILE_LINK_MUTATION = gql`
  mutation uploadFileLink($url: String!) {
    uploadFileLink(url: $url) {
      success
      file {
        id
        name
        path
        size
        mime_type
      }
    }
  }
`;
export const UploadFileExecutorOrder = ({ onUpdated, orderId, ...props }) => {
  return (
    <UploadFile
      action={"project/upload/executor_order/page?executor_order_id=" + orderId}
      accept={".pdf"}
      title={"Укажите дату подписания"}
      onConfirm={() => onUpdated && onUpdated()}
      children={
        <Button style={{ width: 200 }} icon={<UploadOutlined />}>
          Прикрепить договор
        </Button>
      }
    />
  );
};

export const UploadFileWorkActSinging = ({
  stageNumber,
  projectId,
  onUpdated,
  ...props
}) => {
  return (
    <UploadFilePopconfirm
      options={{ datePicker: true }}
      title={"Укажите дату подписания"}
      onUpdated={() => onUpdated && onUpdated()}
      action={
        "project/upload/work_act_singing/page?stageNumber=" +
        stageNumber +
        "&projectId=" +
        projectId
      }
      children={
        <Button
          icon={<UploadOutlined />}
          children={"Прикрепить подписанный акт"}
        />
      }
    />
  );
};
export const UploadFilePaymentSuccess = ({
  onUpdated,
  stageNumber,
  projectId,
  ...props
}) => {
  return (
    <UploadFilePopconfirm
      options={{ datePicker: true, fileNoRequired: true }}
      title={"Укажите дату оплаты"}
      onUpdated={() => onUpdated && onUpdated()}
      action={
        "project/upload/payment_invoice/page?stageNumber=" +
        stageNumber +
        "&projectId=" +
        projectId
      }
      children={
        <Button icon={<UploadOutlined />} children={"Подтвердить оплату"} />
      }
    />
  );
};

export const UploadFilePopconfirm = ({
  onUpdated,
  action,
  options,
  children,
  ...props
}) => {
  const [selectedDateContract, setSelectedDateContract] = useState();
  const [open, setOpen] = useState(false);
  const [openDp, setOpenDp] = useState(false);
  useEffect(() => {
    console.log("selectedDateContract", selectedDateContract);
  }, [selectedDateContract]);
  const popconfirmRef = useRef(null); // Ссылка на Popconfirm

  // Закрытие Popconfirm при клике вне его
  useClickAway(popconfirmRef, () => !openDp && setOpen(false));

  const coldFetch = () => {
    const url =
      process.env.REACT_APP_API_URL +
      action +
      (options?.datePicker ? "&date=" + selectedDateContract : "");
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          message.success("Payment confirmed successfully!");
        } else {
          message.error(data.error || "Failed to confirm payment.");
        }
      })
      .catch((err) => {
        console.error(err);
        message.error("Error occurred while confirming payment.");
      });
  };

  if (!action)
    return <Alert showIcon type={"error"} message={"Эндпоинт не указан"} />;

  return (
    <Popconfirm
      style={{ width: "200px" }}
      placement="bottom"
      open={open}
      onCancel={() => setOpen(false)}
      description={
        <Space
          direction={"vertical"}
          ref={popconfirmRef}
          style={{ width: "200px" }}
        >
          {options?.datePicker && (
            <CustomDatePicker
              onClick={() => setOpenDp(true)}
              size={"small"}
              placement={"Выберите дату..."}
              style={{ width: "200px", marginTop: 15 }}
              onCancel={() => setOpenDp(false)}
              onChange={(value) => {
                setOpenDp(false);
                setSelectedDateContract(
                  value && dayjs(value).format("YYYY-MM-DD")
                );
              }}
            />
          )}
          <UploadFile
            style={{ width: "200px", marginTop: 7, backgroundColor: "red" }}
            action={
              action +
              (options?.datePicker ? "&date=" + selectedDateContract : "")
            }
            accept={".pdf"}
            disabled={options?.datePicker && !selectedDateContract}
            onConfirm={() => {
              setOpen(false);
              onUpdated && onUpdated();
              options?.datePicker && setSelectedDateContract(null);
            }}
          >
            <Button
              type={"dashed"}
              onClick={() => setOpen(true)}
              block
              disabled={options?.datePicker && !selectedDateContract}
              style={{ width: "200px", marginTop: 15 }}
            >
              Отправить файл
            </Button>
          </UploadFile>
          {options.fileNoRequired && (
            <Button
              type={"dashed"}
              danger
              block
              onClick={() => {
                coldFetch();
                setOpen(false);
                onUpdated && onUpdated();
                options?.datePicker && setSelectedDateContract(null);
              }}
              disabled={options?.datePicker && !selectedDateContract}
              style={{ width: "200px", marginTop: 0 }}
            >
              Подтвердить без файла
            </Button>
          )}
        </Space>
      }
      okButtonProps={{ style: { display: "none" } }}
      showCancel={false}
      children={
        children ? (
          cloneElement(children, { onClick: () => setOpen(true) })
        ) : (
          <Button children={"Прикрепить файл"} />
        )
      }
      {...props}
    />
  );
};

const UploadFile = ({
  onConfirm,
  action,
  accept,
  children,
  width,
  ...props
}) => {
  const [uploadFileLink] = useMutation(UPLOAD_FILE_LINK_MUTATION);

  useEffect(() => {
    console.log("Уставновлен эндпоинт для отправки файлов: ", action);
  }, [action]);
  const propsUpload = {
    name: "file",
    maxCount: 1,
    accept: accept,
    action: process.env.REACT_APP_API_URL + action,
    headers: {
      authorization: "authorization-text",
    },

    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
        console.log("uploading");
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
        console.log("file uploaded successfully");
        onConfirm && onConfirm();
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
        console.log("file upload failed");
        console.log(info);
      }
    },
  };

  return (
    <Upload
      block
      children={children}
      {...propsUpload}
      {...props}
      ellipsis={true}
    />
  );
};
