import React, {useEffect, useState} from "react";
import {Handle} from "reactflow";
import {useStore} from "../store";
import {StyledBlock, StyledBlockBig} from "../../style/BlockStyles";
import {Checkbox, Col, Input, notification, Popover, Row, Space, Spin} from "antd";
import {MathComponent} from "mathjax-react";
import {useMutation} from "@apollo/client";
import {COMPUTE_FORMULAS_MUTATION} from "../../../graphql/mutationsFormula";
import {colors, exstra_colors} from "../../style/colors";
import LoadingSpinnerStyles from "../../style/LoadingSpinnerStyles";

const selector = (id, data) => (store) => ({
    setValue: (data) => {
        store.updateNode(id, data);
    },
});
export default function FormulaNode({id, data}) {
    const [loading, setLoading] = useState(false);
    const [findEmptyFieldKey, setFindEmptyFieldKey] = useState();
    const {setValue} = useStore(selector(id, data));

    useEffect(() => {
        console.log('useEffect FormulaNode Data');
        const emptyValues = findEmptyField();
        if (emptyValues?.length != 1) {
            console.log("Мало переменных для подсчёта " + id);
            return;
        }

        if (data?.isFunction) {
            setLoading(true);
            console.log("Начал поодсчёт в функции " + emptyValues[0] + " " + id);
            const formulas = evaluateFormula(emptyValues[0]);
            console.log("Построил ", formulas);
            setFindEmptyFieldKey(emptyValues[0]);
            computeFormulas({variables: {formulas: formulas}});
        } else {
            setLoading(true);
            console.log("Начал поодсчёт в формуле " + emptyValues[0] + " " + id);
            const formulas = evaluateFormula(emptyValues[0]);
            console.log("Построил ", formulas);
            setFindEmptyFieldKey(emptyValues[0]);
            computeFormulas({variables: {formulas: [formulas]}});
        }
    }, [data?.inputs]);


    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message, placement,
        });
    };

    const [computeFormulas] = useMutation(COMPUTE_FORMULAS_MUTATION, {
        onCompleted: (result) => {
            console.log("result", result.computeFormulas);

            if (data?.outputs && data?.outputs[findEmptyField()] && data?.outputs[findEmptyField()]?.value) {
                console.log("Вывод есть");
                if (
                    Array.isArray(data?.outputs[findEmptyField()].value) &&
                    data.outputs[findEmptyField()].value.length === result.computeFormulas.length &&
                    data.outputs[findEmptyField()].value.every((value, index) => value === result.computeFormulas[index])
                ) {
                    console.log("Данные актуальны");
                    setLoading(false);

                    return;
                }
            }
            const newOutput = {
                [findEmptyField()]: {
                    value: result.computeFormulas,
                    name: data.inputs[findEmptyField()]
                }
            };
            setLoading(false);
            console.log("Данные не актуальны");

            setValue({...data, outputs: newOutput});
        },
        onError: (error) => {
            console.log("onError", error.message);
            setLoading(false);
        }
    });

    const findEmptyField = () => {
        // Получаем список всех ключей из data?.formulaData?.variable_data
        const variableKeys = data?.formulaData?.variable_data?.map(item => item.name_key) || [];
        // Получаем список всех ключей из data?.inputs, у которых есть значение
        const inputKeysWithValue = Object.keys(data?.inputs || {}).filter(key => {
            return data?.inputs[key]?.value !== undefined && data?.inputs[key]?.value !== null;
        });
        // Создаем список ключей, которые есть в variableKeys, но отсутствуют в inputKeysWithValue
        const keysToCheck = variableKeys.filter(key => !inputKeysWithValue.includes(key));
        console.log(keysToCheck);

        return keysToCheck;
    };
    const evaluateFormula = (valueReplaceToX) => {
        let formula = data?.formulaData?.original_formula;
        if (data?.isFunction) {
            const arrayKey = Object.entries(data.inputs).find(([key, value]) => Array.isArray(value.value))?.[0];
            if (arrayKey) {
                const arrayValues = data.inputs[arrayKey].value;
                return arrayValues.map(val => {
                    let replacedFormula = formula.replace(new RegExp(arrayKey, 'g'), val);
                    return Object.entries(data.inputs).reduce((acc, [key, value]) => acc
                        .replace(new RegExp(key, 'g'), value.value)
                        .replace(new RegExp(valueReplaceToX, 'g'), '_'), replacedFormula);
                });
            }
        }
        return Object.entries(data.inputs).reduce((acc, [key, value]) => acc
            .replace(new RegExp(key, 'g'), value.value)
            .replace(new RegExp(valueReplaceToX, 'g'), '_'), formula);
    };


    const handleIsFunction = () => {
        console.log('isFunction', data.isFunction);
        data.isFunction = (!data.isFunction)
        setValue(data);
    }
    const handleArrayHandleValue = (key) => {
        console.log('handleArrayHandleValue', data.arrayValueKey);
        data.arrayValueKey = key;
        setValue(data);
    }
    return (
        <StyledBlockBig label={data?.formulaData?.name ?? "Ошибка"}
                        styleBlcok={data.isFunction ? {border: '2px solid ' + colors.function.primary} : {border: '2px solid ' + colors.formulas.primary}}
                        styleHeader={data.isFunction ? {backgroundColor: colors.function.secondary} : {backgroundColor: colors.formulas.secondary}}
                        styleHeaderText={{color: colors.textColor, margin: 0, marginBottom: '5px'}}
        >
            {data?.formulaData ? (
                <Row gutter={15} style={{marginTop: '10px'}}>
                    <Col span={12}>
                        <Checkbox checked={data.isFunction} onChange={handleIsFunction}
                                  children={data.isFunction ? "Функция" : "Формула"}/>
                        <p><strong>Описание:</strong> {data?.formulaData?.description}</p>
                        <p style={{marginBottom: '10px', marginTop: '10px'}}><MathComponent
                            tex={data?.formulaData?.latex_formula} display={true}/></p>
                        <div>
                            <Space direction="vertical" style={{width: "100%"}}>
                                {data?.formulaData?.variable_data && data?.formulaData?.variable_data?.map(variable => (
                                    <div key={variable?.name}>
                                        <Popover
                                            title={variable?.name}
                                            content={variable?.description}
                                            trigger="hover"
                                            placement="top"
                                        >
                                            <Row style={{width: "100%"}}>
                                                <Col span={0.1}>
                                                    {variable?.name === data?.arrayValueKey ? (
                                                        <Handle id={variable?.name} type="target" position="left"
                                                                style={{
                                                                    marginLeft: '-22px',
                                                                    background: 'radial-gradient(circle, ' + colors.inputArray.secondary + ' 18%, ' + colors.inputArray.primary + ' 20%, ' + colors.inputArray.primary + ' 38%, ' + colors.inputArray.secondary + ' 40%)',
                                                                    borderColor: data?.isFunction ? colors.function.primary : colors.formulas.primary,
                                                                    borderWidth: "1px", width: 20,
                                                                    height: 20,
                                                                }}/>

                                                    ) : (
                                                        <Handle id={variable?.name} type="target" position="left"
                                                                style={{
                                                                    marginLeft: '-22px',
                                                                    background: 'radial-gradient(circle, ' + colors.input.secondary + ' 18%, ' + colors.input.primary + ' 20%, ' + colors.input.primary + ' 38%, ' + colors.input.secondary + ' 40%)',
                                                                    borderColor: data?.isFunction ? colors.function.primary : colors.formulas.primary,
                                                                    borderWidth: "1px",
                                                                    width: 20,
                                                                    height: 20,
                                                                }}/>
                                                    )}

                                                </Col>

                                                <Col span={2} style={{marginTop: 10}}>
                                                    {variable?.name && (
                                                        <MathComponent tex={variable?.name + " ="} display={false}/>)}

                                                </Col>
                                                <Col span={data?.isFunction ? 15 : 20}>
                                                    {findEmptyFieldKey === variable.name ? (
                                                        loading ? (
                                                                <LoadingSpinnerStyles/>) :
                                                            (
                                                                <Input

                                                                    style={{
                                                                        color: "black",
                                                                        backgroundColor: colors.result.secondary,
                                                                        borderColor: colors.result.primary,
                                                                        borderWidth: '2px'
                                                                    }}
                                                                    value={data?.outputs[variable.name]?.value}
                                                                />)
                                                    ) : (
                                                        data.inputs && data?.inputs[variable.name] ? (
                                                            <Input
                                                                style={{
                                                                    color: colors.textColor,
                                                                    backgroundColor: colors.input.primary,
                                                                    borderColor: colors.input.secondary,
                                                                    borderWidth: '2px'
                                                                }}
                                                                value={data?.inputs[variable.name]?.value}
                                                                disabled={true}
                                                            />
                                                        ) : (
                                                            <Input
                                                                style={{
                                                                    color: exstra_colors.red12,
                                                                    backgroundColor: exstra_colors.red46,
                                                                    borderColor: exstra_colors.red12,
                                                                    borderWidth: '2px'
                                                                }}
                                                                status="Error"
                                                                placeholder="Подключите ввод"
                                                                disabled={true}
                                                            />
                                                        )
                                                    )}
                                                </Col>

                                                {data?.isFunction ? (
                                                    <Col span={2} style={{marginTop: 8, marginLeft: 5}}>
                                                        <Checkbox
                                                            style={{width: "100%"}}
                                                            onChange={(checked) => {
                                                                if (variable?.name !== data?.arrayValueKey)
                                                                    handleArrayHandleValue(variable?.name);
                                                            }}
                                                            checked={variable?.name === data?.arrayValueKey ? true : false}
                                                            children={"F(x)"}/>

                                                    </Col>
                                                ) : null}
                                            </Row>
                                        </Popover>
                                    </div>
                                ))}
                            </Space>
                        </div>

                    </Col>
                    <Col span={12}>
                        <StyledBlock color={colors.informed} label={'Описание'}>
                            {data?.formulaData?.variable_data?.map(variable => (
                                <Row key={variable.name}>
                                    <Col style={{marginTop: "10px"}}>
                                        <MathComponent tex={variable.name} display={false}/> <span>   </span>
                                    </Col>
                                    <Col>
                                        - {variable.description}
                                    </Col>
                                </Row>
                            ))}
                        </StyledBlock>

                    </Col>
                </Row>
            ) : "В узле отсутсвует формула"}
            {data?.isFunction ? (
                <Handle id={findEmptyFieldKey}
                        type="source" position="right" style={{

                    marginRight: "-5px",
                    background: 'radial-gradient(circle,' + colors.outputArray.primary + ' 20%, ' + colors.outputArray.secondary + ' 20%)',
                    borderColor: colors.function.primary,
                    borderWidth: "1px",
                    width: 20,
                    height: 20,
                }}/>
            ) : (
                <Handle id={findEmptyFieldKey} type="source" position="right"
                        style={{
                            marginRight: "-5px",
                            background: 'radial-gradient(circle,' + colors.output.primary + ' 20%, ' + colors.output.secondary + ' 20%)',
                            borderColor: colors.formulas.primary,
                            borderWidth: "1px",
                            width: 20,
                            height: 20,
                        }}/>
            )}
        </StyledBlockBig>

    );

}
