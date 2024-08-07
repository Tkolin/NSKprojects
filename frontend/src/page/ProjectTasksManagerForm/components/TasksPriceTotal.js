import {Button, Card, Col, Divider, Input, Progress, Row, Skeleton, Statistic, Typography} from "antd";
import {useQuery} from "@apollo/client";
import {STATUS_PROJECTS_QUERY} from "../../../graphql/queriesSpecial";
import React, {useEffect, useState} from "react";
import {AuditOutlined, CalendarOutlined, MinusOutlined, PlusOutlined} from "@ant-design/icons";
import Title from "antd/es/typography/Title";

const {Text} = Typography;
const getTaskCount = (projectTasks, stageNumber) => {
    // Создайте словарь для быстрого доступа к задачам по их id
    return projectTasks.map(row => row.stage_number === stageNumber).length;
    const taskById = projectTasks.reduce((acc, item) => {
        if (item.stage_number === stageNumber) {
            acc[item.id] = item;
        }
        return acc;
    }, {});

    let count = 0;
    const findAllChild = (taskId) => {
        // Если задача не найдена в словаре, возвращаем 0
        if (!taskById[taskId]) return 0;

        const task = taskById[taskId];
        let localCount = 0;

        // Итерация по всем задачам для поиска дочерних задач
        projectTasks.forEach(row => {
            if (row.project_task_inherited_id === taskId) {
                if (!row.executor) {
                    // Если у задачи нет исполнителя, рекурсивно ищем ее дочерние задачи
                    localCount += 1 + findAllChild(row.id);
                }
            }
        });

        return localCount;
    };

    // Итерация по всем задачам на указанном этапе
    Object.keys(taskById).forEach(taskId => {
        if (!taskById[taskId].executor) {
            count += findAllChild(taskId);
        }
    });


};

const TaskItem = ({
                      projectTasks, stage, loading
                  }) => {
    const [progressData, setProgressData] = useState();
    const [data, setData] = useState();

    useEffect(() => {
        if ((projectTasks?.length > 0) && stage) {
            const total_price = projectTasks.map(row => row.price).reduce((acc, current) => acc + (typeof current === 'number' ? current : 0), 0);
            const stage_price = stage.price;
            const percent = Math.round(total_price / stage_price * 100);

            setData({
                task_count: getTaskCount(projectTasks, stage.number),
                total_task_count: projectTasks.filter(second_row => second_row.executor != null).length,
                stage_price: stage_price,
                stage_duration: stage.duration,
                total_price: total_price,
                stage_name: stage.stage.name,
            })
            setProgressData({
                percent: percent >= 99.99 ? 99.99 : percent, strokeColor: {
                    '0%': '#1677ff',
                    '29%': '#1677ff',
                    '30%': '#faad14',
                    '49%': '#faad14',
                    '50%': '#ff4d4f',
                    '100%': '#ff4d4f'
                },
            })
        }
    }, [projectTasks, stage]);


    const formatCurrency = (amount) => {
        return amount.toLocaleString('ru-RU', {style: 'currency', currency: 'RUB'});
    };
    return ((data && progressData) ? (
        <Card size={"small"} color={"red"} title={data.stage_name} loading={loading}
              style={{backgroundColor: progressData.percent > 99 ? "#faad14" : ""}}>
            <Statistic
                title={"Стоимость"}
                value={data.total_price && formatCurrency(data.total_price)}
            />
            <Text type={"secondary"}> из <strong>{formatCurrency(data.stage_price)}</strong></Text>
            <Progress size="small" {...progressData} style={{paddingLeft: 5, paddingRight: 15}}/>
            <Divider style={{margin: 9}}/>
            <Row style={{width: "100%"}}>
                <Col span={12}>
                    <Statistic suffix={<AuditOutlined/>}
                               title={"Назначенные задачи"}
                               value={data.total_task_count}/>
                </Col>
                <Col span={12}>
                    <Statistic suffix={<CalendarOutlined/>}
                               title={"Продолжительность"}
                               value={data.stage_duration}/>
                </Col>
            </Row>


            <Text type={"secondary"}> из <strong>{data.task_count}</strong> (доступных)</Text>
        </Card>) : (<Card><Skeleton active/></Card>))
}

const TasksPriceTotal = ({projectTasks, projectStages}) => {

    return (<Row gutter={1} style={{width: "100%"}}>
            {projectStages.map(row => <Col span={projectStages.length >= 6 ? 4 : 8}>
                <TaskItem stage={row}
                          projectTasks={projectTasks && projectTasks.filter(second_row => second_row.stage_number === row.number)}/>
            </Col>)}
        </Row>
    );
}
export default TasksPriceTotal;