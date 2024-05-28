import {applyNodeChanges, applyEdgeChanges} from "reactflow";
import {nanoid} from "nanoid";
import {create} from "zustand";
import cosnsole from "util";


export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],

    getModels() {
        const state = {
            nodes: get().nodes,
            edges: get().edges,
        };
        return JSON.stringify(state, null, 2);
    },


    setModels(models) {
        set(models);
    },
    onNodesChange(changes) {
         set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    },


    createNode(type, data, x, y) {
        //console.log(type, data, x, y);
        const id = nanoid();

        switch (type) {
            case "inputNode": {
                const newData = {outputs: {"0": {name: "", value: 0}}};
                const position = {x: 0, y: 0};
                set({nodes: [...get().nodes, {id, type, data: newData, position}]});
                break;
            }
            case "arrayInputNode": {
                const newData = {outputs: {"only": {value: 0, name: ""}}};
                const position = {x: 0, y: 0};
                set({nodes: [...get().nodes, {id, type, data: newData, position}]});
                break;
            }
            case "outputNode": {
                const newData = {inputs: {}};
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
                const newData = {formulaData: data, outputs: []};
                const position = {x: 0, y: 0};
                set({nodes: [...get().nodes, {id, type, data: newData, position}]});
                break;
            }
            case "referenceNode": {
                const newData = {outputs: data};
                const position = {x: 0, y: 0};
                set({nodes: [...get().nodes, {id, type, data: newData, position}]});
                break;
            }
        }
    },
    updateNode(id, data) {
        //console.error('1 updateNode 1 ', id, data)
        //console.log("ALT updateNode final", get().edges);
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
                if (connectedNode) { // connectedNode - Обьект подключёных (дочерних узлов)
                    const targetHandle = state.edges.find(edge => edge.target === connectedNodeId && edge.source === id).targetHandle;
                    // Находим значение выхода текущего узла, которое будем передавать во вход подключенного узла
                    const sourceHandle = state.edges.find(edge => edge.target === connectedNodeId && edge.source === id).sourceHandle;

                    //console.log(state.edges);

                    const validSources = state.edges.filter(edge => edge.target === connectedNodeId).map(edge => edge.targetHandle);

                    //console.log("validSource", validSources)
                    let updatedInput = {};

                    if(connectedNode?.data?.inputs)
                     updatedInput = Object.keys(connectedNode.data.inputs).reduce((acc, key) => {
                        if (validSources.includes(key)) {
                            acc[key] = connectedNode.data.inputs[key];
                        }
                        return acc;
                    }, {});

                    //console.log("connectedNodeIds", connectedNodeIds)
                    if (targetHandle && sourceHandle) {
                        // getNode -  узел выхода
                        // connectedNode - Узел входа
                        //console.log("targetHandle && sourceHandle", targetHandle , sourceHandle)

                        updatedInput = {
                            ...updatedInput,
                            [targetHandle]: data.outputs[sourceHandle]
                        };
                        const updatedOutNode = {
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
                            updatedOutNode
                        );
                    }
                }
            });
            return {nodes: updatedNodes};
        });
    },
    onNodesDelete(deleted) {
        const newNodes = get().nodes.filter((node) => !deleted.some((d) => d.id === node.id));
        set({nodes: newNodes});
    },



    addEdge(data) {
        const updateNodeFunc = get().updateNode; // Получаем ссылку на функцию updateNode из хранилища

        const id = nanoid(6);
        const edge = {id, ...data};
        set({edges: [edge, ...get().edges]});
        const sourceNode = get().nodes.find(node => node.id === data.source);
        updateNodeFunc(sourceNode.id, sourceNode.data);
    },
    onEdgesChange(changes) {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });

    },
    onEdgesDelete(deleted) {
        const updateNodeFunc = get().updateNode; // Получаем ссылку на функцию updateNode из хранилища

        set((state) => ({
            edges: state.edges.filter((edge) => edge.id !== deleted.id)
        }));

        setTimeout(() => {
            deleted.forEach((edge) => {
                const sourceNode = get().nodes.find(node => node.id === edge.source);
                if (sourceNode) {
                    updateNodeFunc(sourceNode.id, sourceNode.data);
                }
            });
        }, 100); // Задержка в миллисекундах
    },
}));
