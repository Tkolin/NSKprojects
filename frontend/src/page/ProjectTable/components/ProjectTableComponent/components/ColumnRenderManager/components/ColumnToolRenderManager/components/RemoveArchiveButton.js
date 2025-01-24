import { DeleteOutlined, DeliveredProcedureOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Badge, Button, Popconfirm, Select, Space, Tooltip } from "antd";
import { Option } from "antd/es/mentions";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { CHANGE_STATUS_PROJECT } from "../../../../../../../../../graphql/mutations/project";

const RemoveArchiveButton = ({ project, onCompleted }) => {
  const [changeProjectStatusMutate, { loading: changeProjectStatusLoading }] =
    useMutation(CHANGE_STATUS_PROJECT, {
      onCompleted: () => {
        onCompleted && onCompleted();
      },
      onError: (error) => {
        console.log(error);
      },
    });
  const options_status = [
    {
      key: "DESIGN_REQUEST",
      name: "Запрос на проектирование",
    },
    {
      key: "APPROVAL_KP",
      name: "Согласование КП",
    },
    {
      key: "APPROVAL_AGREEMENT",
      name: "Согласование договора",
    },

    {
      key: "WAITING_START_WORK",
      name: "Подготовка к работе",
    },
    {
      key: "WORKING",
      name: "В работе",
    },
    {
      key: "ARCHIVE",
      name: "Не актуален",
    },
    {
      key: "COMPLETED",
      name: "Завершён",
    },
  ];
  const [selectedStatusFilter, setSelectedStatusFilter] =
    useState("DESIGN_REQUEST");
  const handleBlurSelectedStatusFilter = () => {
    if (!selectedStatusFilter) {
      console.error("Выберите значение из списка!");
    }
  };
  const handleChangeSelectedStatusFilter = (selectedValue) => {
    setSelectedStatusFilter(selectedValue);
  };
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
        disabledMessage.length > 0 ? (
          disabledMessage.map((row) => {
            return (
              <>
                {row}
                <br />
              </>
            );
          })
        ) : (
          <Space.Compact direction="vertical">
            <span>Укажите целевой статус!</span>
            <Select
              placeholder="Выберите статус"
              value={selectedStatusFilter}
              defaultValue={"ALL"}
              onChange={handleChangeSelectedStatusFilter}
              onBlur={handleBlurSelectedStatusFilter}
              style={{ minWidth: 200 }}
              allowClear
            >
              {options_status.map((row) => (
                <Option value={row.key}>{row.name}</Option>
              ))}
            </Select>
          </Space.Compact>
        )
      }
      // onConfirm={() => handleArchiveProject(projectId)}
      icon={<DeleteOutlined />}
      okButtonProps={{ disabled: disabledMessage.length > 0 }}
      onConfirm={() =>
        changeProjectStatusMutate({
          variables: {
            projectId: project.id,
            statusKey: selectedStatusFilter,
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
export default RemoveArchiveButton;
