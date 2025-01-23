import { DownloadOutlined, EditOutlined } from "@ant-design/icons";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Checkbox, Space, Table, Tooltip, Typography } from "antd";
import Link from "antd/es/typography/Link";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import { CHECKED_SEND_DOCUMENTS_STAGE_EXECUTOR } from "../../../../../../../graphql/mutations/projectStage";
import { PROJECT_STAGES_QUERY } from "../../../../../../../graphql/queries/projectStage";
import { PROJECT_QUERY } from "../../../../../../../graphql/queries/queriesByID";
import ReUploadFileButton from "../../../../../../components/ReUploadFileButton";
import ActRenderingProjectDownload from "../../../../../../components/script/fileDownloadScripts/ActRenderingProjectDownload";
import PaymentInvoiceProjectDownload from "../../../../../../components/script/fileDownloadScripts/PaymentInvoiceProjectDownload";
import LinkToDownload from "../../../../../../components/script/LinkToDownload";
import { StyledButtonGreen } from "../../../../../../components/style/ButtonStyles";
import {
  UploadFilePaymentSuccess,
  UploadFileWorkActSinging,
} from "../../../../../../components/UploadFile";

const { Text } = Typography;

const TableStagesComponent = ({
  setEditModalStatus,
  projectId,
  options,
  onUpdated,
}) => {
  const permissions = JSON.parse(localStorage.getItem("userPermissions")).map(
    (row) => row.name_key
  );
  const { data, loading, refetch } = useQuery(PROJECT_STAGES_QUERY, {
    variables: {
      projectId: projectId,
    },
  });
  const [checkSend, { loading: loadingCheckSend }] = useMutation(
    CHECKED_SEND_DOCUMENTS_STAGE_EXECUTOR,
    {
      onCompleted: () => {
        refetch();
      },
    }
  );
  useEffect(() => {
    refetch();
    updateProject();
  }, []);
  const [
    updateProject,
    { data: actualProject, loading: loadingActualProject },
  ] = useLazyQuery(PROJECT_QUERY, {
    fetchPolicy: "network-only",
    variables: { id: projectId },
    onCompleted: () => {
      console.log("Данные проекта обновлены");
    },
  });
  const columnsStages = [
    {
      title: (
        <Space>
          <Tooltip title={"Список ИРД"}>
            <Text style={{ marginRight: 10 }}>Список этапов</Text>
          </Tooltip>
          {permissions.includes("read-project-payments") && (
            <Link type={"warning"}>
              <EditOutlined
                onClick={() => setEditModalStatus && setEditModalStatus()}
              />
            </Link>
          )}
        </Space>
      ),
      children: [
        {
          title: "№",
          dataIndex: "number",
          key: "number",
          align: "left",
        },
        {
          title: "Наименование этапа",
          dataIndex: "stage",
          key: "stage",
          align: "left",
          render: (text, record) => (
            <Space.Compact
              direction={"vertical"}
              style={{ alignContent: "start" }}
            >
              <Text>{record?.stage?.name}</Text>
            </Space.Compact>
          ),
        },
        {
          title: "Сроки этапа",
          dataIndex: "stage_durations",
          key: "stage_durations",
          align: "left",
          render: (text, record) => (
            <Space.Compact
              direction={"vertical"}
              style={{ alignContent: "start" }}
            >
              {record?.date_start &&
                dayjs(record?.date_start).format("DD.MM.YYYY") + "г. - "}
              {record?.date_end &&
                dayjs(record?.date_end).format("DD.MM.YYYY") + "г."}{" "}
              {record.duration && "(" + record.duration + ")"}
            </Space.Compact>
          ),
        },
        ...(options?.includes("acts")
          ? [
              {
                title: "Счёт на оплату",
                dataIndex: "payment_gen",
                key: "payment_gen",
                align: "left",
                render: (text, record) => (
                  <Space.Compact
                    direction="vertical"
                    style={{ alignContent: "start" }}
                  >
                    <PaymentInvoiceProjectDownload
                      stageNumber={record.number}
                      projectId={projectId}
                      type="acts"
                    />
                  </Space.Compact>
                ),
              },
            ]
          : []),
        ...(options?.includes("acts")
          ? [
              {
                title: "Акт выполненых работ",
                dataIndex: "act_gen",
                key: "act_gen",
                align: "left",
                render: (text, record) => (
                  <Space.Compact
                    direction="vertical"
                    style={{ alignContent: "start" }}
                  >
                    <ActRenderingProjectDownload
                      stageNumber={record.number}
                      projectId={projectId}
                      type="acts"
                    />
                  </Space.Compact>
                ),
              },
            ]
          : []),
        ...(options?.includes("acts")
          ? [
              {
                title: "Выслано заказчику",
                key: "payment",
                render: (text, record) => (
                  <Space
                    style={{
                      width: "100%",
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {record?.stage?.id && (
                      <Checkbox
                        size="large"
                        checked={record.is_send_executor}
                        onChange={() =>
                          checkSend({
                            variables: {
                              projectId: projectId,
                              stageId: record?.stage?.id,
                            },
                          })
                        }
                      />
                    )}
                  </Space>
                ),
              },
              {
                title: "Подтверждающий платеж документ",
                dataIndex: "payment",
                key: "payment",
                align: "left",
                render: (text, record) => (
                  <Space.Compact
                    direction="vertical"
                    style={{ alignContent: "start" }}
                  >
                    {record?.type === "prepayment" ? (
                      <Space.Compact direction="horizontal">
                        {actualProject?.project?.prepayment_file_id ? (
                          <>
                            <LinkToDownload
                              fileId={
                                actualProject?.project?.prepayment_file_id
                              }
                            >
                              <StyledButtonGreen icon={<DownloadOutlined />}>
                                Скачать от:{" "}
                                {dayjs(
                                  actualProject?.project?.prepayment_date
                                ).format("DD.MM.YYYY") + "г."}
                              </StyledButtonGreen>
                            </LinkToDownload>
                            <UploadFilePaymentSuccess
                              stageNumber={0}
                              onUpdated={() => {
                                refetch();
                                updateProject();
                              }}
                              projectId={projectId}
                            >
                              <ReUploadFileButton />
                            </UploadFilePaymentSuccess>
                          </>
                        ) : (
                          <Space.Compact direction="horizontal">
                            Файл отсутствует, подтверждено от:{" "}
                            {dayjs(
                              actualProject?.project?.prepayment_date
                            ).format("DD.MM.YYYY") + "г."}
                            <UploadFilePaymentSuccess
                              stageNumber={0}
                              onUpdated={() => {
                                refetch();
                                updateProject();
                              }}
                              projectId={projectId}
                            >
                              <ReUploadFileButton />
                            </UploadFilePaymentSuccess>
                          </Space.Compact>
                        )}
                      </Space.Compact>
                    ) : record?.payment_date ? (
                      <Space.Compact direction="horizontal">
                        <>
                          {record?.payment_file_id ? (
                            <LinkToDownload
                              fileId={record?.payment_file_id}
                              style={{ width: "100%" }}
                            >
                              <StyledButtonGreen icon={<DownloadOutlined />}>
                                Скачать от:{" "}
                                {dayjs(record?.payment_date).format(
                                  "DD.MM.YYYY"
                                ) + "г."}
                              </StyledButtonGreen>
                            </LinkToDownload>
                          ) : (
                            <Space.Compact direction="horizontal">
                              Файл отсутствует, подтверждено от:{" "}
                              {dayjs(record?.payment_date).format(
                                "DD.MM.YYYY"
                              ) + "г."}
                              <UploadFilePaymentSuccess
                                stageNumber={0}
                                onUpdated={() => {
                                  refetch();
                                  updateProject();
                                }}
                                projectId={projectId}
                              >
                                <ReUploadFileButton />
                              </UploadFilePaymentSuccess>
                            </Space.Compact>
                          )}
                        </>
                        <UploadFilePaymentSuccess
                          stageNumber={
                            record?.type === "prepayment" ? 0 : record.number
                          }
                          onUpdated={() => {
                            refetch();
                            updateProject();
                          }}
                          projectId={projectId}
                          children={<ReUploadFileButton />}
                        />
                      </Space.Compact>
                    ) : (
                      <Space.Compact direction="vertical">
                        <UploadFilePaymentSuccess
                          stageNumber={
                            record?.type === "prepayment" ? 0 : record.number
                          }
                          onUpdated={() => {
                            refetch();
                            updateProject();
                          }}
                          projectId={projectId}
                        />
                      </Space.Compact>
                    )}
                  </Space.Compact>
                ),
              },
            ]
          : []),

        ...(options?.includes("payments")
          ? [
              {
                title: "Подписанный с двух сторон акт выполненых работ",
                dataIndex: "act",
                key: "act",
                align: "left",
                render: (text, record) => (
                  <Space.Compact
                    direction={"vertical"}
                    style={{ alignContent: "start" }}
                  >
                    {record?.type === "prepayment" ? (
                      "-"
                    ) : record?.work_act_file_id ? (
                      <Space.Compact direction="horizontal">
                        <LinkToDownload
                          fileId={record?.work_act_file_id}
                          style={{ width: "100%" }}
                        >
                          <StyledButtonGreen icon={<DownloadOutlined />}>
                            Скачать от{" "}
                            {dayjs(record?.work_act_singing_date).format(
                              "DD.MM.YYYY"
                            ) + "г."}
                          </StyledButtonGreen>
                        </LinkToDownload>
                        <UploadFileWorkActSinging
                          stageNumber={record.number}
                          onUpdated={() => {
                            refetch();
                            updateProject();
                          }}
                          projectId={projectId}
                          children={<ReUploadFileButton />}
                        />
                      </Space.Compact>
                    ) : (
                      <Space.Compact direction="vertical">
                        <UploadFileWorkActSinging
                          stageNumber={record.number}
                          onUpdated={() => {
                            refetch();
                            updateProject();
                          }}
                          projectId={projectId}
                        />
                      </Space.Compact>
                    )}
                  </Space.Compact>
                ),
              },
            ]
          : []),
      ],
    },
  ];
  return (
    <Table
      style={{ display: "flex", flexDirection: "column", marginInline: "none" }}
      size={"small"}
      loading={loading || loadingCheckSend}
      columns={columnsStages}
      dataSource={
        data?.projectStages
          ? [
              {
                id: -1,
                number: 0,
                type: "prepayment",
                stage: { name: "Аванс" },
              },
              ...data?.projectStages,
            ]
          : [{}]
      }
      pagination={false}
    />
  );
};
export default TableStagesComponent;
