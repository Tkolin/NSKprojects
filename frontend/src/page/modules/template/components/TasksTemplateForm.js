import React, { useEffect, useState } from 'react';
import { Collapse, Divider, Modal, notification, Transfer, Tree} from 'antd';
import {useMutation, useQuery} from '@apollo/client';
import {UPDATE_TASKS_TEMPLATE_MUTATION} from "../../../../../graphql/mutationsTemplate";
import {StyledButtonGreen} from "../../../../style/ButtonStyles";
import {LoadingOutlined} from "@ant-design/icons";
import TasksToProjectStageForm from "../../projectTasks/components/old/TasksToProjectStageForm";
import {TASKS_QUERY, TEMPLATE_TASKS_TYPE_PROJECTS_QUERY} from "../../../../../graphql/queries";
const { Panel } = Collapse;

const App = ({ typeProjectId, triggerMethod, setTriggerMethod, disabled }) => {
    const [targetKeys, setTargetKeys] = useState([]);
    const [gData, setGData] = useState();


    const handleViewListProjectTasksStage = () => {
        setViewListProjectTasksStageModalVisible(false);
    };
    const { data: dataTasks, loading: loadingTasks } = useQuery(TASKS_QUERY);


    const handleChange = (newTargetKeys) => {
        setTargetKeys(newTargetKeys);
    };
    useEffect(() => {
        if (dataTasks && dataTasks.tasks) {
            const tasks = dataTasks.tasks.items.map((task) => ({
                key: task.id.toString(),
                title: task.name,
                children: [],
            }));
            const updatedGData = tasks.filter(item => targetKeys.includes(item.key));

            setGData(updatedGData);
        }
    }, [dataTasks, targetKeys]);







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

    const [viewListProjectTasksStageModalVisible, setViewListProjectTasksStageModalVisible] = useState(false);

    // Функции уведомлений
    const openNotification = (placement, type, message) => {
        notification[type]({
            message: message, placement,
        });
    };
    // Мутации для добавления и обновления
    const [updateTemplateTask] = useMutation(UPDATE_TASKS_TEMPLATE_MUTATION, {
        onCompleted: () => {
            openNotification('topRight', 'success', 'Данные успешно обновлены tasks!');
        }, onError: (error) => {
            openNotification('topRight', 'error', 'Ошибка при обновлении данных: tasks' + error.message);
        }
    });
    const {
        loading: loadingTemplate, error: errorTemplate, data: dataTemplate
    } = useQuery(TEMPLATE_TASKS_TYPE_PROJECTS_QUERY, {
        onCompleted: (data) => loadTemplate(data),
        variables: {typeProject: typeProjectId},
        fetchPolicy: 'network-only',
    });
    // Функция для извлечения данных из gData
    const extractDataFromTree = (treeData, parentKey = null) => {
        const extractedData = [];
        const extract = (data, parentKey) => {
            data.forEach((item) => {
                const currentKey = item.key;
                extractedData.push({
                    task_id: currentKey,
                    up_task_id: parentKey,
                });
                if (item.children) {
                    extract(item.children, currentKey);
                }
            });
        };
        extract(treeData, parentKey);
        return extractedData;
    };



    // Обработчик отправки формы
    const handleSubmit = () => {
        const tasksData = extractDataFromTree(gData.filter(item => targetKeys.includes(item.key)));
        updateTemplateTask({
            variables: {
                typeProjectId: typeProjectId,
                listTasks_id: tasksData && tasksData.map(task => parseInt(task.task_id)),
                listInheritedTasks_id: tasksData && tasksData.map(task => parseInt(task.up_task_id)),
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


    const loadTemplate = (data) => {
        if (data && data.templatesTasksTypeProjects) {
            const tasks = data && data.templatesTasksTypeProjects;
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
                const parentId = task.inheritedTask && task.inheritedTask.task && task.inheritedTask.task.id;
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




            setGData(gd);
            console.log(JSON.stringify(gd, null, 4));
            console.log(JSON.stringify(gData, null, 4));

        }
    };
    if(loadingTemplate)
        return <LoadingOutlined
            style={{
                fontSize: 24,
            }}
            spin
        />
    return (
        <>
            <div>
                <Transfer
                    disabled={disabled}
                    dataSource={dataTasks && dataTasks.tasks
                        ? dataTasks.tasks.items.map(task => ({
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
            <Collapse defaultActiveKey={['1']} disabled={disabled} >
                <Panel header="Групировка задач" key="1" disabled={disabled}>
                    <Tree
                        disabled={disabled}
                        style={{ margin: 15 }}
                        className="draggable-tree"
                        draggable
                        blockNode
                        onDrop={onDrop}
                        treeData={gData && generateTreeData(gData)}
                    />
                </Panel>
            </Collapse>
            <Modal
                width={1200}
                open={viewListProjectTasksStageModalVisible}
                onCancel={() => setViewListProjectTasksStageModalVisible(false)}
                footer={null}
                onClose={handleViewListProjectTasksStage}>
                <TasksToProjectStageForm />
            </Modal>
            <StyledButtonGreen
                disabled={disabled}
                type={"dashed"} style={{width: '100%', marginTop: 10}}
                               onClick={() => setViewListProjectTasksStageModalVisible(true)}>Распределить задачи по этапам</StyledButtonGreen>
        </>
    );
};

export default App;
