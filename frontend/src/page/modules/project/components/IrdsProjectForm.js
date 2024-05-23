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

const IrdsProjectForm = ({localObject, initialObject, onCompleted}) => {
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

    const {loading: loadingIrds, error: errorIrds, data: dataIrds} =
        useQuery(IRDS_QUERY_COMPACT);
    const handleIrdIdChange = (index, value) => {
        // Получить текущий список stageList
        const irdList = form.getFieldValue("irdList");

        // Обновить конкретный элемент в списке
        const updatedStageList = irdList.map((item, idx) => {
            if (idx === index) {
                return {
                    ...item,
                    ird_id: value
                };
            }
            return item;
        });

        // Установить обновленный список обратно в форму
        form.setFieldValue("irdList", updatedStageList);

        console.log(index, value);
        console.log("Обновленный stageList", form.getFieldsValue());
    };
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

    if (loading || loadingIrds) return <LoadingSpinnerStyles />;

    if (errorIrds ) {
        openNotification('topRight', 'error', 'Ошибка при загрузке данных.');
        return null;
    }

    return (
        <StyledFormLarge layout="vertical" form={form} onFinish={handleFinish}>

            <Form.List name="irdList">
                {(fields, {add, remove}) => (
                    <>
                        {fields.map(({key, name, ...restField}, index) => (
                            <IrdItem
                                key={key}
                                index={index}
                                value={name}
                                irdData={dataIrds?.irds?.items}
                                removeItem={remove}
                                onChangeIrdId={handleIrdIdChange}
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
                                    Добавить ирд
                                </Button>
                            </Col>
                        </Row>
                    </>
                )}
            </Form.List>
            <Button type={"primary"} onClick={() => handleFinish()} icon={<CloudUploadOutlined/>}>Сохранить</Button>
        </StyledFormLarge>
    )
};

export default IrdsProjectForm;
