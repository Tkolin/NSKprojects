import { useMutation, useQuery } from "@apollo/client";
import { Alert, Card, Select, Space } from "antd";
import React, { useEffect, useState } from "react";
import { SET_IRD_TEMPLATE_TO_PROJECT_MUTATION } from "../../graphql/mutations/project";
import { PROJECTS_IRDS_TEMPLATES } from "../../graphql/queries/queriesCompact";
import { StyledButtonGreen } from "../components/style/ButtonStyles";

const TemplatesIrdsForm = ({ project, onCompleted }) => {
  const { loading, data } = useQuery(PROJECTS_IRDS_TEMPLATES);
  const [mutate, { loading: loadingResult }] = useMutation(
    SET_IRD_TEMPLATE_TO_PROJECT_MUTATION,
    {
      onCompleted: (data) => {
        console.log(`Ответ: `, data);
        onCompleted && onCompleted();
      },
      onError: (error) => {
        console.log(`Ошибка: `, error.message);
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
            ?.filter((row) => row.project_irds.length > 0)
            .map((row) => (
              <Select.Option
                style={{
                  width: "400px",
                  wordWrap: "break-word",
                  textWrap: "auto",
                }}
                key={row.id}
                value={row.id}
              >
                <span
                  style={{
                    width: "400px",
                    wordWrap: "break-word",
                    textWrap: "auto",
                  }}
                >
                  {row.name}
                </span>
              </Select.Option>
            ))}
        </Select>
        <Alert
          message={
            <ul>
              {selectedProject?.project_irds.map((row) => (
                <li>{row.ird.name}</li>
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

export default TemplatesIrdsForm;
