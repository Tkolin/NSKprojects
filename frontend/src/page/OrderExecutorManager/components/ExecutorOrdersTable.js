import { useMutation } from "@apollo/client";
import {
  Button,
  notification,
  Popconfirm,
  Space,
  Table,
  Typography,
} from "antd";
import dayjs from "dayjs";

import { useEffect } from "react";
import { EXECUTOR_ORDER_REMOVE } from "../../../graphql/mutations/fileGenerated";
import ReUploadFileButton from "../../components/ReUploadFileButton";
import ExecutorOrderFileGenerated from "../../components/script/fileGenerated/ExecutorOrderFileGenerated";
import LinkToDownload from "../../components/script/LinkToDownload";
import { StyledButtonGreen } from "../../components/style/ButtonStyles";
import { UploadFileExecutorOrder } from "../../components/UploadFile";

const { Text } = Typography;

export const ExecutorOrdersTable = ({ executorOrders, onUpdated }) => {
  const openNotification = (placement, type, message) => {
    notification[type]({
      message: message,
      placement,
    });
  };

  const [removeOrder, { loading }] = useMutation(EXECUTOR_ORDER_REMOVE, {
    onCompleted: (data) => {
      openNotification("topRight", "success", `Данные обновлены`);
      onUpdated && onUpdated(data);
    },
    onError: (error) => {
      openNotification(
        "topRight",
        "error",
        "Ошибка при загрузке: " +
          error.message +
          "/" +
          error.graphQLErrors?.flatMap((row) => row?.extensions?.debugMessage)
      );
    },
  });
  useEffect(() => {
    console.log("executorOrders", executorOrders);
  }, [executorOrders]);
  const columns = [
    {
      title: "Номер договора",
      key: "orderNumber",
      render: (record, text) => (
        <Space.Compact direction={"vertical"}>
          <Text>
            <strong>{record.number ?? "-"}</strong>
          </Text>
          <Text type={"secondary"}>Сгенерирован: {record.date_generate}</Text>
          <Text type={"secondary"}>Дата документа: {record.date_order}</Text>
        </Space.Compact>
      ),
    },
    {
      title: "Файл",
      key: "orderNumber",
      render: (record, text) => {
        return (
          <Space.Compact>
            {record?.signed_file_id ? (
              <Space.Compact direction={"vertical"}>
                <Space.Compact direction="horizontal">
                  <LinkToDownload fileId={record.signed_file_id}>
                    <StyledButtonGreen>
                      Скачать (подписан){" "}
                      {dayjs(record?.date_attachment).format("DD.MM.YYYY") +
                        "г."}
                    </StyledButtonGreen>
                  </LinkToDownload>
                  <UploadFileExecutorOrder
                    onUpdated={() => onUpdated()}
                    orderId={record.id}
                    size={"small"}
                    style={{ width: "300px" }}
                  >
                    <ReUploadFileButton />
                  </UploadFileExecutorOrder>
                </Space.Compact>
              </Space.Compact>
            ) : (
              <Space.Compact direction={"vertical"}>
                <UploadFileExecutorOrder
                  onUpdated={() => onUpdated()}
                  orderId={record.id}
                  size={"small"}
                  style={{ width: "300px" }}
                >
                  Загрузить подписанный файл
                </UploadFileExecutorOrder>
                {/*<UploadFilePopconfirm*/}
                {/*  options={{ datePicker: true }}*/}
                {/*  title={"Укажите дату документа"}*/}
                {/*  onUpdated={() => onUpdated()}*/}
                {/*  action={*/}
                {/*    "project/upload/project_kp/page?projectId=" + project.id*/}
                {/*  }*/}
                {/*  children={<Button size={"small"}>Повторить генерацию</Button>}*/}
                {/*/>*/}
                <ExecutorOrderFileGenerated
                  projecTaskIds={record.project_tasks}
                  onCompleted={() => onUpdated()}
                  children={
                    <Button
                      size={"small"}
                      style={{ width: "300px" }}
                      children={"Сгенерировать договор"}
                    />
                  }
                />
                <Popconfirm
                  placement="topLeft"
                  title={"Удаление договора"}
                  description={"Вы уверены что хотите отменить договор?"}
                  okText="Удалить"
                  onConfirm={() =>
                    removeOrder({ variables: { orederId: record.id } })
                  }
                  cancelText="Отмена"
                >
                  <Button size={"small"} style={{ width: "300px" }}>
                    Отменить договор
                  </Button>
                </Popconfirm>

                <LinkToDownload fileId={record.original_file_id}>
                  <Button size={"small"} style={{ width: "300px" }} danger>
                    Скачать (не подписан)
                  </Button>
                </LinkToDownload>
              </Space.Compact>
            )}
          </Space.Compact>
        );
      },
    },
  ];
  return (
    <Table
      size={"small"}
      columns={columns}
      pagination={false}
      // className={}
      dataSource={executorOrders}
    />
  );
};
