import {StyledBlockBig, StyledBlockRegular} from "../style/BlockStyles";
import {Modal} from "antd";
import OrganizationForm from "../form/modelsForms/OrganizationForm";
import React from "react";
import StageForm from "../form/modelsForms/StageForm";

const OrganizationModalForm = ({key,objectId,object,onClose, mode, onCompleted }) => {

    return (
        <Modal
            key={key}
            open={mode === "add" || mode === "edit"}
            onCancel={() => onClose()}
            footer={null}
            onClose={() => onClose()}
            width={"1000px"}
        >
            <StyledBlockBig label={"Организация"}>
                {mode === "edit" ? (
                    (object || objectId) && (
                        <StageForm
                            localObject={object}
                            onCompleted={() => onClose()}
                            initialObject={objectId ? {id: objectId} : null}
                        />
                    )
                ) : (
                    <StageForm onCompleted={onCompleted || onClose}/>
                )}
            </StyledBlockBig>
        </Modal>
    );
};

export default OrganizationModalForm;
