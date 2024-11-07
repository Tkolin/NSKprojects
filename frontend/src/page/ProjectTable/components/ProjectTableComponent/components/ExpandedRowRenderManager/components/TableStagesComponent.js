import { DownloadOutlined, EditOutlined } from "@ant-design/icons";
import { useLazyQuery } from "@apollo/client";
import { Space, Table, Tooltip, Typography } from "antd";
import Link from "antd/es/typography/Link";
import dayjs from "dayjs";
import React from "react";
import { PROJECT_QUERY } from "../../../../../../../graphql/queriesByID";
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
  project,
  options,
  onUpdated,
}) => {
  const [updateProject, {data: actualProject, loading: loadingActualProject}] = useLazyQuery(PROJECT_QUERY);
  const refetchProject = () => {
    updateProject({ variables: { id: project.id } });
  };

  const columnsStages = [
    {
      title: (
        <Space>
          <Tooltip title={"Список ИРД"}>
            <Text style={{ marginRight: 10 }}>Список этапы</Text>
          </Tooltip>
          <Link type={"warning"}>
            <EditOutlined
              onClick={() => setEditModalStatus && setEditModalStatus()}
            />
          </Link>
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
          title: "Сроки этара",
          dataIndex: "stage_durations",
          key: "stage_durations",
          align: "left",
          render: (text, record) => (
            <Space.Compact
              direction={"vertical"}
              style={{ alignContent: "start" }}
            >
              {record?.date_start &&
                dayjs(record?.date_start).format("DD.MM.YYYY")}{" "}
              -{" "}
              {record?.date_end && dayjs(record?.date_end).format("DD.MM.YYYY")}{" "}
              ({record.duration})
            </Space.Compact>
          ),
        },
        ...(options?.includes("acts")
          ? [
              {
                title: "Счёт на оплату",
                dataIndex: "payment",
                key: "payment",
                align: "left",
                render: (text, record) => (
                  <Space.Compact
                    direction={"vertical"}
                    style={{ alignContent: "start" }}
                  >
                    {record?.type === "prepayment" ? (
                      project?.prepayment_date ? (
                        <LinkToDownload fileId={project?.prepayment_file_id}>
                          <StyledButtonGreen icon={<DownloadOutlined />}>
                            Скачать
                          </StyledButtonGreen>
                        </LinkToDownload>
                      ) : (
                        <Space.Compact direction="vertical">
                          <PaymentInvoiceProjectDownload
                            isPrepayment={true}
                            projectId={project?.id}
                            type="acts"
                          />
                          <UploadFilePaymentSuccess
                            stageNumber={
                              record?.type === "prepayment" ? 0 : record.number
                            }
                            onUpdated={refetchProject}
                            projectId={project?.id}
                          />
                        </Space.Compact>
                      )
                    ) : record?.payment_file_id ? (
                      <>
                        <LinkToDownload
                          fileId={record?.payment_file_id}
                          style={{ width: "100%" }}
                        >
                          <StyledButtonGreen icon={<DownloadOutlined />}>
                            Скачать
                          </StyledButtonGreen>
                        </LinkToDownload>
                      </>
                    ) : (
                      <Space.Compact direction="vertical">
                        <PaymentInvoiceProjectDownload
                          stageNumber={record.number}
                          projectId={project?.id}
                          type="acts"
                        />
                        <UploadFilePaymentSuccess
                          stageNumber={
                            record?.type === "prepayment" ? 0 : record.number
                          }
                          onUpdated={refetchProject}
                          projectId={project?.id}
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
                title: "Акт работ",
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
                    ) : 
                      record?.work_act_singing_file_id ? (
                        <>
                          <LinkToDownload
                            fileId={record?.work_act_singing_file_id}
                            style={{ width: "100%" }}
                          >
                            <StyledButtonGreen icon={<DownloadOutlined />}>
                              Скачать
                            </StyledButtonGreen>
                          </LinkToDownload>
                        </>
                      ) : (
                        <Space.Compact direction="vertical">
                        <ActRenderingProjectDownload
                          stageNumber={record.number}
                          projectId={project?.id}
                          type="acts"
                        />
                        <UploadFileWorkActSinging
                          stageNumber={ record.number}
                          onUpdated={refetchProject}
                          projectId={project?.id}
                        />
                      </Space.Compact>
                      )
                    }
                    
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
      loading={loadingActualProject}
      columns={columnsStages}
      dataSource={
        project?.project_stages
          ? [
              {
                id: -1,
                number: 0,
                type: "prepayment",
                stage: { name: "Аванс" },
              },
              ...project?.project_stages,
            ]
          : [{}]
      }
      pagination={false}
    />
  );
};
export default TableStagesComponent;
