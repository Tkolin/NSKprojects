import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import ContactTable from './page/view/tableView/ContactTable';
import ContactForm from './page/form/basicForm/ContactForm';
import LoginForm from './page/form/authForm/LoginForm';
import RegisterForm from './page/form/authForm/RegisterForm';
import Home from './page/Home';
import OrganizationForm from './page/form/basicForm/OrganizationForm';
import OrganizationTable from './page/view/tableView/OrganizationTable';
import PersonForm from './page/form/basicForm/PersonForm';
import ProjectTable from './page/view/tableView/ProjectTable';
import FacilityForm from './page/form/simpleForm/FacilityForm';
import FacilityList from './page/view/tableView/FacilityTable';
import ProjectStageList from './page/view/tableView/ProjectStageTable';
import StageTaskList from './page/view/tableView/StageTaskTable';
import CustomLayout from './page/Layout';
import {useQuery} from "@apollo/client";
import {CURRENT_USER_QUERY} from "./graphql/queries";
import PersonTable from "./page/view/tableView/PersonTable";
import {Cookies} from "react-cookie";
import LoadingSpinnerStyles from "./page/style/LoadingSpinnerStyles";
import TemplateForm from "./page/form/composedForm/TemplateForm";
import IrdTable from "./page/view/tableView/IrdTable";
import TypeProjectTable from "./page/view/tableView/TypeProjectTable";
import StageTable from "./page/view/tableView/StageTable";
import Test from "./test";
import {ConfigProvider} from "antd";
import ruRU from "antd/locale/ru_RU";
import CreateNewProject from "./page/form/composedForm/CreateNewProject";
import {createGlobalStyle} from "styled-components";


const App = () => {
    const cookies = new Cookies();
    const accessToken = cookies.get('accessToken');
    const {loading, error, data} = useQuery(CURRENT_USER_QUERY, {
        context: {
            headers: {
                Authorization: accessToken ? `Bearer ${accessToken}` : '',
            }
        }
    });
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
            <GlobalStyles />
            <Router>
                <CustomLayout currentUser={currentUser}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/t" element={<Test />} />

                        {currentUser ? (
                            <>
                                {currentUser.role.name === "admin" && (
                                    <>
                                        <Route path="/ird" element={<IrdTable />} />
                                        <Route path="/typeProject" element={<TypeProjectTable />} />
                                        <Route path="/stageProject" element={<StageTable />} />

                                        <Route path="/template/new" element={<TemplateForm />} />

                                        <Route path="/contacts" element={<ContactTable />} />
                                        <Route path="/contacts/new" element={<ContactForm />} />

                                        <Route path="/project" element={<ProjectTable />} />
                                        <Route path="/project/new" element={<CreateNewProject />} />
                                        <Route path="/project/stage" element={<ProjectStageList />} />
                                         <Route path="/project/stage/task" element={<StageTaskList />}/>
                                         <Route path="/project/facility" element={<FacilityList />} />
                                        <Route path="/project/facility/new" element={<FacilityForm />} />
                                        <Route path="/organization" element={<OrganizationTable />} />
                                        <Route path="/organization/new" element={<OrganizationForm />} />

                                        <Route path="/person" element={<PersonTable />} />
                                        <Route path="/person/new" element={<PersonForm />} />
                                    </>
                                )}

                                {currentUser.role.name === "bookkeeper" && (
                                    <>
                                        <Route path="/contacts" element={<ContactTable />} />
                                        <Route path="/contacts/new" element={<ContactForm />} />

                                        <Route path="/person" element={<PersonTable />} />
                                        <Route path="/person/new" element={<PersonForm />} />

                                        <Route path="/organization" element={<OrganizationTable />} />
                                        <Route path="/organization/new" element={<OrganizationForm />} />
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <Route path="/auth/register" element={<RegisterForm />} />
                                <Route path="/auth/login" element={<LoginForm />} />
                            </>
                        )}
                    </Routes>
                </CustomLayout>
            </Router>
        </ ConfigProvider>
    );
};

export default App;
