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

const nodeTypes = {
  inputNode: InputNode,
  mathOperationNode: MathOperationNode,
  out: OutputNode,
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
      <ReactFlowProvider>
        <div style={{ width: "100vw", height: "100vh" }}>
          <ReactFlow
              nodeTypes={nodeTypes}
              nodes={store.nodes}
              edges={store.edges}
              onChange={console.log('change')}
              onNodesChange={store.onNodesChange}
              onNodesDelete={store.onNodesDelete}
              onEdgesChange={store.onEdgesChange}
              onEdgesDelete={store.onEdgesDelete}
              onConnect={store.addEdge}
              fitView
          >
            <DevTools />

            <Panel className={tw("space-x-4")} position="top-right">
              <button
                  className={tw("px-2 py-1 rounded bg-white shadow")}
                  onClick={store.addInputNode}
              >
                Add InputNode
              </button>
              <button
                  className={tw("px-2 py-1 rounded bg-white shadow")}
                  onClick={store.addMathOperationNode}
              >
                Add MathOperationNode
              </button>
            </Panel>
            <Background />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
  );
}
