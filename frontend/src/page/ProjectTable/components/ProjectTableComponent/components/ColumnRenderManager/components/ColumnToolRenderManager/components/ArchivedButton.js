import {Popconfirm} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import {StyledButtonRed} from "../../../../../../../../components/style/ButtonStyles";
import React from "react";
import {useMutation} from "@apollo/client";
import {ARCHIVE_PROJECT} from "../../../../../../../../../graphql/mutationsProject";

const ArchivedButton = ({projectId, onCompleted}) => {
    const [changeProjectStatusMutate, {loading: changeProjectStatusLoading}] = useMutation(ARCHIVE_PROJECT, {
        onCompleted: () => {
            onCompleted && onCompleted();
        },
        onError: (error) => {
            console.log(error);
        }

    });

    const handleArchiveProject = (projectId) => {
        changeProjectStatusMutate({variables: {projectId: projectId, statusKey: "ARCHIVE"}})
    }
    return (
        <Popconfirm
            title={"Архивация заявки"}
            description={"Вы уверены? это перенесёт заявку в архив!"}
            onConfirm={() => handleArchiveProject(projectId)}
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