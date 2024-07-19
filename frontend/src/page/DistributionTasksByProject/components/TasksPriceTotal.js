import {Button, Card, Col, Divider, Progress, Row, Statistic, Typography} from "antd";
import {useQuery} from "@apollo/client";
import {STATUS_PROJECTS_QUERY} from "../../../graphql/queriesSpecial";
import React, {useEffect, useState} from "react";
import {AuditOutlined} from "@ant-design/icons";
import Title from "antd/es/typography/Title";

const {Text} = Typography;

const TaskItem = ({
                      task_count, total_task_count,
                      stage_price, total_price,
                      stage_name, loading
                  }) => {


        //TODO: Константа
        const _touchedTheMoney = 10;
        const percent = ((Math.ceil((total_price / stage_price) * 10000) / 100) ?? 0);

        const progressData = {
            percent: percent >= 99.99 ? 99.99 : percent,
            strokeColor: {
                '0%': '#1677ff',
                '29%': '#1677ff',
                '30%': '#faad14',
                '49%': '#faad14',
                '50%': '#ff4d4f',
                '100%': '#ff4d4f'
            },
        }
        const formatCurrency = (amount) => {
            return amount.toLocaleString('ru-RU', {style: 'currency', currency: 'RUB'});
        };
        return (
            <Card size={"small"} color={"red"} title={stage_name} loading={loading} style={{backgroundColor: percent > 99 ? "#faad14" : ""}}>
                <Statistic title={"Распределение средств на этапе"}
                           value={formatCurrency(total_price)}
                />
                <Text type={"secondary"}> из <strong>{formatCurrency(stage_price)}</strong></Text>
                <Progress size="small" {...progressData} style={{paddingLeft: 5, paddingRight: 15}}/>
                <Divider style={{margin: 9}}/>
                <Statistic suffix={<AuditOutlined/>}
                           title={"Назначенные задачи"}
                           value={total_task_count}/>
                <Text type={"secondary"}> из <strong>{task_count}</strong> (доступных)</Text>

            </Card>)
    }
;


const TasksPriceTotal = ({data = {project_tasks: [], project_stages: []}}) => {
    // const {loading: loading, error: error, data: data, refetch: refetch} = useQuery(STATUS_PROJECTS_QUERY);
    const [outputData, setOutputData] = useState({});
    const sumTotalPrice = (tasks) => {
        return tasks.map(row => row.price).reduce((acc, current) => acc + (typeof current === 'number' ? current : 0), 0)
    }

    useEffect(() => {
        console.log("TasksPriceTotal data", data)
        setOutputData(null);
        data?.project_stages?.map(row => {
            const actual_tasks = data.project_tasks.filter(second_row => second_row.stage_number === row.number);
            outputData[row.number] = {
                stage_name: row.stage?.name,
                task_count: actual_tasks.length,
                total_task_count: actual_tasks.filter(second_row => second_row.executor != null).length,
                stage_price: row.price,
                total_price: sumTotalPrice(actual_tasks)
            }
        })
    }, [data]);
    useEffect(() => {
        console.log("outputData", outputData);

    }, [outputData]);
    // const legendItems = ({
    //     'ARCHIVE': {color: '#eeeeee', text: 'В Архиве', disable: true},
    //     'COMPLETED': {color: '#eeeeee', text: 'Завершён'},
    //     'DESIGN_REQUEST': {color: '#f7f2ff', text: 'Запрос на проектирование'},
    //     'APPROVAL_KP': {color: '#fff2f2', text: 'Согласование КП'},
    //     'APPROVAL_AGREEMENT': {color: '#fcfbf0', text: 'Согласование договора'},
    //     'WAITING_SOURCE': {color: '#f8fff2', text: 'Ожидание исходных материалов'},
    //     'WORKING': {color: '#f2f9ff', text: 'В работе'}
    // });
    return (
        <Row gutter={1}>

            {Object.values(outputData)?.map(item => {
                console.log(item);
                return (<Col span={8}>
                        <TaskItem {...item}/>
                </Col>
                )
            })}

        </Row>

    );
}
export default TasksPriceTotal;