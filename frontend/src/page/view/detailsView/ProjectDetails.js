import {StyledBlockBig, StyledBlockLarge, StyledBlockRegular} from "../../style/BlockStyles";
import React, {useState} from "react";
import {Col, Divider, Form, Modal, Row, Select} from "antd";
import TypeProjectForm from "../../form/modelsForms/TypeProjectForm";
import IrdsTemplateForm from "../../form/aggregateComponent/templateForm/IrdsTemplateForm";
import StagesTemplateForm from "../../form/aggregateComponent/templateForm/StagesTemplateForm";
import {TYPES_PROJECTS_QUERY} from "../../../graphql/queries";
import {useQuery} from "@apollo/client";
import ProjectForm from "../../form/modelsForms/ProjectForm";
import IrdsProjectForm from "../../form/aggregateComponent/projectForm/IrdsProjectForm";
import StagesProjectForm from "../../form/aggregateComponent/projectForm/StagesProjectForm";


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
