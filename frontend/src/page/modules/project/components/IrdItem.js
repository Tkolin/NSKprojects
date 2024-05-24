import React, {useEffect, useState} from 'react';
import {Row, Col, Form, InputNumber, Select, Tooltip, DatePicker} from 'antd';
import {
    MinusCircleOutlined,
} from '@ant-design/icons';
import {useForm} from "antd/es/form/Form";
import {StyledFormItemAutoComplete} from "../../../../components/style/SearchAutoCompleteStyles";
import {EmptyFormItem} from "../../../../components/formComponents/EmptyFormItem";


const IrdItem = ({
                     onChangeIrdId,
                     index,
                     irdData,
                     removeItem,
                     onChangeExtend,
                     form
                 }) => {


    const [irdAutoComplete, setIrdAutoComplete] = useState({options: [], selected: null});
    const [firstLoad, setFirstLoad] = useState(false)

    useEffect(() => {
        if (firstLoad) {
            const irdList = form.getFieldValue("irdList");
            const updatedIrdList = irdList.map((item, idx) => {
                if (idx === index) {
                    return {
                        ...item,
                        stage_id: irdAutoComplete?.selected
                    };
                }
                return item;
            });
            form.setFieldValue("irdList", updatedIrdList);
            onChangeExtend();
        }
    }, [irdAutoComplete?.selected]);
    useEffect(() => {
        setIrdAutoComplete({...irdAutoComplete, selected: form.getFieldValue("irdList")?.[index]?.stage_id})
        setFirstLoad(true);
    }, []);

    // Для хранения выбора элемента

    return (
        <Row key={index} gutter={2} style={{marginBottom: 0}}>
            <Col span={0}>
                <Form.Item
                    name={[index, 'ird_id']}
                    style={{marginBottom: 0, width: 0, height: 0}}
                >
                    <InputNumber style={{marginBottom: 0, width: 0, height: 0}}
                    />
                </Form.Item>

            </Col>
            <Col span={14}>
                <Tooltip title="Наименование ИРД">

                    <StyledFormItemAutoComplete
                        style={{marginBottom: 0, width: "100%"}}

                        formName={[index, 'ird_name']}
                        placeholder={"Выбор ИРД..."}

                        data={irdData}
                        stateSearch={irdAutoComplete}
                        setStateSearch={setIrdAutoComplete}
                    />
                </Tooltip>
            </Col>
            <EmptyFormItem name={"ird_id"}/>

            <Col span={3}>

                <Tooltip title="Номер этапа">
                    <Form.Item
                        name={[index, 'stage_number_item']}
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
                        name={[index, 'application_project_item']}
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
                        name={[index, 'date_complite_item']}
                        style={{marginBottom: 0, textAlign: "center", width: "100%"}}

                    >
                        <DatePicker
                            style={{marginBottom: 0, width: "100%"}}
                            onChange={()=>onChangeExtend()}
                            status={"warning"}
                            placeholder="Получено"/>
                    </Form.Item>
                </Tooltip>
            </Col>

            <Col span={1} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <MinusCircleOutlined onClick={() => removeItem && removeItem(index)}/>
            </Col>

        </Row>
    );
};

export default IrdItem;
