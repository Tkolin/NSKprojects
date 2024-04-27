import { useCallback, useState } from 'react';
import ReactFlow, { addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import 'reactflow/dist/style.css';

import InputNode from "./InputNode.js";
import SumNode from "./SumNode";
import OutputNode from "./OutputNode";

const rfStyle = {
    backgroundColor: '#B8CEFF',
};

const initialNodes = [
    { id: 'node-0', type: 'inputNode', position: { x: 0, y: 0 }, data: { value: 0 } },
    { id: 'node-1', type: 'inputNode', position: { x: 100, y: 0 }, data: { value: 0 } },
    {
        id: 'node-2',
        type: 'sumNode',
        targetPosition: 'top',
        position: { x: 0, y: 200 },
        data: { label: 'node 2' },
    },
    {
        id: 'node-3',
        type: 'outputNode',
        targetPosition: 'top',
        position: { x: 200, y: 200 },
        data: { label: 'node 3' },
    },
];
const initialEdges = [
    { id: 'edge-0', source: 'node-0', target: 'node-2', animated: true },
    { id: 'edge-1', source: 'node-1', target: 'node-2', animated: true },
    { id: 'edge-2', source: 'node-2', target: 'node-3', animated: true }
];

const nodeTypes = {
    inputNode: InputNode,
    sumNode: SumNode,
    outputNode: OutputNode };

function Flow() {
    const [inputValues, setInputValues] = useState({ node0: 0, node1: 0 });
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
    );
    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );
    const onConnect = useCallback(
        (connection) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges]
    );
    const handleChange = () =>{
        console.log(nodes);
    };
    return (
        <div style={{width: '100vh', height: '100vh'}}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onChange={handleChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                style={rfStyle}
            />
        </div>

    );
}

export default Flow;
