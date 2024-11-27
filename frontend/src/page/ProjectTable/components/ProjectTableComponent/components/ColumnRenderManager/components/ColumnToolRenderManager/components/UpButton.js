import { DeleteOutlined, DeliveredProcedureOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Badge, Button, Popconfirm, Tooltip } from "antd";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { UP_STATUS_PROJECT } from "../../../../../../../../../graphql/mutations/project";

const UpButton = ({ project, onCompleted }) => {
  const [changeProjectStatusMutate, { loading: changeProjectStatusLoading }] =
    useMutation(UP_STATUS_PROJECT, {
      onCompleted: () => {
        onCompleted && onCompleted();
      },
      onError: (error) => {
        console.log(error);
      },
    });

  const [disabledMessage, setDisabledMessage] = useState([]);
  const addDisableMessage = (value) => {
    setDisabledMessage([...disabledMessage, value]);
  };

  useEffect(() => {
    //  Проверка доступности поднятия статуса в зависимости от параметров проекта
    reloadDisabled();
  }, [project]);
  const reloadDisabled = () => {
    const result = project?.requirements?.map((row) => row.comment);

    setDisabledMessage(result);
  };
  const permissions = JSON.parse(localStorage.getItem("userPermissions")).map(
    (row) => row.name_key
  );
  if (!permissions.includes("update-project")) return null;
  return (
    <Popconfirm
      title={"Переход к следующему этапу"}
      description={
        disabledMessage.length > 0
          ? disabledMessage.map((row) => {
              return (
                <>
                  {row}
                  <br />
                </>
              );
            })
          : "Вы уверены? это перенесёт проект на следующий этап!"
      }
      // onConfirm={() => handleArchiveProject(projectId)}
      icon={<DeleteOutlined />}
      okButtonProps={{ disabled: disabledMessage.length > 0 }}
      onConfirm={() =>
        changeProjectStatusMutate({
          variables: {
            projectId: project.id,
            date: dayjs().format("YYYY-MM-DD"),
          },
        })
      }
    >
      <Tooltip
        key={nanoid()}
        title={
          disabledMessage.length > 0 &&
          disabledMessage.map((row) => {
            return (
              <div key={nanoid()}>
                {row}
                <br />
              </div>
            );
          })
        }
      >
        <Badge count={disabledMessage.length} offset={[-5, 0]}>
          <Button
            className={!(disabledMessage.length > 0) && "green-btn"}
            disabled={disabledMessage.length > 0}
            onClick={() => reloadDisabled()}
            icon={<DeliveredProcedureOutlined />}
            loading={changeProjectStatusLoading}
            style={{ height: 32 }}
          />
        </Badge>
      </Tooltip>
    </Popconfirm>
  );
};
export default UpButton;
