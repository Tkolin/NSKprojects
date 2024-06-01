import {StyledBlockRegular} from "../style/BlockStyles";
import {Modal} from "antd";
 import React from "react";
import ContactForm from "../form/modelsForms/ContactForm";
import {nanoid} from "nanoid";

const ContactModalForm = ({key,object,onClose, mode}) => {
    return (
        <Modal
            key={key ?? nanoid()}
            open={mode === "add" || mode === "edit"}
            onCancel={() => onClose(null)}
            footer={null}
            onClose={() => onClose(null)}
        >
            <StyledBlockRegular label={"Контакт"}>
                {mode === "edit" ? (
                    object && (
                        <ContactForm onCompleted={() => onClose(null)}
                                          initialObject={object}/>
                    )
                ) : (
                    <ContactForm onCompleted={() => onClose(null)}/>
                )}
            </StyledBlockRegular>
        </Modal>
    );
};

export default ContactModalForm;
