import React, {useEffect, useState} from "react";
import {Handle} from "reactflow";
import {tw} from "twind";
import {useStore} from "../store";
import {StyledBlock, StyledBlockBig} from "../../style/BlockStyles";
import {Checkbox, Col, Input, notification, Popover, Row, Space, Spin} from "antd";
import {MathComponent} from "mathjax-react";
import {StyledButtonGreen} from "../../style/ButtonStyles";
import {LoadingOutlined} from "@ant-design/icons";
import {useMutation, useQuery} from "@apollo/client";
import {COMPUTE_FORMULA_MUTATION} from "../../../graphql/mutationsFormula";
import {CONTACTS_QUERY, FORMULA_BY_KEY_QUERY} from "../../../graphql/queries";
import {colors, exstra_colors} from "../../style/colors";
import {isFunction} from "util";

const selector = (id, data) => (store) => ({
    setValue: (data) => {
        store.updateNode(id, data);
    },
});
export default function FormulaNode({id, data}) {
    const [values, setValues] = useState({});
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const {setValue} = useStore(selector(id, data));

    useEffect(() => {
        console.log("formulaNode ", id, data)
    }, [data, ]);

    const handleInputChange = (value, key ) => {
        console.log(key, value)
        if(!(data.inputs[key]))
            data.inputs[key] = {value: null}

        data.inputs[key].value =  value; // обновляем значение в копии
        setValue(data); // обновляем состояние
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
        if (data?.formulaData && data?.formulaData?.variable_data)
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
        if (data?.formulaData && data?.formulaData?.variable_data)
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

        formula = formula.replace(new RegExp(emptyFieldKey, 'g'), 'x');

        Object.keys(variables).forEach((key) => {
            formula = formula.replace(new RegExp(key, 'g'), variables[key]);
        });
        console.log('formula ', formula);
        computeFormula({variables: {formula: formula}});
    };
    const handleIsFunction = () => {
        console.log('isFunction', data.isFunction);
        data.isFunction = (!data.isFunction)
        setValue(data);
    }
    return (
            <StyledBlockBig label={data?.formulaData?.name ?? "Ошибка"}
                            styleBlcok={data.isFunction ? {border: '2px solid '+colors.function.primary} : {border: '2px solid '+colors.formulas.primary}}
                            styleHeader={data.isFunction ?  {backgroundColor: colors.function.secondary} : {backgroundColor: colors.formulas.secondary} }
                            styleHeaderText={ {color: colors.textColor, margin: 0, marginBottom: '5px'}}
                             >
                {data?.formulaData ? (
                    <Row gutter={15} style={{marginTop: '10px'}}>
                        <Col span={12}>
                            <Checkbox value={data.isFunction} onChange={handleIsFunction} children={data.isFunction ? "Функция": "Формула"}/>
                            <p><strong>Описание:</strong> {data?.formulaData?.description}</p>
                            <p style={{marginBottom: '10px', marginTop: '10px'}}> <MathComponent tex={data?.formulaData?.latex_formula} display={true}/></p>
                            <div>
                                <Space direction="vertical" style={{ width: "100%" }} >
                                    {data?.formulaData?.variable_data && data?.formulaData?.variable_data?.map(variable => (
                                        <div key={variable?.name}>
                                            <Popover
                                                title={variable?.name}
                                                content={variable?.description}
                                                trigger="hover"
                                                placement="top"
                                            >
                                                <Row style={{ width: "100%" }}>
                                                    <Col span={0.1} >
                                                        <Handle id={variable?.name} type="target" position="left"  style={{
                                                            marginLeft: '-22px',
                                                            borderColor: colors.input.primary,
                                                            width: 15,
                                                            height: 15,
                                                            ...(data.isFunction ? {
                                                                background: `linear-gradient(to bottom, ${colors.input.secondary} 50%, ${colors.inputArray.secondary} 50%)`,
                                                            } : {
                                                                backgroundColor: colors.input.secondary,
                                                            })
                                                        }}/>
                                                    </Col>
                                                    <Col span={3}  style={{marginTop: 10}}>
                                                        {variable?.name &&(
                                                        <MathComponent  tex={variable?.name + " ="} display={false} />)}

                                                    </Col>
                                                    <Col span={20}>
                                                        {data.inputs && data?.inputs[variable.name] ? (
                                                            <Input
                                                                style={{color: colors.textColor, backgroundColor: colors.input.primary, borderColor: colors.input.secondary, borderWidth: '2px'}}
                                                                value={data?.inputs[variable.name]?.value}
                                                                disabled={true}
                                                            />
                                                        ) : (
                                                            <Input
                                                                style={{color: exstra_colors.red12, backgroundColor: exstra_colors.red46, borderColor: exstra_colors.red12, borderWidth: '2px'}}
                                                                status="Подключите ввод" placeholder="Error"
                                                                disabled={true}
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
                                        <Handle id='output' type="source" position="right" style={{marginRight: '-15px',
                                            backgroundColor:
                                            colors.output.secondary,
                                            borderColor: colors.output.primary,width: 20, height: 20}} />
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
