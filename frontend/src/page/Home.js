import React from 'react';
import {Button, Card, Col, Divider, Popover, Row, Space, Typography} from "antd";

import '../style.css';
import {useQuery} from "@apollo/client";
import {GET_CURRENT_USER} from "../graphql/queries";
import {MenuItemsByPermission} from "./MenuItems";
import {useNavigate} from "react-router-dom"; // Подключаем файл со стилями для анимации

const Home = () => {
    const navigate = useNavigate();
    const {error, data, refetch} = useQuery(GET_CURRENT_USER, {
        pollInterval: 50000, // Интервал опроса в миллисекундах (например, 60000 мс = 1 минута)
        fetchPolicy: 'cache-only'
    });


    const currentUser = data;
    const handleChange = (key) => {
        if(!key)
            return;
        navigate(key);
    };

    return (
        <>
            {MenuItemsByPermission(currentUser?.currentUser ?? {})?.map((main_row) => {
                if (!main_row || !main_row.children)
                    return null;
                return (
                    <>
                        <Divider>{main_row.icon} {main_row.label}</Divider>
                        <Row gutter={5}>
                            {main_row?.children?.map((row) => {
                                if (!row || !row.children)
                                    return (
                                        <Col span={6}>
                                            <Card size={"small"} key={row?.key} title={(<>{row.icon} {row?.label}</>)}
                                                  style={{height: "100%"}}>
                                                <Space direction={"vertical"} style={{width: "100%"}}>
                                                    <Button size={"small"} onClick={()=>{handleChange(row.key)}} style={{textAlign: "start"}}
                                                            type="text" block>Открыть</Button>
                                                </Space>
                                            </Card>
                                        </Col>)
                                return (
                                    <Col span={6}>
                                        <Card size={"small"} key={row?.key} title={(<>{row.icon} {row?.label}</>)}
                                              style={{height: "100%"}}>
                                            <Space direction={"vertical"} style={{width: "100%"}}>
                                                {row?.children?.map(second_row => {
                                                    if (!second_row)
                                                        return null;
                                                    if (second_row?.status)
                                                        return (<Popover content="В разработке" color="pink">
                                                                <Button onClick={()=>{handleChange(second_row.key)}} danger disabled={true} size={"small"}
                                                                        style={{textAlign: "start"}}
                                                                        icon={second_row.icon}
                                                                        block>{second_row.label}</Button>
                                                            </Popover>
                                                        );

                                                    return (
                                                        <Button onClick={()=>{handleChange(second_row.key)}} size={"small"} style={{textAlign: "start"}}
                                                                icon={second_row.icon} type="text" block>{second_row.label}</Button>

                                                    );
                                                })}
                                            </Space>
                                        </Card>
                                    </Col>)
                            })}
                        </Row>
                    </>
                )
            })}

        </>
    );
};

export default Home;
