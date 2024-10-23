import { useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { PROJECT_TASKS_QUERY } from "../../../../../../../graphql/queries";

const App = ({ projectId }) => {
  function addOneDay(date = new Date()) {
    date.setDate(date.getDate() + 2);

    return date;
  }
  function minusOneDay(date = new Date()) {
    date.setDate(date.getDate() + 1);

    return date;
  }
  const [getTasks, { data: tasksData, loading: tasksLoading }] = useLazyQuery(
    PROJECT_TASKS_QUERY,
    {
      variables: { projectId: projectId },
      onCompleted: (data) => {
        //openNotification('topRight', 'success', `Данные подгружены.`);
        console.log(data.projectTasksQuery.items);
        let i = 0;
        let stagesIds = [];
        data.projectTasksQuery.items.forEach((row) => {
          if (!row.project_task_inherited_id) {
            stagesIds.push(row.id);
          }
        });
        console.log("is stage", stagesIds);

        setВata([
          columns,
          ...data.projectTasksQuery.items.map((row) => {
            //console.log("mama v childe", mamaAndChild[row.id]?.toString());
            if (data.projectTasksQuery.items)
              return [
                row.id,
                (row.project_task_inherited_id
                  ? "Задача: "
                  : "Этап " + row.stage_number + " : ") +
                  " " +
                  row.task.name,
                row.stage_number,
                row.date_start !== row.date_end
                  ? new Date(row.date_start)
                  : minusOneDay(new Date( row.date_start )),
                row.date_start !== row.date_end
                  ? new Date(row.date_end)
                  : addOneDay(new Date(row.date_end)),
                null,
                100,
                !stagesIds.includes(row.id) ? null : row.project_task_inherited_id ?? null, //mamaAndChild[row.id] ? mamaAndChild[row.id].toString() :  null,   // родитель
              ];
          }),
        ]);
        console.log("ffa4gaaergae", [
          columns,
          data.projectTasksQuery.items.map((row) => {
            return [
              row.id,
              row.stage_number + " " + row.task.name,
              row.stage_number,
              new Date(row.date_start),
              new Date(row.date_end),
              null,
              100,
              null,
            ];
          }),
        ]);
      },
      onError: (error) => {
        // openNotification('topRight', 'error', `Ошибка при загрузке данных: ${error.message}`);
      },
    }
  );
  useEffect(() => {
    getTasks();
  }, [projectId]);
  const [data, setВata] = useState([]);
  // [
  //     "Research",
  //     "Find sources",
  //     null,
  //     new Date(2015, 0, 1),
  //     new Date(2015, 0, 5),
  //     null,
  //     100,
  //     null,
  //   ],
  const options = {
    gantt: {
      criticalPathEnabled: false, // Critical path arrows will be the same as other arrows.
      innerGridHorizLine: {
        stroke: "#ffe0b2",
        strokeWidth: 1,
      },
      innerGridTrack: { fill: "#fff3e0" },
      innerGridDarkTrack: { fill: "#ffcc80" },
    },
  };
  const columns = [
    { type: "string", label: "Task ID" },
    { type: "string", label: "Task Name" },
    { type: "string", label: "Resource" },
    { type: "date", label: "Start Date" },
    { type: "date", label: "End Date" },
    { type: "number", label: "Duration" },
    { type: "number", label: "Percent Complete" },
    { type: "string", label: "Dependencies" },
  ];

  //   const data = [columns, ...rows]
  if (!projectId) return "Ошибка: Проект не передан";
  return (
    <div style={{ width: "100%", height: "100%" }}>
      {data.length}
      <Chart
        chartType="Gantt"
        width="100%"
        height={data.length * 50 + `px`}
        data={data}
        options={options}
      />
    </div>
  );
};
export default App;
