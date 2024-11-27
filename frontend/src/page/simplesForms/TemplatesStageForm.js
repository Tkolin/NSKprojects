import { useMutation, useQuery } from "@apollo/client";
import { Alert, Card, Select, Space } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { SET_STAGE_TEMPLATE_TO_PROJECT_MUTATION } from "../../graphql/mutations/project";
import { PROJECTS_STAGES_TEMPLATES } from "../../graphql/queries/queriesCompact";
import { NotificationContext } from "../../NotificationProvider";
import { StyledButtonGreen } from "../components/style/ButtonStyles";

const TemplatesStageForm = ({ project, onCompleted }) => {
  const { loading, data } = useQuery(PROJECTS_STAGES_TEMPLATES);
  const { openNotification } = useContext(NotificationContext);

  const [mutate, { loading: loadingResult }] = useMutation(
    SET_STAGE_TEMPLATE_TO_PROJECT_MUTATION,
    {
      onCompleted: (data) => {
        openNotification("topRight", "success", `Шаблон установлен!`);
        onCompleted && onCompleted();
      },
      onError: (error) => {
        openNotification(
          "topRight",
          "error",
          `Ошибка при загрузке шаблона: ${error.message}`
        );
      },
    }
  );
  useEffect(() => {}, [project]);
  const [selectedProject, setSelectedProject] = useState();
  return (
    <Card title={"Применение шаблона"}>
      <Space direction={"vertical"}>
        <Select
          style={{
            width: "200px",
          }}
          loading={loading}
          popupMatchSelectWidth={false}
          onSelect={(value, option) =>
            setSelectedProject(
              data?.projects?.items?.filter((row) => row.id === value)[0]
            )
          }
          onChange={(value, option) => console.log("OnSelected", value, option)}
        >
          {data?.projects?.items
            ?.filter((row) => row.project_stages.length > 0)
            .map((row) => (
              <Select.Option key={row.id} value={row.id}>
                {row.name}
              </Select.Option>
            ))}
        </Select>
        <Alert
          message={
            <ul>
              {selectedProject?.project_stages.map((row) => (
                <li>{row.stage.name}</li>
              ))}
            </ul>
          }
        />
        <StyledButtonGreen
          loading={loadingResult}
          onClick={() =>
            mutate({
              variables: {
                projectId: project.id,
                templateProjectId: selectedProject.id,
              },
            })
          }
        >
          Применить шаблон
        </StyledButtonGreen>
      </Space>
    </Card>
  );
};

export default TemplatesStageForm;
