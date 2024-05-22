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

const StagesProjectForm = ({localObject, initialObject, onCompleted}) => {
    const {openNotification} = useContext(NotificationContext);
    const [form] = Form.useForm();
    const nameModel = 'Этапы на проеselectorкте';
    const [actualObject, setActualObject] = useState(localObject ?? (initialObject ?? null));
    const [loadContext, {loading, data}] = useLazyQuery(PROJECTS_QUERY_BY_ID, {
        variables: {projectId: initialObject?.id ?? null},
        onCompleted: (data) => {
            setActualObject(data?.projects?.items[0]);
            updateForm(data?.projects?.items[0]);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при загрузке данных: ${error.message}`);
        },
    });

    const [mutate] = useMutation(UPDATE_STAGES_TO_PROJECT_MUTATION, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Создание новой записи в таблице ${nameModel} выполнено успешно`);
            form.resetFields();
            onCompleted && onCompleted(data);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при выполнении создания ${nameModel}: ${error.message}`);
        },
    });

    useEffect(() => {
        if (initialObject?.id) {
            loadContext();
        }
    }, [initialObject]);

    const updateForm = (data) => {
        if (data) {
            form.resetFields();
            form.setFieldsValue({
                stageList: data.project_stages,
            });
        }
    };

    const {loading: loadingStages, error: errorStages, data: dataStages} =
        useQuery(STAGES_QUERY_COMPACT, {
            notifyOnNetworkStatusChange: true,
        });


    if (loading || loadingStages) return <LoadingSpinnerStyles />;

    if (errorStages ) {
        openNotification('topRight', 'error', 'Ошибка при загрузке данных.');
        return null;
    }

    const handleFinish = (values) => {
        console.log(form.getFieldsValue());
        // mutate({
        //     variables: {
        //         input: {
        //             id: actualObject.id,
        //             project_stages: values.stageList.map((stage, index) => ({
        //                 ...stage,
        //                 start_date: stage.date_range ? stage.date_range[0].toISOString() : null,
        //                 end_date: stage.date_range ? stage.date_range[1].toISOString() : null,
        //             })),
        //         },
        //     },
        // });
    };
    const handleStageIdChange = (index, value) => {
        // Получить текущий список stageList
        const stageList = form.getFieldValue("stageList");

        // Обновить конкретный элемент в списке
        const updatedStageList = stageList.map((item, idx) => {
            if (idx === index) {
                return {
                    ...item,
                    stage_id: value
                };
            }
            return item;
        });

        // Установить обновленный список обратно в форму
        form.setFieldValue("stageList", updatedStageList);

        console.log(index, value);
        console.log("Обновленный stageList", form.getFieldsValue());
    };
    return (
        <StyledFormLarge layout="vertical" form={form} onFinish={handleFinish}>

            <Form.List name="stageList">
                {(fields, {add, remove}) => (
                    <>
                        {fields.map(({key, name, ...restField}, index) => (
                            <StageItem
                                key={key}
                                index={index}
                                value={name}
                                stagesData={dataStages?.stages?.items}
                                removeItem={remove}
                                onChangeStageId={handleStageIdChange}
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
                                    icon={<PlusOutlined />}
                                >
                                    Добавить этап
                                </Button>
                            </Col>
                        </Row>
                    </>
                )}
            </Form.List>
            <Button type={"primary"} onClick={() => handleFinish()} icon={<CloudUploadOutlined/>}>Сохранить</Button>
        </StyledFormLarge>
    );
};

export default StagesProjectForm;
