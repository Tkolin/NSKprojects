import {applyNodeChanges, applyEdgeChanges} from "reactflow";
import {nanoid} from "nanoid";
import {create} from "zustand";


export const useStore = create((set, get) => ({
    nodes: [
        {
            id: "inputNode",
            type: "inputNode",
            data: {
                outputs:{
                    'one': { name: 'Переменная 1', value: 15 },
                    'two': { name: 'Переменная 2', value: 20 }
                },
            },
            position: {x: -150, y: 0},
        },
        {
            id: "inputNode1",
            type: "inputNode",
            data: {
                outputs:{
                    'output': { name: 'Переменная 1', value: 15 },
                    'two': { name: 'Переменная 2', value: 20 }
                },
            },
            position: {x: 0, y: 0},
        },
        {
            id: "mathOperationNodeId",
            type: "mathOperationNode",
            data: {
                operation: "+",
                inputs: {"x": {value: 1},
                    "y": {value: 2}},
            },
            position: {x: -150, y: 300},
        },
        {
            id: "mathOperationNodeId1",
            type: "mathOperationNode",
            data: {
                operation: "+",
                inputs: {"x": {value: 1},
                    "y": {value: 2}},
            },
            position: {x: -150, y: 450},
        },
        {
            id: "outputNode1",
            type: "formulaNode",
            data: {inputs: {}},
            position: {x: 450, y: 800},
        },
        {
            id: "outputNode2",
            type: "formulaNode",
            data: {inputs: {}},
            position: {x: 450, y: 400},
        }
    ],
    edges: [],

    onNodesChange(changes) {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    },


    createNode(type, data, x, y) {
        console.log(type, data, x, y);
        const id = nanoid();

        switch (type) {
            case "inputNode": {
                const newData = {value: 0};
                const position = {x: 0, y: 0};
                set({nodes: [...get().nodes, {id, type, data: newData, position}]});
                break;
            }
            case "arrayInputNode": {
                const newData = {value: 0};
                const position = {x: 0, y: 0};
                set({nodes: [...get().nodes, {id, type, data: newData, position}]});
                break;
            }
            case "outputNode": {
                const newData = {value: 0};
                const position = {x: 0, y: 0};
                set({nodes: [...get().nodes, {id, type, data: newData, position}]});
                break;
            }
            case "mathOperationNode": {
                const newData = {gain: '+'};
                const position = {x: 0, y: 0};
                set({nodes: [...get().nodes, {id, type, data: newData, position}]});
                break;
            }
            case "formulaNode": {
                const newData = {formulaData: data};
                const position = {x: 0, y: 0};
                set({nodes: [...get().nodes, {id, type, data: newData, position}]});
                break;
            }
        }
    },
    updateNode(id, data) {
        console.error('1 updateNode 1 ', id, data)
        set((state) => {
            // + Обновляем data в переданном узле
            const updatedNodes = state.nodes.map((node) =>
                node.id === id ? {...node, data: {...node.data, ...data}} : node
            );

            // Получаем список дочерних элементов ОТ этого узла (1 уровень)
            const connectedNodeIds = state.edges
                .filter(edge => edge.source === id)
                .map(edge => edge.target);

            // Обновляем дочерние элементы
            connectedNodeIds.forEach(connectedNodeId => {
                const connectedNode = updatedNodes.find(node => node.id === connectedNodeId);
                console.error('connectedNode ', connectedNode);
                if (connectedNode) { // connectedNode - Обьект подключёных (дочерних узлов)
                    console.log('connectedNode', connectedNode);
                    const targetHandle = state.edges.find(edge => edge.target === connectedNodeId && edge.source === id).targetHandle;
                    // Находим значение выхода текущего узла, которое будем передавать во вход подключенного узла
                    const sourceHandle = state.edges.find(edge => edge.target === connectedNodeId && edge.source === id).sourceHandle;
                    console.log('targetHandle', targetHandle);
                    console.log('sourceHandle', sourceHandle);

                    if (targetHandle && sourceHandle) {
                        // Добавляем новый обьект values {'ключ': {полученая дата из связаного узла}}
                        const updatedInput = {
                            ...connectedNode.data.inputs,
                            [targetHandle]: data.outputs[sourceHandle]
                        };
                        const updatedMathNode = {
                            ...connectedNode,
                            data: {
                                ...connectedNode.data,
                                inputs: updatedInput,
                            },
                        };
                        // Заменяем узел в массиве updatedNodes
                        updatedNodes.splice(
                            updatedNodes.findIndex(node => node.id === connectedNodeId),
                            1,
                            updatedMathNode
                        );
                    }
                }
            });
            console.log('updatedNodes Final', updatedNodes);
            return {nodes: updatedNodes};
        });
    },
    onNodesDelete(deleted) {
        const newNodes = get().nodes.filter((node) => !deleted.some((d) => d.id === node.id));
        set({nodes: newNodes});
    },

    onEdgesChange(changes) {
        console.log('onEdgesChange');

        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
    },

    addEdge(data) {
        console.log('addEdge', data);

        const id = nanoid(6);
        const edge = {id, ...data};

        set({edges: [edge, ...get().edges]});
    },

    onEdgesDelete(deleted) {
        const newEdges = get().edges.filter((edge) => !deleted.some((d) => d.source === edge.source && d.target === edge.target));
        set({edges: newEdges});
    },
}));
