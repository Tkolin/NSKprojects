import {applyNodeChanges, applyEdgeChanges} from "reactflow";
import {nanoid} from "nanoid";
import {create} from "zustand";


export const useStore = create((set, get) => ({
    nodes: [
        {
            id: "inputNode",
            type: "inputNode",
            data: {values: {'one': 1}},
            position: {x: -0, y: 0},
        },
        {
            id: "inputNode1",
            type: "inputNode",
            data: {values: {'one': 2}},
            position: {x: 0, y: 0},
        },
        {
            id: "mathOperationNodeId",
            type: "mathOperationNode",
            data: {
                operation: "+",
                inputs: {x: 1, y: 2},
            },
            position: {x: 0, y: 0},
        },
        {
            id: "mathOperationNodeId1",
            type: "mathOperationNode",
            data: {
                operation: "+",
                inputs: {x: 1, y: 2},
            },
            position: {x: 0, y: 0},
        },
        {
            id: "outputNode1",
            type: "formulaNode",
            data: {inputs: {}},
            position: {x: 0, y: 0},
        },
        {
            id: "outputNode2",
            type: "formulaNode",
            data: {inputs: {}},
            position: {x: 0, y: 0},
        }
    ],
    edges: [
        {
            id: "inputNode->mathOperationNodeId",
            source: "inputNode",
            sourceHandle: 'output',
            target: "mathOperationNodeId",
            targetHandle: 'x',
        },
        {
            id: "inputNode1->mathOperationNodeId",
            source: 'inputNode1',
            sourceHandle: 'output',
            target: 'mathOperationNodeId',
            targetHandle: 'y'
        },

    ],

    onNodesChange(changes) {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    },


    createNode(type, x, y) {

        const id = nanoid();

        switch (type) {
            case "inputNode": {
                const data = {value: 0};
                const position = {x: 0, y: 0};

                set({nodes: [...get().nodes, {id, type, data, position}]});

                break;
            }

            case "mathOperationNode": {
                const data = {gain: '+'};
                const position = {x: 0, y: 0};

                set({nodes: [...get().nodes, {id, type, data, position}]});

                break;
            }
        }
    },
    updateNode(id, data) {
        console.error('updateNode ', id, data)
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
                //console.error('connectedNode ', connectedNode);
                if (connectedNode) {
                    const targetHandle = state.edges.find(edge => edge.target === connectedNodeId && edge.source === id).targetHandle;
                    // Находим значение выхода текущего узла, которое будем передавать во вход подключенного узла
                    const sourceHandle = state.edges.find(edge => edge.target === connectedNodeId && edge.source === id).sourceHandle;

                    if (targetHandle && sourceHandle) {
                        // Добавляем новую пару ключ-значение в объект values у узла mathOperationNode
                        const updatedInput = {
                            ...connectedNode.data.inputs,
                            [targetHandle]: data.values[sourceHandle]
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
            console.log('updatedNodes Final', updatedNodes );
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
