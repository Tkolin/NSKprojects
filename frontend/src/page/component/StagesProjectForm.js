import {StyledFormBig} from "../style/FormStyles";
import {Button, Form, InputNumber, Select, Space} from "antd";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {StyledBlockBig} from "../style/BlockStyles";
import React from "react";

const StagesProjectForm = ({ project, onSave }) => {


    return (
        <StyledBlockBig label={'Этапы'}>
            <StyledFormBig form={formStage}>
                <Form.List name="stageList">
                    {(fields, {add, remove}) => (<>
                        {fields.map(({key, name, ...restField}) => (<Space
                            key={key}
                            style={{
                                display: 'flex',
                                marginBottom: 2,
                                marginTop: 2
                            }}
                            align="baseline"
                        >
                            <Form.Item
                                {...restField}
                                style={{marginBottom: 0, display: 'flex'}}
                                name={[name, 'stage_item']}
                            >
                                <Select
                                    style={{maxWidth: 260, minWidth: 260}}
                                    popupMatchSelectWidth={false}
                                    filterOption={false}
                                    onSearch={(value) => handleAutoCompleteStage(value)} // Передаем введенное значение
                                    onSelect={(value) => handleAutoCompleteStageSelect(value)}
                                    placeholder="Начните ввод..."
                                    allowClear
                                    showSearch
                                >
                                    {dataStages && dataStages.stagesTable && dataStages.stagesTable.stages.map(stage => (
                                        <Select.Option value={stage.id}>{stage.name}</Select.Option>))}
                                    {dataStages && dataStages.stagesTable && dataStages.stagesTable.stages && dataStages.stagesTable.stages.length === 0 && (
                                        <Select.Option value="CREATE_NEW">Создать новый
                                            этап?</Select.Option>)}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                {...restField}
                                style={{marginBottom: 0, display: 'flex'}}
                                name={[name, 'date_range']}
                                rules={[{
                                    required: true, message: 'Missing last name',
                                },]}
                            >
                                <RangePicker
                                    id={{
                                        start: 'date_start_item',
                                        end: 'date_end_item',
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                {...restField}
                                style={{marginBottom: 0, display: 'flex'}}
                                name={[name, 'percent_item']}
                                rules={[{
                                    required: true, message: 'Missing last name',
                                },]}
                            >
                                <InputNumber/>
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(name)}/>
                        </Space>))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block
                                    icon={<PlusOutlined/>}>
                                Добавить элемент
                            </Button>
                        </Form.Item>
                    </>)}
                </Form.List>
            </StyledFormBig>

        </StyledBlockBig>
    );
}
export default StagesProjectForm;