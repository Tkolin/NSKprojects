import React, {useEffect} from 'react';
import {Button, Col, Divider, Form, InputNumber, Row, Space, Tooltip} from 'antd';


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
    UPDATE_EXECUTORS_TO_TASKS,
    UPDATE_TASK_TO_PROJECT_MUTATION
} from "../../../graphql/mutationsTask";
import TextArea from "antd/es/input/TextArea";

const {RangePicker} = DatePicker;

const TaskProjectForm = ({actualTaskToProject, onCompletion}) => {
    // Состояния
    const [form] = Form.useForm();

    // TODO: Вынести при необходимости
    const {
        loading: loadingDelegates, error: errorDelegates, data: personsList
    } = useQuery(PERSONS_QUERY_COMPACT);
    const [updateProjectTasksExecutors, {loading: loadingMutation}] = useMutation(UPDATE_EXECUTORS_TO_TASKS, {
        onCompleted: (data) => {
            console.log("UPDATE_EXECUTORS_TO_TASKS", data);
        },
        onError: (error) => {
            console.log("UPDATE_EXECUTORS_TO_TASKS", error);
        }
    });
    const [updateProjectTasks, {loading: loadingMutationSecond}] = useMutation(UPDATE_TASK_TO_PROJECT_MUTATION, {
        onCompleted: (data) => {
            console.log("UPDATE_TASK_TO_PROJECT_MUTATION", data);
        },
        onError: (error) => {
            console.log("UPDATE_TASK_TO_PROJECT_MUTATION", error);
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
        console.log("useEffect actualTaskToProject", actualTaskToProject)
        if (actualTaskToProject) {
            form.resetFields();
            form.setFieldsValue({

                date_range: {
                    dateStart: actualTaskToProject.date_start ? dayjs(actualTaskToProject.date_start) : null,
                    dateEnd: actualTaskToProject.date_end ? dayjs(actualTaskToProject.date_end) : null,
                    duration: actualTaskToProject.duration ?? null
                },
                price: actualTaskToProject.price,
                executors: actualTaskToProject?.executors?.map((row) => (
                    {
                        ...row,
                        person: {
                            selected: row?.executor?.id,
                            output: row?.executor?.passport?.lastname ?? null + " " + row?.executor?.passport?.firstname  ?? null + " " + row?.executor?.passport?.patronymic  ?? null,
                        },
                        duration: {
                            dateStart: row.date_start ? dayjs(row.date_start) : null,
                            dateEnd: row.date_end ? dayjs(row.date_start) : null,
                            duration: row.duration ?? null,
                        },
                    })),
                description: actualTaskToProject.description

            })
        }
    }, [actualTaskToProject]);
    const handleComplete = () => {
        const formData = form.getFieldsValue();
        console.log("upt 1 ", {
            data: [{
                ...actualTaskToProject,
                price: formData.price,
                date_start: formData.date_range?.dateStart ? dayjs(formData.date_range.dateStart).format('YYYY-MM-DD') : null,
                date_end: formData.date_range?.dateEnd ? dayjs(formData.date_range.dateEnd).format('YYYY-MM-DD') : null,
                duration: formData.date_range?.duration ?? null,
            }]
        })
        console.log("upt 2 ", {
            data: formData.executors.map(row => ({
                project_tasks_id: actualTaskToProject.id,
                executor_id: row?.person?.selected ?? null,
                date_start: row.date_range?.dateStart ? dayjs(formData.date_range.dateStart).format('YYYY-MM-DD') : null,
                date_end: row.date_range?.dateEnd ? dayjs(formData.date_range.dateEnd).format('YYYY-MM-DD') : null,
                duration: row.date_range?.duration ?? null,
                price: row.price ?? null,
            }))
        })
        updateProjectTasks({
            variables: {
                data: [{

                    id: actualTaskToProject.id,
                    projectId: actualTaskToProject.projectId,
                    inherited_task_ids: actualTaskToProject.inherited_task_ids,
                    task_id: actualTaskToProject.task_id,

                    description: actualTaskToProject.description,
                    stage_number: actualTaskToProject.stage_number,

                    price: formData.price,
                    date_start: formData.date_range?.dateStart ? dayjs(formData.date_range.dateStart).format('YYYY-MM-DD') : null,
                    date_end: formData.date_range?.dateEnd ? dayjs(formData.date_range.dateEnd).format('YYYY-MM-DD') : null,
                    duration: formData.date_range?.duration ?? null,
                }]
            }
        })
        updateProjectTasksExecutors({
            variables: {
                data: formData?.executors?.map(row => ({
                    project_tasks_id: actualTaskToProject.id,
                    executor_id: row?.person?.selected,
                    date_start: row.date_range?.dateStart ? dayjs(formData.date_range.dateStart).format('YYYY-MM-DD') : null,
                    date_end: row.date_range?.dateEnd ? dayjs(formData.date_range.dateEnd).format('YYYY-MM-DD') : null,
                    duration: row.date_range?.duration ?? null,
                    price: row.price ?? null,
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


                <Divider>Исполнители: </Divider>
                <Form.List name="executors" style={{width: '100%'}}>
                    {(fields, {add, remove}) => (<>
                        {fields.map(({key, name, ...restField}) => (
                            <>
                                <Row
                                    key={key}
                                    gutter={0}
                                    style={{
                                        width: '100%', marginBottom: 0, marginTop: 0
                                    }}
                                ><Space.Compact>
                                    <Col span={10}>
                                        <Form.Item
                                            name={[name, 'person']}>

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
                                    </Col> <Col span={5}>

                                    <Tooltip title="Стоимость">
                                        <Form.Item
                                            name={[name, 'price']}>
                                            <InputNumber
                                                //onChange={handleChangeItemDuration}
                                                min={1}
                                                style={{width: "100%"}}
                                            />
                                        </Form.Item>
                                    </Tooltip>
                                </Col> <Col span={10}>

                                    <Tooltip title="Продолжительность">
                                        <Form.Item

                                            style={{width: "100%"}}
                                            name={[name, 'duration']}>
                                            <DateRangePickerComponent
                                                //onChange={handleChangeItemDuration}
                                                size={"middle"}
                                                min={1}
                                                max={325}
                                                style={{width: "100%"}}
                                            />
                                        </Form.Item>
                                    </Tooltip>
                                </Col> <Col span={1}>
                                    <StyledButtonRed icon={<CloseOutlined/>} onClick={() => remove(name)}/>
                                </Col></Space.Compact>
                                </Row>
                                <Row gutter={0}
                                     style={{
                                         width: '100%', marginBottom: 0, marginTop: 0
                                     }}>
                                    <Col span={24}>
                                        <Tooltip title="Описание задачи">
                                            <Form.Item

                                                style={{width: "100%"}}
                                                name={[name, 'description']}>
                                                <TextArea rows={4} placeholder="Описание задачи"/>
                                            </Form.Item>

                                        </Tooltip>

                                    </Col>
                                </Row>
                                <Divider style={{margin: 2, marginBottom: 10}}/>
                            </>
                        ))}
                        <Divider style={{margin: '20px 0'}}/>

                        <Button type="dashed" onClick={() => add()} block
                                icon={<PlusOutlined/>}>
                            Добавить элемент
                        </Button>

                        <Button onClick={() => console.log(form.getFieldsValue())}
                                icon={<PlusOutlined/>}>
                            Извлеч
                        </Button>


                    </>)}
                </Form.List>
                <div style={{alignContent: "center", width: "100%"}}>
                    <StyledButtonGreen s onClick={() => handleComplete()}
                                       icon={<PlusOutlined/>}>
                        Сохранить
                    </StyledButtonGreen>
                </div>
            </Form>

        </>
    );
};

export default TaskProjectForm;
