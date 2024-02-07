// Ваш проект/frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import ContactList from './page/contact/ContactList';
import ContactForm from './page/contact/ContactForm';
import LoginForm from './page/authorization/LoginForm';
import RegisterForm from './page/authorization/RegisterForm';
import Home from './page/Home';
import CustomLayout from './page/Layout';
import {useQuery} from "@apollo/client";
import {CURRENT_USER_QUERY} from "./graphql/queries";

const App = () => {
    const accessToken = localStorage.getItem('accessToken'); // Получаем токен из куки

    const {loading, error, data} = useQuery(CURRENT_USER_QUERY, {
        context: {
            headers: {
                Authorization: accessToken ? `Bearer ${accessToken}` : '',
            }
        }
    });
    if (loading) return <div>Loading...</div>
    if(data)
        if (error) return <div>Error: {error.message}</div>;

    const currentUser = data?.currentUser;

    return (
        <Router>
            <CustomLayout currentUser={currentUser}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    {currentUser ? (
                        currentUser.role.name === "admin" ? (
                            <>
                                <Route path="/contacts" element={<ContactList />} />
                                <Route path="/contacts/new" element={<ContactForm />} />
                            </>
                        ) : null
                    ) : (
                        <>
                            <Route path="/auth/register" element={<RegisterForm />} />
                            <Route path="/auth/login" element={<LoginForm />} />
                        </>
                    )}
                </Routes>
            </CustomLayout>
        </Router>
    );
};

export default App;
