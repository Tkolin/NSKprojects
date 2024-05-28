import {StyledBlockRegular} from "../../../components/style/BlockStyles";
import {Modal} from "antd";
import OrganizationForm from "../../../components/form/modelsForms/OrganizationForm";
import React from "react";

const OrganizationModalForm = ({key,object,onClose, mode}) => {
    return (
        <Modal
            key={key}
            open={mode === "add" || mode === "edit"}
            onCancel={() => onClose(null)}
            footer={null}
            onClose={() => onClose(null)}
        >
            <StyledBlockRegular label={"Организация"}>
                {mode === "edit" ? (
                    object && (
                        <OrganizationForm onCompleted={() => onClose(null)}
                                          initialObject={object}/>
                    )
                ) : (
                    <OrganizationForm onCompleted={() => onClose(null)}/>
                )}
            </StyledBlockRegular>
        </Modal>
    );
};

export default OrganizationModalForm;
