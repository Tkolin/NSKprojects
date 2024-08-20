import {Button, Popconfirm, Tooltip} from "antd";
import {DeleteOutlined, DeliveredProcedureOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {useMutation} from "@apollo/client";
import {UP_STATUS_PROJECT} from "../../../../../../../../../graphql/mutationsProject";
import dayjs from "dayjs";

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
        setDisabledMessage([]);
        switch (project.status.name_key) {
            // Если ирд получено и договор подписан
            case "DESIGN_REQUEST":
                if (!project.name)
                    addDisableMessage("Отсутствует имя проекта;  ");
                if (!project.price)
                    addDisableMessage("Отсутствует стоимость;  ")
                if (!project.duration)
                    addDisableMessage("Отсутствует продолжительность;  ")
                if (!project.organization_customer)
                    addDisableMessage("Отсутствует организация заказчик;  ")
                break;

            case "APPROVAL_KP":
                if (project.project_stages?.length <= 0)
                    addDisableMessage("Отсутствуют этапы;  ")
                if (!project.kp_file_id)
                    addDisableMessage("Отсутствует подписанный файл;  ")
                break;

            case "APPROVAL_AGREEMENT":
                if (!project.project_irds?.filter(row => (row.stage_number === 1) && (row.received_date)))
                    addDisableMessage("Отсутствует ирд;  ");
                if (!project.date_signing)
                    addDisableMessage("Отсутствует дата подписания;  ")
                if (!project.contract_file_id)
                    addDisableMessage("Отсутствует подписанный файл;  ")
                break;
            case "ARCHIVE":
                addDisableMessage("Не реализованно;  ")
                break;
            case "COMPLETED":
                addDisableMessage("Не реализованно;  ");
                break;
            case "WAITING_SOURCE":
                addDisableMessage("Не реализованно;  ")
                break;
            case "WORKING":
                addDisableMessage("Не реализованно;  ");
                break;
        }
    }
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
                <Button className={!(disabledMessage.length > 0) && "green-btn"}
                        disabled={(disabledMessage.length > 0)}
                        onClick={() => reloadDisabled()}
                        icon={<DeliveredProcedureOutlined/>} loading={changeProjectStatusLoading}
                        style={{height: 32}}
                />
            </Tooltip>

        </Popconfirm>
    )
}
export default ArchivedButton;