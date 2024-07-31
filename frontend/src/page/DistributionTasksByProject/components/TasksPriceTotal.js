import {Button, Card, Col, Divider, Progress, Row, Skeleton, Statistic, Typography} from "antd";
import {useQuery} from "@apollo/client";
import {STATUS_PROJECTS_QUERY} from "../../../graphql/queriesSpecial";
import React, {useEffect, useState} from "react";
import {AuditOutlined} from "@ant-design/icons";
import Title from "antd/es/typography/Title";

const {Text} = Typography;

const TaskItem = ({
                      projectTasks, stage, loading
                  }) => {


    const [progressData, setProgressData] = useState();
    const [data, setData] = useState();
    const _touchedTheMoney = 10;
    useEffect(() => {
        if ((projectTasks?.length > 0) && stage) {
            const total_price = projectTasks.map(row => row.price).reduce((acc, current) => acc + (typeof current === 'number' ? current : 0), 0);
            const stage_price = stage.price;
            const percent = (((Math.ceil(total_price / stage_price) * 10000) / 100) ?? 0);

            setData({
                task_count: projectTasks.lenght,
                total_task_count: projectTasks.filter(second_row => second_row.executor != null).length,
                stage_price: stage_price,
                total_price: total_price,
                stage_name: stage.name,
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
    return ((data && progressData) ? (<Card size={"small"} color={"red"} title={data.stage_name} loading={loading}
                                            style={{backgroundColor: progressData.percent > 99 ? "#faad14" : ""}}>
        <Statistic title={"Распределение средств на этапе"}
                   value={data.total_price && formatCurrency(data.total_price)}
        />
        <Text type={"secondary"}> из <strong>{formatCurrency(data.stage_price)}</strong></Text>
        <Progress size="small" {...progressData} style={{paddingLeft: 5, paddingRight: 15}}/>
        <Divider style={{margin: 9}}/>
        <Statistic suffix={<AuditOutlined/>}
                   title={"Назначенные задачи"}
                   value={data.total_task_count}/>
        <Text type={"secondary"}> из <strong>{data.task_count}</strong> (доступных)</Text>
    </Card>) : (<Card><Skeleton active/></Card>))
}

const TasksPriceTotal = ({projectTasks, projectStages}) => {
     const [outputData, setOutputData] = useState(null);
    const sumTotalPrice = (tasks) => {
        return tasks.map(row => row.price).reduce((acc, current) => acc + (typeof current === 'number' ? current : 0), 0)
    }



    return (<Row gutter={1} style={{width: "100%"}}>
            {projectStages.map(row => <Col span={8}>
                <TaskItem stage={row}
                          projectTasks={projectTasks && projectTasks.filter(second_row => second_row.stage_number === row.number)}/>
            </Col>)}
            {/*{outputData ? (*/}
            {/*Object.values(outputData)?.map(item => {*/}
            {/*    console.log(item);*/}
            {/*    return (<Col span={8}>*/}
            {/*            <TaskItem {...item}/>*/}
            {/*    </Col>*/}
            {/*    )*/}
            {/*})) : <Skeleton active/>}*/}

        </Row>

    );
}
export default TasksPriceTotal;