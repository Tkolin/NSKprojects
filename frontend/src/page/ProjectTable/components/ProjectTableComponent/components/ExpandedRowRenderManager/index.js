import {
  AuditOutlined,
  BarsOutlined,
  BookOutlined,
  BulbOutlined,
  ExceptionOutlined,
  FieldTimeOutlined,
  FundProjectionScreenOutlined,
  ReconciliationOutlined,
  SignatureOutlined,
} from "@ant-design/icons";
import { Modal, Space, Tabs } from "antd";
import { nanoid } from "nanoid";
import React, { useState } from "react";
import IrdsProjectForm from "../../../../../ProjectIrdsForm";
import StageToProjectForm from "../../../../../ProjectStagesForm";
import TableExecutorsComponent from "./components/TableExecutorsComponent";
import TableIrdsComponent from "./components/TableIrdsComponent";
import TableNotificationsComponent from "./components/TableNotificationsComponent";
import TablePaymentExecutorOrdersComponent from "./components/TablePaymentExecutorOrdersComponent";
import TableProjectTasksDelayManagment from "./components/TableProjectTasksDelayManagment";
import TableProjectTasksManagment from "./components/TableProjectTasksManagment";
import TableStagesComponent from "./components/TableStagesComponent";
import TaskGanttChartComponent from "./components/TaskGanttChartComponent";

const Index = ({ project, expandable, refetchProject, options }) => {
  const [editModalStatus, setEditModalStatus] = useState();
  const [uniqueKey, setUniqueKey] = useState("");
  const getNameModalView = (type) => {
    switch (type) {
      case "project":
        return "Данные проекта";
      case "irds":
        return "Список ИРД";
      case "stages":
        return "Список этапов";
      case "tasks":
        return "Список задач";
      default:
        return null;
    }
  };
  const renderEditModalContent = ({ project, model, onCompleted }) => {
    const commonProps = {
      onCompleted: () => onCompleted(),
      project: project,
    };
    switch (model) {
      case "irds":
        return <IrdsProjectForm {...commonProps} />;
      case "stages":
        return <StageToProjectForm {...commonProps} />;
      default:
        return null;
    }
  };
  return (
    <>
      <Space
        direction={"vertical"}
        align={"start"}
        style={{
          width: "100%",
          padding: "20px 70px 20px 20px",
          borderRadius: "10px",
          backgroundColor: "#fff",
        }}
      >
        <Tabs
          onChange={() => setUniqueKey(nanoid())}
          size={"small"}
          type="card"
          accordion
          style={{
            width: "100%",
          }}
          items={[
            ...(options.includes("stages")
              ? [
                  {
                    key: project.id + "_tab_item_0",
                    icon: <BulbOutlined />,
                    children: (
                      <TableNotificationsComponent
                        key={"item_0_" + uniqueKey}
                        data-permission={"read-project"}
                        projectId={project.id}
                      />
                    ),
                  },
                ]
              : []),
            ...(options.includes("stages")
              ? [
                  {
                    key: project.id + "_tab_item_1",
                    icon: <BarsOutlined />,
                    label: "Этапы",
                    children: (
                      <TableStagesComponent
                        key={"item_1_" + uniqueKey}
                        projectId={project.id}
                        data-permission={"read-project-stage"}
                        setEditModalStatus={() => setEditModalStatus("stages")}
                      />
                    ),
                  },
                ]
              : []),
            ...(options.includes("irds")
              ? [
                  {
                    key: project.id + "_tab_item_2",
                    icon: <BookOutlined />,
                    label: "ИРД",
                    children: (
                      <TableIrdsComponent
                        key={"item_2_" + uniqueKey}
                        projectId={project.id}
                        data-permission={"read-project-ird"}
                        setEditModalStatus={() => setEditModalStatus("irds")}
                      />
                    ),
                  },
                ]
              : []),
            ...(options.includes("executors")
              ? [
                  {
                    key: project.id + "_tab_item_3",
                    icon: <AuditOutlined />,
                    label: "Исполнители",
                    children: (
                      <TableExecutorsComponent
                        key={"item_3_" + uniqueKey}
                        data-permission={"read-project-task-executor"}
                        projectId={project?.id}
                        setEditModalStatus={() =>
                          setEditModalStatus("executor")
                        }
                      />
                    ),
                  },
                ]
              : []),
            ...(options.includes("stages-extra")
              ? [
                  {
                    key: project.id + "_tab_item_4",
                    icon: <ExceptionOutlined />,
                    label: "Акты и Счета по Этапам",
                    children: (
                      <TableStagesComponent
                        key={"item_4_" + uniqueKey}
                        data-permission={"read-project-stage"}
                        projectId={project.id}
                        options={["acts", "payments"]}
                        setEditModalStatus={() => setEditModalStatus("stages")}
                      />
                    ),
                  },
                ]
              : []),
            ...(options.includes("tasks")
              ? [
                  {
                    key: project.id + "_tab_item_5",
                    icon: <SignatureOutlined />,
                    label: "Задачи",
                    children: (
                      <TableProjectTasksManagment
                        key={"item_5_" + uniqueKey}
                        data-permission={"read-project-task-executor"}
                        projectId={project.id}
                        setEditModalStatus={() => setEditModalStatus("tasks")}
                      />
                    ),
                  },
                ]
              : []),
            ...(options.includes("executor_orders")
              ? [
                  {
                    key: project.id + "_tab_item_6",
                    icon: <ReconciliationOutlined />,
                    label: "Оплата договоров с исполнителями",
                    children: (
                      <TablePaymentExecutorOrdersComponent
                        key={"item_5_" + uniqueKey}
                        data-permission={"read-project-task-executor"}
                        projectId={project.id}
                        setEditModalStatus={() =>
                          setEditModalStatus("executor_orders")
                        }
                      />
                    ),
                  },
                ]
              : []),
            ...(options.includes("task-chart")
              ? [
                  {
                    key: project.id + "_tab_item_7",
                    icon: <FundProjectionScreenOutlined />,
                    label: "График задач",
                    children: (
                      <TaskGanttChartComponent
                        key={"item_5_" + uniqueKey}
                        style={{ width: "100%" }}
                        projectId={project.id}
                      />
                    ),
                  },
                ]
              : []),
            ...(options.includes("task-chart")
              ? [
                  {
                    key: project.id + "_tab_item_8",
                    icon: <FieldTimeOutlined />,
                    label: "Задержки",
                    children: (
                      <TableProjectTasksDelayManagment
                        key={"item_5_" + uniqueKey}
                        projectId={project.id}
                      />
                    ),
                  },
                ]
              : []),
          ]}
        />
      </Space>
      <Modal
        key={nanoid()}
        open={editModalStatus}
        onCancel={() => setEditModalStatus(null)}
        footer={null}
        title={getNameModalView(editModalStatus)}
        width={"max-content"}
        onClose={() => setEditModalStatus(null)}
      >
        {renderEditModalContent({
          project: project,
          model: editModalStatus,
          onCompleted: () => setEditModalStatus(null),
        })}
      </Modal>
    </>
  );
};
export default Index;
