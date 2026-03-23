export const transformToMenuItems = (data) => {
  if (!Array.isArray(data)) return [];

  return data.map((item) => {
    const newItem = {
      key: item.id.toString(),
      label: item.name,
      path: item.path,
    };

    if (!item.children?.length) return newItem;

    return {
      ...newItem,
      children: transformToMenuItems(item.children),
    };
  });
};

export const findPathById = (items, targetPath, currentPath = []) => {
  if (!Array.isArray(items)) return null;

  for (const item of items) {
    const newPath = [...currentPath, item.id];

    if (item.children && item.children.length > 0) {
      const foundPath = findPathById(item.children, targetPath, newPath);
      if (foundPath) {
        return foundPath;
      }
    }

    if (item.path === targetPath) {
      return newPath;
    }
  }
  return null;
};

export const findPath = (items, targetId) => {
  if (!Array.isArray(items)) return null;

  for (const item of items) {
    const newPath = item.path;

    if (item.id === targetId) {
      return newPath;
    }

    if (item.children && item.children.length > 0) {
      const foundPath = findPath(item.children, targetId);
      if (foundPath) {
        return foundPath;
      }
    }
  }
  return null;
};
