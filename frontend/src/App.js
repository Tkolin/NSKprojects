// Ваш проект/frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import ContactList from './components/contact/ContactList';
import ContactForm from './components/contact/ContactForm';
import Home from './components/Home';
import CustomLayout from './components/Layout';

const App = () => {
    return (
        <Router>
            <CustomLayout>

                <Routes>
                    <Route path="/contacts" element={<ContactList />} />
                    <Route path="/contacts/new" element={<ContactForm />} />
                    <Route path="/" element={<Home />} />
                </Routes>
            </CustomLayout>
        </Router>
    );
};

export default App;
