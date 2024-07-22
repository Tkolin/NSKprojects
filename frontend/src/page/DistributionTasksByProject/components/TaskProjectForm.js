import React, {useContext, useEffect, useState} from 'react';
import {Alert, Button, Col, Divider, Form, InputNumber, Row, Space, Tooltip, Typography} from 'antd';


import {SaveOutlined} from "@ant-design/icons";
import FormItem from "antd/es/form/FormItem";
import {CustomAutoComplete} from "../../components/style/SearchAutoCompleteStyles";
import DateRangePickerComponent from "../../components/DateRangePickerComponent";
import {StyledButtonGreen} from "../../components/style/ButtonStyles";
import {useMutation, useQuery} from "@apollo/client";
import {PERSONS_QUERY_COMPACT} from "../../../graphql/queriesCompact";
import dayjs from "dayjs";

import {NotificationContext} from "../../../NotificationProvider";
import Link from "antd/es/typography/Link";
import {PROJECT_TASKS_DETAIL_UPDATE} from "../../../graphql/mutationsProject";
import {PROJECTS_QUERY} from "../../../graphql/queries";

const {Text} = Typography;

const TaskProjectForm = ({taskToProject, mainTaskToProject, onCompleted, onChange, disabled}) => {
        // Состояния
        const [form] = Form.useForm();
        const {openNotification} = useContext(NotificationContext);
        const [localDisabled, setLocalDisabled] = useState();
        const checkDisabled = () => {
            if (mainTaskToProject)
                setLocalDisabled(true);
            else
                setLocalDisabled(disabled);
        }
        useEffect(() => {
            checkDisabled();
        }, [disabled, mainTaskToProject]);

        // TODO: Вынести при необходимости
        const {
            loading: loadingDelegates, error: errorDelegates, data: personsList
        } = useQuery(PERSONS_QUERY_COMPACT);

        const [updateProjectTasks, {loading: loadingMutationSecond}] = useMutation(PROJECT_TASKS_DETAIL_UPDATE, {
            onCompleted: (data) => {
                if (onChange) {
                    onChange();
                }
                openNotification('topRight', 'success', `Создание новой записи выполнено успешно`);
                onCompleted && onCompleted();
            },
            onError: (error) => {
                openNotification('topRight', 'error', `Ошибка при выполнении создания: ${error.message}`);
            }
        });

        useEffect(() => {
            console.log("personsList", personsList?.persons?.items.map(row => ({
                id: row.id,
                firstname: row.passport.firstname,
                lastname: row.passport.lastname,
                patronymic: row.passport.patronymic,
            })));
        }, [personsList]);
        useEffect(() => {
            console.log("=_-+new setting task: ", taskToProject)
            if (taskToProject) {
                checkDisabled();
                form.resetFields();
                form.setFieldsValue({

                    date_range: {
                        dateStart: taskToProject.date_start ? dayjs(taskToProject.date_start) : null,
                        dateEnd: taskToProject.date_end ? dayjs(taskToProject.date_end) : null,
                        duration: taskToProject.duration ?? null
                    },
                    price: taskToProject.price,
                    executor: taskToProject?.executor ? {
                        selected: taskToProject?.executor?.id,
                        output: taskToProject?.executor?.passport?.lastname ?? null + " " +
                            taskToProject?.executor?.passport?.firstname ?? null + " " + taskToProject?.executor?.passport?.patronymic ?? null,
                    } : null,
                    description: taskToProject.description

                })
            }

        }, [taskToProject]);
        const handleComplete = () => {
            console.log("taskToProject", taskToProject);
            const formData = form.getFieldsValue();

            updateProjectTasks({
                variables: {
                    data: {
                        id: taskToProject.id,
                        description: taskToProject.description,
                        executor_id: formData?.executor?.selected ?? null,
                        price: formData.price,
                        date_start: formData.date_range?.dateStart ? dayjs(formData.date_range.dateStart).format('YYYY-MM-DD') : null,
                        date_end: formData.date_range?.dateEnd ? dayjs(formData.date_range.dateEnd).format('YYYY-MM-DD') : null,
                        duration: formData.date_range?.duration ?? null,
                    }
                }
            })
        };
        if (!taskToProject || loadingDelegates)
            return <Alert message="Выберите задачу" type="info" showIcon />

        return (
            <>
                {mainTaskToProject && (
                    <Alert style={{marginBottom: 10}} message={
                        <Text>У главной задачи уже установлен
                            исполнитель!
                            {localDisabled ? (
                                    <Link onClick={() => setLocalDisabled(false)}> хотите переназначить эту подзадачу? <br/> (нажмите
                                        для
                                        изменения)</Link>
                                ) :
                                (
                                    <Text strong> идёт изменение</Text>
                                )}
                        </Text>
                    } type="warning" showIcon />



                )}


                <Form form={form}
                      labelAlign="left" disabled={localDisabled}>

                    <FormItem name={"date_range"} labelCol={{span: 8}} wrapperCol={{span: 16}}
                              label={"Продолжительность задачи"}>
                        <DateRangePickerComponent/>
                    </FormItem>
                    <Form.Item name="price" labelCol={{span: 8}} wrapperCol={{span: 16}} style={{width: '100%'}}
                               label="Стоимость">
                        <InputNumber suffix={"₽"} style={{width: '100%'}}
                                     formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                     parser={value => `${value}`.replace(/[^0-9]/g, '')}/>
                    </Form.Item>
                    <Form.Item
                        label={"Исполнитель"}
                        name={"executor"}>
                        <CustomAutoComplete
                            typeData={"FIO"}
                            style={{width: "100%", maxWidth: "100%"}}
                            data={personsList?.persons?.items.map(row => ({
                                    id: row.id,
                                    firstname: row.passport.firstname,
                                    lastname: row.passport.lastname,
                                    patronymic: row.passport.patronymic,
                                })
                            )}
                            onChange={() => console.log("1 CustomAutoComplete")}
                        />
                    </Form.Item>


                    <Space style={{justifyContent: "center", width: "100%", marginTop: 10}}>
                        <StyledButtonGreen loading={loadingMutationSecond} onClick={() => handleComplete()}
                                           icon={<SaveOutlined/>}>
                            Сохранить
                        </StyledButtonGreen>
                    </Space>
                </Form>

            </>
        );
    }
;

export default TaskProjectForm;
