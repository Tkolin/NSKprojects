import React, {useEffect, useState} from 'react';
import catImage from '../cat.jpg'; // Путь к вашему изображению

const Home = () => {

    const accessToken = localStorage.getItem('accessToken');
    return (

        <div>
            <h1>Welcome to the Home Page!</h1>
            <img src={catImage} alt="Cat" style={{maxWidth: '100%', height: 'auto'}}/>
        </div>
    );
};

export default Home;