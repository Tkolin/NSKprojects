import { ConfigProvider, Space } from "antd";
import ruRU from "antd/locale/ru_RU";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import CustomLayout from "./page/Layout";

import Home from "./page/Home";
import ContactForm from "./page/simplesForms/ContactForm";
import OrganizationForm from "./page/simplesForms/OrganizationForm";
import PersonForm from "./page/simplesForms/PersonForm";

import OrganizationTable from "./page/OrganizationTable";
import ContactTable from "./page/simplesTables/ContactTable";
import PersonTable from "./page/simplesTables/PersonTable";

import moment from "moment";
import { NotificationProvider } from "./NotificationProvider";
import ProjectTable from "./page/ProjectTable";
import LoginForm from "./page/simplesForms/LoginForm";
import RegisterForm from "./page/simplesForms/RegisterForm";
import SimpleProjectTable from "./page/simplesTables/ProjectTable";

import StatusLegendComponent from "./page/ProjectTable/components/StatusLegendComponent";
import ProjectTSManagerForm from "./page/ProjectTSManagerForm";
import ProjectTSStructureForm from "./page/ProjectTSStructureForm";
import EquipmentModelForm from "./page/simplesForms/EquipmentModelForm";
import EquipmentTypeForm from "./page/simplesForms/EquipmentTypeForm";
import MathForm from "./page/simplesForms/MathForm";
import ReferenceForm from "./page/simplesForms/ReferenceForm";
import RequestForm from "./page/simplesForms/RequestForm";
import SupplierForm from "./page/simplesForms/SupplierForm";
import TechSpecForm from "./page/simplesForms/TechChapterForm";
import EquipmentModelTable from "./page/simplesTables/EquipmentModelTable";
import EquipmentTypeTable from "./page/simplesTables/EquipmentTypeTable";
import ExecutorPaymentsTable from "./page/simplesTables/ExecutorPaymentsTable";
import ParameterTable from "./page/simplesTables/ParameterTable";
import ReferenceTable from "./page/simplesTables/ReferenceTable";
import RoleTable from "./page/simplesTables/RoleTable";
import SupplierTable from "./page/simplesTables/SupplierTable";
import UserTable from "./page/simplesTables/UserTable";
import { PermissionsProvider } from "./permission/PermissionsProvider";
import usePermissionHider from "./permission/usePermissionHider";

const GlobalStyles = createGlobalStyle`
    body {
        margin: 0;
    }
 
`;

const App = () => {
  usePermissionHider();

  moment.locale("ru");
  return (
    <PermissionsProvider>
      <ConfigProvider locale={ruRU}>
        <NotificationProvider>
          <GlobalStyles />

          <Router>
            <CustomLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                {/*Справочники*/}
                <Route path="/references" element={<Home />} />
                {/* <Route path="/ts1" element={<TestPage/>}/> */}
                <Route path="/references/contact" element={<Home />} />
                <Route
                  path="/references/contact/table"
                  element={<ContactTable />}
                />
                <Route
                  path="/references/contact/form"
                  element={
                    <Space
                      style={{ width: "100%", justifyContent: "center" }}
                      children={<ContactForm />}
                    />
                  }
                />
                <Route
                  path="/user/person/form"
                  element={
                    <Space
                      style={{ width: "100%", justifyContent: "center" }}
                      children={<RegisterForm />}
                    />
                  }
                />
                <Route
                  path="/project/document"
                  element={
                    <Space
                      style={{ width: "100%", justifyContent: "center" }}
                      children={<ProjectTable mode={"files"} />}
                    />
                  }
                />
                <Route path="/references/person" element={<Home />} />
                <Route
                  path="/references/person/table"
                  element={<PersonTable />}
                />
                <Route
                  path="/references/person/form"
                  element={
                    <Space
                      style={{ width: "100%", justifyContent: "center" }}
                      children={<PersonForm />}
                    />
                  }
                />
                <Route path="/references/organization" element={<Home />} />
                <Route
                  path="/references/organization/table"
                  element={<OrganizationTable />}
                />
                <Route
                  path="/references/organization/form"
                  element={
                    <Space
                      style={{ width: "100%", justifyContent: "center" }}
                      children={<OrganizationForm />}
                    />
                  }
                />
                <Route path="/references/suppliers" element={<Home />} />
                <Route
                  path="/references/suppliers/table"
                  element={<SupplierTable />}
                />
                <Route
                  path="/references/suppliers/form"
                  element={
                    <Space
                      style={{ width: "100%", justifyContent: "center" }}
                      children={<SupplierForm />}
                    />
                  }
                />
                <Route path="/references/equipment_type" element={<Home />} />
                <Route
                  path="/references/equipment_type/table"
                  element={<EquipmentTypeTable />}
                />
                <Route
                  path="/references/equipment_type/parameters"
                  element={<ParameterTable />}
                />
                <Route
                  path="/references/equipment_type/form"
                  element={
                    <Space
                      style={{ width: "100%", justifyContent: "center" }}
                      children={<EquipmentTypeForm />}
                    />
                  }
                />
                <Route path="/references/equipment_model" element={<Home />} />
                <Route
                  path="/references/equipment_model/table"
                  element={<EquipmentModelTable />}
                />
                <Route
                  path="/references/equipment_model/form"
                  element={
                    <Space
                      style={{ width: "100%", justifyContent: "center" }}
                      children={<EquipmentModelForm />}
                    />
                  }
                />
                {/*Расчёты*/}
                <Route
                  path="/math/reference/form"
                  element={<ReferenceForm />}
                />
                <Route
                  path="/math/reference/table"
                  element={<ReferenceTable />}
                />
                <Route path="/math/module/creater" element={<MathForm />} />
                <Route
                  path="/math/tech_ref/form/chapter"
                  element={<TechSpecForm />}
                />
                <Route
                  path="/math/tech_ref/table/structure"
                  element={<ProjectTSStructureForm />}
                />
                <Route
                  path="/math/tech_ref/table/manager"
                  element={<ProjectTSManagerForm />}
                />
                <Route path="/math/formula/form" element={<Home />} />
                <Route path="/math/formula/table" element={<Home />} />
                {/* <Route path="/math/tech_ref/table/template" element={<ReferenceForm />}/> */}
                {/*Проекты*/}
                <Route path="/project" element={<Home />} />
                <Route
                  path="/project/extra/table_1"
                  element={<SimpleProjectTable columnKey={"v1"} />}
                />
                <Route
                  path="/project/extra/table_2"
                  element={<SimpleProjectTable columnKey={"v2"} />}
                />
                <Route
                  path="/project/statistic"
                  element={<StatusLegendComponent />}
                />
                <Route path="/project/request" element={<Home />} />
                <Route
                  path="/project/request/table"
                  element={<ProjectTable mode={"request"} />}
                />
                <Route
                  path="/project/request/form"
                  element={
                    <Space
                      style={{ width: "100%", justifyContent: "center" }}
                      children={<RequestForm />}
                    />
                  }
                />
                <Route path="/project/kp" element={<Home />} />
                <Route
                  path="/project/kp/table"
                  element={<ProjectTable mode={"kp"} />}
                />
                <Route path="/project/kp/form" element={<Home />} />
                <Route path="/project/contract" element={<Home />} />
                <Route
                  path="/project/contract/table"
                  element={<ProjectTable mode={"contract"} />}
                />
                <Route path="/project/contract/form" element={<Home />} />
                <Route path="/project/work" element={<Home />} />
                <Route
                  path="/project/work/table"
                  element={<ProjectTable mode={"work"} />}
                />
                <Route path="/project/waiting_start_work" element={<Home />} />
                <Route
                  path="/project/waiting_start_work/table"
                  element={<ProjectTable mode={"waiting_start_work"} />}
                />
                <Route path="/project/tasks_distribution" element={<Home />} />
                <Route
                  path="/project/tasks_distribution/table"
                  element={<ProjectTable mode={"executorPayment"} />}
                />
                <Route
                  path="/bookeep/executor_order_table"
                  element={<ProjectTable mode={"executorPayment"} />}
                />
                <Route
                  path="bookeep/all_executor_order_table"
                  element={<ExecutorPaymentsTable />}
                />
                <Route path="/project/work/form" element={<Home />} />
                {/*Учётки*/}
                <Route path="/user/person/table" element={<UserTable />} />
                <Route path="/user/role/table" element={<RoleTable />} />
                <Route path="/auth/register" element={<RegisterForm />} />
                <Route
                  path="/auth/login"
                  element={
                    <Space
                      style={{ width: "100%", justifyContent: "center" }}
                      children={<LoginForm />}
                    />
                  }
                />
                {/* Тестирование
                                <Route path="/test/test1" element={<ProjectForm/>}/>
                                <Route path="/test/test2" element={<LoginForm/>}/> */}
              </Routes>
            </CustomLayout>
          </Router>
        </NotificationProvider>
      </ConfigProvider>
    </PermissionsProvider>
  );
};

export default App;
