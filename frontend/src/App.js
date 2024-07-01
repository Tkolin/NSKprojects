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
import LoadingSpinnerStyles from "./page/components/style/LoadingSpinnerStyles";
import ContactPage from "./page/simplesForms/ContactPage";
import PersonPage from "./page/simplesForms/PersonPage";
import OrganizationPage from "./page/simplesForms/OrganizationPage";
import DistributionTasksByProject from "./page/DistributionTasksByProject/Index";
import CreateNewProject from "./page/CreateNewProject/Index";
import ContactTable from "./page/simplesTables/ContactTable";
import PersonTable from "./page/simplesTables/PersonTable";
import OrganizationTable from "./page/simplesTables/OrganizationTable";
import IrdTable from "./page/simplesTables/IrdTable";
import TypeProjectTable from "./page/simplesTables/TypeProjectTable";
import StageTable from "./page/simplesTables/StageTable";
import ProjectTable from "./page/ProjectTable/Index";
import RegisterPage from "./page/simplesForms/RegisterPage";
import LoginPage from "./page/simplesForms/loginPage";
import {NotificationProvider} from "./NotificationProvider";
import moment from "moment";
import RequestPage from "./page/simplesForms/RequestPage";
import ProjectTableComponent from "./page/ProjectTable/components/ProjectTableComponent";


const App = () => {
    const cookies = new Cookies();
    const accessToken = cookies.get('accessToken');
    const {loading, error, data} = useQuery(CURRENT_USER_QUERY);

    // Обработка загрузки и ошибок
    if (loading) return <LoadingSpinnerStyles/>;
    if (data) if (error) return `Ошибка! ${error.message}`;

    const currentUser = data?.currentUser;
    moment.locale('ru');

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
                            <Route path="/request/new" element={<RequestPage/>}/>
                            <Route path="/project/table/request" element={<ProjectTableComponent projectStatuses={"DESIGN_REQUEST"}/>}/>
                            <Route path="/project/table/kp" element={<ProjectTableComponent projectStatuses={"APPROVAL_KP"}/>}/>
                            <Route path="/project/table/contract" element={<ProjectTableComponent projectStatuses={"APPROVAL_AGREEMENT"}/>}/>



                             {/*<Route path="/test2" element={<Test2/>}/>*/}
                            <Route path="/form/contact" element={<ContactPage/>}/>
                            <Route path="/form/persons" element={<PersonPage/>}/>
                            <Route path="/form/organizations" element={<OrganizationPage/>}/>
                            <Route path="/form/new_project" element={<CreateNewProject/>}/>
                            <Route path="/form/tasks_project" element={<DistributionTasksByProject/>}/>



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
