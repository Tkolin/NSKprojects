import {StyledBlockRegular} from "../style/BlockStyles";
import {Modal} from "antd";
import React, {useEffect} from "react";
import TypeProjectForm from "../form/modelsForms/TypeProjectForm";
import {nanoid} from "nanoid";

const TypeProjectModalForm = ({key,object,onClose, mode, onCompleted, localObject}) => {
    useEffect(() => {
        console.log("modela localObject", localObject);
    }, [localObject]);

    return (
        <Modal
            key={key ?? nanoid()}
            open={mode === "add" || mode === "edit"}
            onCancel={() => onClose(null)}
            footer={null}
            onClose={() => onClose(null)}
            width={"600px"}
        >
            <StyledBlockRegular label={"Тип документации"}>
                {mode === "edit" ? (
                    (object) && (
                        <TypeProjectForm onCompleted={() => onClose(null)}
                                          initialObject={object}/>
                    )
                    ||
                    (localObject) && (
                        <TypeProjectForm onCompleted={onCompleted || onClose}
                                         localObject={localObject}/>
                    )
                ) : (
                    <TypeProjectForm  onCompleted={onCompleted || onClose}/>
                )}
            </StyledBlockRegular>
        </Modal>
    );
};

export default TypeProjectModalForm;
