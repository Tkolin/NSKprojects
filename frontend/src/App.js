import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import ContactList from './page/contact/ContactList';
import ContactForm from './page/contact/ContactForm';
import LoginForm from './page/authorization/LoginForm';
import RegisterForm from './page/authorization/RegisterForm';
import Home from './page/Home';
import OrganizationForm from './page/organization/OrganizationForm';
import OrganizationList from './page/organization/OrganizationList';
import PersonForm from './page/person/PersonForm';
import ProjectForm from './page/project/ProjectForm';
import ProjectList from './page/project/ProjectList';
import FacilityForm from './page/project/facility/FacilityForm';
import FacilityList from './page/project/facility/FacilityList';
import ProjectStageFrom from './page/project/stage/ProjectStageForm';
import ProjectStageList from './page/project/stage/ProjectStageList';
import StageTaskForm from './page/project/stage/task/StageTaskForm';
import StageTaskList from './page/project/stage/task/StageTaskList';
import CustomLayout from './page/Layout';
import {useQuery} from "@apollo/client";
import {CURRENT_USER_QUERY} from "./graphql/queries";
import PersonList from "./page/person/PersonList";
import {Cookies} from "react-cookie";
import LoadingSpinner from "./page/component/LoadingSpinner";
import TemplateForm from "./page/component/TemplateForm";

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
    if (data)if(error) return `Ошибка! ${error.message}`;

    const currentUser = data?.currentUser;

    return (
        <Router>
            <CustomLayout currentUser={currentUser}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    {currentUser ? (
                        currentUser.role.name === "admin" ? (
                            <>
                                <Route path="/template/new" element={<TemplateForm />} />

                                <Route path="/contacts" element={<ContactList />} />
                                <Route path="/contacts/new" element={<ContactForm />} />

                                <Route path="/project" element={<ProjectList />} />
                                <Route path="/project/new" element={<ProjectForm />} />
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
                        ) : null
                    ) : (
                        <>
                            <Route path="/auth/register" element={<RegisterForm />} />
                            <Route path="/auth/login" element={<LoginForm />} />
                        </>
                    )}
                </Routes>
            </CustomLayout>
        </Router>
    );
};

export default App;
