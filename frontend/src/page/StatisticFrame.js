import {
  AuditOutlined,
  DatabaseOutlined,
  FileAddOutlined,
  FileProtectOutlined,
  HistoryOutlined,
  ReconciliationOutlined,
} from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { Timeline, Tooltip } from "antd";
import React from "react";
import { PROJECTS_QUERY_STATISTICS } from "../graphql/queries/queriesSpecial";

const App = () => {
  const { loading, error, data } = useQuery(PROJECTS_QUERY_STATISTICS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Статусы проектов
  const statuses = [
    {
      key: "DESIGN_REQUEST",
      label: "Запрос на проектирование",
      icon: <FileAddOutlined />,
    },
    { key: "APPROVAL_KP", label: "Согласование КП", icon: <AuditOutlined /> },
    {
      key: "APPROVAL_AGREEMENT",
      label: "Согласование договора",
      icon: <FileProtectOutlined />,
    },
    {
      key: "WAITING_START_WORK",
      label: "Подготовка к работе",
      icon: <HistoryOutlined />,
    },
    { key: "WORKING", label: "В работе", icon: <ReconciliationOutlined /> },
    { key: "ARCHIVE", label: "В архиве", icon: <DatabaseOutlined /> },
  ];

  // Формирование массива для Timeline
  const timelineItems = [];

  statuses.forEach(({ key, label, icon }) => {
    // Добавляем стадию как отдельный объект
    timelineItems.push({ children: <strong>{label}</strong>, dot: icon });

    // Фильтруем проекты для текущей стадии
    const filteredProjects = data?.projects?.items?.filter(
      (project) => project.status?.name_key === key
    );
    // Теперь выставляем их по project.requirements - чем больше обьектов - тем ниже, также добовляем их ниже в тултип все

    // Добавляем номера проектов как отдельные объекты
    filteredProjects?.forEach((project) => {
      timelineItems.push({
        color: "green",
        children: (
          <Tooltip
            title={project?.requirements?.map((row) => (
              <>
                {row.comment}
                <br />
              </>
            ))}
          >
            {project.number ? project.number + " - " : ""}
            {project.name}
          </Tooltip>
        ),
      });
    });
  });

  return <Timeline mode="left" items={timelineItems} />;
};

export default App;
