import React, { useState } from 'react';
import { theme, Transfer, Tree} from 'antd';
import {useQuery} from "@apollo/client";
import {GET_TEMPLATES_TASKS_TYPE_PROJECTS} from "../../graphql/queriesSearch";
const isChecked = (selectedKeys, eventKey) => selectedKeys.includes(eventKey);
const generateTree = (treeNodes = [], checkedKeys = []) =>
    treeNodes.map(({ children, ...props }) => ({
        ...props,
        disabled: checkedKeys.includes(props.key),
        children: generateTree(children, checkedKeys),
    }));
const TreeTransfer = ({ dataSource, targetKeys, ...restProps }) => {
    const { token } = theme.useToken();
    const transferDataSource = [];
    function flatten(list = []) {
        list.forEach((item) => {
            transferDataSource.push(item);
            flatten(item.children);
        });
    }
    flatten(dataSource);
    return (
        <Transfer
            {...restProps}
            targetKeys={targetKeys}
            dataSource={transferDataSource}
            className="tree-transfer"
            render={(item) => item.title}
            showSelectAll={false}
        >
            {({ direction, onItemSelect, selectedKeys }) => {
                if (direction === 'left') {
                    const checkedKeys = [...selectedKeys, ...targetKeys];
                    return (
                        <div
                            style={{
                                padding: token.paddingXS,
                            }}
                        >
                            <Tree
                                blockNode
                                checkable
                                checkStrictly
                                defaultExpandAll
                                checkedKeys={checkedKeys}
                                treeData={generateTree(dataSource, targetKeys)}
                                onCheck={(_, { node: { key } }) => {
                                    onItemSelect(key, !isChecked(checkedKeys, key));
                                }}
                                onSelect={(_, { node: { key } }) => {
                                    onItemSelect(key, !isChecked(checkedKeys, key));
                                }}
                            />
                        </div>
                    );
                }
            }}
        </Transfer>
    );
};

const App = () => {
    const [targetKeys, setTargetKeys] = useState([]);
    const { loading: loading, error: error, data: dataTasks } = useQuery(GET_TEMPLATES_TASKS_TYPE_PROJECTS, {
        variables: { typeProjectId: 1 },
    });

    const buildHierarchy = (tasks, parentId = null) => {
        return tasks
            .filter(task => task.inherited_task_id === parentId)
            .map(task => {
                const children = buildHierarchy(tasks, task.id);
                return { ...task, children };
            });
    };

    const renderTree = (dataSource) => {
        return dataSource.map(item => ({
            key: item.id,
            title: item.task.name,
            children: item.children ? renderTree(item.children) : null,
        }));
    };
    const tasksHierarchy = buildHierarchy(dataTasks?.templatesTasksTypeProjects || []);

    const addNumbersToHierarchy = (tasks, parentNumber = "") => {
        return tasks.map((task, index) => {
            const number = parentNumber === "" ? `${index + 1}` : `${parentNumber}.${index + 1}`;
            const numberedName = `${number} ${task.task.name}`;
            const children = task.children ? addNumbersToHierarchy(task.children, number) : null;
            return { ...task, task: { ...task.task, name: numberedName }, children };
        });
    };

    const tasksHierarchyWithNumbers = addNumbersToHierarchy(tasksHierarchy);

    const dataSource = renderTree(tasksHierarchyWithNumbers);


    const onChange = (keys) => {
        setTargetKeys(keys);
    };
    return <TreeTransfer dataSource={dataSource} targetKeys={targetKeys} onChange={onChange} />;
};
export default App;