import {StyledFormBig, StyledFormLarge} from "../../../../components/style/FormStyles";
import {Button, Col, Form, InputNumber, Modal, notification, Row, Select, Space, Tooltip} from "antd";
import {DatePicker} from "antd/lib";
import {CloudUploadOutlined, MinusCircleOutlined, PlusOutlined, SaveOutlined} from "@ant-design/icons";
import React, {useContext, useEffect, useState} from "react";
import {useLazyQuery, useMutation, useQuery} from "@apollo/client";
import {
    UPDATE_IRDS_TO_PROJECT_MUTATION,
    UPDATE_PROJECT_MUTATION,
    UPDATE_STAGES_TO_PROJECT_MUTATION
} from "../../../../graphql/mutationsProject";
import {IRDS_QUERY, PROJECTS_QUERY, STAGES_QUERY, TEMPLATE_IRDS_TYPE_PROJECTS_QUERY} from "../../../../graphql/queries";
import {ADD_IRD_MUTATION} from "../../../../graphql/mutationsIrd";
import LoadingSpinnerStyles from "../../../../components/style/LoadingSpinnerStyles";
import {StyledButtonGreen} from "../../../../components/style/ButtonStyles";
import IrdForm from "../../../../components/form/modelsForms/IrdForm";
import {NotificationContext} from "../../../../NotificationProvider";
import {PROJECTS_QUERY_BY_ID} from "../../../../graphql/queriesByID";
import {IRDS_QUERY_COMPACT, STAGES_QUERY_COMPACT} from "../../../../graphql/queriesCompact";
import StageItem from "./StageItem";
import IrdItem from "./IrdItem";
import {useProjectStore} from "../Store";
import dayjs from "dayjs";

const IrdsProjectForm = ({localObject, initialObject, onCompleted}) => {
    const updateIrds = useProjectStore((state) => state.updateIrds);
    const actualIrds = useProjectStore((state) => state.irds);
    // Первичные данные
    const {openNotification} = useContext(NotificationContext);
    const [form] = Form.useForm();
    const [formLoad, setFormLoad] = useState(false);

    const load = () => {
        console.log(actualIrds);
        form.setFieldsValue({
            irdList: actualIrds && Object.values(actualIrds)?.map((row) => ({
                ...row,
                ird_id: row.ird_id,
                date_complite_item:  row?.date_complite_item ? dayjs(row?.date_complite_item) : null,
            }))

        });
    }
    useEffect(() => {
        load();
    }, [actualIrds]);

    const {loading: loadingIrds, error: errorIrds, data: dataIrds} =
        useQuery(IRDS_QUERY_COMPACT);

    const handleChange = () => {
        updateIrds({...form.getFieldValue("irdList")});
    }

    return (
        <StyledFormLarge layout="vertical"
                         onChange={() => {
                             handleChange();
                         }}
                         form={form}>

            <Form.List name="irdList">
                {(fields, {add, remove}) => (
                    <>
                        {fields.map(({key, name, ...restField}, index) => (
                            <IrdItem
                                form={form}
                                key={key}
                                index={index}
                                value={name}
                                irdData={dataIrds?.irds?.items}
                                removeItem={remove}
                                onChangeExtend={handleChange}
                                {...restField}
                            />
                        ))}
                        <Row>
                            <Col span={24}>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    style={{width: '100%'}}
                                    icon={<PlusOutlined />}
                                >
                                    Добавить ирд
                                </Button>
                            </Col>
                        </Row>
                    </>
                )}
            </Form.List>
        </StyledFormLarge>
    )
};

export default IrdsProjectForm;
