import React, {useContext, useEffect, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import {Button, Form, Space} from 'antd';
import {
    STAGES_QUERY_COMPACT
} from '../../graphql/queriesCompact';

import StageItem from "./components/StageItem";
import {PlusOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import StagesListHeader from "./components/StagesListHeader";
import StagesListFooter from "./components/StagesListFooter";
import {StyledButtonGreen} from "../components/style/ButtonStyles";
import StageModalForm from "../components/modal/StageModalForm";
import {
    rebuildStagesToQuery
} from "../components/script/rebuildData/ProjectRebuilderQuery";
import {PROJECT_STAGE_SYNC_MUTATION} from "../../graphql/mutationsProject";
import {NotificationContext} from "../../NotificationProvider";

const StageToProjectForm = ({onCompleted, project}) => {

    // Первичные данные

    const [form] = Form.useForm();

    // Внешняя логика
    const [totalToPercent, setTotalToPercent] = useState(0);
    const [totalToDuration, setTotalToDuration] = useState(0);
    const [stageModalStatus, setStageModalStatus] = useState(null);
    const [isChangeStageNumber, setIsChangeStageNumber] = useState(true);
    const {openNotification} = useContext(NotificationContext);

    const [mutateStage] = useMutation(PROJECT_STAGE_SYNC_MUTATION, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Создание новой записи в таблице  выполнено успешно`);
            console.log("upd data data data ", data);
            onCompleted && onCompleted();
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при выполнении создания этапа : ${error.message}`);
        },
    });
    const load = () => {
        console.log("load", project.project_stages);
        if (project.project_stages) {
            let stageList = project.project_stages && Object.values(project.project_stages)
                .map((row) => ({
                    ...row,
                    date_range: {
                        dateStart: row?.date_start ? dayjs(row?.date_start) : null,
                        dateEnd: row?.date_end ? dayjs(row?.date_end) : null,
                        duration: row?.duration ?? null
                    },
                    stage: {selected: row?.stage?.id, output: row?.stage?.name},
                }));

            if (isChangeStageNumber) {
                console.log("s");
                stageList = stageList.sort((a, b) => a?.number - b?.number);
            }

            form.setFieldsValue({stageList});
        }
    };

    useEffect(() => {
        project && load();
    }, [project]);

    const {loading: loadingStages, error: errorStages, data: dataStages} =
        useQuery(STAGES_QUERY_COMPACT);

    const handleChange = () => {
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
    const moveItem = (index, newIndex) => {
        const stageList = form.getFieldValue('stageList');
        if (newIndex < 0 || newIndex >= stageList.length) return;

        const [movedItem] = stageList.splice(index, 1);
        stageList.splice(newIndex, 0, movedItem);

        form.setFieldsValue({stageList});

        setIsChangeStageNumber(false);

        handleChange();
    }
    const handleSave = () => {
        mutateStage({variables: {data: rebuildStagesToQuery(form.getFieldValue("stageList"), project.id)}});
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
                                    {...restField}
                                    moveItem={moveItem}
                                    form={form}
                                    durationSetting={{
                                        minDate: project?.date_range?.dateStart,
                                        maxDate: project?.date_range?.dateEnd
                                    }}
                                    projectPrice={project?.price ?? 0}
                                    prepayment={project?.prepayment ?? 0}
                                    setStageModalStatus={setStageModalStatus}
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
                            totalToPercent={totalToPercent} freeCol={
                            <Button
                                type="primary"
                                size={"small"}
                                onClick={() => add()}
                                style={{width: '100%'}}
                                icon={<PlusOutlined/>}
                            >
                                Добавить этап к списку
                            </Button>


                        }/>



                        <Space style={{ justifyContent: "center", width: "100%"}}>
                            <StyledButtonGreen loading={loading} onClick={() => handleSave()}>Сохранить</StyledButtonGreen>
                        </Space>
                    </>
                )}
            </Form.List>
            <StageModalForm
                onClose={() => setStageModalStatus(null)}
                onCompleted={(value)=> {
                    const newRow = [...form.getFieldValue("stageList")];
                    newRow[stageModalStatus?.key] = {stage: {selected: value.id, output: value.name}};
                    form.setFieldValue("stageList",newRow);
                    setStageModalStatus(null);
                    //console.log(value)
                }}
                mode={stageModalStatus?.mode}/>
        </Form>
    );
};

export default StageToProjectForm;
