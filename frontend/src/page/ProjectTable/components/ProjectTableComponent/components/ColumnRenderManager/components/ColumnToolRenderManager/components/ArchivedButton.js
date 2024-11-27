import { DeleteOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Popconfirm } from "antd";
import React from "react";
import { ARCHIVE_PROJECT } from "../../../../../../../../../graphql/mutations/project";
import { StyledButtonRed } from "../../../../../../../../components/style/ButtonStyles";

const ArchivedButton = ({ projectId, onCompleted }) => {
  const [changeProjectStatusMutate, { loading: changeProjectStatusLoading }] =
    useMutation(ARCHIVE_PROJECT, {
      onCompleted: () => {
        onCompleted && onCompleted();
      },
      onError: (error) => {
        console.log(error);
      },
    });

  const handleArchiveProject = (projectId) => {
    changeProjectStatusMutate({
      variables: { projectId: projectId, statusKey: "ARCHIVE" },
    });
  };
  const permissions = JSON.parse(localStorage.getItem("userPermissions")).map(
    (row) => row.name_key
  );
  if (!permissions.includes("update-project-template")) return null;
  return (
    <Popconfirm
      title={"Архивация заявки"}
      description={"Вы уверены? это перенесёт заявку в архив!"}
      onConfirm={() => handleArchiveProject(projectId)}
      icon={<DeleteOutlined />}
    >
      <StyledButtonRed
        loading={changeProjectStatusLoading}
        style={{ height: 32 }}
        type={"text"}
        icon={<DeleteOutlined />}
      />
    </Popconfirm>
  );
};
export default ArchivedButton;
