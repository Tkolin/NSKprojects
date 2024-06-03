import {Button, Col, Form, Row, Space,} from "antd";
import { PlusOutlined, } from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {useQuery} from "@apollo/client";

import {IRDS_QUERY_COMPACT} from "../../../../graphql/queriesCompact";
import IrdItem from "./IrdItem";
import dayjs from "dayjs";
import StageModalForm from "../../../../components/modal/StageModalForm";
import {StyledButtonGreen} from "../../../../components/style/ButtonStyles";

const IrdsProjectForm = ({localObject, initialObject, onCompleted, updateIrds, actualIrds}) => {
    // Первичные данные
    const [form] = Form.useForm();
    const [typeProjectModalStatus, setTypeProjectModalStatus] = useState(null);

    const load = () => {
        console.log(actualIrds);
        form.setFieldsValue({
            irdList: actualIrds && Object.values(actualIrds)?.map((row) => ({
                ...row,
                receivedDate:  row?.receivedDate ? dayjs(row?.receivedDate) : null,
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
        <Form layout="vertical"
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
                                onChange={handleChange}
                                {...restField}
                            />
                        ))}
                        <Row>
                            <Col span={24} >
                                <Space.Compact style={{width: '100%'}}>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        style={{width: '100%'}}
                                        icon={<PlusOutlined/>}
                                    >
                                        Добавить ИРД к списку
                                    </Button>
                                    <StyledButtonGreen
                                        type="dashed"
                                        onClick={() => setTypeProjectModalStatus("add")}
                                        style={{width: '100%'}}
                                        icon={<PlusOutlined/>}
                                    >
                                        Создать ИРД
                                    </StyledButtonGreen>
                                </Space.Compact>
                            </Col>
                        </Row>
                    </>
                )}
            </Form.List>
            <StageModalForm
                onClose={() => setTypeProjectModalStatus(null)}
                mode={typeProjectModalStatus}/>
        </Form>
    )
};

export default IrdsProjectForm;
