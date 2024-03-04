import React, { useEffect, useState } from 'react';
import {Button, Collapse, Divider, notification, Transfer, Tree} from 'antd';
import {SEARCH_TASKS_QUERY, SEARCH_TEMPLATE_TASKS_OR_TYPE_PROJECT_QUERY} from '../../graphql/queriesSearch';
import {useMutation, useQuery} from '@apollo/client';
import {UPDATE_TASKS_TEMPLATE_MUTATION} from "../../graphql/mutationsTemplate";
const { Panel } = Collapse;

const App = ({ typeProjectId, triggerMethod, setTriggerMethod }) => {
    const [dataTasks, setDataTasks] = useState(null);
    const [targetKeys, setTargetKeys] = useState([]);
    const [gData, setGData] = useState();
    const {  } = useQuery(
        SEARCH_TASKS_QUERY,
        {
            onCompleted: (data) => setDataTasks(data),
        }
    );


    const handleChange = (newTargetKeys) => {
        setTargetKeys(newTargetKeys);

    };

    useEffect(() => {
        if (dataTasks && dataTasks.tasksTable) {
            const tasks = dataTasks.tasksTable.tasks.map((task) => ({
                key: task.id.toString(),
                title: task.name,
                children: [],
            }));
            setGData(tasks);
        }
    }, [dataTasks]);



    const generateNumber = (parentNumbers, index) => {
        if (!parentNumbers) {
            return `${index + 1}`;
        }
        return `${parentNumbers}.${index + 1}`;
    };

    const generateTreeData = (data, parentNumbers = '') => {
        return data.map((item, index) => {
            const numbers = generateNumber(parentNumbers, index);
            return {
                key: item.key,
                title: `${numbers} ${item.title}`,
                children: item.children ? generateTreeData(item.children, numbers) : [],
            };
        });
    };

    const onDrop = (info) => {
        const dropKey = info.node.key;
        const dragKey = info.dragNode.key;
        const dropPos = info.node.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

        const loop = (data, key, callback) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].key === key) {
                    return callback(data[i], i, data);
                }
                if (data[i].children) {
                    loop(data[i].children, key, callback);
                }
            }
        };

        const data = [...gData];
        let dragObj;

        loop(data, dragKey, (item, index, arr) => {
            arr.splice(index, 1);
            dragObj = item;
        });

        if (!info.dropToGap) {
            loop(data, dropKey, (item) => {
                item.children = item.children || [];
                item.children.unshift(dragObj);
            });
        } else {
            let ar;
            let i;
            loop(data, dropKey, (item, index, arr) => {
                ar = arr;
                i = index;
            });
            if (dropPosition === -1) {
                ar.splice(i, 0, dragObj);
            } else {
                ar.splice(i + 1, 0, dragObj);
            }
        }
        setGData(data);
    };


    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message, placement,
        });
    };
    // Мутации для добавления и обновления
    const [updateTemplateTask] = useMutation(UPDATE_TASKS_TEMPLATE_MUTATION, {
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно обновлены tt!');
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных: tt' + error.message);
        }
    });
    const {
        loading: loadingTemplate, error: errorTemplate, data: dataTemplate
    } = useQuery(SEARCH_TEMPLATE_TASKS_OR_TYPE_PROJECT_QUERY, {
        onCompleted: (data) => loadTemplate(),
        variables: {typeProject: typeProjectId},
        fetchPolicy: 'network-only',
    });
    // Функция для извлечения данных из gData
    const extractDataFromTree = (treeData) => {
        const extractedData = [];
        const extract = (data, parentNumbers = '') => {
            data.forEach((item, index) => {
                const numbers = parentNumbers ? `${parentNumbers}.${index + 1}` : `${index + 1}`;
                extractedData.push({
                    task_id: item.key,
                    up_task_id: parentNumbers,
                    stage_number: numbers,
                });
                if (item.children) {
                    extract(item.children, numbers);
                }
            });
        };
        extract(treeData);
        return extractedData;
    };


    // Обработчик отправки формы
    const handleSubmit = () => {
        const tasksData = extractDataFromTree(gData);
        updateTemplateTask({
            variables: {
                typeProjectId: typeProjectId,
                listTasks_id: tasksData && tasksData.map(task => parseInt(task.task_id)),
                listInheritedTasks_id: tasksData && tasksData.map(task => parseInt(task.up_task_id)),
                stageNumber: tasksData && tasksData.map(task => task.stage_number),
            }
        });
    };
    // Триггер
    if (triggerMethod) {
        handleSubmit();
        setTriggerMethod(false); // Reset the trigger
    }
    // Подстановка значений
    const importDataToTree = (data, parentKey = null) => {
        return data.map((item, index) => {
            const newItem = {
                key: item.key,
                title: item.title,
                children: [],
            };

            if (item.children && item.children.length > 0) {
                newItem.children = importDataToTree(item.children, item.key);
            }

            return newItem;
        });
    };


    const loadTemplate = () => {
        if (dataTemplate) {
            const tasks = dataTemplate && dataTemplate.templatesTasksTypeProjects;
            const ids = tasks && tasks.map(data => ({
                key: data.task.id.toString(),
                title: data.task.name,
                children: tasks.filter(child => child.inheritedTask && child.inheritedTask.id === data.task.id)
                    .map(child => ({
                        key: child.task.id.toString(),
                        title: child.task.name,
                    })),
            }));

            setTargetKeys(ids.map(item => item.key));


            // Сначала сгруппируем tasks по inheritedTask.id
            const groupedTasks = tasks.reduce((acc, task) => {
                const parentId = task.inheritedTask && task.inheritedTask.id;
                if (!acc[parentId]) {
                    acc[parentId] = [];
                }
                acc[parentId].push(task);
                return acc;
            }, {});

            // Функция для создания дочерних элементов
            const createChildren = (parentId) => {
                const children = groupedTasks[parentId] || [];
                return children.map(child => ({
                    key: child.task.id.toString(),
                    title: child.task.name,
                    children: createChildren(child.task.id),
                }));
            };

            // Формируем иерархию, начиная с элементов без родителей
            const rootTasks = groupedTasks[null] || [];
            const gd = rootTasks.map(root => ({
                key: root.task.id.toString(),
                title: root.task.name,
                children: createChildren(root.task.id),
            }));

            setGData(importDataToTree(gd));
        }
    };

    return (
        <>
            <div>
                <Transfer

                    dataSource={dataTasks && dataTasks.tasksTable
                        ? dataTasks.tasksTable.tasks.map(task => ({
                            key: task.id.toString(),
                            title: task.name,
                            chosen: targetKeys.includes(task.id.toString()),
                        }))
                        : []}
                    showSearch
                    listStyle={{
                        display: 'flex',
                        flex: 1,
                        height: 300,
                    }}
                    operations={['Добавить', 'Убрать']}
                    targetKeys={targetKeys}
                    onChange={handleChange}
                    render={(item) => `${item.title}`}
                />
            </div>
            <Divider>Упорядочить</Divider>
            <Collapse defaultActiveKey={['1']} >
                <Panel header="Групировка задач" key="1">
                    <Tree
                        style={{ margin: 15 }}
                        className="draggable-tree"
                        draggable
                        blockNode
                        onDrop={onDrop}
                        treeData={gData && generateTreeData(gData.filter(item => targetKeys.includes(item.key)))}
                    />
                </Panel>
            </Collapse>
        </>
    );
};

export default App;
