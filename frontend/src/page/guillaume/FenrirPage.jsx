import React, {useEffect, useState} from "react";
import ReactFlow, {
    ReactFlowProvider,
    Background,
    MiniMap,
} from "reactflow";
import {shallow} from "zustand/shallow";
import {useStore} from "./store";
import InputNode from "./nodes/InputNode";
import MathOperationNode from "./nodes/MathOperationNode";
import OutputNode from "./nodes/OutputNode";
import "reactflow/dist/style.css";
import FormulaNode from "./nodes/FormulaNode";
import ReferenceNode from "./nodes/ReferenceNode";
import {Button, Divider, Input, Layout, Menu, Modal, Row, Select, Space} from "antd";
import {Header} from "antd/es/layout/layout";
import {Content, Footer} from "antd/lib/layout/layout";
import Sider from "antd/es/layout/Sider";
import {colors} from "../style/colors";
import {
    FileAddOutlined,
    FileExclamationOutlined,
    FileOutlined, FileTextOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
import {useQuery} from "@apollo/client";
import {FORMULA_BY_KEY_QUERY, REFERENCES_QUERY} from "../../graphql/queries";
import InputArrayNode from "./nodes/InputArrayNode";
import {nanoid} from "nanoid";
import {CompactMenu, CustomButton, CustomSelect} from "./FenrirStyles";
import SubMenu from "antd/es/menu/SubMenu";
import FenrirForm from "./form/FenrirForm";
import FenrirView from "./form/FenrirView";
import DevTools from "../../_dev/devtoolH/Devtools";



const nodeTypes = {
    inputNode: InputNode,
    arrayInputNode: InputArrayNode,
    mathOperationNode: MathOperationNode,
    outputNode: OutputNode,
    formulaNode: FormulaNode,
    referenceNode: ReferenceNode
};

const selector = (store) => ({
    nodes: store.nodes,
    edges: store.edges,
    onNodesChange: store.onNodesChange,
    onNodesDelete: store.onNodesDelete,
    onEdgesChange: store.onEdgesChange,
    onEdgesDelete: store.onEdgesDelete,
    addEdge: store.addEdge,
    addInputNode: (mode) => store.createNode('inputNode', mode),
    addOutputNode: (mode) => store.createNode('outputNode', mode),
    addFormulaNode: (data) => store.createNode('formulaNode', data),
    addArrayInputNode: (data) => store.createNode('arrayInputNode', data),
    addReferenceNode: (data) => store.createNode('referenceNode', data),
    getModels: () => store.getModels(),
    setModels: (models) => store.setModels(models),

    updateNode: (id, data) => store.updateNode(id, data),
    //addMathOperationNode: (data) => store.createNode('mathOperationNode',data),
});

export default function FenrirPage() {
    const store = useStore(selector, shallow);

    const [createFenrirModalVisible, setCreateFenrirModalVisible] = useState();
    const [viewFenrirModalVisible, setViewFenrirModalVisible] = useState();

    const setModel = (models) => {
        console.log("setModel", models)
        store.setModels(models);
    }


    const menuClick = (e) => {
        switch (e?.key) {
            case "SubMenyFile:1-1":
                console.log(e?.key);
                setCreateFenrirModalVisible({visible: true, type: "shema"})
                break;
            case "SubMenyFile:1-2":
                console.log(e?.key);
                setViewFenrirModalVisible({visible: true, type: "shema"})

                break;
            case "SubMenyFile:2-1":
                setCreateFenrirModalVisible({visible: true, type: "template"})

                break;
            case "SubMenyFile:2-2":
                setViewFenrirModalVisible({visible: true, type: "template"})

                break;
        }
    }

    const handleSaveContext = () => {
        console.log(store.getModels());
    }

    const {
        loading: loadFormulas,
        error: errorFormulas,
        data: dataFormulas,
        refetch: refetchFormulas
    } = useQuery(FORMULA_BY_KEY_QUERY, {
        variables: {
            queryOptions: {
                keys: 'formula1'
            }
        }, fetchPolicy: 'network-only',
        onCompleted: (result) => {
            console.log('result ', result?.formulaByKey.items);
        }
    });
    const {
        loading: loadReference,
        error: errorReference,
        data: dataReference,
        refetch: refetchReference
    } = useQuery(REFERENCES_QUERY, {
        fetchPolicy: 'network-only',
        onCompleted: (result) => {
            console.log('result ref ', result?.references.items);
        }
    });
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
                paddingRight: 0,
                paddingLeft: 0,
                border: '1px solid ' + colors.border, // стиль и цвет границы
                height: 70,
                backgroundColor: colors.headerBG,
                color: colors.textColor
            }}>
                <CompactMenu mode="horizontal" onClick={menuClick} style={{
                    backgroundColor: colors.header, background: colors.header
                }}>

                    <SubMenu key="SubMenyFile" icon={<FileExclamationOutlined/>}
                             title="Файл">
                        <Menu.ItemGroup title="Схема">
                            <Menu.Item key="SubMenyFile:1-1">Сохранить</Menu.Item>
                            <Menu.Item key="SubMenyFile:1-2">Загрузить</Menu.Item>
                        </Menu.ItemGroup>
                        <Menu.ItemGroup title="Шаблон">
                            <Menu.Item key="SubMenyFile:2-1">Сохранить</Menu.Item>
                            <Menu.Item key="SubMenyFile:2-2">Загрузить</Menu.Item>
                        </Menu.ItemGroup>
                    </SubMenu>
                    <SubMenu key="SubMenu2" icon={<FileOutlined/>}
                             title="Главная">
                        <Menu.ItemGroup title="Item 1">
                            <Menu.Item key="setting:1">Option 1</Menu.Item>
                            <Menu.Item key="setting:2">Option 2</Menu.Item>
                        </Menu.ItemGroup>
                        <Menu.ItemGroup title="Item 2">
                            <Menu.Item key="setting:3">Option 3</Menu.Item>
                            <Menu.Item key="setting:4">Option 4</Menu.Item>
                        </Menu.ItemGroup>
                    </SubMenu>
                    <SubMenu key="SubMenu3" icon={<FileAddOutlined/>}
                             title="Вставка">
                        <Menu.ItemGroup title="Item 1">
                            <Menu.Item key="setting:1">Option 1</Menu.Item>
                            <Menu.Item key="setting:2">Option 2</Menu.Item>
                        </Menu.ItemGroup>
                        <Menu.ItemGroup title="Item 2">
                            <Menu.Item key="setting:3">Option 3</Menu.Item>
                            <Menu.Item key="setting:4">Option 4</Menu.Item>
                        </Menu.ItemGroup>
                    </SubMenu>
                    <SubMenu key="SubMenu4" icon={<FileTextOutlined/>}
                             title="Данные">
                        <Menu.ItemGroup title="Item 1">
                            <Menu.Item key="setting:1">Option 1</Menu.Item>
                            <Menu.Item key="setting:2">Option 2</Menu.Item>
                        </Menu.ItemGroup>
                        <Menu.ItemGroup title="Item 2">
                            <Menu.Item key="setting:3">Option 3</Menu.Item>
                            <Menu.Item key="setting:4">Option 4</Menu.Item>
                        </Menu.ItemGroup>
                    </SubMenu>
                </CompactMenu>
                <hr style={{margin: 0}}/>
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
                    <Space.Compact style={{width: "100%"}}>

                        <CustomSelect
                            className={"my-custom-select-formula"}
                            size={'small'}
                            loading={loadFormulas}
                            value={null}
                            placeholder={"Выбор..."}
                            style={{
                                width: '100%'
                            }}
                            onSelect={(value) => {
                                const selectedFormula = dataFormulas?.formulaByKey?.items.find(item => item.id === value);
                                store.addFormulaNode(selectedFormula);
                                console.log("От формулы ", selectedFormula);
                            }}>
                            {dataFormulas?.formulaByKey?.items?.map(row => (
                                <Select.Option key={row.id} value={row.id}>
                                    {row.name}
                                </Select.Option>
                            ))}
                        </CustomSelect>
                        <CustomButton size={'small'}
                                      className={"my-custom-btn-create-formula"}
                                      onClick={() => {}}
                                      icon={<PlusCircleOutlined/>}/>
                    </Space.Compact>
                    <Divider style={{margin: 0, marginBottom: '10px', color: colors.textColor}}>Справоочники</Divider>
                    <Space.Compact style={{width: "100%"}}>
                        <CustomSelect
                            className={"my-custom-select-references"}
                            size={'small'}
                            placeholder={"Выбор..."}
                            value={null}
                            style={{
                                width: '100%'
                            }}
                            loading={loadReference}
                            onSelect={(value) => {
                                const selectedReference = dataReference?.references?.items.find(item => item.id === value);
                                const referen_values = JSON.parse(selectedReference.reference_values);
                                const outputs = referen_values.reduce((acc, item) => {
                                    if (typeof item.value !== 'string') {
                                        console.error(`Неверный формат значения: ${item.value}`);
                                        return acc;
                                    }
                                    const id = nanoid();
                                    acc[id] = {name: item.name, value: parseInt(item.value)}; // Преобразование строки в число
                                    return acc;
                                }, {});
                                store.addReferenceNode(outputs);
                            }}
                        >
                            {dataReference?.references?.items?.map(row => (
                                <Select.Option key={row.id} value={row.id}>
                                    {row.name}
                                </Select.Option>
                            ))}
                        </CustomSelect>
                        <CustomButton size={'small'}
                                      className={"my-custom-btn-create-references"}
                                      onClick={() => {
                                      }}
                                      icon={<PlusCircleOutlined/>}/>
                    </Space.Compact>

                    <Divider style={{margin: 0, marginBottom: '10px', color: colors.textColor}}>Ввод/Вывод</Divider>
                    <CustomButton size={'small'}
                                  className={"my-custom-btn-add-input"}
                            onClick={() => {
                                store.addInputNode('single');
                                console.log("От кнопки ушло");
                            }}
                            icon={<PlusCircleOutlined/>}>Ввод значения</CustomButton>
                    <CustomButton size={'small'}
                            className={"my-custom-btn-add-input-array"}
                            onClick={() => {
                                store.addArrayInputNode();
                                console.log("От кнопки ушло");
                            }}
                            icon={<PlusCircleOutlined/>}>Ввод значений</CustomButton>

                    <CustomButton size={'small'}
                                  className={"my-custom-btn-add-output"}
                            onClick={() => {
                                store.addOutputNode('single');
                                console.log("От кнопки ушло");
                            }}
                            icon={<PlusCircleOutlined/>}>Вывод значений</CustomButton>
                </Sider>
                <Content style={{
                    border: '1px solid ' + colors.border, // стиль и цвет границы
                    textAlign: 'center',
                    height: '100%',
                    color: 'black',
                    backgroundColor: colors.background
                }}>
                    <div style={{width: "100%", height: "100%"}}>
                        <Modal
                            open={createFenrirModalVisible?.visible ?? false}
                            onCancel={() => setCreateFenrirModalVisible({...createFenrirModalVisible, visible: false})}
                            footer={null}>
                            <FenrirForm type={createFenrirModalVisible?.type} fenrir={store.getModels()}/>
                        </Modal>
                        <Modal
                            open={viewFenrirModalVisible?.visible ?? false}
                            onCancel={() => setViewFenrirModalVisible({...createFenrirModalVisible, visible: false})}
                            footer={null}>
                            <FenrirView
                                onClose={() => setViewFenrirModalVisible({...createFenrirModalVisible, visible: false})}
                                type={viewFenrirModalVisible?.type}
                                onSetModels={(models) => setModel(models)}/>
                        </Modal>
                        <ReactFlowProvider>
                            <ReactFlow
                                proOptions={{hideAttribution: true}}
                                nodeTypes={nodeTypes}
                                nodes={store.nodes}
                                edges={store.edges}
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
                    </div>

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
                    }}>Ввод данных</Divider>
                    {store.nodes?.map((row) => {
                        if (row.type === 'inputNode') {
                            return Object.keys(row.data.outputs).map((key) => {
                                return (
                                    <div style={{width: "100%"}}>
                                        <Row style={{width: "100%"}}>
                                            {row.data.outputs[key].name} :
                                        </Row>
                                        <Row style={{width: "100%"}}>
                                            <Input
                                                size={"small"}
                                                value={row.data.outputs[key].value}
                                                onChange={(e) => {
                                                    if (e.target.value !== row.data.outputs[key].value) {
                                                        console.log("пеоотмееи", " было");
                                                        const data = row.data;
                                                        data.outputs[key].value = e.target.value;
                                                        store.updateNode(row.id, data);
                                                    }
                                                }}
                                                style={{width: "100%"}}
                                            />

                                        </Row>
                                    </div>

                                );
                            });
                        }
                        return null;
                    })}

                    <hr/>
                    {store.nodes?.map((row) => {
                        if (row.type === 'referenceNode') {
                            return (
                                <div key={row.id}>{row.id} - {row.type}</div>
                            );
                        }
                        return null;
                    })}
                    <hr/>
                    {store.nodes?.map((row) => {
                        if (row.type === 'arrayInputNode') {
                            return (
                                <div key={row.id}>{row.id} - {row.type}</div>
                            );
                        }
                        return null;
                    })}
                    <Divider style={{
                        margin: 0, marginBottom: '10px',
                        color: colors.textColor
                    }}>Вывод</Divider>
                    {store.nodes?.map((row) => {
                        if (row.type === 'outputNode') {
                            return (

                                <div key={row.id}>{row.id} - {row.type}</div>
                            );
                        }
                        return null;
                    })}
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
    )

        ;
}
