import React from 'react';
import catImage from '../cat.jpg';
import {Typography} from "antd";
import {StyledBlockLarge} from "./style/BlockStyles";
const { Text, Title } = Typography;


const Home = () => {
    return (
        <StyledBlockLarge>
            <Title>Главная страница!</Title>
            <img src={catImage} alt="Cat" style={{maxWidth: '100%', height: 'auto'}}/>
        </StyledBlockLarge>
    );
};

export default Home;