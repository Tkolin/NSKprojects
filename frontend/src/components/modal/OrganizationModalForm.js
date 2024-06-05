import {StyledBlockBig, StyledBlockRegular} from "../style/BlockStyles";
import {Modal} from "antd";
import OrganizationForm from "../form/modelsForms/OrganizationForm";
import React from "react";

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
                        <OrganizationForm
                            localObject={object}
                            onCompleted={() => onClose()}
                            initialObject={objectId ? {id: objectId} : null}
                        />
                    )
                ) : (
                    <OrganizationForm  onCompleted={onCompleted || onClose}/>
                )}
            </StyledBlockBig>
        </Modal>
    );
};

export default OrganizationModalForm;
