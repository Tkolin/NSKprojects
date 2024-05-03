import React, {useEffect, useState} from "react";
import {Handle} from "reactflow";
import {tw} from "twind";
import {useStore} from "../store";
import {StyledBlock, StyledBlockBig} from "../../style/BlockStyles";
import {Col, Input, notification, Popover, Row, Space, Spin} from "antd";
import {MathComponent} from "mathjax-react";
import {StyledButtonGreen} from "../../style/ButtonStyles";
import {LoadingOutlined} from "@ant-design/icons";
import {useMutation, useQuery} from "@apollo/client";
import {COMPUTE_FORMULA_MUTATION} from "../../../graphql/mutationsFormula";
import {CONTACTS_QUERY, FORMULA_BY_KEY_QUERY} from "../../../graphql/queries";

// const comput = (id) => (store) => ({
//     setValue: (total) => store.updateNode(id,  {values:{'output': total}} ),
// });

export default function ReferenceNode({id, data}) {
    const [values, setValues] = useState({});
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const {loading: loadingQ, error: errorQ, data: dataQ, refetch: refetchQ} = useQuery(FORMULA_BY_KEY_QUERY, {
        variables: {
            queryOptions: {
                keys: 'formula1'
            }
        }, fetchPolicy: 'network-only',
        onCompleted: (result) => {
            console.log('result ', result?.formulaByKey.items[0]);
            data.formulaData =  result.formulaByKey.items[0];
        }
    });
    useEffect(() => {

    }, []);
    const handleInputChange = (key, value) => {
        setValues({...values, [key]: value});
    };
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message, placement,
        });
    };

    const [computeFormula] = useMutation(COMPUTE_FORMULA_MUTATION, {
        onCompleted: (data) => {
            console.log("onCompleted");
            console.log(data);
            setResult(data?.computeFormula);
            setLoading(false);

        }, onError: (error) => {
            console.log("onError");
            setResult("onError")
            setLoading(false);
        }
    });
    const findEmptyField = (variableData, values) => {
        if (data?.formulaData)
            return;

        let emptyFieldKey;
        let emptyCount = 0;

        variableData.forEach((variable) => {
            if (!values.hasOwnProperty(variable.name) || !values[variable.name]) {
                emptyCount++;
                emptyFieldKey = variable.name;
            }
        });

        if (emptyCount === 1) {
            return emptyFieldKey;
        } else if (emptyCount === 2) {
            return null;
        } else {
            return undefined;
        }
    };
    const evaluateFormula = () => {
        if (data?.formulaData)
            return;
        const emptyFieldKey = findEmptyField(data?.formulaData?.variable_data, values);

        if (emptyFieldKey === undefined) {
            openNotification('topRight', 'error', 'evaluateFormula!');
            return;
        } else if (emptyFieldKey === null) {
            openNotification('topRight', 'error', 'evaluateFormula!');
            return;
        }
        setLoading(true);
        let formula = data?.formulaData?.original_formula;
        let variables = {};
        data?.formulaData?.variable_data?.forEach((variable) => {
            if (values.hasOwnProperty(variable.name)) {
                variables[variable.name] = values[variable.name];
            }
        });

        // ������ ����������� ���������� �� 'x'
        formula = formula.replace(new RegExp(emptyFieldKey, 'g'), 'x');

        // ����������� �������� ��� ����������
        Object.keys(variables).forEach((key) => {
            formula = formula.replace(new RegExp(key, 'g'), variables[key]);
        });
        console.log('formula ', formula);
        computeFormula({variables: {formula: formula}});
    };

    return (
        <StyledBlockBig label={data?.formulaData?.name ?? "Ошибка"} className={tw("rounded-md bg-white shadow-xl")}>
            {data?.formulaData ? (
                <Row gutter={15}>
                    <Col span={12}>
                        <p><strong>Описание:</strong> {data?.formulaData?.description}</p>
                        <p><strong>Формула: </strong> <MathComponent tex={data?.formulaData?.latex_formula} display={false}/></p>
                        <div>
                            <Space direction="vertical" style={{ width: "100%" }} >
                                {data?.formulaData?.variable_data?.map(variable => (
                                    <div key={variable.name}>
                                        <Popover
                                            title={variable.name}
                                            content={variable.description}
                                            trigger="hover"
                                            placement="top"
                                        >
                                            <Row style={{ width: "100%" }}>
                                                <Col span={1} >
                                                    <Handle id={variable.name} type="target" position="left" style={{marginLeft: '-16px'}} />
                                                </Col>
                                                <Col span={3}  style={{marginTop: 10}}>
                                                    <MathComponent tex={variable.name + " ="} display={false} />

                                                </Col>
                                                <Col span={20}>
                                                    {data.inputs[variable.name] ? (
                                                        <Input
                                                            style={{color: "yellow", backgroundColor: "orange"}}
                                                            disabled={true}
                                                            value={data.inputs[variable.name]}
                                                        />
                                                    ) : (
                                                        <Input
                                                            placeholder={variable.name}
                                                            onChange={(e) => handleInputChange(variable.name, e.target.value)}
                                                        />
                                                    )}
                                                </Col>
                                            </Row>
                                        </Popover>
                                    </div>
                                ))}
                            </Space>
                        </div>
                        <div style={{width: '100%', marginTop: '10px'}}>
                            <StyledButtonGreen style={{width: '100%'}} onClick={evaluateFormula}>Вывод</StyledButtonGreen>
                        </div>
                        <p>
                            <strong>Данные: </strong>
                            {loading ? <Spin indicator={<LoadingOutlined spin/>}/> : result}
                        </p>
                    </Col>
                    <Col span={12}>
                        <StyledBlock color={'info'} label={'Вывод'}>
                            {data?.formulaData?.variable_data?.map(variable => (
                                <div key={variable.name}>
                                    <Handle id='output' type="source" position="bottom"/>
                                    <p>
                                        <MathComponent tex={variable.name + '-'} display={false}/>
                                        <span>{variable.description}</span>
                                    </p>
                                </div>
                            ))}
                        </StyledBlock>
                    </Col>
                </Row>
            ) : "В узле отсутсвует фоормула"}

        </StyledBlockBig>

    );

}
