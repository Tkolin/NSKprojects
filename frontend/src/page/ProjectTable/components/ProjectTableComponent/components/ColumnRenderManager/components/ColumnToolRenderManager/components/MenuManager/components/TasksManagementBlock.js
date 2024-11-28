import { AppstoreAddOutlined } from "@ant-design/icons";
import { Divider, Modal } from "antd";
import React, { useEffect, useState } from "react";
import CombinedProjectTasksForms from "../../../../../../../../../../CombinedProjectTasksForms";
import ProjectLeaderForm from "../../../../../../../../../../ProjectLeaderForm";
import CustomMenuButton from "./CustomMenuButton";

const TasksManagementBlock = ({ record, onUpdated }) => {
  const [openTaskManager, setOpenTaskManager] = useState(false);
  const [openProjectLeader, setOpenProjectLeader] = useState(false);
  useEffect(() => {
    console.log("3 TasksManagementBlock project", record.project_tasks);
  }, [record]);
  const permissions = JSON.parse(localStorage.getItem("userPermissions")).map(
    (row) => row.name_key
  );
  if (!permissions.includes("update-project-task")) return null;
  return (
    <>
      <Divider style={{ margin: "5px" }} orientation={"left"}>
        Управление задачами
      </Divider>

      <CustomMenuButton
        onClick={() => setOpenTaskManager(true)}
        icon={<AppstoreAddOutlined />}
      >
        Распределение задач
      </CustomMenuButton>

      <CustomMenuButton
        onClick={() => setOpenProjectLeader(true)}
        icon={<AppstoreAddOutlined />}
      >
        Назначить главного на проекте
      </CustomMenuButton>

      <Modal
        key={record?.id + "_talsks_manager_modal"}
        open={openTaskManager}
        onCancel={() => setOpenTaskManager(null)}
        footer={null}
        width={"max-content"}
        children={
          <CombinedProjectTasksForms
            key={record?.id + "_talsks_manager"}
            project={record}
          />
        }
      />
      <Modal
        key={record?.id + "_p_leader_modal"}
        open={openProjectLeader}
        onCancel={() => setOpenProjectLeader(null)}
        footer={null}
        width={"max-content"}
        children={
          <ProjectLeaderForm
            key={record?.id + "_p_leader"}
            project={record}
            onCompleted={() => setOpenProjectLeader(null)}
          />
        }
      />
    </>
  );
};
export default TasksManagementBlock;
