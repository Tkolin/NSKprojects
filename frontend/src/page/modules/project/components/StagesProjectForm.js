import React, {useContext, useEffect, useState} from 'react';
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import {Button, Col, Form, Row, фRow} from 'antd';
import LoadingSpinnerStyles from '../../../../components/style/LoadingSpinnerStyles';
import {StyledFormLarge} from '../../../../components/style/FormStyles';
import {NotificationContext} from '../../../../NotificationProvider';
import {
    PROJECT_STATUSES_QUERY_COMPACT,
    TYPES_PROJECTS_QUERY_COMPACT,
    CONTACTS_QUERY_COMPACT,
    ORGANIZATIONS_QUERY_COMPACT, STAGES_QUERY_COMPACT
} from '../../../../graphql/queriesCompact';
import {
    PROJECTS_QUERY_BY_ID
} from '../../../../graphql/queriesByID';
import {UPDATE_STAGES_TO_PROJECT_MUTATION} from '../../../../graphql/mutationsProject';
import StageItem from "./StageItem";
import {CloudUploadOutlined, PlusOutlined} from "@ant-design/icons";
import {useProjectStore} from "../Store";
import dayjs from "dayjs";

const StagesProjectForm = ({onCompleted, onChange}) => {
    const updateStages = useProjectStore((state) => state.updateStages);
    const actualStages = useProjectStore((state) => state.stages);
    // Первичные данные
    const {openNotification} = useContext(NotificationContext);
    const [form] = Form.useForm();
    const [formLoad, setFormLoad] = useState(false);

    const load = () => {
        console.log(actualStages);
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
        updateStages({...form.getFieldValue("stageList")});
    }

    return (
        <StyledFormLarge layout="vertical" onChange={() => {
            handleChange();
        }} form={form}>

            <Form.List name="stageList">
                {(fields, {add, remove}) => (
                    <>
                        {fields.map(({key, name, ...restField}, index) => (
                            <StageItem
                                form={form}

                                key={key}
                                index={index}
                                value={name}
                                stagesData={dataStages?.stages?.items}
                                removeItem={remove}
                                onChangeExtend={handleChange}
                                isFirst={index === 0}
                                isLast={index === fields.length - 1}
                                {...restField}
                            />
                        ))}
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
