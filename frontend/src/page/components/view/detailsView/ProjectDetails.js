import {StyledBlockBig, StyledBlockLarge, StyledBlockRegular} from "../../style/BlockStyles";
import React, {useState} from "react";
import {Col, Divider, Form, Modal, Row, Select} from "antd";
import TypeProjectForm from "../../form/modelsForms/TypeProjectForm";
import IrdsTemplateForm from "../../form/composedForm/template/templateForm/IrdsTemplateForm";
import StagesTemplateForm from "../../form/composedForm/template/templateForm/StagesTemplateForm";
import {TYPES_PROJECTS_QUERY} from "../../../graphql/queries";
import {useQuery} from "@apollo/client";
import ProjectForm from "../../form/modelsForms/Index";
import IrdsProjectForm from "../../form/composedForm/CreateNewProject/components/IrdsProjectForm";
import StagesProjectForm from "../../form/composedForm/CreateNewProject/components/Index";


const {Option} = Select;

const ProjectDetails = ({project}) => {



    return (
        <StyledBlockLarge>
            <Row gutter={8}>
<Col span={24}>
<Divider>Проект</Divider>
    <ProjectForm project={project}/>

    <Divider>Этапы</Divider>



    <StagesProjectForm/>
    <Divider>Ирд</Divider>

    <IrdsProjectForm/>

</Col>




            </Row>
        </StyledBlockLarge>
    );
};

export default ProjectDetails;
