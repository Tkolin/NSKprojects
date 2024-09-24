import { DeleteOutlined, DeliveredProcedureOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Badge, Button, Popconfirm, Tooltip } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { UP_STATUS_PROJECT } from "../../../../../../../../../graphql/mutationsProject";


const ArchivedButton = ({project, onCompleted}) => {

    const [changeProjectStatusMutate, {loading: changeProjectStatusLoading}] = useMutation(UP_STATUS_PROJECT, {
        onCompleted: () => {
            onCompleted && onCompleted();
        },
        onError: (error) => {
            console.log(error);
        }
    });

    const [disabledMessage, setDisabledMessage] = useState([])
    const addDisableMessage = (value) => {
        setDisabledMessage([...disabledMessage, value]);
    }

    useEffect(() => {
        //  Проверка доступности поднятия статуса в зависимости от параметров проекта
        reloadDisabled();
    }, [project,]);
    const reloadDisabled = () => {
        const result = [];
        switch (project.status.name_key) {
            case "DESIGN_REQUEST":
                if (!project.name)
                    result.push("Отсутствует имя проекта;  ");
                if (!project.organization_customer?.id)
                    result.push("Отсутствует организация заказчик;  ");
                if (project.facilities.length <= 0)
                    result.push("Отсутствуют объекты проектирования;  ");
                if (!project.duration)
                    result.push("Отсутствует продолжительность;  ")
                if (!project.type_project_document?.id)
                    result.push("Отсутствует тип документации;  ");
                if (!project.price)
                    result.push("Отсутствует стоимость;  ");
                if (!project.prepayment)
                    result.push("Отсутствует аванс;  ");
                break;

            case "APPROVAL_KP":
                if (!project.name)
                    result.push("Отсутствует имя проекта;  ");
                if (!project.organization_customer?.id)
                    result.push("Отсутствует организация заказчик;  ");
                if (project.facilities.length <= 0)
                    result.push("Отсутствуют объекты проектирования;  ");
                if (!project.duration)
                    result.push("Отсутствует продолжительность;  ")
                if (!project.type_project_document?.id)
                    result.push("Отсутствует тип документации;  ");
                if (!project.price)
                    result.push("Отсутствует стоимость;  ");
                if (!project.prepayment)
                    result.push("Отсутствует аванс;  ");

                if (project.project_stages?.length <= 0)
                    result.push("Отсутствуют этапы;  ")
                if (!project.kp_file_id)
                    result.push("Отсутствует подписанный файл;  ")
                break;

            case "APPROVAL_AGREEMENT":
                if (!project.name)
                    result.push("Отсутствует имя проекта;  ");
                if (!project.organization_customer?.id)
                    result.push("Отсутствует организация заказчик;  ");
                if (project.facilities.length <= 0)
                    result.push("Отсутствуют объекты проектирования;  ");
                if (!project.duration)
                    result.push("Отсутствует продолжительность;  ")
                if (!project.type_project_document?.id)
                    result.push("Отсутствует тип документации;  ");
                if (!project.price)
                    result.push("Отсутствует стоимость;  ");
                if (!project.prepayment)
                    result.push("Отсутствует аванс;  ");

                if (project.project_stages?.length <= 0)
                    result.push("Отсутствуют этапы;  ")
                if (!project.kp_file_id)
                    result.push("Отсутствует подписанный файл кп;  ")

                if (project.project_irds?.length <= 1)
                    result.push("Ирд не сформировано;  ");
                if (project.project_irds?.filter(row => (row.stage_number === 1) && (row.received_date)) > 0)
                    result.push("Ирд не получено;  ", project.project_irds?.filter(row => (row.stage_number === 1) && (row.received_date)).length);
                if (!project.date_signing)
                    result.push("Отсутствует дата подписания;  ")
                if (!project.contract_file_id)
                    result.push("Отсутствует подписанный файл договора;  ")
                break;
            case "ARCHIVE":
                result.push("Не реализованно;  ")
                break;
            case "COMPLETED":
                result.push("Не реализованно;  ");
                break;
            case "WAITING_SOURCE":
                result.push("Не реализованно;  ")
                break;
            case "WORKING":
                result.push("Не реализованно;  ");
                break;
        }
        setDisabledMessage(result);
    }
    const permissions = JSON.parse(localStorage.getItem("userPermissions")).map(row=>row.name_key);
    if(!permissions.includes("update-project"))
        return null;
    return (
        <Popconfirm
            title={"Переход к следующему этапу"}
            description={(disabledMessage.length > 0) ?
                disabledMessage.map(row => {
                    return <>{row}<br/></>
                })
                : "Вы уверены? это перенесёт проект на следующий этап!"}
            // onConfirm={() => handleArchiveProject(projectId)}
            icon={<DeleteOutlined/>}
            okButtonProps={{disabled: (disabledMessage.length > 0)}}
            onConfirm={() => changeProjectStatusMutate({
                variables: {
                    projectId: project.id,
                    date: dayjs().format("YYYY-MM-DD")
                }
            })}
        >
            <Tooltip title={(disabledMessage.length > 0) &&
                disabledMessage.map(row => {
                    return <>{row}<br/></>
                })}>
                <Badge count={disabledMessage.length} offset={[-5, 0]}>
                    <Button className={!(disabledMessage.length > 0) && "green-btn"}
                            disabled={(disabledMessage.length > 0)}
                            onClick={() => reloadDisabled()}
                            icon={<DeliveredProcedureOutlined/>} loading={changeProjectStatusLoading}
                            style={{height: 32}}
                    />
                </Badge>

            </Tooltip>

        </Popconfirm>
    )
}
export default ArchivedButton;