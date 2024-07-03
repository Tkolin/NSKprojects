import {StyledBlockBig} from "../style/BlockStyles";
import {Divider, Modal} from "antd";
import OrganizationForm from "../form/modelsForms/OrganizationForm";
import React from "react";
import {nanoid} from "nanoid";

const OrganizationModalForm = ({key,objectId,object,onClose, mode, onCompleted }) => {

    return (
        <Modal
            key={key ?? nanoid()}
            open={mode === "add" || mode === "edit"}
            onCancel={() => onClose()}
            footer={null}
            onClose={() => onClose()}
            width={"900px"}
        >
            <Divider>Организация</Divider>
            {mode === "edit" ? (
                (object) && (
                        <OrganizationForm
                            localObject={object}
                            onCompleted={() => onClose()}
                            initialObject={objectId ? {id: objectId} : null}
                        />
                    )
                ) : (
                    <OrganizationForm  onCompleted={onCompleted || onClose}/>
                )}
         </Modal>
    );
};

export default OrganizationModalForm;
