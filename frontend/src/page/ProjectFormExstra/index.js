import { EyeOutlined } from "@ant-design/icons";
import { Alert, Button, Divider, Space } from "antd";
import React, { useEffect, useState } from "react";
import ProjectForm from "../ProjectForm";
import IrdToProjectForm from "../ProjectIrdsForm";
import StageToProjectForm from "../ProjectStagesForm";

const template = {
    APPROVAL_AGREEMENT: ["project", "stage", "ird"],
    APPROVAL_KP: ["project", "stage"],
    DESIGN_REQUEST: ["project"],
    WAITING_SOURCE: ["project", "stage", "ird"],
    WORKING: ["project"],
}
const Index = ({project, status}) => {
    const [page, setPage] = useState("project")
    useEffect(() => {
        setPage("project")
    }, [project, status,]);
    const onCompleted = () => {
        console.log("TODO onCompleted in ProjectFormExtra");
    }
    const ErrorAlert = () => {
        return <Alert message={"Ошибка конструктора"} type={"error"}/>
    }
    return (
        <Space direction={"vertical"}>
            {template[status].length > 1 && (
                <Space.Compact block>
                    {/*TODO: Надо спрашивать об сохранении изменений*/}
                    {template[status]?.includes("project") && <Button style={{width: "50%"}}
                                                                      disabled={page === "project"}
                                                                      children={"Проект"}
                                                                      onClick={() => setPage("project")}
                                                                      icon={page === "project" ? "" : <EyeOutlined/>}/>}
                    {template[status]?.includes("stage") && <Button style={{width: "50%"}}
                                                                    disabled={page === "stage"}
                                                                    children={"Этапы"}
                                                                    onClick={() => setPage("stage")}
                                                                    icon={page === "stage" ? "" : <EyeOutlined/>}/>}
                    {template[status]?.includes("ird") && <Button style={{width: "50%"}}
                                                                  disabled={page === "ird"}
                                                                  children={"Ирд"}
                                                                  onClick={() => setPage("ird")}
                                                                  icon={page === "ird" ? "" : <EyeOutlined/>}/>}

                </Space.Compact>)
            }


            {page === "project" ? template[status].includes("project") ? (
                <ProjectForm
                    cardProps={{title: "Изменение проекта"}}
                    type={"kp"}
                    onCompleted={() => onCompleted && onCompleted()}
                    // disabledOptions={["status_id", "organization_customer", "date_create"]}
                    requiredOptions={["name", "type_project_document", "organization_customer", "date_range", "price", "prepayment"]}
                    project={project}
                />) : <ErrorAlert/> : page === "stage" ? template[status].includes("stage") ? (
                <Space.Compact direction={"vertical"}>

                <StageToProjectForm onCompleted={() => onCompleted()} cardProps={{title: "Уточнение заявки"}}
                                        project={project}/>
                </Space.Compact>) : <ErrorAlert/> : page === "ird" ? template[status].includes("ird") ? (
                <Space.Compact direction={"vertical"}>

                <IrdToProjectForm onCompleted={() => onCompleted()} cardProps={{title: "Уточнение заявки"}}
                                      project={project}/>
                </Space.Compact>) : <ErrorAlert/> : <ErrorAlert/>}
            <Divider style={{margin: 2}}/>
        </Space>)
}
export default Index;