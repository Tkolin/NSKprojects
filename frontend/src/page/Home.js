import React, {useEffect, useState} from 'react';

const Home = () => {

    const accessToken = localStorage.getItem('accessToken');
    return (

        <div>
            <h1>Welcome to the Home Page!</h1>
            <h1>Абцэсс</h1>
            {accessToken}

        </div>
    );
};

export default Home;