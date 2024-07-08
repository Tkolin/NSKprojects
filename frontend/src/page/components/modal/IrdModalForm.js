import {StyledBlockBig} from "../style/BlockStyles";
import {Modal} from "antd";
import React from "react";
import IrdForm from "../form/modelsForms/IrdForm";

const OrganizationModalForm = ({key,objectId,object,onClose, mode, onCompleted }) => {

    return (
        <Modal
            key={key}
            open={mode === "add" || mode === "edit"}
            onCancel={() => onClose()}
            footer={null}
            onClose={() => onClose()}
            width={"1000px"}
            title={"ИРД"}
        >
                 {mode === "edit" ? (
                    (object || objectId) && (
                        <IrdForm
                            localObject={object}
                            onCompleted={() => onClose()}
                            initialObject={objectId ? {id: objectId} : null}
                        />
                    )
                ) : (
                    <IrdForm  onCompleted={onCompleted || onClose}/>
                )}
         </Modal>
    );
};

export default OrganizationModalForm;
