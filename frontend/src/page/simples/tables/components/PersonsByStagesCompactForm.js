import React, {useContext, useEffect, useState} from 'react';
import {Button, DatePicker, Form, Input, Space} from 'antd';
import {useLazyQuery, useMutation} from "@apollo/client";
import {NotificationContext} from "../../../../NotificationProvider";
import {UPDATE_EMPLOYEES_TO_TASK} from "../../../../graphql/mutationsTask";
import {EMPLOYEES_TO_TASK_BY_PROJECT_TASK_ID} from "../../../../graphql/queriesByID";
import LoadingSpinnerStyles from "../../../../components/style/LoadingSpinnerStyles";
import {StyledButtonGreen} from "../../../../components/style/ButtonStyles";
import IrdItem from "../../../modules/project/components/IrdItem";
import {PlusOutlined} from "@ant-design/icons";


const BikForm = ({taskId, onCompleted}) => {
    // Первичные данные
    const {openNotification} = useContext(NotificationContext);
    const [form] = Form.useForm();
    const nameModel = 'БИК';
    const [actualObject, setActualObject] = useState();
    const [loadContext, {loading, data}] = useLazyQuery(EMPLOYEES_TO_TASK_BY_PROJECT_TASK_ID, {
        variables: {taskId: taskId},
        onCompleted: (data) => {
            setActualObject(data?.projectTasksExecutors?.items);
            updateForm(data?.projectTasksExecutors?.items)
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при загрузке данных: ${error.message}`);
        },
    });

    // Мутация
    const [mutate, {loading: loadingSave}] = useMutation(UPDATE_EMPLOYEES_TO_TASK, {
        onCompleted: (data) => {
            openNotification('topRight', 'success', `Мутация ${nameModel} выполнена успешно`);
            form.resetFields();
            onCompleted && onCompleted(data?.createBik || data?.updateBik);
        },
        onError: (error) => {
            openNotification('topRight', 'error', `Ошибка при выполнении мутации ${nameModel}: ${error.message}`);
        },
    });

    // Подгрузка при обновлении
    useEffect(() => {
        if (taskId)
            loadContext();
    }, []);

    const updateForm = (data) => {
        if (data) {
            form.resetFields();
            form.setFieldsValue({
                ...data,
            });
        }
    };

    // Завершение
    const handleSubmit = () => {
        //  mutate({ variables: { ...(actualObject ? { id: actualObject.id } : {}), ...form.getFieldsValue() } });
    };
    if (loading || loadingSave) return <LoadingSpinnerStyles/>

    return (
        <div>
            <Form form={form}>
                <Form.List name="irdList">
                    {(fields, {add, remove}) => (
                        <>
                            {fields.map(({key, name, ...restField}, index) => (
                                <Row key={index} gutter={0} style={{marginBottom: 0}}>
                                    <Space.Compact style={{width: "100%"}}>
                                        <Col span={14}>
                                            <Tooltip title="Наименование ИРД">

                                                <Form.Item name={[index, 'IRD']}>

                                                    <CustomAutoComplete
                                                        style={{marginBottom: 0, width: "100%"}}
                                                        placeholder={"Выбор ИРД..."}
                                                        data={irdData}
                                                        onSelect={() => onChange()}
                                                        onChange={() => onChange()}
                                                    />
                                                </Form.Item>
                                            </Tooltip>

                                        </Col>
                                        <Col span={3}>
                                            <Tooltip title="Номер этапа">
                                                <Form.Item
                                                    name={[index, 'stageNumber']}
                                                    style={{marginBottom: 0, width: "100%"}}
                                                >
                                                    <InputNumber max={100}
                                                                 style={{marginBottom: 0, width: "100%"}}
                                                                 min={0} prefix={"№"}/>
                                                </Form.Item>
                                            </Tooltip>
                                        </Col>
                                        <Col span={3}>
                                            <Tooltip title="Номер в приложении">
                                                <Form.Item
                                                    name={[index, 'applicationProject']}
                                                    style={{marginBottom: 0, width: "100%"}}
                                                >
                                                    <InputNumber max={100} min={0}
                                                                 style={{marginBottom: 0, width: "100%"}}
                                                                 prefix={"№"}/>
                                                </Form.Item>
                                            </Tooltip>
                                        </Col>

                                        <Col span={3}>
                                            <Tooltip title="Дата получения">
                                                <Form.Item
                                                    name={[index, 'receivedDate']}
                                                    style={{marginBottom: 0, width: "100%"}}

                                                >
                                                    <DatePicker
                                                        style={{marginBottom: 0, width: "100%"}}
                                                        onChange={() => onChange()}
                                                        status={"warning"}
                                                        placeholder="Получено"/>
                                                </Form.Item>
                                            </Tooltip>
                                        </Col>

                                        <Col span={1}>
                                            <StyledButtonRed icon={<CloseOutlined/>}
                                                             onClick={() => removeItem && removeItem(index)}/>
                                        </Col>
                                    </Space.Compact>
                                </Row>
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
                            </Space.Compact>

                        </>
                    )}
                </Form.List>


            </Form>
        </div>
    );
};

export default BikForm;
