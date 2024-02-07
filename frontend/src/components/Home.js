import React, {useEffect, useState} from 'react';
import {Cookies} from "react-cookie"; // Импортируем библиотеку для декодирования токена

const Home = () => {

    const cookies = new Cookies();
    const accessToken = cookies.get('accessToken');

    console.log(accessToken);


    return (

        <div>
            <h1>Welcome to the Home Page!</h1>
            {accessToken}
        </div>
    );
};

export default Home;