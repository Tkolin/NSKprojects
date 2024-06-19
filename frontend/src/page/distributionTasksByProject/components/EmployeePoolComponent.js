import React, {useEffect, useState} from 'react';
import {Form, Tree} from 'antd';


const TasksTreeComponent = ({value, onChange, stageNumber, mode = "editor", onSelect, selectable}) => {

    const [expandedKeys, setExpandedKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState();// number: {31,31,13,13}
    const [autoExpandParent, setAutoExpandParent] = useState(true);

    useEffect(() => {
        console.log("onChangeTree", value);
        onChange && onChange(value)
    }, [value]);
    const onDragEnter = (info) => {
        console.log(info);
        // expandedKeys, set it when controlled is needed
        // setExpandedKeys(info.expandedKeys)
    };
    if (!value || !value?.gData) {
        return "задач нету"
    }

    const onDrop = (info) => {
        console.log(info);
        const dropKey = info.node.key;
        const dragKey = info.dragNode.key;
        const dropPos = info.node.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]); // the drop position relative to the drop node, inside 0, top -1, bottom 1

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
        const data = [...value.gData];

        // Find dragObject
        let dragObj;
        loop(data, dragKey, (item, index, arr) => {
            arr.splice(index, 1);
            dragObj = item;
        });
        if (!info.dropToGap) {
            // Drop on the content
            loop(data, dropKey, (item) => {
                item.children = item.children || [];
                // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
                item.children.unshift(dragObj);
            });
        } else {
            let ar = [];
            let i;
            loop(data, dropKey, (_item, index, arr) => {
                ar = arr;
                i = index;
            });
            if (dropPosition === -1) {
                // Drop on the top of the drop node
                ar.splice(i, 0, dragObj);
            } else {
                // Drop on the bottom of the drop node
                ar.splice(i + 1, 0, dragObj);
            }
        }
        onChange({...value, gData: data});

    };

    const onExpand = (expandedKeysValue) => {
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        setExpandedKeys(expandedKeysValue);
        setAutoExpandParent(false);
    };
    const onCheck = (checkedKeysValue) => {
        onChange({...value, checkedKeys: {...value?.checkedKeys, [stageNumber]: checkedKeysValue}});
    };
    const onSelectLocal = (selectedKeysValue, info) => {
        onSelect && onSelect(info.node);
        setSelectedKeys(selectedKeysValue);
    };

    const updateTreeData = (list) => {
        console.log("value",value)
        return list.map(node => {
            node.disableCheckbox = false;

            // Disable the node if it is already checked in other stages
            for (let stage in value?.checkedKeys) {
                if (stage !== "null" && stage !== stageNumber?.toString() && value?.checkedKeys[stage].includes(node.key)) {
                    node.disableCheckbox = true;
                    break;
                } else {
                    node.disableCheckbox = false;
                }
            }
            if (node.children) {
                node.children = updateTreeData(node.children);
            }
            return node;
        });
    };
    return (
        <Tree
            checkable={stageNumber}
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onCheck={onCheck}
            checkedKeys={stageNumber && value?.checkedKeys && value?.checkedKeys[stageNumber]}
            onSelect={onSelectLocal}
            selectedKeys={selectedKeys}

            selectable={selectable}

            className="draggable-tree"
            defaultExpandedKeys={expandedKeys}
            draggable={mode === "editor"}
            blockNode={mode === "editor"}
            onDragEnter={onDragEnter}
            onDrop={onDrop}
            treeData={updateTreeData(value.gData)}
        />

    );
};
export default TasksTreeComponent;