import {Button, Col, Form,  Row, } from "antd";
import { PlusOutlined, } from "@ant-design/icons";
import React, { useEffect} from "react";
import {useQuery} from "@apollo/client";

import {IRDS_QUERY_COMPACT} from "../../../../graphql/queriesCompact";
import IrdItem from "./IrdItem";
import dayjs from "dayjs";

const IrdsProjectForm = ({localObject, initialObject, onCompleted, updateIrds, actualIrds}) => {
    // Первичные данные
    const [form] = Form.useForm();

    const load = () => {
        console.log(actualIrds);
        form.setFieldsValue({
            irdList: actualIrds && Object.values(actualIrds)?.map((row) => ({
                ...row,
                ird_id: row.ird_id,
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
        </Form>
    )
};

export default IrdsProjectForm;
