import React from 'react';
import {Card, Col, Row, Space, Statistic} from "antd";
import {ArrowDownOutlined, ArrowUpOutlined} from "@ant-design/icons";
import {useQuery} from "@apollo/client";
import {STATUS_PROJECTS_QUERY} from "../../../graphql/queriesSpecial";
import LoadingSpinnerStyles from "../../components/style/LoadingSpinnerStyles";

const LegendItem = ({color, text, value}) => (
    <Card bordered={false}
          style={{
              height: "150px",
              backgroundColor: color,
              marginBottom: 20
          }}>
        <Statistic
            title={text}
            value={value}
        />
    </Card>
);

const StatusLegend = ({projectStatuses}) => {
    const {loading: loading, error: error, data: data, refetch: refetch} = useQuery(STATUS_PROJECTS_QUERY, {variables: {
            projectStatuses
        }});

    const legendItems = ({
        'ARCHIVE': {color: '#eeeeee', text: 'В Архиве', disable: true},
        'COMPLETED': {color: '#eeeeee', text: 'Завершён'},
        'DESIGN_REQUEST': {color: '#f7f2ff', text: 'Запрос на проектирование'},
        'APPROVAL_KP': {color: '#fff2f2', text: 'Согласование КП'},
        'APPROVAL_AGREEMENT': {color: '#fcfbf0', text: 'Согласование договора'},
        'WAITING_SOURCE': {color: '#f8fff2', text: 'Ожидание исходных материалов'},
        'WORKING': {color: '#f2f9ff', text: 'В работе'}
    });
    if(loading)
        return <LoadingSpinnerStyles/>
    if(error)
        return error.message;
    return (
        <Row gutter={5}>

            {data?.projectsStatistic?.map(item => (
                    <Col span={4}>
                        <LegendItem
                            key={item?.status?.name_key}
                                    color={legendItems[item?.status?.name_key]?.color ?? null}
                                    text={item?.status?.name}
                                    value={item?.project_ids?.length ?? 0}
                        />
                    </Col>
            ))}
        </Row>

    );
};

export default StatusLegend;
