// import React, {useState} from 'react';
// import {Input, Space, notification, Row, Col, Popover, Spin} from 'antd';
// import {useMutation} from "@apollo/client";
// import {COMPUTE_FORMULA_MUTATION} from "../../graphql/mutationsFormula";
// import {MathComponent} from "mathjax-react";
//
// import {LoadingOutlined} from "@ant-design/icons";
// import {StyledBlock, StyledBlockBig} from "../../page/style/BlockStyles";
// import {StyledButtonGreen} from "../../page/style/ButtonStyles";
//
//
// const FormulaOutput = ({formulaData, onConnectInput, onConnectOutput}) => {
//     const [values, setValues] = useState({});
//     const [result, setResult] = useState('');
//     const [loading, setLoading] = useState(false);
//
//     const handleInputChange = (key, value) => {
//         setValues({...values, [key]: value});
//     };
//     const openNotification = (placement, type, message) => {
//         notification[type]({
//             message: message, placement,
//         });
//     };
//     // ������� ��� ��������
//     const [compute] = useMutation(COMPUTE_FORMULA_MUTATION, {
//         onCompleted: (data) => {
//             console.log("����� ��������");
//             console.log(data);
//             setResult(data.computeFormula);
//             setLoading(false);
//
//         }, onError: (error) => {
//             console.log("������ ��������");
//             setResult("������ ��������")
//             setLoading(false);
//         }
//     });
//     const findEmptyField = (variableData, values) => {
//
//         let emptyFieldKey;
//         let emptyCount = 0;
//
//         variableData.forEach((variable) => {
//             if (!values.hasOwnProperty(variable.name) || !values[variable.name]) {
//                 emptyCount++;
//                 emptyFieldKey = variable.name;
//             }
//         });
//
//         if (emptyCount === 1) {
//             return emptyFieldKey;
//         } else if (emptyCount === 2) {
//             return null;
//         } else {
//             return undefined;
//         }
//     };
//     const evaluateFormula = () => {
//         // �������� ������� ������ �����
//         const emptyFieldKey = findEmptyField(formulaData?.variable_data, values);
//
//         if (emptyFieldKey === undefined) {
//             openNotification('topRight', 'error', '��� ���������� ��������!');
//             return;
//         } else if (emptyFieldKey === null) {
//             openNotification('topRight', 'error', '��������� ���������� �� ����� ���� ����������!');
//             return;
//         }
//         setLoading(true);
//         let formula = formulaData?.original_formula;
//         let variables = {};
//         formulaData?.variable_data?.forEach((variable) => {
//             if (values.hasOwnProperty(variable.name)) {
//                 variables[variable.name] = values[variable.name];
//             }
//         });
//
//         // ������ ����������� ���������� �� 'x'
//         formula = formula.replace(new RegExp(emptyFieldKey, 'g'), 'x');
//
//         // ����������� �������� ��� ����������
//         Object.keys(variables).forEach((key) => {
//             formula = formula.replace(new RegExp(key, 'g'), variables[key]);
//         });
//         console.log('formula ', formula);
//         compute({variables: {formula: formula}});
//     };
//
//
//
//     return (
//             <StyledBlockBig label={formulaData?.name} >
//                 <Row gutter={15}>
//                     <Col span={12}>
//                         <p><strong>��������:</strong> {formulaData?.description}</p>
//                         <p><strong>�������:</strong> <MathComponent tex={formulaData?.latex_formula} display={false}/>
//                         </p>
//                         <div>
//                             <Space direction="vertical" style={{width: "100%"}}>
//                                 {formulaData?.variable_data?.map(variable => (
//
//                                         <Popover
//                                             title={variable.name}
//                                             content={variable.description}
//                                             trigger="hover"
//                                             placement="top" // ������ ����� ������
//                                         >
//                                             {/* ������� ����� */}
//                                             <Row style={{width: "100%"}}>
//                                                 <Col span={12}>
//                                                     <MathComponent tex={variable.name} display={false}/> =
//                                                 </Col>
//                                                 <Col span={12}>
//                                                     <Input
//                                                         key={variable.name}
//                                                         placeholder={variable.name}
//                                                         onChange={(e) => handleInputChange(variable.name, e.target.value)}
//                                                     />
//
//                                                 </Col>
//                                             </Row>
//                                         </Popover>
//                                 ))}
//                             </Space>
//                         </div>
//                         <div style={{width: '100%', marginTop: '10px'}}>
//                             <StyledButtonGreen style={{width: '100%'}}
//                                                onClick={evaluateFormula}>���������</StyledButtonGreen>
//                         </div>
//                         <p>
//                             {/*� � ����� ���� ������ ����� ����� ��� ������*/}
//                             <strong>���������: </strong>
//                             {loading ? <Spin indicator={<LoadingOutlined spin/>}/> : result}
//                         </p>
//
//                     </Col>
//                     <Col span={12}>
//                         <StyledBlock color={'info'} label={'���������'}>
//                             {formulaData?.variable_data?.map(variable => (
//                                 <div>
//                                     <MathComponent tex={variable.name} display={false}/> - {variable.description}
//                                 </div>
//
//                             ))}
//                         </StyledBlock>
//                     </Col>
//                 </Row>
//
//             </StyledBlockBig>
//     );
// };
//
// export default FormulaOutput;
