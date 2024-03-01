import React from 'react';
import catImage from '../cat.jpg';
import { Typography } from "antd";
import {StyledBlockRegular} from "./style/BlockStyles";
import './style.css'; // Подключаем файл со стилями для анимации
const { Text, Title } = Typography;

const Home = () => {
    return (
        <StyledBlockRegular label={"Главная страница!"}>
            <img src={catImage} alt="Cat" className="rotate-image" />
        </StyledBlockRegular>
    );
};

export default Home;
