import React, {useState} from 'react';
import {BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom';
import {Cookies} from "react-cookie";
import {ConfigProvider} from "antd";
import ruRU from "antd/locale/ru_RU";
import {useQuery} from "@apollo/client";
import {GET_CURRENT_USER} from "./graphql/queries";
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
import TestMail from "./page/TestMail";


const App = () => {
    const cookies = new Cookies();
    const [data, setData] = useState()
    const {loading, error, refetch: refetchCurr} = useQuery(GET_CURRENT_USER, {
        pollInterval: 60000, // Интервал опроса в миллисекундах (например, 60000 мс = 1 минута)
        fetchPolicy: 'network-only', // Всегда берет данные с сервера, а не из кэша
        onCompleted: (data)=>{
            setData(data);
        },
        onError: (error) => {
            console.log(error.message);
            if(!cookies.get('accessToken'))
                setData(null);
        }
    });

     if (loading) return <LoadingSpinnerStyles/>;

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
                    <CustomLayout currentUser={data} error={error?.message ? (error?.message != "Not token found" ? error?.message : null) : null}>
                        <Routes>
                            <Route path="/" element={<Home/>}/>
                            {/*Справочники*/}
                            <Route path="/references" element={<Home/>}/>

                            <Route path="/references/contact" element={<Home/>}/>
                            <Route path="/references/contact/table" element={<ContactTable/>}/>
                            <Route path="/references/contact/form" element={<ContactPage/>}/>

                            <Route path="/references/person" element={<Home/>}/>
                            <Route path="/references/person/table" element={<PersonTable/>}/>
                            <Route path="/references/person/form" element={<PersonPage/>}/>

                            <Route path="/references/organization" element={<Home/>}/>
                            <Route path="/references/organization/table" element={<OrganizationTable/>}/>
                            <Route path="/references/organization/form" element={<OrganizationPage/>}/>

                            {/*Проекты*/}
                            <Route path="/project" element={<Home/>}/>

                            <Route path="/project/extra" element={<ProjectTable/>}/>

                            <Route path="/project/request" element={<Home/>}/>
                            <Route path="/project/request/table" element={<ProjectTableComponent projectStatuses={"DESIGN_REQUEST"}/>}/>
                            <Route path="/project/request/form" element={<RequestPage/>}/>

                            <Route path="/project/kp" element={<Home/>}/>
                            <Route path="/project/kp/table" element={<ProjectTableComponent projectStatuses={"APPROVAL_KP"}/>}/>
                            <Route path="/project/kp/form" element={<Home/>}/>

                            <Route path="/project/contract" element={<Home/>}/>
                            <Route path="/project/contract/table" element={<ProjectTableComponent projectStatuses={"APPROVAL_AGREEMENT"}/>}/>
                            <Route path="/project/contract/form" element={<Home/>}/>

                            <Route path="/project/work" element={<Home/>}/>
                            <Route path="/project/work/table" element={<ProjectTableComponent projectStatuses={"WORKING"}/>}/>
                            <Route path="/project/work/form" element={<Home/>}/>














                            <Route path="/request/new" element={<RequestPage/>}/>
                            <Route path="/project/table/request"
                                   element={<ProjectTableComponent projectStatuses={"DESIGN_REQUEST"}/>}/>
                            <Route path="/project/table/kp"
                                   element={<ProjectTableComponent projectStatuses={"APPROVAL_KP"}/>}/>
                            <Route path="/project/table/contract"
                                   element={<ProjectTableComponent projectStatuses={"APPROVAL_AGREEMENT"}/>}/>


                            {/*<Route path="/test2" element={<Test2/>}/>*/}
                            <Route path="/form/contact" element={<ContactPage/>}/>
                            <Route path="/form/persons" element={<PersonPage/>}/>
                            <Route path="/form/organizations" element={<OrganizationPage/>}/>
                            <Route path="/form/new_project" element={<CreateNewProject/>}/>
                            <Route path="/form/tasks_project" element={<DistributionTasksByProject/>}/>


                            <Route path="/testMail" element={<TestMail/>}/>


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
