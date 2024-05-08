import React from "react";
import {Handle} from "reactflow";
import {tw} from "twind";
import {useStore} from "../store";
import {StyledBlockBig, StyledBlockSmall} from "../../style/BlockStyles";
import {colors} from "../../style/colors";
import {Button, Col, Divider, Form, Input, Popover, Row, Space} from "antd";
import {MathComponent} from "mathjax-react";
import {PlusSquareOutlined} from "@ant-design/icons";
import {nanoid} from "nanoid";

const selector = (id, data) => (store) => ({
    setValue: (data) => {
        store.updateNode(id, data);
    },
});
export default function InputNode({id, data}) {
    const {setValue} = useStore(selector(id, data));

    const updateValue = (value, key, field) => {
        data.outputs[key][field] = value; // обновляем значение в копии
        setValue(data); // обновляем состояние
    }
    return (
        <StyledBlockBig label={'Данные'}
                        styleBlcok={{border: '2px solid ' + colors.input.primary}}
                        styleHeader={{backgroundColor: colors.input.secondary}}
                        styleHeaderText={{color: colors.textColor, margin: 0, marginBottom: '5px'}}>

            <div style={{width: '300px'}}>
                <Space direction="vertical" style={{width: "100%"}}>
                    {data?.outputs ?
                        Object.keys(data?.outputs)?.map((key, add, del) => {
                            const value = data.outputs[key];
                            return (
                                <div key={key}>
                                    <Row style={{width: "100%", marginTop: "5px"}}>
                                        <Space.Compact>
                                            <Col span={16}>
                                                <Input
                                                    placeholder={"Наименование"}
                                                    value={value.name}
                                                    onChange={(e) => updateValue(e.target.value, key, 'name')}
                                                />
                                            </Col>
                                            <Col span={5}>
                                                <Input
                                                    placeholder={"Значение"}
                                                    value={value.value}
                                                    key={key}
                                                    style={{width: 'calc(100% + 30px)'}}
                                                    onChange={(e) => updateValue(e.target.value, key, 'value')}
                                                />
                                            </Col>
                                            <Col span={1}>
                                                <Handle id={key}
                                                        type="source" position="left" style={{
                                                    marginLeft: '46px',
                                                    background: 'radial-gradient(circle, ' + colors.input.secondary + ' 18%, ' + colors.input.primary + ' 20%, ' + colors.input.primary + ' 38%, ' + colors.input.secondary + ' 40%)',
                                                    borderColor: colors.input.primary,
                                                    borderWidth: "1px",
                                                    width: 20,
                                                    height: 20,
                                                }}/>
                                            </Col>
                                        </Space.Compact>
                                    </Row>
                                </div>)
                        }) : "данные отсутвуют"
                    }
                </Space>
                <Button icon={<PlusSquareOutlined/>} size={'small'}
                        onClick={() => {
                            setValue(
                                data = {
                                    ...data,
                                    outputs: {
                                        ...data.outputs,
                                        [nanoid()]: {name: "", value: 0}
                                    }
                                });
                        }}
                        style={{width: '100%', marginTop: '20px', borderColor: colors.input.primary}} type={'dashed'}/>
            </div>


        </StyledBlockBig>

    )
        ;
}
