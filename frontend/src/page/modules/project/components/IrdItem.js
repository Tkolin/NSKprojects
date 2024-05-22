import React, {useEffect, useState} from 'react';
import {Row, Col, Form, InputNumber, Select, Tooltip, DatePicker, Input, Space, Button} from 'antd';
import {
    CaretUpOutlined,
    CaretDownOutlined,
    MinusCircleOutlined,
    PlusOutlined,
    SaveOutlined,
    CloudUploadOutlined
} from '@ant-design/icons';
import moment from 'moment';
import {StyledFormItemAutoComplete} from "../../../../components/style/SearchAutoCompleteStyles";
import {useQuery} from "@apollo/client";
import {STAGES_QUERY_COMPACT, TYPES_PROJECTS_QUERY_COMPACT} from "../../../../graphql/queriesCompact";
import {useForm} from "antd/es/form/Form";
import {StyledButtonGreen} from "../../../../components/style/ButtonStyles";

const {RangePicker} = DatePicker;

const StageItem = ({value, onChangeStageId, onChange, index, stagesData, moveItem, removeItem, isFirst, isLast}) => {
    const [form] = useForm();
    // бновления всех записей в строке

    const [stageAutoComplete, setStageAutoComplete] = useState({options: [], selected: null});
    const handleItems = () => {
    }
    useEffect(() => {
        onChangeStageId && onChangeStageId(index, stageAutoComplete?.selected)
    }, [stageAutoComplete?.selected]);
    // Для хранения выбора элемента

    return (
        <>
            {fields.map(({key, name, ...restField}) => (<Space
                key={key}
                style={{
                    display: 'flex', marginBottom: 2, marginTop: 2
                }}
                align="baseline"
            >
                <Tooltip title="Номер этапа">
                    <Form.Item
                        {...restField}
                        name={[name, 'stage_number_item']}
                        style={{display: 'flex', marginBottom: 0}}
                    >
                        <InputNumber max={100} min={0} prefix={"№"}/>
                    </Form.Item>
                </Tooltip>
                <Tooltip title="Номер в приложении">
                    <Form.Item
                        {...restField}
                        name={[name, 'application_project_item']}
                        style={{display: 'flex', marginBottom: 0}}
                    >
                        <InputNumber max={100} min={0} prefix={"№"}/>
                    </Form.Item>
                </Tooltip>
                <Tooltip title="Наименование ИРД">
                    <Form.Item
                        {...restField}
                        style={{width: 570, minWidth: 220, marginBottom: 0}}
                        name={[name, 'ird_item']}
                    >
                        <Select
                            style={{width: 570, minWidth: 220, marginBottom: 0}}
                            popupMatchSelectWidth={false}
                            filterOption={false}
                            placeholder="Начните ввод..."
                            onSearch={(value) => handleAutoCompleteIrd(value)}
                            onSelect={(value) => handleAutoCompleteIrdSelect(value)}
                            allowClear
                            showSearch
                        >
                            {dataIrds?.irds?.items?.map(ird => (
                                <Select.Option key={ird.id}
                                               value={ird.id}>
                                    {ird.name}
                                </Select.Option>))}
                        </Select>
                    </Form.Item>
                </Tooltip>
                <Tooltip title="Дата получения">
                    <Form.Item
                        {...restField}
                        name={[name, 'isChecked']}
                        valuePropName="date_complite_item"
                        style={{
                            display: 'flex', marginBottom: 0, marginTop: 0
                        }}
                    >
                        <DatePicker
                            disabled={disable}
                            status={"warning"}
                            placeholder="Получено"/>
                    </Form.Item>
                </Tooltip>
                <MinusCircleOutlined onClick={() => remove(name)}/>
            </Space>))}
            <Form.Item block style={{width: "100%"}}>
                <Space.Compact block style={{width: "100%"}}>
                    <Button style={{width: "100%"}} type="dashed" onClick={() => add()}
                            icon={<PlusOutlined/>}>
                        Добавить ИРД
                    </Button>
                    <StyledButtonGreen icon={<SaveOutlined/>}
                                       onClick={() => setAddModalVisible(true)}>Создать ИРД</StyledButtonGreen>
                    <Button type={"primary"} onClick={() => saveTemplate()} icon={<CloudUploadOutlined/>}>Сохранить
                        в шаблоне</Button>

                </Space.Compact>

            </Form.Item>
        </>
    );
};

export default StageItem;
