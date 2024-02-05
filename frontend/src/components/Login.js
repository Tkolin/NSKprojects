// Login.js

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../graphql/queries';

const Login = () => {
    const [loginUser] = useMutation(LOGIN_USER);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data } = await loginUser({
                variables: {
                    email: formData.email,
                    password: formData.password,
                },
            });

            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" onChange={handleChange} />
            <input type="password" name="password" onChange={handleChange} />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
