import Reac, {useState} from 'react';
import {Button, Col, Divider, Form, InputNumber, Modal, Row, Select, Space, Tooltip} from 'antd';

import PersonForm from "../../../../components/form/modelsForms/PersonForm";
import TaskForm from "../../../../components/form/modelsForms/TaskForm";
import {
    StyledFormItemSelect,
} from "../../../../components/style/SelectStyles";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {DatePicker} from "antd/lib";
import FormItem from "antd/es/form/FormItem";
import {CustomAutoComplete, CustomAutoCompleteAndCreate} from "../../../../components/style/SearchAutoCompleteStyles";
import DateRangePickerComponent from "../../project/components/DateRangePickerComponent";

const {RangePicker} = DatePicker;

const TaskProjectForm = ({value, onChange, onCompletion, personsList}) => {
    // // Состояния
     const [form] = Form.useForm();
    // const [,] = notification.useNotification();

     const [taskModalStatus, setTaskModalStatus] = useState(null);
     const [personModalStatus, setPersonModalStatus] = useState(false);



    return (
        <>
            <Form form={form}
                  labelCol={{span: 8}}
                  labelAlign="left"
                  wrapperCol={{span: 16}}>

                <FormItem name={"date_range"} label={"Продолжительность"}>
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

                <Form.Item name="price" style={{width: '100%'}} label="Стоимость">
                    <InputNumber suffix={"₽"} style={{width: '100%'}}
                                 formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                 parser={value => `${value}`.replace(/[^0-9]/g, '')}/>
                </Form.Item>
                <Form.Item name="task_id" label="Задача">
                    <CustomAutoCompleteAndCreate
                        //items
                        placeholder="Начните ввод..."/>
                </Form.Item>
                <Form.Item name="inherited_task_ids" label="Наслудует от">
                    <CustomAutoCompleteAndCreate
                        //items
                        placeholder="Начните ввод..."/>
                </Form.Item>


                <Divider>Исполнители: </Divider>
                <Form.List name="executorList" style={{width: '100%'}}>
                    {(fields, {add, remove}) => (<>
                        {fields.map(({key, name, ...restField}) => (
                            <Row
                            key={key}
                            style={{
                                width: '100%', marginBottom: 0, marginTop: 0,
                            }}
                            align="baseline"
                        >
                                <Col span={12} style={{background: "red"}}>
                                         <Form.Item style={{width: "100%"}}>
                                            <CustomAutoComplete
                                                style={{width: "100%"}}
                                                items={personsList}
                                            />
                                        </Form.Item>
                                 </Col>

                                <Col span={3}>
                                    <Tooltip title="Стоимость">
                                        <Form.Item
                                            {...restField}
                                            style={{width: "100%"}}
                                            name={[name, 'price_item']}>
                                            <InputNumber
                                                //onChange={handleChangeItemDuration}
                                                size={"middle"}
                                                min={1}
                                                style={{width: "100%"}}
                                            />
                                        </Form.Item>
                                    </Tooltip>
                                </Col>
                                <Col span={6}>
                                    <Tooltip title="Продолжительность">
                                        <Form.Item
                                            {...restField}
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
                                </Col>
                                <Col span={3}>
                                    <MinusCircleOutlined style={{width: "100%"}} onClick={() => remove(name)}/>
                                </Col>
                        </Row>))}
                        <Divider style={{margin: '20px 0'}}/>

                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block
                                    icon={<PlusOutlined/>}>
                                Добавить элемент
                            </Button>
                        </Form.Item>
                    </>)}
                </Form.List>
            </Form>

        </>
    );
};

export default TaskProjectForm;
