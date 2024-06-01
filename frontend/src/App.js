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
import LoadingSpinnerStyles from "./components/style/LoadingSpinnerStyles";

import LoginPage from "./page/modules/auth/loginPage";
import RegisterPage from "./page/modules/auth/RegisterPage";
import ContactPage from "./page/simples/forms/ContactPage";
import {NotificationProvider} from "./NotificationProvider";
import PersonPage from "./page/simples/forms/PersonPage";
import OrganizationPage from "./page/simples/forms/OrganizationPage";
import ProjectModules from "./page/modules/project/Index";
import ProjectTasksModules from "./page/modules/projectTasks/Index";
import ContactTable from "./page/simples/tables/ContactTable";
import PersonTable from "./page/simples/tables/PersonTable";
import OrganizationTable from "./page/simples/tables/OrganizationTable";
import IrdTable from "./page/simples/tables/IrdTable";
import TypeProjectTable from "./page/simples/tables/TypeProjectTable";
import StageTable from "./page/simples/tables/StageTable";
import ProjectTable from "./page/simples/tables/ProjectTable";


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
                            {/*<Route path="/test1" element={<Test/>}/>*/}
                            {/*<Route path="/test2" element={<Test2/>}/>*/}
                            <Route path="/form/contact" element={<ContactPage/>}/>
                            <Route path="/form/persons" element={<PersonPage/>}/>
                            <Route path="/form/organizations" element={<OrganizationPage/>}/>
                            <Route path="/form/new_project" element={<ProjectModules/>}/>
                            <Route path="/form/tasks_project" element={<ProjectTasksModules/>}/>

                            <Route path="/table/contacts" element={<ContactTable/>}/>
                            <Route path="/table/persons" element={<PersonTable/>}/>
                            <Route path="/table/organizations" element={<OrganizationTable/>}/>
                            <Route path="/table/ird" element={<IrdTable/>}/>
                            <Route path="/table/type_projects" element={<TypeProjectTable/>}/>
                            <Route path="/table/stage_projects" element={<StageTable/>}/>
                            <Route path="/reports/project" element={<ProjectTable/>}/>

                            <Route path="/auth/register" element={<RegisterPage/>}/>
                            <Route path="/auth/login" element={<LoginPage/>}/>
                         </Routes>
                    </CustomLayout>
                </Router>
            </NotificationProvider>
        </ConfigProvider>
    );
};

export default App;
