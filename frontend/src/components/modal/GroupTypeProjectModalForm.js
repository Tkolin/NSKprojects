import {StyledBlockRegular} from "../style/BlockStyles";
import {Modal} from "antd";
 import React, {useEffect} from "react";
import ContactForm from "../form/modelsForms/ContactForm";
import {nanoid} from "nanoid";
import GroupTypeProjectForm from "../form/modelsForms/GroupTypeProjectForm";

const ContactModalForm = ({key,object,objectId,onClose, mode, onCompleted}) => {
    return (
        <Modal
            key={key ?? nanoid()}
            open={mode === "add" || mode === "edit"}
            onCancel={() => onClose(null)}
            footer={null}
            onClose={() => onClose(null)}
            width={"600px"}
        >
            <StyledBlockRegular label={"Контакт"}>
                {mode === "edit" ? (
                    (object || objectId) && (
                        <GroupTypeProjectForm
                            onCompleted={() =>
                            onClose(null)}
                            initialObject={objectId ? {id: objectId} : null}
                            localObject={object}
                        />
                    )
                ) : (
                    <GroupTypeProjectForm onCompleted={onCompleted || onClose}/>
                )}
            </StyledBlockRegular>
        </Modal>
    );
};

export default ContactModalForm;
