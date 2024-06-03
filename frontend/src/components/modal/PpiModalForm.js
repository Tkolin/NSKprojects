import {StyledBlockRegular} from "../style/BlockStyles";
import {Modal} from "antd";
import React from "react";
import ContactForm from "../form/modelsForms/ContactForm";
import {nanoid} from "nanoid";
import BikForm from "../form/modelsForms/BikForm";
import PassportPlaceIssuesForm from "../form/modelsForms/PassportPlaceIssuesForm";

const PpiModalForm = ({key,object,objectId,onClose, mode}) => {
    return (
        <Modal
            key={key ?? nanoid()}
            open={mode === "add" || mode === "edit"}
            onCancel={() => onClose(null)}
            footer={null}
            onClose={() => onClose(null)}
            width={"600px"}

        >
            <StyledBlockRegular label={"Место выдачи"}>
                {mode === "edit" ? (
                    (object || objectId) && (
                        <PassportPlaceIssuesForm
                            onCompleted={() =>
                            onClose(null)}
                            initialObject={objectId ? {id: objectId} : null}
                            localObject={object}
                        />
                    )
                ) : (
                    <PassportPlaceIssuesForm onCompleted={() => onClose(null)}/>
                )}
            </StyledBlockRegular>
        </Modal>
    );
};

export default PpiModalForm;
