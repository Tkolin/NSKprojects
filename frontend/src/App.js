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
import CustomLayout from './page/Layout';
import {useQuery} from "@apollo/client";
import {CURRENT_USER_QUERY} from "./graphql/queries";

const App = () => {
    const accessToken = localStorage.getItem('accessToken'); // Получаем токен из куки

    const {loading, error, data} = useQuery(CURRENT_USER_QUERY, {
        context: {
            headers: {
                Authorization: accessToken ? `Bearer ${accessToken}` : '',
            }
        }
    });
    if (loading) return <div>Loading...</div>
    if(data)
        if (error) return <div>Error: {error.message}</div>;

    const currentUser = data?.currentUser;

    return (
        <Router>
            <CustomLayout currentUser={currentUser}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    {currentUser ? (
                        currentUser.role.name === "admin" ? (
                            <>
                                <Route path="/contacts" element={<ContactList />} />
                                <Route path="/contacts/new" element={<ContactForm />} />

                                <Route path="/project" element={<ProjectList />} />
                                <Route path="/project/new" element={<ProjectForm />} />
                                <Route path="/project/stage" element={<ProjectStageList />} />
                                <Route path="/project/stage/new" element={<ProjectStageFrom />} />
                                <Route path="/project/facility" element={<FacilityList />} />
                                <Route path="/project/facility/new" element={<FacilityForm />} />
                                <Route path="/organization" element={<OrganizationList />} />
                                <Route path="/organization/new" element={<OrganizationForm />} />

                                <Route path="/person" element={<PersonForm />} />
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
