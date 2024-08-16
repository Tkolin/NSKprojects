import {Popconfirm} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import {StyledButtonRed} from "../../../../../../../../components/style/ButtonStyles";
import React, {useContext} from "react";
import {useMutation} from "@apollo/client";
import {CHANGE_STATUS_PROJECT} from "../../../../../../../../../graphql/mutationsProject";
import {NotificationContext} from "../../../../../../../../../NotificationProvider";

const {openNotification} = useContext(NotificationContext);

const ArchivedButton = ({project, onCompleted}) => {
    const [changeProjectStatusMutate, {loading: changeProjectStatusLoading}] = useMutation(CHANGE_STATUS_PROJECT, {
        onCompleted: () => {
            openNotification('topRight', 'success', `Статус проекта изменён`);
            onCompleted && onCompleted();
        },
        onError: (error) => {
            console.log(error);
            openNotification('topRight', 'error', `Ошибка при изменении статуса проекта: ${error.message}`);
        }

    });
    const handleArchiveProject = (projectId) => {
        changeProjectStatusMutate({variables: {projectId: projectId, statusKey: "ARCHIVE"}})
    }
    return (
        <Popconfirm
            title={"Архивация заявки"}
            description={"Вы уверены? это перенесёт заявку в архив!"}
            onConfirm={() => handleArchiveProject(project.id)}
            icon={
                <DeleteOutlined/>
            }
        >
            <StyledButtonRed loading={changeProjectStatusLoading} style={{height: 32}} type={"text"}
                             icon={<DeleteOutlined/>}/>
        </Popconfirm>
    )
}
export default ArchivedButton;