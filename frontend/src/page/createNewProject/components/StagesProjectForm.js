import React, {useEffect, useState} from 'react';
import {useQuery} from '@apollo/client';
import {Button,  Divider, Form,  Space} from 'antd';
import {
    STAGES_QUERY_COMPACT
} from '../../../graphql/queriesCompact';

import StageItem from "./StageItem";
import {PlusOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import StagesListHeader from "./StagesListHeader";
import StagesListFooter from "./StagesListFooter";
import {StyledButtonGreen} from "../../components/style/ButtonStyles";
import StageModalForm from "../../components/modal/StageModalForm";

const StagesProjectForm = ({onCompleted, onChange, updateStages, actualStages, project}) => {

    // Первичные данные

    const [form] = Form.useForm();

    // Внешняя логика
    const [totalToPercent, setTotalToPercent] = useState(0);
    const [totalToDuration, setTotalToDuration] = useState(0);
    const [stageModalStatus, setStageModalStatus] = useState(null);


    const load = () => {
        console.log("load", actualStages);
        form.setFieldsValue({
            stageList: actualStages && Object.values(actualStages)?.map((row) => ({
                ...row,
                date_range: {
                    dateStart: row?.date_range?.dateStart ? dayjs(row?.date_range?.dateStart) : null,
                    dateEnd: row?.date_range?.dateEnd ? dayjs(row?.date_range?.dateEnd) : null,
                    duration: row?.date_range?.duration ?? null
                }
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
    useEffect(() => {
        console.log("project", project);
    }, [project]);
    return (
        <Form layout="vertical" onChange={() => {
            handleChange();
        }} form={form}>
            <Divider style={{margin: 3}}/>
            <StyledButtonGreen
                type="dashed"
                size={"small"}
                onClick={() => setStageModalStatus("add")}
                icon={<PlusOutlined/>}
            >
                Создать этап
            </StyledButtonGreen>
            <Divider style={{margin: 10, marginTop: 3}}/>

            <Form.List name="stageList">
                {(fields, {add, remove}) => (
                    <>
                        <StagesListHeader/>

                        {fields.map(({key, name, ...restField}, index) => (
                            <>
                                <StageItem
                                    {...restField}

                                    form={form}
                                    durationSetting={{
                                        minDate: project?.date_range?.dateStart,
                                        maxDate: project?.date_range?.dateEnd
                                    }}
                                    projectPrice={project?.price ?? 0}
                                    prepayment={project?.prepayment ?? 0}

                                    key={key}
                                    index={index}
                                    value={name}
                                    stagesData={dataStages?.stages?.items}
                                    removeItem={(value) => {
                                        remove(value);
                                        handleChange();
                                    }}
                                    onChange={(value) => {
                                        console.log("stageList", form.getFieldValue("stageList"));
                                        handleChange();
                                    }}
                                    isFirst={index === 0}
                                    isLast={index === fields.length - 1}
                                />
                            </>

                        ))}
                        <StagesListFooter
                            project={project}
                            totalToDuration={totalToDuration}
                            totalToPercent={totalToPercent}/>


                        <Space.Compact style={{width: '100%', marginTop: 10, marginBottom: 10}}>
                            <Button
                                type="dashed"
                                onClick={() => add()}
                                style={{width: '100%'}}
                                icon={<PlusOutlined/>}
                            >
                                Добавить этап к списку
                            </Button>

                        </Space.Compact>


                    </>
                )}
            </Form.List>
            <StageModalForm
                onClose={() => setStageModalStatus(null)}
                mode={stageModalStatus}/>
        </Form>
    );
};

export default StagesProjectForm;
