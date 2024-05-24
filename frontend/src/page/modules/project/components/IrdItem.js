import React, {useEffect, useState} from 'react';
import {Row, Col, Form, InputNumber, Select, Tooltip, DatePicker} from 'antd';
import {
    MinusCircleOutlined,
} from '@ant-design/icons';
import {useForm} from "antd/es/form/Form";
import {StyledFormItemAutoComplete} from "../../../../components/style/SearchAutoCompleteStyles";
import {EmptyFormItem} from "../../../../components/formComponents/EmptyFormItem";


const IrdItem = ({
                     value,

                     onChange,
                     index,
                     form,
                     irdData,
                     removeItem,
                 }) => {

    // бновления всех записей в строке
    const [irdAutoComplete, setIrdAutoComplete] = useState({options: [], selected: null});
    const [firstLoad, setFirstLoad] = useState(false)

    useEffect(() => {
        if (firstLoad) {
            const irdList = form.getFieldValue("irdList");
            const updatedIrdList = irdList.map((item, idx) => {
                if (idx === index) {
                    return {
                        ...item,
                        ird_id: irdAutoComplete?.selected
                    };
                }
                return item;
            });
            form.setFieldValue("irdList", updatedIrdList);
            onChange();
        }
    }, [irdAutoComplete?.selected]);
    useEffect(() => {
        setIrdAutoComplete({...irdAutoComplete, selected: form.getFieldValue("irdList")?.[index]?.ird_id})
        setFirstLoad(true);
    }, []);

    // Для хранения выбора элемента

    return (
        <Row key={index} gutter={2} style={{marginBottom: 0}}>

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
                        style={{marginBottom: 0, textAlign: "center", width: "100%"}}

                    >
                        <DatePicker
                            style={{marginBottom: 0, width: "100%"}}
                            onChange={()=>onChange()}
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
