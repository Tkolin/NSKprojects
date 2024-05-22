import {StyledFormBig} from "../../../../components/style/FormStyles";
import {Button, Form, InputNumber, Modal, notification, Select, Space, Tooltip} from "antd";
import {DatePicker} from "antd/lib";
import {CloudUploadOutlined, MinusCircleOutlined, PlusOutlined, SaveOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {UPDATE_IRDS_TO_PROJECT_MUTATION, UPDATE_PROJECT_MUTATION} from "../../../../graphql/mutationsProject";
import {IRDS_QUERY, PROJECTS_QUERY, STAGES_QUERY, TEMPLATE_IRDS_TYPE_PROJECTS_QUERY} from "../../../../graphql/queries";
import {ADD_IRD_MUTATION} from "../../../../graphql/mutationsIrd";
import LoadingSpinnerStyles from "../../../../components/style/LoadingSpinnerStyles";
import {StyledButtonGreen} from "../../../../components/style/ButtonStyles";
import IrdForm from "../../../../components/form/modelsForms/IrdForm";

const IrdsProjectForm = ({localObject, initialObject, onCompleted}) => {

    return (
        <StyledFormBig form={formIRD} name="dynamic_form_nest_item" autoComplete="off" disabled={disable}>
            <Form.List name="irdList">
                {(fields, {add, remove}) => ()}
            </Form.List>
            <div style={{textAlign: 'center'}}>
                <Space>
                    <StyledButtonGreen style={{marginBottom: 0}} type="dashed" onClick={handleSubmit}>
                        Сохранить проект
                    </StyledButtonGreen>
                </Space>
            </div>
            <Modal
                open={addModalVisible}
                onCancel={() => setAddModalVisible(false)}
                footer={null}
                onClose={handleClose}
            >
                <IrdForm onClose={handleClose}/>
            </Modal>
        </StyledFormBig>
    )
};

export default IrdsProjectForm;
