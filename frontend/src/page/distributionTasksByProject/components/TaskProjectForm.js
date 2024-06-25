import React, {useContext, useEffect, useState} from 'react';
import {Button, Col, Divider, Form, InputNumber, Row, Space, Tooltip, Typography} from 'antd';


import {CloseOutlined, PlusOutlined} from "@ant-design/icons";
import {DatePicker} from "antd/lib";
import FormItem from "antd/es/form/FormItem";
import {CustomAutoComplete} from "../../components/style/SearchAutoCompleteStyles";
import DateRangePickerComponent from "../../createNewProject/components/DateRangePickerComponent";
import {StyledButtonGreen, StyledButtonRed} from "../../components/style/ButtonStyles";
import {useMutation, useQuery} from "@apollo/client";
import {PERSONS_QUERY_COMPACT} from "../../../graphql/queriesCompact";
import LoadingSpinnerStyles from "../../components/style/LoadingSpinnerStyles";
import dayjs from "dayjs";
import {
    UPDATE_TASK_TO_PROJECT_MUTATION
} from "../../../graphql/mutationsTask";
import {NotificationContext} from "../../../NotificationProvider";

const {Text} = Typography;

const TaskProjectForm = ({actualTaskToProject, onCompletion, onChange}) => {
    // Состояния
    const [form] = Form.useForm();
    const [multipleTasks, setMultipleTasks] = useState(false);
    const {openNotification} = useContext(NotificationContext);


    // TODO: Вынести при необходимости
    const {
        loading: loadingDelegates, error: errorDelegates, data: personsList
    } = useQuery(PERSONS_QUERY_COMPACT);

    const [updateProjectTasks, {loading: loadingMutationSecond}] = useMutation(UPDATE_TASK_TO_PROJECT_MUTATION, {
        onCompleted: (data) => {
            if (onChange) {
                onChange();
            }
            openNotification('topRight', 'success', `Создание новой записи выполнено успешно`);
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
        console.log("actualTaskToProject", actualTaskToProject);
        if (actualTaskToProject?.length >= 2)
            setMultipleTasks(true)
        else
            setMultipleTasks(false)
        if (actualTaskToProject?.length === 0)
            form.resetFields();
        if (actualTaskToProject?.length >= 1) {
            form.resetFields();
            form.setFieldsValue({

                date_range: {
                    dateStart: actualTaskToProject[0].date_start ? dayjs(actualTaskToProject[0].date_start) : null,
                    dateEnd: actualTaskToProject[0].date_end ? dayjs(actualTaskToProject[0].date_end) : null,
                    duration: actualTaskToProject[0].duration ?? null
                },
                price: actualTaskToProject[0].price,
                executor: actualTaskToProject[0]?.executor ? {
                    selected: actualTaskToProject[0]?.executor?.id,
                    output: actualTaskToProject[0]?.executor?.passport?.lastname ?? null + " " +
                        actualTaskToProject[0]?.executor?.passport?.firstname ?? null + " " + actualTaskToProject[0]?.executor?.passport?.patronymic ?? null,
                } : null,
                description: actualTaskToProject[0].description

            })
        }

    }, [actualTaskToProject]);
    const handleComplete = () => {
        console.log("actualTaskToProject", actualTaskToProject);
        const formData = form.getFieldsValue();

        updateProjectTasks({
            variables: {
                data: actualTaskToProject?.map((row) => ({

                    id: row.id,


                    description: row.description,
                    project_id: row.project_id,

                    executor_id: formData?.executor?.selected ?? null,
                    price: formData.price,
                    date_start: formData.date_range?.dateStart ? dayjs(formData.date_range.dateStart).format('YYYY-MM-DD') : null,
                    date_end: formData.date_range?.dateEnd ? dayjs(formData.date_range.dateEnd).format('YYYY-MM-DD') : null,
                    duration: formData.date_range?.duration ?? null,
                }))
            }
        })


    }
    if (!actualTaskToProject || loadingDelegates)
        return <LoadingSpinnerStyles/>

    return (
        <>
            <Form form={form}
                  labelAlign="left">
                {multipleTasks && (
                    <Text style={{marginTop: 0, width: "100%"}} type={"danger"}>Групповое изменение задач</Text>)}
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


                <div style={{alignContent: "center", width: "100%"}}>
                    <StyledButtonGreen onClick={() => handleComplete()}
                                       icon={<PlusOutlined/>}>
                        Сохранить
                    </StyledButtonGreen>
                </div>
            </Form>

        </>
    );
};

export default TaskProjectForm;
