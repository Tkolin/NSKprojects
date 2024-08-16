import {Alert, Button, Divider, Space} from "antd";
import {EyeOutlined, SaveOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import IrdToProjectForm from "../ProjectIrdsForm";
import {StyledButtonGreen} from "../components/style/ButtonStyles";
import StageToProjectForm from "../ProjectStagesForm";
import ProjectForm from "../ProjectForm";

const Index = ({project, options = []}) => {
    const [page, setPage] = useState()
    const ErrorAlert = () => {
        return <Alert message={"Ошибка конструктора"} type={"error"}/>
    }
    return (<Space direction={"vertical"}>

        <Space.Compact block>
            {/*TODO: Надо спрашивать об сохранении изменений*/}
            {options.includes("project") && <Button style={{width: "50%"}}
                                                    disabled={page === "project"}
                                                    children={"Проект"}
                                                    onClick={() => setPage("project")}
                                                    icon={page === "project" ? "" : <EyeOutlined/>}/>}
            {options.includes("stage") && <Button style={{width: "50%"}}
                                                  disabled={page === "stage"}
                                                  children={"Этапы"}
                                                  onClick={() => setPage("stage")}
                                                  icon={page === "stage" ? "" : <EyeOutlined/>}/>}
            {options.includes("ird") && <Button style={{width: "50%"}}
                                                disabled={page === "ird"}
                                                children={"Ирд"}
                                                onClick={() => setPage("ird")}
                                                icon={page === "ird" ? "" : <EyeOutlined/>}/>}
        </Space.Compact>


        {page === "project" ? options.includes("project") ? (<ProjectForm
            cardProps={{title: "Согласование КП"}}
            type={"kp"}
            onCompleted={() => onUpdated()}
            // disabledOptions={["status_id", "organization_customer", "date_create"]}
            requiredOptions={["name", "type_project_document", "organization_customer", "date_range", "price", "prepayment"]}
            project={project}
        />) : <ErrorAlert/> : page === "stage" ? options.includes("stage") ? (
            <Space.Compact direction={"vertical"}>
                <StyledButtonGreen size={"small"} type={"text"} icon={<SaveOutlined/>}
                                   children={"Загрузить шаблонные этапы"}/>
                <StageToProjectForm cardProps={{title: "Уточнение заявки"}} project={project}/>
            </Space.Compact>) : <ErrorAlert/> : page === "ird" ? options.includes("ird") ? (
            <Space.Compact direction={"vertical"}>
                <StyledButtonGreen size={"small"} type={"text"} icon={<SaveOutlined/>}
                                   children={"Загрузить шаблонные этапы"}/>
                <IrdToProjectForm cardProps={{title: "Уточнение заявки"}} project={project}/>
            </Space.Compact>) : <ErrorAlert/> : <ErrorAlert/>}
        <Divider style={{margin: 2}}/>
    </Space>)
}
export default Index;