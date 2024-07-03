import {StyledBlockBig} from "../style/BlockStyles";
import {Divider, Modal} from "antd";
import React from "react";
import StageForm from "../form/modelsForms/StageForm";

const OrganizationModalForm = ({key,object,onClose, mode, onCompleted }) => {

    return (
        <Modal
            key={key}
            open={mode === "add" || mode === "edit"}
            onCancel={() => onClose()}
            footer={null}
            onClose={() => onClose()}
            width={"500px"}
        >
            <Divider> Этап </Divider>
                {mode === "edit" ? (
                    (object) && (
                        <StageForm

                            onCompleted={() => onClose(null)}
                            initialObject={object}
                        />
                    )
                ) : (
                    <StageForm onCompleted={onCompleted || onClose}/>
                )}
        </Modal>
    );
};

export default OrganizationModalForm;
