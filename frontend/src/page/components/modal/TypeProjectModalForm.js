import {StyledBlockRegular} from "../style/BlockStyles";
import {Divider, Modal} from "antd";
import React, {useEffect} from "react";
import TypeProjectForm from "../form/modelsForms/TypeProjectForm";
import {nanoid} from "nanoid";

const TypeProjectModalForm = ({key,object,onClose, mode, onCompleted, localObject}) => {

    return (
        <Modal
            key={key ?? nanoid()}
            open={mode === "add" || mode === "edit"}
            onCancel={() => onClose(null)}
            footer={null}
            onClose={() => onClose(null)}
            width={"600px"}
        >
            <Divider> Тип документации </Divider>

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
         </Modal>
    );
};

export default TypeProjectModalForm;
