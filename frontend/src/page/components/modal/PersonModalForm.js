import {StyledBlockBig} from "../style/BlockStyles";
import {Modal} from "antd";
import React from "react";
import {nanoid} from "nanoid";
import PersonForm from "../form/modelsForms/PersonForm";

const PersonModalForm = ({key,object,objectId,onClose, mode, onCompleted}) => {
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
                    <PersonForm onCompleted={onCompleted || onClose}/>
                )}
            </StyledBlockBig>
        </Modal>
    );
};

export default PersonModalForm;
