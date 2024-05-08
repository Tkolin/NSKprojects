import React, {useEffect} from "react";
import {Handle} from "reactflow";
import {StyledBlockBig} from "../../style/BlockStyles";
import {colors} from "../../style/colors";
import {Button, Col, Input, Row, Space, Table} from "antd";
import {StyledHandleArrayInput} from "./StylesNodesHandle";
import {CustomButton} from "../FenrirStyles";
import {nanoid} from "nanoid";
import {useStore} from "../store";
import {CopyOutlined} from "@ant-design/icons";
import copyTableDataToClipboard from "../ConvertOutputToCSVScript";

const selector = (id, data) => (store) => ({
    setValue: (data) => {
        store.updateNode(id, data);
    },
});
export default function OutputNode({id, data}) {
    const {setValue} = useStore(selector(id, data));
    useEffect(() => {
        data = {
            ...data,
            outputs: {
                ...data?.inputs
            }
        }
        setValue(data);
    }, [data?.inputs]);
    // Определение количества строк в таблице (на основе самого длинного массива значений)
    const maxRows = Math.max(...Object.values(data?.inputs).map(item => Array.isArray(item.value) ? item.value.length : 1));

    // Формирование данных для таблицы
    const tableData = [];
    for (let i = 0; i < maxRows; i++) {
        const row = {};
        Object.keys(data?.inputs).forEach(key => {
            const value = data?.inputs[key].value;
            if (Array.isArray(value)) {
                row[key] = value[i] ?? "";
            } else {
                row[key] = value;
            }
        });
        tableData.push(row);
    }

    // Формирование заголовков столбцов
    const columns = Object.keys(data?.inputs).map(key => ({
        title: data?.inputs[key].name,
        dataIndex: key,
        key: key,
    }));

    return (
        <StyledBlockBig label={'Вывод данных'}
                        styleBlcok={{border: '2px solid ' + colors.result.primary}}
                        styleHeader={{backgroundColor: colors.result.secondary}}
                        styleHeaderText={{color: colors.textColor, margin: 0, marginBottom: '5px'}}>
            {data?.inputs && (
                <Space direction="vertical" style={{width: "100%"}}>

                    {Object.keys(data?.inputs).map(key => (
                        <div key={key}>
                            <Row style={{width: "100%", marginTop: "5px"}}>
                                <Space.Compact>
                                    <Col span={0.1}>
                                        <StyledHandleArrayInput id={key}
                                                                type="target" position="right" style={{
                                            marginLeft: '-22px',
                                        }}/>
                                    </Col>
                                    <Col span={23}>
                                        <Input
                                            placeholder={"Наименование"}
                                            value={data?.inputs[key].name}
                                        />
                                    </Col>
                                </Space.Compact>
                            </Row>
                        </div>
                    ))}
                </Space>
            )}
            <Button onClick={()=>{
                data = {
                    ...data,
                    inputs: {
                        ...data.inputs,
                        [nanoid()]: {name: "", value: 0}
                    }
                }
                setValue(data);
            }}>
                Создать ввод
            </Button>
            <Table
                size={'small'}
                dataSource={tableData}
                columns={columns}
                pagination={false}
            />
            <Button onClick={()=>{
                copyTableDataToClipboard(data.outputs);
            }}
            icon={<CopyOutlined/>}
            >
                Скопировать
            </Button>
        </StyledBlockBig>
    );
}
