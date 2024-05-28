import React, {useContext, useEffect, useState} from 'react';
import {useQuery} from '@apollo/client';
import {Button, Col, Form, Row} from 'antd';
import {StyledFormLarge} from '../../../../components/style/FormStyles';
import {NotificationContext} from '../../../../NotificationProvider';
import {
STAGES_QUERY_COMPACT
} from '../../../../graphql/queriesCompact';

import StageItem from "./StageItem";
import { PlusOutlined} from "@ant-design/icons";
import {useProjectStore} from "../Store";
import dayjs from "dayjs";
import StagesListHeader from "./StagesListHeader";
import StagesListFooter from "./StagesListFooter";

const StagesProjectForm = ({onCompleted, onChange, updateStages, actualStages, project }) => {

    // Первичные данные
    const [form] = Form.useForm();

    // Внешняя логика
    const [totalToPercent, setTotalToPercent] = useState(0);
    const [totalToDuration,setTotalToDuration] = useState(0);


    const load = () => {
        form.setFieldsValue({
            stageList: actualStages && Object.values(actualStages)?.map((row) => ({
                ...row,
                stage_id: row?.stage_id ?? null,
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
        <StyledFormLarge layout="vertical" onChange={() => {
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
                            <Col span={24}>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    style={{width: '100%'}}
                                    icon={<PlusOutlined/>}
                                >
                                    Добавить этап
                                </Button>
                            </Col>
                        </Row>

                    </>
                )}
            </Form.List>
        </StyledFormLarge>
    );
};

export default StagesProjectForm;
