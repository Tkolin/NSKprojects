export const colorTreeData = (nodes) => {
    return nodes.map((node) => {
      let color = 'red'; // По умолчанию красный
  
      if (node.executor) {
        // Главная задача имеет исполнителя
        color = 'gray';
        // Все подзадачи также будут серыми
        if (node.children && node.children.length > 0) {
          node.children = node.children.map((child) => ({
            ...child,
            title: <span style={{ color: 'gray' }}>{child.title}</span>,
          }));
        }
      } else if (node.children && node.children.length > 0) {
        const total = node.children.length;
        const withExecutor = node.children.filter(
          (child) => child.executor
        ).length;
  
        if (withExecutor === total) {
          // Все подзадачи имеют исполнителей
          color = 'gray';
        } else if (withExecutor > 0) {
          // Некоторые подзадачи имеют исполнителей
          color = 'yellow';
          // Отсутствующие подзадачи окрашиваем в красный
          node.children = node.children.map((child) => ({
            ...child,
            title: child.executor ? (
              <span style={{ color: 'gray' }}>{child.title}</span>
            ) : (
              <span style={{ color: 'red' }}>{child.title}</span>
            ),
          }));
        }
      }
  
      // Если у задачи нет подзадач и нет исполнителя, цвет остаётся красным
  
      return {
        ...node,
        title: <span style={{ color }}>{node.title}</span>,
        children: node.children ? colorTreeData(node.children) : [],
      };
    });
  };
  