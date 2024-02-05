// Ваш проект/frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import ContactList from './components/ContactList';
import ContactForm from './components/ContactForm';
import Home from './components/Home';

const App = () => {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <NavLink to="/contacts">Contact List</NavLink>
                        </li>
                        <li>
                            <NavLink to="/contacts/new">Add Contact</NavLink>
                        </li>
                        <li>
                            <NavLink to="/">Home</NavLink>
                        </li>
                    </ul>
                </nav>

                <Routes>
                    <Route path="/contacts" element={<ContactList />} />
                    <Route path="/contacts/new" element={<ContactForm />} />
                    <Route path="/" element={<Home />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
