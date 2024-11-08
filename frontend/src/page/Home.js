import React, { useEffect, useState } from 'react';

import '../style.css';

import { useNavigate } from "react-router-dom"; // Подключаем файл со стилями для анимации
import StatisticFrame from './StatisticFrame';

const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState()
    useEffect(() => {
        setUser({
            permissions: JSON.parse(localStorage.getItem("userPermissions")),
            user: JSON.parse(localStorage.getItem("user")),
        })
    }, []);


    const handleChange = (key) => {
        if(!key)
            return;
        navigate(key);
    };

    return (
        <>
           <StatisticFrame />

        </>
    );
};

export default Home;
