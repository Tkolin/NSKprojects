import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import ContactList from './page/directory/ContactList';
import ContactForm from './page/form/ContactForm';
import LoginForm from './page/authorization/LoginForm';
import RegisterForm from './page/authorization/RegisterForm';
import Home from './page/Home';
import OrganizationForm from './page/form/OrganizationForm';
import OrganizationList from './page/directory/OrganizationList';
import PersonForm from './page/form/PersonForm';
import ProjectForm from './page/form/ProjectForm';
import ProjectList from './page/directory/ProjectList';
import FacilityForm from './page/form/FacilityForm';
import FacilityList from './page/directory/FacilityList';
import ProjectStageFrom from './page/form/ProjectStageForm';
import ProjectStageList from './page/directory/ProjectStageList';
import StageTaskForm from './page/form/StageTaskForm';
import StageTaskList from './page/directory/StageTaskList';
import CustomLayout from './page/Layout';
import {useQuery} from "@apollo/client";
import {CURRENT_USER_QUERY} from "./graphql/queries";
import PersonList from "./page/directory/PersonList";
import {Cookies} from "react-cookie";
import LoadingSpinner from "./page/component/LoadingSpinner";
import TemplateForm from "./page/form/TemplateForm";
import IrdList from "./page/directory/IrdList";
import TypeProjectList from "./page/directory/TypeProjectList";
import StageList from "./page/directory/StageList";
import Test from "./test";
import {ConfigProvider} from "antd";
import ruRU from "antd/locale/ru_RU";
import CreateNewProject from "./page/form/CreateNewProject";


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
    if (loading) return <LoadingSpinner/>;
    if (data) if (error) return `Ошибка! ${error.message}`;

    const currentUser = data?.currentUser;


    return (
        <ConfigProvider locale={ruRU}>
            <Router>
                <CustomLayout currentUser={currentUser}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/t" element={<Test />} />

                        {currentUser ? (
                            <>
                                {currentUser.role.name === "admin" && (
                                    <>
                                        <Route path="/ird" element={<IrdList />} />
                                        <Route path="/typeProject" element={<TypeProjectList />} />
                                        <Route path="/stageProject" element={<StageList />} />

                                        <Route path="/template/new" element={<TemplateForm />} />

                                        <Route path="/contacts" element={<ContactList />} />
                                        <Route path="/contacts/new" element={<ContactForm />} />

                                        <Route path="/project" element={<ProjectList />} />
                                        <Route path="/project/new" element={<CreateNewProject />} />
                                        <Route path="/project/stage" element={<ProjectStageList />} />
                                        <Route path="/project/stage/new" element={<ProjectStageFrom />} />
                                        <Route path="/project/stage/task" element={<StageTaskList />}/>
                                        <Route path="/project/stage/task/new" element={<StageTaskForm />} />
                                        <Route path="/project/facility" element={<FacilityList />} />
                                        <Route path="/project/facility/new" element={<FacilityForm />} />
                                        <Route path="/organization" element={<OrganizationList />} />
                                        <Route path="/organization/new" element={<OrganizationForm />} />

                                        <Route path="/person" element={<PersonList />} />
                                        <Route path="/person/new" element={<PersonForm />} />
                                    </>
                                )}

                                {currentUser.role.name === "bookkeeper" && (
                                    <>
                                        <Route path="/contacts" element={<ContactList />} />
                                        <Route path="/contacts/new" element={<ContactForm />} />

                                        <Route path="/person" element={<PersonList />} />
                                        <Route path="/person/new" element={<PersonForm />} />

                                        <Route path="/organization" element={<OrganizationList />} />
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
