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
// import OrganizationForm from './page/form/modelsForms/OrganizationForm';
// import OrganizationTable from './page/view/tableView/OrganizationTable';
// import PersonForm from './page/form/modelsForms/PersonForm';
// import ProjectTable from './page/view/tableView/ProjectTable';
// import FacilityForm from './page/form/modelsForms/FacilityForm';
// import FacilityList from './page/view/tableView/FacilityTable';
// import ProjectStageList from './page/view/tableView/ProjectStageTable';
// import StageTaskList from './page/view/tableView/StageTaskTable';
// import PersonTable from "./page/view/tableView/PersonTable";
// import TemplateForm from "./page/form/composedForm/TemplateForm";
// import IrdTable from "./page/view/tableView/IrdTable";
// import TypeProjectTable from "./page/view/tableView/TypeProjectTable";
// import StageTable from "./page/view/tableView/StageTable";
// import CreateNewProject from "./page/form/composedForm/CreateNewProject";
// import SectionReferenceTable from "./page/view/tableView/SectionReferenceTable";
// import TasksChartForm from "./page/form/modelsForms/TasksChartForm";

import Test from "./_dev/test";
import Test2 from "./_dev/test2";

import {NotificationProvider} from './NotificationProvider';


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
