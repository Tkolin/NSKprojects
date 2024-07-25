import React, {useEffect, useState} from 'react';
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

import ContactTable from "./page/simplesTables/ContactTable";
import PersonTable from "./page/simplesTables/PersonTable";
import OrganizationTable from "./page/simplesTables/OrganizationTable";

import ProjectTable from "./page/ProjectTable";
import RegisterPage from "./page/simplesForms/RegisterPage";
import LoginPage from "./page/simplesForms/loginPage";
import {NotificationProvider} from "./NotificationProvider";
import moment from "moment";
import RequestPage from "./page/simplesForms/RequestPage";
import UserTable from "./page/simplesTables/UserTable";
import RoleTable from "./page/simplesTables/RoleTable";
import RolePage from "./page/simplesForms/RolePage";
import {PermissionsProvider} from "./permission/PermissionsProvider";
import usePermissionHider from "./permission/usePermissionHider";
import ProjectForm from "./page/ProjectForm";

const GlobalStyles = createGlobalStyle`
    body {
        margin: 0;
    }

    //[data-permission] {
    //    display: none; /* Скрываем элементы по умолчанию */
    //}
`;

const App = () => {
    const cookies = new Cookies();
    usePermissionHider();
    const [data, setData] = useState()
    const {loading, error, refetch: refetchCurr} = useQuery(GET_CURRENT_USER, {
        //pollInterval: 60000, // Интервал опроса в миллисекундах (например, 60000 мс = 1 минута)
        fetchPolicy: 'cache-and-network', // Всегда берет данные с сервера, а не из кэша
        onCompleted: (data) => {
            console.log(data);
            setData(data);
        },
        onError: (error) => {
            console.log(error.message);
            if (!cookies.get('accessToken'))
                setData(null);
        }
    });

    if (loading) return <LoadingSpinnerStyles/>;

    moment.locale('ru');


    return (
        <PermissionsProvider permissions={data?.currentUser?.permissions?.map(row => row.name_key) ?? null}>

            <ConfigProvider locale={ruRU}>
                <NotificationProvider>
                    <GlobalStyles/>

                    <Router>
                        <CustomLayout currentUser={data}
                                      error={error?.message ? (error?.message != "Not token found" ? error?.message : null) : null}>
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

                                <Route path="/project/extra" element={<ProjectTable
                                    projectStatuses={[
                                        "APPROVAL_AGREEMENT",
                                        "APPROVAL_KP",
                                        "COMPLETED",
                                        "DESIGN_REQUEST",
                                        "WAITING_SOURCE",
                                        "WORKING"]}
                                    legendOptions={[
                                    "APPROVAL_AGREEMENT",
                                    "APPROVAL_KP",
                                    "COMPLETED",
                                    "DESIGN_REQUEST",
                                    "WAITING_SOURCE",
                                    "WORKING"]}
                                    columnOptions={["progress", "tool", "main", "customer", "status", "price"]}/>}/>

                                <Route path="/project/request" element={<Home/>}/>
                                <Route path="/project/request/table"
                                       element={<ProjectTable projectStatuses={["DESIGN_REQUEST"]}
                                                              columnOptions={["main", "customer", "request_tools"]}/>}/>
                                <Route path="/project/request/form" element={<RequestPage/>}/>

                                <Route path="/project/kp" element={<Home/>}/>
                                <Route path="/project/kp/table"
                                       element={<ProjectTable projectStatuses={["APPROVAL_KP"]}
                                                              columnOptions={["main", "customer", "kp_tools"]}/>}/>
                                <Route path="/project/kp/form" element={<Home/>}/>

                                <Route path="/project/contract" element={<Home/>}/>
                                <Route path="/project/contract/table"
                                       element={<ProjectTable projectStatuses={["APPROVAL_AGREEMENT"]}
                                                              columnOptions={["main", "customer"]}/>}/>
                                <Route path="/project/contract/form" element={<Home/>}/>

                                <Route path="/project/work" element={<Home/>}/>
                                <Route path="/project/work/table"
                                       element={<ProjectTable projectStatuses={["WORKING"]}
                                                              columnOptions={["main", "customer"]}/>}/>

                                <Route path="/project/work/form" element={<Home/>}/>
                                {/*Учётки*/}
                                <Route path="/user/person/table" element={<UserTable/>}/>
                                <Route path="/user/role/table" element={<RoleTable/>}/>

                                <Route path="/user/role/form" element={<RolePage/>}/>

                                <Route path="/auth/register" element={<RegisterPage/>}/>
                                <Route path="/auth/login" element={<LoginPage/>}/>


                                {/*Тестирование*/}
                                <Route path="/test/test1" element={<ProjectForm/>}/>
                                <Route path="/test/test2" element={<LoginPage/>}/>
                            </Routes>
                        </CustomLayout>
                    </Router>
                </NotificationProvider>
            </ConfigProvider>
        </PermissionsProvider>

    );
};

export default App;
