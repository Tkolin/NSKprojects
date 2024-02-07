// Ваш проект/frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import ContactList from './components/contact/ContactList';
import ContactForm from './components/contact/ContactForm';
import LoginForm from './components/authorization/LoginForm';
import RegisterForm from './components/authorization/RegisterForm';
import Home from './components/Home';
import CustomLayout from './components/Layout';

const App = () => {
    return (
        <Router>
            <CustomLayout>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/contacts" element={<ContactList />} />
                    <Route path="/contacts/new" element={<ContactForm />} />
                    <Route path="/contacts/new" element={<ContactForm />} />
                    <Route path="/auth/register" element={<RegisterForm />} />
                    <Route path="/auth/login" element={<LoginForm />} />
                </Routes>
            </CustomLayout>
        </Router>
    );
};

export default App;
