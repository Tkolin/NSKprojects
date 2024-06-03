import {StyledBlockBig, StyledBlockRegular} from "../style/BlockStyles";
import {Modal} from "antd";
import React from "react";
import ContactForm from "../form/modelsForms/ContactForm";
import {nanoid} from "nanoid";
import BikForm from "../form/modelsForms/BikForm";
import PersonForm from "../form/modelsForms/PersonForm";

const PersonModalForm = ({key,object,objectId,onClose, mode}) => {
    return (
        <Modal
            key={key ?? nanoid()}
            open={mode === "add" || mode === "edit"}
            onCancel={() => onClose(null)}
            footer={null}
            onClose={() => onClose(null)}
            width={"1000px"}

        >
            <StyledBlockBig label={"Сотрудник"}>
                {mode === "edit" ? (
                    (object || objectId) && (
                        <PersonForm
                            onCompleted={() =>
                            onClose(null)}
                            initialObject={objectId ? {id: objectId} : null}
                            localObject={object}
                        />
                    )
                ) : (
                    <PersonForm onCompleted={() => onClose(null)}/>
                )}
            </StyledBlockBig>
        </Modal>
    );
};

export default PersonModalForm;
