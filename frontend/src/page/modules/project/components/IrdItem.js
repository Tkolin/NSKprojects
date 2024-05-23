import React, {useEffect, useState} from 'react';
import {Row, Col, Form, InputNumber, Select, Tooltip, DatePicker} from 'antd';
import {
    MinusCircleOutlined,
} from '@ant-design/icons';
import {useForm} from "antd/es/form/Form";
import {StyledFormItemAutoComplete} from "../../../../components/style/SearchAutoCompleteStyles";


const StageItem = ({value, onChangeIrdId, onChange, index, irdData, moveItem, removeItem, isFirst, isLast}) => {


    const [irdAutoComplete, setIrdAutoComplete] = useState({options: [], selected: null});

    useEffect(() => {
        onChangeIrdId && onChangeIrdId(index, irdAutoComplete?.selected)
    }, [irdAutoComplete?.selected]);
    // Для хранения выбора элемента

    return (
        <Row key={index} gutter={2} style={{marginBottom: 0}}>
            <Col span={0} style={{marginBottom: 0, width: 0, height: 0}}
            >

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
                        name={[index, 'isChecked']}
                        valuePropName="date_complite_item"
                        style={{marginBottom: 0,textAlign: "center" ,width: "100%"}}

                    >
                        <DatePicker
                            style={{marginBottom: 0, width: "100%"}}

                            status={"warning"}
                            placeholder="Получено"/>
                    </Form.Item>
                </Tooltip>
            </Col>

            <Col span={1} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <MinusCircleOutlined onClick={() => removeItem && removeItem(index)}/>
            </Col>
            {/*// <Form.Item block style={{width: "100%"}}>*/}
            {/*//     <Space.Compact block style={{width: "100%"}}>*/}
            {/*//         <Button style={{width: "100%"}} type="dashed" onClick={() => add()}*/}
            {/*//                 icon={<PlusOutlined/>}>*/}
            {/*//             Добавить ИРД*/}
            {/*//         </Button>*/}
            {/*//         <StyledButtonGreen icon={<SaveOutlined/>}*/}
            {/*//                            onClick={() => setAddModalVisible(true)}>Создать ИРД</StyledButtonGreen>*/}
            {/*//         <Button type={"primary"} onClick={() => saveTemplate()} icon={<CloudUploadOutlined/>}>Сохранить*/}
            {/*//             в шаблоне</Button>*/}
            {/*//*/}
            {/*//     </Space.Compact>*/}
            {/*//*/}
            {/*// </Form.Item>*/}
        </Row>
    );
};

export default StageItem;
