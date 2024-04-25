import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import {CONTACTS_QUERY, FORMULA_BY_KEY_QUERY} from "../../../../graphql/queries";
import { Col, Divider, Drawer, Form, Layout, Row, Select, Button, FloatButton } from "antd";
import FormulaDetails from "./script/FormulaOutputScript";
import LoadingSpinnerStyles from "../../../style/LoadingSpinnerStyles";
import { StyledBlock } from "../../../style/BlockStyles";
import { SettingOutlined } from "@ant-design/icons";
import InformationOutputScript from "./script/InformationOutputScript";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Draggable from "react-draggable";

const FormulaUsabilityForm = () => {
    const [formulaFilterForm] = Form.useForm();
    const {
        error: errorQuery,
        loading: loadingQuery,
        data: dataQuery,
    } = useQuery(FORMULA_BY_KEY_QUERY, {
        variables: {
            keys: ['ALL']
        },
        onCompleted: (data) => {
            console.log(data);
        },
    });

    const [selectedFormulas, setSelectedFormulas] = useState([]);
    const [selectedInformation, setSelectedInformation] = useState([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [informationData, setInformationData] = useState([]);
    const addingInformation = (data) => {
        setInformationData([...informationData, data]);
    }
    const {loading: loading, error: error, data: data, refetch: refetch} = useQuery(CONTACTS_QUERY, {
        variables: {
            queryOptions: {
                page, limit, search, sortField: sortField, sortOrder
            }
        }, fetchPolicy: 'network-only',
    });
    const handleChange = (selectedOptions) => {
        setSelectedFormulas(selectedOptions);
    };

    const showDrawer = () => {
        setDrawerVisible(true);
    };

    const onClose = () => {
        setDrawerVisible(false);
    };

    const [connections, setConnections] = useState([]);

    const handleConnectInput = (fromFormulaId, toFormulaId) => {
        console.log('handleConnectInput');
        setConnections([...connections, { from: fromFormulaId, to: toFormulaId }]);
    };

    const handleConnectOutput = (fromFormulaId, toFormulaId) => {
        console.log('handleConnectOutput');
        setConnections([...connections, { from: fromFormulaId, to: toFormulaId }]);
    };

    if (loadingQuery) return <LoadingSpinnerStyles />;

    return (
        <DndProvider backend={HTML5Backend}>
            <Row gutter={25}>
                <Col span={24}>
                    {selectedFormulas.length > 0 ? (
                        selectedFormulas.map((selectedFormula) => (
                            <Draggable key={selectedFormula} style={{margin: 5,  width: 810}}>
                                <div style={{margin: 5, width: 810}}>
                                    <FormulaDetails
                                        formulaData={dataQuery?.formulaByKey?.items.find(formula => formula.id === selectedFormula)}
                                        onConnectInput={handleConnectInput}
                                        onConnectOutput={handleConnectOutput}
                                    />
                                </div>
                            </Draggable>
                        ))
                    ) : (
                        <p>Выберите формулы для отображения</p>
                    )}
                </Col>
                <FloatButton
                    icon={<SettingOutlined />}
                    shape="square"
                    type={"primary"}
                    style={{
                        position: 'fixed',
                        right: 75,
                    }}
                    onClick={showDrawer}
                />
                <Drawer
                    title="Настройка окружения"
                    width={500}
                    closable={false}
                    onClose={onClose}
                    open={drawerVisible}
                >
                    <Divider>Формулы</Divider>
                    <Select
                        mode={'multiple'}
                        placeholder={"По названию"}
                        loading={loadingQuery}
                        onChange={handleChange}
                        style={{ width: '100%' }}
                        value={selectedFormulas}
                    >
                        {dataQuery?.formulaByKey?.items.map((row) => (
                            <Select.Option key={row.id} value={row.id}>{row.name}</Select.Option>
                        ))}
                    </Select>
                    <Divider>Справочная информация</Divider>
                    <Select
                        mode={'multiple'}
                        placeholder={"По названию"}
                        loading={loadingQuery}
                        onChange={handleChange}
                        style={{ width: '100%' }}
                        value={selectedInformation}
                    >
                        {dataQuery?.formulaByKey?.items.map((row) => (
                            <Select.Option key={row.id} value={row.id}>{row.name}</Select.Option>
                        ))}
                    </Select>
                </Drawer>
                {/* Отображение связей */}
                {/*{connections.map((conn, index) => {*/}
                {/*    const fromFormula = dataQuery?.formulaByKey?.items.find(formula => formula.id === conn.from);*/}
                {/*    const toFormula = dataQuery?.formulaByKey?.items.find(formula => formula.id === conn.to);*/}

                {/*    if (!fromFormula || !toFormula) {*/}
                {/*        return null;*/}
                {/*    }*/}

                {/*    // Рассчитываем координаты начальной и конечной точек*/}
                {/*    const fromX = fromFormula.position.x + fromFormula.width;*/}
                {/*    const fromY = fromFormula.position.y + fromFormula.height / 2;*/}
                {/*    const toX = toFormula.position.x;*/}
                {/*    const toY = toFormula.position.y + toFormula.height / 2;*/}

                {/*    return (*/}
                {/*        <svg key={index} style={{ position: 'absolute', zIndex: 1, pointerEvents: 'none' }}>*/}
                {/*            /!* Стрелка *!/*/}
                {/*            <defs>*/}
                {/*                <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">*/}
                {/*                    <path d="M0,0 L0,6 L9,3 z" fill="#f00" />*/}
                {/*                </marker>*/}
                {/*            </defs>*/}
                {/*            /!* Линия *!/*/}
                {/*            <line x1={fromX} y1={fromY} x2={toX} y2={toY} stroke="black" markerEnd="url(#arrow)" />*/}
                {/*        </svg>*/}
                {/*    );*/}
                {/*})}*/}
            </Row>
        </DndProvider>
    );
};

export default FormulaUsabilityForm;
