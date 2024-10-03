// ColoredTree.jsx

import { Skeleton, Tree } from 'antd';
import React, { useEffect, useState } from 'react';

// Функция для построения дерева из плоского списка задач
const buildTree = (tasks) => {
  const tree = [];
  const lookup = {};

  tasks.forEach((task) => {
    lookup[task.id] = { ...task, children: [] };
  });

  tasks.forEach((task) => {
    if (task.project_task_inherited_id) {
      if (lookup[task.project_task_inherited_id]) {
        lookup[task.project_task_inherited_id].children.push(lookup[task.id]);
      }
    } else {
      tree.push(lookup[task.id]);
    }
  });

  return tree;
};

// Функция для определения цвета узла на основе исполнителей
const determineColor = (node) => {
  if (!node.children || node.children.length === 0) {
    // Узел без подзадач
    return node.executor ? 'green' : 'red';
  }

  let allChildrenAssigned = true;
  let someChildrenAssigned = false;

  node.children.forEach((child) => {
    const childColor = determineColor(child);
    console.log("dermo", childColor);
    if (childColor === 'red') {
      allChildrenAssigned = false;
    }
    if (childColor === 'yellow') {
      allChildrenAssigned = false;
    }
    if (childColor !== 'red') {
      someChildrenAssigned = true;
    }
  });

  if (allChildrenAssigned) {
    return 'green';
  } else if (someChildrenAssigned) {
    return 'yellow';
  } else {
    return 'red';
  }
};

// Функция для применения цвета к заголовку узла с иконкой
const applyColorToTitle = (node, color) => {

  let icon;
  let bgColor;
  switch (color) {
    case 'green':
      icon = '✔️';
      bgColor = "#95de64";
      break;
    case 'yellow':
      icon = '⚠️';
      bgColor = "#ffe58f";
      break;
    case 'red':
      icon = '❌';
      bgColor = "#ffa39e";
      break;
    default:
      icon = '';
  }

  return (
    <span >
      <span style={{borderRadius: "9px", padding: "0px 5px", border: "1px solid" }}>
       {node.offset ?? 0}
       -
      {node.duration ?? 0}
       </span>
      
        <span style={{ backgroundColor: bgColor, borderRadius: "15px", padding: "2px 15px" }}>
        {icon} {node.task.name} 

        </span>
    </span>
  );
};

// Функция для преобразования древовидной структуры в формат, подходящий для компонента Tree
const transformTreeData = (nodes) => {
  return nodes.map((node) => {
     const color = determineColor(node);
    const transformedNode = { 

      key: node.id.toString(),
      title: applyColorToTitle(node, color),
      children: transformTreeData(node.children),
    };
    return transformedNode;
  });
};

const ColoredTree = ({
  project_tasks, // Плоский список задач
  onChange, // Функция для обновления задач при изменении дерева
  onSelect, // Функция при выборе узла
  draggable = true, // Разрешить перетаскивание
  selectable = true, // Разрешить выбор узлов
  multiple = true, // Разрешить множественный выбор
  checkable = false, // Не используем чекбоксы
}) => {
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Построение и окраска дерева при изменении `project_tasks`
  useEffect(() => {
    if (project_tasks && project_tasks.length > 0) {
      const tree = buildTree(project_tasks);
      const coloredTree = transformTreeData(tree);
      setTreeData(coloredTree);
      setLoading(false);
    } else {
      setTreeData([]);
      setLoading(false);
    }
  }, [project_tasks]);

  // Обработчик перетаскивания узлов
  const handleDrop = (info) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]); // позиция относительно узла

    const data = [...project_tasks];
    let dragObj;

    // Удаляем перетаскиваемый узел из исходного места
    const removeNode = (data, key) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id.toString() === key) {
          dragObj = data.splice(i, 1)[0];
          return true;
        }
        if (data[i].children && removeNode(data[i].children, key)) {
          return true;
        }
      }
      return false;
    };

    removeNode(data, dragKey);

    if (!info.dropToGap) {
      // Если перетаскивание внутрь узла
      const addNode = (data, key) => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].id.toString() === key) {
            data[i].children = data[i].children || [];
            data[i].children.unshift({ ...dragObj, project_task_inherited_id: parseInt(key) });
            return true;
          }
          if (data[i].children && addNode(data[i].children, key)) {
            return true;
          }
        }
        return false;
      };
      addNode(data, dropKey);
    } else {
      // Если перетаскивание на уровень узла
      const addNodeAtPosition = (data, key, pos) => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].id.toString() === key) {
            if (pos === -1) {
              data.splice(i, 0, { ...dragObj, project_task_inherited_id: data[i].project_task_inherited_id });
            } else {
              data.splice(i + 1, 0, { ...dragObj, project_task_inherited_id: data[i].project_task_inherited_id });
            }
            return true;
          }
          if (data[i].children && addNodeAtPosition(data[i].children, key, pos)) {
            return true;
          }
        }
        return false;
      };
      addNodeAtPosition(data, dropKey, dropPosition);
    }

    // Обновляем состояние задач
    if (onChange) {
      onChange(data);
    }
  };

  if (loading) {
    return <Skeleton active />;
  }

  return (
    <Tree
      showLine={true}
      className="colored-tree"
      draggable={draggable}
      multiple={multiple}
      blockNode
      selectable={selectable}
      onSelect={onSelect}
      treeData={treeData}
      onDrop={handleDrop}
    />
  );
};

export default ColoredTree;
