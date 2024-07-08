import {StyledBlockRegular} from "../style/BlockStyles";
import {Modal} from "antd";
 import React from "react";
import ContactForm from "../form/modelsForms/ContactForm";
import {nanoid} from "nanoid";

const ContactModalForm = ({key,object,objectId,onClose, mode, onCompleted}) => {
    return (
        <Modal
            key={key ?? nanoid()}
            open={mode === "add" || mode === "edit"}
            onCancel={() => onClose(null)}
            footer={null}
            onClose={() => onClose(null)}
            width={"300px"}
             title={"Контакт"}
            styles={{header: {textAlign: "center"} }}
         >
                 {mode === "edit" ? (
                    (object || objectId) && (
                        <ContactForm
                            onCompleted={() =>
                            onClose(null)}
                            initialObject={objectId ? {id: objectId} : null}
                            localObject={object}
                        />
                    )
                ) : (
                    <ContactForm  onCompleted={onCompleted || onClose}/>
                )}
         </Modal>
    );
};

export default ContactModalForm;
