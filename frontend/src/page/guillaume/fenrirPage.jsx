import React from "react";
import ReactFlow, {
    ReactFlowProvider,
    Background,
    Panel,
    useReactFlow, MiniMap,
} from "reactflow";
import {shallow} from "zustand/shallow";
import {useStore} from "./store";
import {tw} from "twind";
import InputNode from "./nodes/InputNode";
import MathOperationNode from "./nodes/MathOperationNode";
import OutputNode from "./nodes/OutputNode";
import customAntd from "../style/select.css";
import "reactflow/dist/style.css";
import DevTools from "./devtoolH/Devtools";
import FormulaNode from "./nodes/FormulaNode";
import {Button, Divider, Input, Layout, Select} from "antd";
import {Header} from "antd/es/layout/layout";

import {Content, Footer} from "antd/lib/layout/layout";
import Sider from "antd/es/layout/Sider";
import {colors, exstra_colors} from "../style/colors";
import {PlusCircleOutlined} from "@ant-design/icons";
import {useQuery} from "@apollo/client";
import {FORMULA_BY_KEY_QUERY} from "../../graphql/queries";
import ArrayInputNode from "./nodes/ArrayInputNode";


const styles = {
    header: {
        position: 'fixed',
        zIndex: 1,
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    },
    logo: {
        width: '50px',
        height: '50px',
        background: 'rgba(255, 255, 255, 0.2)',
        margin: '16px 24px 16px 0',
        float: 'left',
    },
    user: {
        display: 'flex',
        alignItems: 'center',
    },
    logoutButton: {
        marginLeft: '10px',
    },
    content: {
        margin: '24px 16px 0',
        overflow: 'initial',
    },
    footer: {
        textAlign: 'center',
    },
};

const nodeTypes = {
    inputNode: InputNode,
    arrayInputNode: ArrayInputNode,
    mathOperationNode: MathOperationNode,
    outNode: OutputNode,
    formulaNode: FormulaNode
};

const selector = (store) => ({
    nodes: store.nodes,
    edges: store.edges,
    onNodesChange: store.onNodesChange,
    onNodesDelete: store.onNodesDelete,
    onEdgesChange: store.onEdgesChange,
    onEdgesDelete: store.onEdgesDelete,
    addEdge: store.addEdge,
    addInputNode: (mode) => store.createNode('inputNode',mode),
    addOutputNode: (mode) =>store.createNode('outputNode',mode),
    addFormulaNode: (data) => store.createNode('formulaNode', data),
    addArrayInputNode: (data) => store.createNode('arrayInputNode', data),
   // addReferenceNode: (data) => store.createNode('referenceNode', data),
    //addMathOperationNode: (data) => store.createNode('mathOperationNode',data),
});

export default function FenrirPage() {

    const {loading: loadFormulas, error: errorFormulas, data: dataFormulas, refetch: refetchFormulas} = useQuery(FORMULA_BY_KEY_QUERY, {
        variables: {
            queryOptions: {
                keys: 'formula1'
            }
        }, fetchPolicy: 'network-only',
        onCompleted: (result) => {
            console.log('result ', result?.formulaByKey.items);
        }
    });

    const store = useStore(selector, shallow);
    return (
        <Layout

            style={{
            borderRadius: 8,
            overflow: 'hidden',
            width: '100%',
            height: '85vh',
            backgroundColor: colors.headerBG,

        }}>
            <Header style={{
                border: '1px solid ' + colors.border, // стиль и цвет границы
                height: 64,
                backgroundColor: colors.headerBG,
                color: colors.textColor
            }}>
                <Divider style={{margin: 0, color: colors.textColor}}>Инструменты</Divider>
            </Header>
            <Layout>
                <Sider style={{
                    overflow: 'auto',
                    width: '120px',
                    backgroundColor: colors.siderBG,
                    padding: '5px',
                    color: colors.textColor

                }}>
                    <Divider style={{margin: 0, marginBottom: '30px', color: colors.textColor}}>Добавление
                        объектов</Divider>
                    <Divider style={{margin: 0, marginBottom: '10px', color: colors.textColor}}>Формулы</Divider>

                    <Select
                        className={"my-custom-select-formula"}
                        size={'small'}
                        loading={loadFormulas}
                        style={{
                            width: '100%'
                        }}
                        onSelect={(value)=>{
                            const selectedFormula = dataFormulas?.formulaByKey?.items.find(item => item.id === value);
                            store.addFormulaNode(selectedFormula);
                            console.log("От формулы ", selectedFormula);}}>
                        {dataFormulas?.formulaByKey?.items?.map(row => (
                            <Select.Option key={row.id} value={row.id}>
                                {row.name}
                            </Select.Option>
                        ))}
                    </Select>
                    <Divider style={{margin: 0, marginBottom: '10px', color: colors.textColor}}>Мат. операции</Divider>
                    <Select
                        className={"my-custom-select-math"}
                        size={'small'}
                        style={{
                            width: '100%'
                        }}
                        //onSelect={(value)=>store.addMathOperationNode(value)}
                    >
                        <Select.Option value="1">Option 1</Select.Option>
                        <Select.Option value="1">Option 1</Select.Option>
                    </Select>
                    <Divider style={{margin: 0, marginBottom: '10px', color: colors.textColor}}>Справоочники</Divider>
                    <Select
                        className={"my-custom-select-references"}
                        size={'small'}
                        style={{
                            width: '100%'
                        }}
                         //onSelect={(value)=>store.addReferenceNode(value)}

                    >
                        <Select.Option value="1">Option 1</Select.Option>
                        <Select.Option value="1">Option 1</Select.Option>
                    </Select>
                    <Divider style={{margin: 0, marginBottom: '10px', color: colors.textColor}}>Ввод/Вывод</Divider>
                    <Button size={'small'} style={{
                        width: '100%',
                        backgroundColor: colors.input.secondary,
                        border: '1.5px solid ' + colors.input.primary,
                        borderRadius: '2px',
                        marginBottom: '5px', color: "#e2e3e7"
                    }}
                            onClick={() => {store.addInputNode('single'); console.log("От кнопки ушло");}}
                            icon={<PlusCircleOutlined/>}>Создать ввод</Button>
                    <Button size={'small'} style={{
                        width: '100%',
                        backgroundColor: colors.input.secondary,
                        border: '1.5px solid ' + colors.input.primary,
                        borderRadius: '2px',
                        marginBottom: '5px', color: "#e2e3e7"
                    }}
                            onClick={() => {store.addArrayInputNode(); console.log("От кнопки ушло");}}
                            icon={<PlusCircleOutlined/>}>Создать массива</Button>
                    <Button size={'small'} style={{
                        width: '100%',
                        backgroundColor: colors.output.secondary,
                        border: '1.5px solid ' + colors.output.primary,
                        borderRadius: '2px',
                        marginBottom: '5px', color: "#e2e3e7"
                    }}
                            onClick={() => {store.addOutputNode('single'); console.log("От кнопки ушло");}}
                            icon={<PlusCircleOutlined/>}>Создать вывод</Button> </Sider>
                <Content style={{
                    border: '1px solid ' + colors.border, // стиль и цвет границы
                    textAlign: 'center',
                    height: '100%',
                    color: 'black',
                    backgroundColor: colors.background
                }}>
                    <ReactFlowProvider>
                        <ReactFlow
                            proOptions={{hideAttribution: true}}
                            nodeTypes={nodeTypes}
                            nodes={store.nodes}
                            edges={store.edges}
                            // onChange={console.log('log change')}
                            onNodesChange={store.onNodesChange}
                            onNodesDelete={store.onNodesDelete}
                            onEdgesChange={store.onEdgesChange}
                            onEdgesDelete={store.onEdgesDelete}
                            onConnect={store.addEdge}
                            fitView
                        >
                            <DevTools/>
                            <Background/>
                            <MiniMap/>
                        </ReactFlow>
                    </ReactFlowProvider>
                </Content>
                <Sider style={{
                    overflow: 'auto',
                    width: '120px',
                    color: colors.textColor,
                    backgroundColor: colors.siderBG,
                    padding: '5px',
                }}>
                    <Divider style={{
                        margin: 0, marginBottom: '30px',
                        color: colors.textColor
                    }}>Данные</Divider>

                    <Divider style={{
                        margin: 0, marginBottom: '10px',
                        color: colors.textColor
                    }}
                    >Ввод данных</Divider>
                    <Divider style={{margin: 0, marginBottom: '10px', color: colors.textColor}}>Вывод данных</Divider>

                </Sider>
            </Layout>
            <Footer style={{
                border: '1px solid ' + colors.border, // стиль и цвет границы
                color: colors.textColor,
                padding: '0px',
                lineHeight: '0px',
                height: '25px',
                backgroundColor: colors.footerBG,
            }}>
                <Divider style={{margin: 0, marginBottom: '10px', color: colors.textColor}}>Страницы</Divider>
            </Footer>
        </Layout>
    );
}
