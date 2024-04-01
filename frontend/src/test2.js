import React, { useEffect } from 'react';
import 'zingchart/es6';
import zingchart from 'zingchart-react';

function GanttChart() {
    useEffect(() => {
        // Настройка данных для Gantt Chart
        const chartData = {
            "type": "gantt",
            "plotarea": {
                "margin": "100 20 20 20"
            },
            "scale-x": {
                "transform": {
                    "type": "date",
                    "all": "%d %M %Y"
                },
                "label": {
                    "text": "Date"
                }
            },
            "scale-y": {
                "label": {
                    "text": "Task"
                }
            },
            "series": [
                {
                    "values": [
                        {
                            "label": "Task 1",
                            "start": "2024-04-01",
                            "end": "2024-04-05"
                        },
                        {
                            "label": "Task 2",
                            "start": "2024-04-06",
                            "end": "2024-04-10"
                        },
                        {
                            "label": "Task 3",
                            "start": "2024-04-11",
                            "end": "2024-04-15"
                        }
                    ]
                }
            ]
        };

        // Отрисовка Gantt Chart
        zingchart.render({
            id: 'myChart',
            data: chartData,
            height: '100%',
            width: '100%'
        });
    }, []);

    return <div id="myChart"></div>;
}

export default GanttChart;