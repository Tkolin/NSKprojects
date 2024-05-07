import React, {useState} from "react";
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
import DevTools from "./devtoolH/Devtools";
import FormulaNode from "./nodes/FormulaNode";
import ReferenceNode from "./nodes/ReferenceNode";
import {Button, Divider, Layout, Menu, Modal, Row, Select} from "antd";
import {Header} from "antd/es/layout/layout";
import {Content, Footer} from "antd/lib/layout/layout";
import Sider from "antd/es/layout/Sider";
import {colors, exstra_colors} from "../style/colors";
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
import {CompactMenu, CustomSelect} from "./FenrirStyles";
import SubMenu from "antd/es/menu/SubMenu";
import FenrirForm from "./form/FenrirForm";
import FenrirView from "./form/FenrirView";


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
    arrayInputNode: InputArrayNode,
    mathOperationNode: MathOperationNode,
    outNode: OutputNode,
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
    //addMathOperationNode: (data) => store.createNode('mathOperationNode',data),
});

export default function FenrirPage() {
    const [createFenrirModalVisible, setCreateFenrirModalVisible] = useState();
    const [viewFenrirModalVisible, setViewFenrirModalVisible] = useState();
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
                <hr/>
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

                    <CustomSelect
                        className={"my-custom-select-formula"}
                        size={'small'}
                        loading={loadFormulas}
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
                    <Divider style={{margin: 0, marginBottom: '10px', color: colors.textColor}}>Функции</Divider>
                    <CustomSelect
                        className={"my-custom-select-functions"}
                        size={'small'}
                        style={{
                            width: '100%'
                        }}
                        loading={loadFormulas}
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
                    <Divider style={{margin: 0, marginBottom: '10px', color: colors.textColor}}>Мат. операции</Divider>
                    <CustomSelect
                        className={"my-custom-select-math"}
                        size={'small'}
                        style={{
                            width: '100%'
                        }}
                        //onSelect={(value)=>store.addMathOperationNode(value)}
                    >
                        <Select.Option value="1">Option 1</Select.Option>
                        <Select.Option value="1">Option 1</Select.Option>
                    </CustomSelect>
                    <Divider style={{margin: 0, marginBottom: '10px', color: colors.textColor}}>Справоочники</Divider>
                    <CustomSelect
                        className={"my-custom-select-references"}
                        size={'small'}
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

                    <Divider style={{margin: 0, marginBottom: '10px', color: colors.textColor}}>Ввод/Вывод</Divider>
                    <Button size={'small'} style={{
                        width: '100%',
                        backgroundColor: colors.input.secondary,
                        border: '1.5px solid ' + colors.input.primary,
                        borderRadius: '2px',
                        marginBottom: '5px', color: "#e2e3e7"
                    }}
                            onClick={() => {
                                store.addInputNode('single');
                                console.log("От кнопки ушло");
                            }}
                            icon={<PlusCircleOutlined/>}>Создать ввод</Button>
                    <Button size={'small'} style={{
                        width: '100%',
                        backgroundColor: colors.input.secondary,
                        border: '1.5px solid ' + colors.input.primary,
                        borderRadius: '2px',
                        marginBottom: '5px', color: "#e2e3e7"
                    }}
                            onClick={() => {
                                store.addArrayInputNode();
                                console.log("От кнопки ушло");
                            }}
                            icon={<PlusCircleOutlined/>}>Создать массива</Button>
                    <Button size={'small'} style={{
                        width: '100%',
                        backgroundColor: colors.output.secondary,
                        border: '1.5px solid ' + colors.output.primary,
                        borderRadius: '2px',
                        marginBottom: '5px', color: "#e2e3e7"
                    }}
                            onClick={() => {
                                store.addOutputNode('single');
                                console.log("От кнопки ушло");
                            }}
                            icon={<PlusCircleOutlined/>}>Создать вывод</Button> </Sider>
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
                            footer={null} >
                            <FenrirForm type={createFenrirModalVisible?.type} fenrir={store.getModels()}/>
                        </Modal>
                        <Modal
                            open={viewFenrirModalVisible?.visible ?? false}
                            onCancel={() => setViewFenrirModalVisible({...createFenrirModalVisible, visible: false})}
                            footer={null} >
                            <FenrirView type={viewFenrirModalVisible?.type} onSetModels={store.setModels}/>
                        </Modal>
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
                    }}
                    >Ввод данных</Divider>
                    <Divider style={{margin: 0, marginBottom: '10px', color: colors.textColor}}>Вывод данных</Divider>
                    <Button onClick={handleSaveContext} children={"Получить текущее состояние"}/>

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
