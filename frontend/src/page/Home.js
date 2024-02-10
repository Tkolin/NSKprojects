import React, {useEffect, useState} from 'react';
import catImage from '../cat.jpg';
import {Row, Col, Typography} from "antd"; // Путь к вашему изображению
import StyledFormBlock from './style/FormStyles'; // Импорт стилей
const { Text, Title } = Typography;


const Home = () => {

    const accessToken = localStorage.getItem('accessToken');
    return (
        <StyledFormBlock>
            <Title>Главная страница!</Title>
            <img src={catImage} alt="Cat" style={{maxWidth: '100%', height: 'auto'}}/>
        </StyledFormBlock>
    )
;
};

export default Home;