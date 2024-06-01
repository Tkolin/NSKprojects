import {StyledBlockRegular} from "../style/BlockStyles";
import {Modal} from "antd";
import OrganizationForm from "../form/modelsForms/OrganizationForm";
import React from "react";

const OrganizationModalForm = ({key,object,onClose, mode}) => {

    return (
        <Modal
            key={key}
            open={mode === "add" || mode === "edit"}
            onCancel={() => onClose()}
            footer={null}
            onClose={() => onClose()}
        >
            <StyledBlockRegular label={"Организация"}>
                {mode === "edit" ? (
                    object && (
                        <OrganizationForm onCompleted={() => onClose()}
                                          initialObject={object}/>
                    )
                ) : (
                    <OrganizationForm onCompleted={() => onClose()}/>
                )}
            </StyledBlockRegular>
        </Modal>
    );
};

export default OrganizationModalForm;
