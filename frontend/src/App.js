import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {Cookies} from "react-cookie";
import {ConfigProvider, Space} from "antd";
import ruRU from "antd/locale/ru_RU";
import {useLazyQuery} from "@apollo/client";
import {GET_CURRENT_USER} from "./graphql/queries";
import {createGlobalStyle} from "styled-components";
import CustomLayout from './page/Layout';

import Home from './page/Home';
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
import StatusLegendComponent from "./page/ProjectTable/components/StatusLegendComponent";

const GlobalStyles = createGlobalStyle`
    body {
        margin: 0;
    }
`;

const App = () => {

    const cookies = new Cookies();


    usePermissionHider();
    const [data, setData] = useState()
    const [findActualUsers, {loading, error, refetch: refetchCurr}] = useLazyQuery(GET_CURRENT_USER, {
        fetchPolicy: 'cache-and-network', // Всегда берет данные с сервера, а не из кэша
        onCompleted: (data) => {
            setData(data.currentUser);
            const oldUser = localStorage.getItem("userData");
            const oldPermissions = localStorage.getItem("userPermissions");
            const newUser = JSON.stringify(data.currentUser.user);
            const newPermissions = JSON.stringify(data.currentUser.permissions);

            if (!(oldUser === newUser && oldPermissions === newPermissions)) {

                localStorage.setItem("userData", JSON.stringify(data.currentUser.user));
                localStorage.setItem("userPermissions", JSON.stringify(data.currentUser.permissions));
                window.location.reload();
            }
        },
        onError: (error) => {
            console.log("Ошибка аутентификации: " + error.message);
        }
    });
    useEffect(() => {
        //  Запрос на актуальные данные в сервере если токен есть
        if (cookies.get("accessToken")) {
            if (localStorage.getItem("userData") && localStorage.getItem("userPermissions")) {
                setData({
                    permissions: JSON.parse(localStorage.getItem("userPermissions")),
                    user: JSON.parse(localStorage.getItem("userPermissions")),
                })
            }
            findActualUsers();

        } else {
            console.log("Ошибка аутентификации: " + "Токен отсутствует");
        }
    }, []);

    // if (loading) return <LoadingSpinnerStyles/>;

    moment.locale('ru');


    return (
        <PermissionsProvider permissions={data?.permissions?.map(row => row.name_key) ?? null}>

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
                                    <Space style={{width: "100%", justifyContent: "center"}} children={
                                        <ContactForm/>
                                    }/>
                                }/>


                                <Route path="/user/person/form" element={
                                    <Space style={{width: "100%", justifyContent: "center"}} children={
                                        <RegisterForm/>
                                    }/>
                                }/>

                                <Route path="/references/person" element={<Home/>}/>
                                <Route path="/references/person/table" element={<PersonTable/>}/>
                                <Route path="/references/person/form" element={
                                    <Space style={{width: "100%", justifyContent: "center"}} children={
                                        <PersonForm/>
                                    }/>
                                }/>

                                <Route path="/references/organization" element={<Home/>}/>
                                <Route path="/references/organization/table" element={<OrganizationTable/>}/>
                                <Route path="/references/organization/form" element={
                                    <Space style={{width: "100%", justifyContent: "center"}} children={
                                        <OrganizationForm/>
                                    }/>
                                }/>

                                {/*Проекты*/}
                                <Route path="/project" element={<Home/>}/>

                                <Route path="/project/statistic" element={<StatusLegendComponent/>}
                                />

                                <Route path="/project/request" element={<Home/>}/>
                                <Route path="/project/request/table"
                                       element={<ProjectTable mode={"request"}/>}/>
                                <Route path="/project/request/form" element={
                                    <Space style={{width: "100%", justifyContent: "center"}} children={
                                        <RequestForm/>
                                    }/>
                                }/>

                                <Route path="/project/kp" element={<Home/>}/>
                                <Route path="/project/kp/table"
                                       element={<ProjectTable mode={"kp"}/>}/>
                                <Route path="/project/kp/form" element={<Home/>}/>

                                <Route path="/project/contract" element={<Home/>}/>
                                <Route path="/project/contract/table"
                                       element={<ProjectTable mode={"contract"}/>}
                                />
                                <Route path="/project/contract/form" element={<Home/>}/>

                                <Route path="/project/work" element={<Home/>}/>
                                <Route path="/project/work/table"
                                       element={<ProjectTable mode={'work'}/>}/>

                                <Route path="/project/tasks_distribution" element={<Home/>}/>
                                <Route path="/project/tasks_distribution/table"
                                       element={<ProjectTable mode={'executorPayment'}/>}/>


                                <Route path="/bookeep/executor_order_table"
                                       element={<ProjectTable mode={"executorPayment"}/>}/>


                                <Route path="/project/work/form" element={<Home/>}/>
                                {/*Учётки*/}
                                <Route path="/user/person/table" element={<UserTable/>}/>
                                <Route path="/user/role/table" element={<RoleTable/>}/>


                                <Route path="/auth/register" element={<RegisterForm/>}/>
                                <Route path="/auth/login" element={
                                    <Space style={{width: "100%", justifyContent: "center"}} children={
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
