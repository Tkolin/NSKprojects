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
                    key: "0",
                    icon: <BulbOutlined />,
                    children: (
                      <TableNotificationsComponent
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
                    key: "1",
                    icon: <BarsOutlined />,
                    label: "Этапы",
                    children: (
                      <TableStagesComponent
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
                    key: "2",
                    icon: <BookOutlined />,
                    label: "ИРД",
                    children: (
                      <TableIrdsComponent
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
                    key: "3",
                    icon: <AuditOutlined />,
                    label: "Исполнители",
                    children: (
                      <TableExecutorsComponent
                        data-permission={"read-project-task-executor"}
                        project={project}
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
                    key: "4",
                    icon: <ExceptionOutlined />,
                    label: "Акты и Счета по Этапам",
                    children: (
                      <TableStagesComponent
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
                    key: "5",
                    icon: <SignatureOutlined />,
                    label: "Задачи",
                    children: (
                      <TableProjectTasksManagment
                        data-permission={"read-project-task-executor"}
                        project={project}
                        setEditModalStatus={() => setEditModalStatus("tasks")}
                      />
                    ),
                  },
                ]
              : []),
            ...(options.includes("executor_orders")
              ? [
                  {
                    key: "6",
                    icon: <ReconciliationOutlined />,
                    label: "Оплата договоров с исполнителями",
                    children: (
                      <TablePaymentExecutorOrdersComponent
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
                    key: "7",
                    icon: <FundProjectionScreenOutlined />,
                    label: "График задач",
                    children: (
                      <TaskGanttChartComponent
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
                    key: "8",
                    icon: <FieldTimeOutlined />,
                    label: "Задержки",
                    children: (
                      <TableProjectTasksDelayManagment projectId={project.id} />
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
