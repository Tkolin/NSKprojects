import {StyledBlockRegular} from "../style/BlockStyles";
import {Modal} from "antd";
import OrganizationForm from "../form/modelsForms/OrganizationForm";
import React from "react";
import TypeProjectForm from "../form/modelsForms/TypeProjectForm";

const TypeProjectModalForm = ({key,object={id: null},onClose, mode="edit"||"add"}) => {
    return (
        <Modal
            key={key}
            open={mode === "add" || mode === "edit"}
            onCancel={() => onClose(null)}
            footer={null}
            onClose={() => onClose(null)}
            width={"600px"}

        >
            <StyledBlockRegular label={"Тип документации"}>
                {mode === "edit" ? (
                    object && (
                        <TypeProjectForm onCompleted={() => onClose(null)}
                                          initialObject={object}/>
                    )
                ) : (
                    <TypeProjectForm  onCompleted={() => onClose(null)}/>
                )}
            </StyledBlockRegular>
        </Modal>
    );
};

export default TypeProjectModalForm;
