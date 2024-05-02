import React from "react";
import ReactFlow, {
    ReactFlowProvider,
    Background,
    Panel,
    useReactFlow,
} from "reactflow";
import { shallow } from "zustand/shallow";
import { useStore } from "./store";
import { tw } from "twind";
import InputNode from "./nodes/InputNode";
import MathOperationNode from "./nodes/MathOperationNode";
import OutputNode from "./nodes/OutputNode";

import "reactflow/dist/style.css";
import DevTools from "./devtoolH/Devtools";
import FormulaNode from "./nodes/FormulaNode";

const nodeTypes = {
    inputNode: InputNode,
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
    addInputNode: () => store.createNode("inputNode"),
    addMathOperationNode: () => store.createNode("MathOperationNode"),
});

export default function App() {
    const store = useStore(selector, shallow);
    return (
   <>Пельмени</>
    );
}
