// src/components/Register.js

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { REGISTER_USER } from '../graphql/queries';

const Register = () => {
    const [registerUser] = useMutation(REGISTER_USER);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data } = await registerUser({
                variables: {
                    name: formData.name,
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
        <dir>
            <dir>Регистрация</dir>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" onChange={handleChange}/>
                <input type="email" name="email" onChange={handleChange}/>
                <input type="password" name="password" onChange={handleChange}/>
                <button type="submit">Register</button>
            </form>
        </dir>

    );
};

export default Register;
