import React, {useState} from "react";
import {Collapse, Modal, Space} from "antd";
import TableStagesComponent from "./components/TableStagesComponent";
import TableIrdsComponent from "./components/TableIrdsComponent";
import TableExecutorsComponent from "./components/TableExecutorsComponent";
import TableProjectTasksManagment from "./components/TableProjectTasksManagment";
import TablePaymentExecutorOrdersComponent from "./components/TablePaymentExecutorOrdersComponent";
import {nanoid} from "nanoid";
import IrdsProjectForm from "../../../../../ProjectIrdsForm";
import StageToProjectForm from "../../../../../ProjectStagesForm";

const Index = ({project, expandable, options}) => {
    const [editModalStatus, setEditModalStatus] = useState();
    const getNameModalView = (type) => {
        switch (type) {
            case 'project':
                return "Данные проекта";
            case 'irds':
                return "Список ИРД";
            case 'stages':
                return "Список этапов";
            case 'tasks':
                return "Список задач";
            default:
                return null;
        }
    }
    const renderEditModalContent = ({project, model, onCompleted}) => {
        const commonProps = {
            onCompleted: () => onCompleted(),
            project: project,
        };
        switch (model) {
            case 'irds':
                return <IrdsProjectForm {...commonProps} />;
            case 'stages':
                return <StageToProjectForm {...commonProps} />;
            default:
                return null;
        }
    };
    return (
        <>
            <Space style={{maxWidth: "1200px"}} direction={"vertical"} align={"start"}>
                <Collapse size={"small"} accordion items={
                    [
                        ...(options.includes("stages") ? [{
                            key: '1',
                            label: "Этапы",
                            children:
                                <TableStagesComponent data-permission={"read-project-stage"} project={project}
                                                      setEditModalStatus={() => setEditModalStatus("stages")}/>
                        }] : []),

                        ...(options.includes("irds") ? [
                            {
                                key: '2',
                                label: "ИРД",
                                children:
                                    <TableIrdsComponent data-permission={"read-project-ird"} project={project}
                                                        setEditModalStatus={() => setEditModalStatus("irds")}/>

                            }] : []),

                        ...(options.includes("executors") ? [
                            {
                                key: '3',
                                label: "Исполнители",
                                children:
                                    <TableExecutorsComponent data-permission={"read-project-task-executor"}
                                                             project={project}
                                                             setEditModalStatus={() => setEditModalStatus("executor")}/>
                            }] : []),
                        ...(options.includes("stages-extra") ? [
                            {
                                key: '4',
                                label: "Этапы",
                                children:
                                    <TableStagesComponent data-permission={"read-project-stage"} project={project}
                                                          options={['acts', 'payments']}
                                                          setEditModalStatus={() => setEditModalStatus("stages")}/>
                            }] : []),
                        ...(options.includes("tasks") ? [
                            {
                                key: '5',
                                label: "Задачи",
                                children:
                                    <TableProjectTasksManagment
                                        data-permission={"read-project-task-executor"}
                                        project={project}
                                        setEditModalStatus={() => setEditModalStatus("tasks")}/>
                            }] : []),

                        ...(options.includes("executor_orders") ? [
                            {
                                key: '6',
                                label: "Исполнители",
                                children:
                                    <TablePaymentExecutorOrdersComponent
                                        data-permission={"read-project-task-executor"}
                                        project={project}
                                        setEditModalStatus={() => setEditModalStatus("executor_orders")}/>
                            }] : []),

                    ]
                }/>


            </Space>
            <Modal
                key={nanoid()}
                open={editModalStatus}
                onCancel={() => setEditModalStatus(null)}
                footer={null}
                title={getNameModalView(editModalStatus)}

                width={"max-content"}

                onClose={() => setEditModalStatus(null)}
            >
                {renderEditModalContent({
                    project: project,
                    model: editModalStatus,
                    onCompleted: () => setEditModalStatus(null)
                })}
            </Modal>
        </>
    )
}
export default Index;