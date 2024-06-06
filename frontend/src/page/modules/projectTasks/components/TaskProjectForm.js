import Reac, {useEffect, useState} from 'react';
import {Button, Col, Divider, Form, Input, InputNumber, Modal, Row, Select, Space, Tooltip} from 'antd';

import PersonForm from "../../../../components/form/modelsForms/PersonForm";
import TaskForm from "../../../../components/form/modelsForms/TaskForm";
import {
    StyledFormItemSelect,
} from "../../../../components/style/SelectStyles";
import {CloseOutlined, MinusCircleOutlined, MinusSquareOutlined, PlusOutlined} from "@ant-design/icons";
import {DatePicker} from "antd/lib";
import FormItem from "antd/es/form/FormItem";
import {CustomAutoComplete, CustomAutoCompleteAndCreate} from "../../../../components/style/SearchAutoCompleteStyles";
import DateRangePickerComponent from "../../project/components/DateRangePickerComponent";
import styled, {css} from "styled-components";
import {StyledButtonRed} from "../../../../components/style/ButtonStyles";
import {useQuery} from "@apollo/client";
import {CONTACTS_QUERY_COMPACT, PERSONS_QUERY_COMPACT} from "../../../../graphql/queriesCompact";
import React from "react";

const {RangePicker} = DatePicker;

const TaskProjectForm = ({value, onChange, onCompletion, tasks}) => {
    // Состояния
    const [form] = Form.useForm();
    const {
        loading: loadingDelegates, error: errorDelegates, data: personsList
    } = useQuery(PERSONS_QUERY_COMPACT);
    useEffect(() => {
        console.log("personsList", personsList?.
        persons?.items.map(row=>({
            id: row.id,
            firstname: row.passport.firstname,
            lastname: row.passport.lastname,
            patronymic: row.passport.patronymic,
        })));
    }, [personsList]);
    return (
        <>
            <Form form={form}
                  labelAlign="left">

                <FormItem name={"date_range"} labelCol={{span: 8}} wrapperCol={{span: 16}} label={"Продолжительность задачи"}>
                    <RangePicker
                        style={{width: "100%"}}
                        // minDate={actualityProjectData.date_signing}
                        // maxDate={actualityProjectData.date_end}
                        // onChange={handleDateStageRebuild}
                        id={{
                            start: 'date_start_item',
                            end: 'date_end_item',
                        }}
                    />
                </FormItem>

                <Form.Item name="price" labelCol={{span: 8}} wrapperCol={{span: 16}} style={{width: '100%'}} label="Стоимость">
                    <InputNumber suffix={"₽"} style={{width: '100%'}}
                                 formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                 parser={value => `${value}`.replace(/[^0-9]/g, '')}/>
                </Form.Item>


                <Divider>Исполнители: </Divider>
                <Form.List name="executorList" style={{width: '100%'}}>
                    {(fields, {add, remove}) => (<>
                        {fields.map(({key, name, ...restField}) => (
                            <Row
                                key={key}
                                gutter={0}
                                style={{
                                    width: '100%', marginBottom: 0, marginTop: 0
                                }}
                            ><Space.Compact>
                                <Col span={8}>
                                    <Form.Item
                                        name={[name, 'person']}>

                                        <CustomAutoComplete
                                            typeData={"FIO"}
                                            style={{width: "100%", maxWidth: "100%"}}
                                            data={personsList?.
                                            persons?.items.map(row=>({
                                                id: row.id,
                                                firstname: row.passport.firstname,
                                                lastname: row.passport.lastname,
                                                patronymic: row.passport.patronymic,
                                                 })
                                            )}
                                            onChange={() => console.log("1 CustomAutoComplete")}

                                        />
                                    </Form.Item>
                                </Col> <Col span={6}>

                                <Tooltip title="Стоимость">
                                    <Form.Item
                                        name={[name, 'price_item']}>
                                        <InputNumber
                                            //onChange={handleChangeItemDuration}
                                            min={1}
                                            style={{width: "100%"}}
                                        />
                                    </Form.Item>
                                </Tooltip>
                            </Col> <Col span={9}>

                                <Tooltip title="Продолжительность">
                                    <Form.Item

                                        style={{width: "100%"}}
                                        name={[name, 'duration_item']}>
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
                                <StyledButtonRed icon={<CloseOutlined />} onClick={() => remove(name)}/>
                            </Col></Space.Compact>
                            </Row>
                        ))}
                        <Divider style={{margin: '20px 0'}}/>

                        <Button type="dashed" onClick={() => add()} block
                                icon={<PlusOutlined/>}>
                            Добавить элемент
                        </Button>
                    </>)}
                </Form.List>
            </Form>

        </>
    );
};

export default TaskProjectForm;
