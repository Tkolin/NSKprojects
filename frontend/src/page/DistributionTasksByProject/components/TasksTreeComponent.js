import React, {useEffect, useState} from 'react';
import {Tree} from 'antd';

const App = ({value, onChange, onSelect, draggable, selectable, multiple, checkable, onCheck}) => {

    const onDrop = (info) => {
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
        const data = [...value];
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
            let ar = [];
            let i;
            loop(data, dropKey, (_item, index, arr) => {
                ar = arr;
                i = index;
            });
            if (dropPosition === -1) {
                ar.splice(i, 0, dragObj);
            } else {
                ar.splice(i + 1, 0, dragObj);
            }
        }
        onChange(data);
    };
    return (
        <Tree
            checkable={checkable}

            showLine={true}
            className="draggable-tree"
            draggable={draggable}
            multiple={multiple}
            blockNode

            onCheck={(value) => {
                 onCheck && onCheck(value)
            }}

            selectable={selectable}
            onSelect={(value) => {
                 onSelect && onSelect(value)
            }}
            onDrop={onDrop}
            treeData={value}
        />
    );
};
export default App;