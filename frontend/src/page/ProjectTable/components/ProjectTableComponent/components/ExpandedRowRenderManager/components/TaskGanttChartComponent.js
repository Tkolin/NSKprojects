import { useLazyQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { Chart } from 'react-google-charts'
import { PROJECT_TASKS_QUERY } from '../../../../../../../graphql/queries'

const App = ({ projectId }) => {
  const [getTasks, { data: tasksData, loading: tasksLoading }] = useLazyQuery(
    PROJECT_TASKS_QUERY,
    {
      variables: { projectId: projectId },
      onCompleted: data => {
        //openNotification('topRight', 'success', `Данные подгружены.`);
        console.log(data.projectTasksQuery.items)
        //"items": [
        // {
        //     "id": "287",
        //     "task": {
        //       "id": "1",
        //       "name": "Анализ исходно-разрешительной документации",
        //       "__typename": "Task"
        //     },
        //     "date_start": "2024-09-30",
        //     "date_end": "2024-10-15",
        //     "__typename": "ProjectTask"
        //   },
        //   {
        //     "id": "288",
        //     "task": {
        //       "id": "4",
        //       "name": "Согласование основных технических решений",
        //       "__typename": "Task"
        //     },
        //     "date_start": "2024-09-30",
        //     "date_end": "2024-11-14",
        //     "__typename": "ProjectTask"
        //   },
        //   {
        //     "id": "289",
        //     "task": {
        //       "id": "8",
        //       "name": "Выпуск проекта в полном объёме",
        //       "__typename": "Task"
        //     },
        //     "date_start": "2024-09-30",
        //     "date_end": "2024-10-30",
        //     "__typename": "ProjectTask"
        //   },
        //   {
        //     "id": "290",
        //     "task": {
        //       "id": "11",
        //       "name": "Сопровождение проекта в экспертизе",
        //       "__typename": "Task"
        //     },
        //     "date_start": "2024-09-30",
        //     "date_end": "2024-09-30",
        //     "__typename": "ProjectTask"
        //   },
        //   {
        //     "id": "291",
        //     "task": {
        //       "id": "12",
        //       "name": "Разработка рабочей документации",
        //       "__typename": "Task"
        //     },
        //     "date_start": "2024-09-30",
        //     "date_end": "2024-11-29",
        //     "__typename": "ProjectTask"
        //   }
        setВata(
          columns,
          ...data.projectTasksQuery.items.map(row => [
            row.task.name,
            row.task.name,
            null,
            new Date(row.date_start),
            new Date(row.date_start),
            null,
            100,
            null
          ])
        )
      },
      onError: error => {
        // openNotification('topRight', 'error', `Ошибка при загрузке данных: ${error.message}`);
      }
    }
  )
  useEffect(() => {
    getTasks()
  }, [projectId])
  const [data, setВata] = useState([])
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
      arrow: {
        angle: 100,
        width: 5,
        color: 'green',
        radius: 0
      }
    }
  }
  const columns = [
    { type: 'string', label: 'Task ID' },
    { type: 'string', label: 'Task Name' },
    { type: 'string', label: 'Resource' },
    { type: 'date', label: 'Start Date' },
    { type: 'date', label: 'End Date' },
    { type: 'number', label: 'Duration' },
    { type: 'number', label: 'Percent Complete' },
    { type: 'string', label: 'Dependencies' }
  ]

  //   const data = [columns, ...rows]
  if (!projectId) return 'Ошибка: Проект не передан'
  return (
    <Chart
      chartType='Gantt'
      width='100%'
      height='50%'
      data={data}
      options={options}
    />
  )
}
export default App
