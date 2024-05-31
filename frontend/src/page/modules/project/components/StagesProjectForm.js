import React, { useEffect, useState} from 'react';
import {useQuery} from '@apollo/client';
import {Button, Col, Form, Row, Space} from 'antd';
import {
STAGES_QUERY_COMPACT
} from '../../../../graphql/queriesCompact';

import StageItem from "./StageItem";
import { PlusOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import StagesListHeader from "./StagesListHeader";
import StagesListFooter from "./StagesListFooter";
import {StyledButtonGreen} from "../../../../components/style/ButtonStyles";
import TypeProjectModalForm from "../../../../components/modal/TypeProjectModalForm";
import {nanoid} from "nanoid";
import StageModalForm from "../../../../components/modal/StageModalForm";

const StagesProjectForm = ({onCompleted, onChange, updateStages, actualStages, project }) => {

    // Первичные данные
    const [form] = Form.useForm();

    // Внешняя логика
    const [totalToPercent, setTotalToPercent] = useState(0);
    const [totalToDuration,setTotalToDuration] = useState(0);
    const [typeProjectModalStatus, setTypeProjectModalStatus] = useState(null);


    const load = () => {
        form.setFieldsValue({
            stageList: actualStages && Object.values(actualStages)?.map((row) => ({
                ...row,
                date_range: [
                    row?.date_range?.[0] ? dayjs(row?.date_range?.[0]) : null,
                    row?.date_range?.[1] ? dayjs(row?.date_range?.[1]) : null
                ]
            }))

        });
    }
    useEffect(() => {
        load();
    }, [actualStages]);

    const {loading: loadingStages, error: errorStages, data: dataStages} =
        useQuery(STAGES_QUERY_COMPACT);

    const handleChange = () => {
        console.log("stageFormChange", form.getFieldsValue())
        updateStages({...form.getFieldValue("stageList")});
        handleFooterUpdate();
    }
    const handleFooterUpdate = () => {
        const stageList = form.getFieldValue('stageList');
        if (Array.isArray(stageList)) {
            const totalDuration = stageList.reduce((acc, item) => {
                const duration = parseInt(item?.duration_item) || 0;
                return acc + duration;
            }, 0);
            setTotalToDuration(totalDuration);
        }
        if (Array.isArray(stageList)) {
            const totalProcent = stageList.reduce((acc, item) => {
                const procent = item?.percent ?? 0;
                return acc + procent;
            }, 0);
            setTotalToPercent(totalProcent);
        }
    }

    return (
        <Form layout="vertical" onChange={() => {
            handleChange();
        }} form={form}>

            <Form.List name="stageList">
                {(fields, {add, remove}) => (
                    <>
                        <StagesListHeader/>

                        {fields.map(({key, name, ...restField}, index) => (
                            <>
                                <StageItem
                                    form={form}

                                    projectPrice={project?.price ?? 0}
                                    prepayment={project?.prepayment ?? 0}

                                    key={key}
                                    index={index}
                                    value={name}
                                    stagesData={dataStages?.stages?.items}
                                    removeItem={remove}
                                    onChange={handleChange}
                                    isFirst={index === 0}
                                    isLast={index === fields.length - 1}
                                    {...restField}
                                />
                            </>

                        ))}
                        <StagesListFooter
                        project={project}
                        totalToDuration={totalToDuration}
                        totalToPercent={totalToPercent}/>

                        <Row>
                            <Col span={24} >
                                <Space.Compact style={{width: '100%'}}>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        style={{width: '100%'}}
                                        icon={<PlusOutlined/>}
                                    >
                                        Добавить этап к списку
                                    </Button>
                                    <StyledButtonGreen
                                        type="dashed"
                                        onClick={() => setTypeProjectModalStatus("add")}
                                        style={{width: '100%'}}
                                        icon={<PlusOutlined/>}
                                    >
                                        Создать этап
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
    );
};

export default StagesProjectForm;
