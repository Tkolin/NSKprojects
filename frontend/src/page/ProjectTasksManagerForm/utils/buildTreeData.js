// export const buildTreeData = (project_stages, project_tasks) => {
//     // Создаём карту подзадач по их родителям
//     const tasksByParent = project_tasks.reduce((acc, task) => {
//       const parentId = task.project_task_inherited_id;
//       if (!acc[parentId]) {
//         acc[parentId] = [];
//       }
//       acc[parentId].push(task);
//       return acc;
//     }, {});
  
//     // Функция для рекурсивного построения дерева
//     const buildNode = (task) => {
//       const children = tasksByParent[task.id] || [];
//       return {
//         key: task.id.toString(),
//         title: task.task.name + task.task.name + " "+ task.task.name,
//         executor: task.executor, // Для окраски
//         children: children.map(buildNode),
//       };
//     };
  
//     // Строим дерево из project_stages
//     const treeData = project_stages.map((stage) => {
//       const mainTask = project_tasks.find(
//         (task) => task.id === stage.stage.task_id
//       );
  
//       return {
//         key: mainTask.id.toString(),
//         title: mainTask.task.name,
//         executor: mainTask.executor, // Для окраски
//         children: (tasksByParent[mainTask.id] || []).map(buildNode),
//       };
//     });
  
//     return treeData;
//   };
  export const flattenTree = (node, accumulator = []) => {
    const { id, task_id, executor, project_task_inherited_id, ...rest } = node;
    accumulator.push({ id, task_id, executor, project_task_inherited_id, ...rest });
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => flattenTree(child, accumulator));
    }
    return accumulator;
  };