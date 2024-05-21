import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {Cookies} from "react-cookie";
import {ConfigProvider} from "antd";
import ruRU from "antd/locale/ru_RU";
import {useQuery} from "@apollo/client";
import {CURRENT_USER_QUERY} from "./graphql/queries";
import {createGlobalStyle} from "styled-components";

import CustomLayout from './page/Layout';

import Home from './page/Home';
import LoadingSpinnerStyles from "./page/style/LoadingSpinnerStyles";

import LoginForm from './page/form/authForm/LoginForm';
import RegisterForm from './page/form/authForm/RegisterForm';

import ContactTable from './page/view/tableView/ContactTable';
import ContactForm from './page/form/modelsForms/ContactForm';


import Test from "./_dev/test";
import Test2 from "./_dev/test2";

import {NotificationProvider} from './NotificationProvider';
import ProjectForm from "./page/form/modelsForms/ProjectForm";
import ComposedProjectForm from "./page/form/modules/project/Index";


const App = () => {
    const cookies = new Cookies();
    const accessToken = cookies.get('accessToken');
    const {loading, error, data} = useQuery(CURRENT_USER_QUERY);

    // Обработка загрузки и ошибок
    if (loading) return <LoadingSpinnerStyles/>;
    if (data) if (error) return `Ошибка! ${error.message}`;

    const currentUser = data?.currentUser;

    const GlobalStyles = createGlobalStyle`
        body {
            margin: 0;
        }
    `;
    return (
        <ConfigProvider locale={ruRU}>
            <NotificationProvider>
                <GlobalStyles/>
                <Router>
                    <CustomLayout currentUser={currentUser}>
                        <Routes>
                            <Route path="/" element={<Home/>}/>
                            <Route path="/test1" element={<Test/>}/>
                            <Route path="/test2" element={<Test2/>}/>

                            <Route path="/table/contacts" element={<ContactTable/>}/>
                            <Route path="/form/contact" element={<ContactForm/>}/>

                            <Route path="/table/persons" element={<ContactTable/>}/>
                            <Route path="/form/persons" element={<ContactForm/>}/>

                            <Route path="/table/organizations" element={<ContactTable/>}/>
                            <Route path="/form/organizations" element={<ContactForm/>}/>

                            <Route path="/table/ird" element={<ContactTable/>}/>
                            <Route path="/form/ird" element={<ContactForm/>}/>

                            <Route path="/table/type_projects" element={<ContactTable/>}/>
                            <Route path="/form/type_projects" element={<ContactForm/>}/>

                            <Route path="/table/stage_projects" element={<ContactTable/>}/>
                            <Route path="/form/stage_projects" element={<ContactForm/>}/>

                            <Route path="/reports/project" element={<ContactTable/>}/>
                            <Route path="/form/new_project" element={<ComposedProjectForm/>}/>


                            <Route path="/auth/register" element={<RegisterForm/>}/>
                            <Route path="/auth/login" element={<LoginForm/>}/>
                        </Routes>
                    </CustomLayout>
                </Router>
            </NotificationProvider>
        </ConfigProvider>
    );
};

export default App;
