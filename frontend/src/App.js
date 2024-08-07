import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom';
import {Cookies} from "react-cookie";
import {ConfigProvider, Space} from "antd";
import ruRU from "antd/locale/ru_RU";
import {useQuery} from "@apollo/client";
import {GET_CURRENT_USER} from "./graphql/queries";
import {createGlobalStyle} from "styled-components";
import CustomLayout from './page/Layout';

import Home from './page/Home';
import LoadingSpinnerStyles from "./page/components/style/LoadingSpinnerStyles";
import ContactForm from "./page/simplesForms/ContactForm";
import PersonForm from "./page/simplesForms/PersonForm";
import OrganizationForm from "./page/simplesForms/OrganizationForm";

import ContactTable from "./page/simplesTables/ContactTable";
import PersonTable from "./page/simplesTables/PersonTable";
import OrganizationTable from "./page/simplesTables/OrganizationTable";

import ProjectTable from "./page/ProjectTable";
import RegisterForm from "./page/simplesForms/RegisterForm";
import LoginForm from "./page/simplesForms/LoginForm";
import {NotificationProvider} from "./NotificationProvider";
import moment from "moment";

import UserTable from "./page/simplesTables/UserTable";
import RoleTable from "./page/simplesTables/RoleTable";
import {PermissionsProvider} from "./permission/PermissionsProvider";
import usePermissionHider from "./permission/usePermissionHider";
import ProjectForm from "./page/ProjectForm";
import RequestForm from "./page/simplesForms/RequestForm";
import DemoBar from "./page/TestPage";
import ProjectPaymentExecutorOrderTable from "./page/ProjectPaymentExecutorOrderTable";

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
                                <Route path="/test" element={<DemoBar/>}/>
                                {/*Справочники*/}
                                <Route path="/references" element={<Home/>}/>

                                <Route path="/references/contact" element={<Home/>}/>
                                <Route path="/references/contact/table" element={<ContactTable/>}/>
                                <Route path="/references/contact/form" element={
                                    <Space style={{width: "100%", justifyContent: "center" }} children={
                                        <ContactForm/>
                                    }/>
                                }/>

                                <Route path="/references/person" element={<Home/>}/>
                                <Route path="/references/person/table" element={<PersonTable/>}/>
                                <Route path="/references/person/form" element={
                                    <Space style={{width: "100%", justifyContent: "center" }} children={
                                        <PersonForm/>
                                    }/>
                                }/>

                                <Route path="/references/organization" element={<Home/>}/>
                                <Route path="/references/organization/table" element={<OrganizationTable/>}/>
                                <Route path="/references/organization/form" element={
                                    <Space style={{width: "100%", justifyContent: "center" }} children={
                                        <OrganizationForm/>
                                    }/>
                                }/>

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
                                <Route path="/project/request/form" element={
                                    <Space style={{width: "100%", justifyContent: "center" }} children={
                                        <RequestForm/>
                                    }/>
                                }/>

                                <Route path="/project/kp" element={<Home/>}/>
                                <Route path="/project/kp/table"
                                       element={<ProjectTable projectStatuses={["APPROVAL_KP"]}
                                                              columnOptions={["main", "customer", "kp_tools"]}/>}/>
                                <Route path="/project/kp/form" element={<Home/>}/>

                                <Route path="/project/contract" element={<Home/>}/>
                                <Route path="/project/contract/table"
                                       element={<ProjectTable
                                           projectStatuses={[
                                               "APPROVAL_AGREEMENT"]}
                                           legendOptions={[
                                               "APPROVAL_AGREEMENT"]}
                                           columnOptions={["progress", "contract_tools", "main", "customer", "status", "price"]}/>}
                                />
                                <Route path="/project/contract/form" element={<Home/>}/>

                                <Route path="/project/work" element={<Home/>}/>
                                <Route path="/project/work/table"
                                       element={<ProjectTable projectStatuses={["WORKING"]}
                                                              columnOptions={["progress", "working_tools", "main", "customer", "status", "price"]}/>}/>

                                <Route path="/project/work/form" element={<Home/>}/>
                                {/*Учётки*/}
                                <Route path="/user/person/table" element={<UserTable/>}/>
                                <Route path="/user/role/table" element={<RoleTable/>}/>

                                <Route path="/bookeep/executor_order_table" element={<ProjectPaymentExecutorOrderTable/>}/>

                                <Route path="/auth/register" element={<RegisterForm/>}/>
                                <Route path="/auth/login" element={
                                    <Space style={{width: "100%", justifyContent: "center" }} children={
                                        <LoginForm/>
                                    }/>}/>


                                {/*Тестирование*/}
                                <Route path="/test/test1" element={<ProjectForm/>}/>
                                <Route path="/test/test2" element={<LoginForm/>}/>
                            </Routes>
                        </CustomLayout>
                    </Router>
                </NotificationProvider>
            </ConfigProvider>
        </PermissionsProvider>

    );
};

export default App;
