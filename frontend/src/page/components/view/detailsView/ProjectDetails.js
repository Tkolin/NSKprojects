import { Col, Divider, Row, Select } from "antd";
import React from "react";
import StagesProjectForm from "../../form/composedForm/CreateNewProject/components/Index";
import IrdsProjectForm from "../../form/composedForm/CreateNewProject/components/IrdsProjectForm";
import ProjectForm from "../../form/modelsForms/Index";
import { StyledBlockLarge } from "../../style/BlockStyles";

const { Option } = Select;

const ProjectDetails = ({ project }) => {
  return (
    <StyledBlockLarge>
      <Row gutter={8}>
        <Col span={24}>
          <Divider>Проект</Divider>
          <ProjectForm project={project} />

          <Divider>Этапы</Divider>

          <StagesProjectForm />
          <Divider>Ирд</Divider>

          <IrdsProjectForm />
        </Col>
      </Row>
    </StyledBlockLarge>
  );
};

export default ProjectDetails;
