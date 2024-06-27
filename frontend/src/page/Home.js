import React from 'react';
import {Button, Calendar, Divider, Space, Typography} from "antd";

import '../style.css';
import styled from "styled-components";
import Link from "antd/es/typography/Link";
import {PinterestOutlined} from "@ant-design/icons"; // Подключаем файл со стилями для анимации
const {Text, Title} = Typography;
const StyledBlockWrapper = styled.div`
    margin: 10px auto;
    background-color: #f8fafc;
    padding: 15px;
    padding-top: 0px;
    border-radius: 8px;
    border-color: #61dafb;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    width: 400px;
    height: 400px;
`;
const StyledBlock = ({content, header = "Заголовок"}) => {
    return (
        <StyledBlockWrapper>
            <Divider>{header}</Divider>
            {content}
        </StyledBlockWrapper>
    )
}
const Home = () => {
    const content = [
        {
            key: 1,
            header: "Организации",
            content: (
                <Space.Compact direction={"vertical"} style={{alignContent: "center", width: "100%"}}>
                    <Button icon={<PinterestOutlined/>} >Список организаций</Button>
                    <Button icon={<PinterestOutlined/>} >Создать организацию</Button>
                    <Button icon={<PinterestOutlined/>} >Список контактов</Button>
                    <Button icon={<PinterestOutlined/>} >Создать контакт</Button>
                </Space.Compact>
            )
        },
        {
            key: 2,
            header: "Заголовок 2",
            content: (
                <>
                    уу
                </>
            )
        },
        {
            key: 3,
            header: "Заголовок 3",
            content: (
                <Calendar fullscreen={false}/>
            )
        }
    ];
    return (
        <Space size={[8, 16]} wrap>
            {content.map((row) => (
                // eslint-disable-next-line react/no-array-index-key
                <StyledBlock key={row.key} content={row.content} header={row.header}/>
            ))}
        </Space>
    );
};

export default Home;
