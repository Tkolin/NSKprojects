import {Button, Col, Form, Row, Space,} from "antd";
import { PlusOutlined, } from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {useQuery} from "@apollo/client";

import {IRDS_QUERY_COMPACT} from "../../../../graphql/queriesCompact";
import IrdItem from "./IrdItem";
import dayjs from "dayjs";
import StageModalForm from "../../../../components/modal/StageModalForm";
import {StyledButtonGreen} from "../../../../components/style/ButtonStyles";
import IrdModalForm from "../../../../components/modal/IrdModalForm";

const IrdsProjectForm = ({localObject, initialObject, onCompleted, updateIrds, actualIrds}) => {
    // Первичные данные
    const [form] = Form.useForm();
    const [irdModalStatus, setIrdModalStatus] = useState(null);

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

                                <Space.Compact style={{width: '100%', marginBottom: 10, marginTop: 10}}>
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
                                        onClick={() => setIrdModalStatus("add")}
                                        style={{width: '30%'}}
                                        icon={<PlusOutlined/>}
                                    >
                                        Создать ИРД
                                    </StyledButtonGreen>
                                </Space.Compact>

                    </>
                )}
            </Form.List>
            <IrdModalForm
                onClose={() => setIrdModalStatus(null)}
                mode={irdModalStatus}/>
        </Form>
    )
};

export default IrdsProjectForm;
