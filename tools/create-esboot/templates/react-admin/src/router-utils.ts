import type { IMenu } from './model/app';

export function getAllPathsFromMenu(menuItems?: IMenu[]) {
  let paths: string[] = [];

  menuItems?.forEach((item: IMenu) => {
    if (item.path) {
      paths.push(item.path);
    }
    if (item.children && item.children.length > 0) {
      paths = paths.concat(getAllPathsFromMenu(item.children));
    }
  });

  return paths;
}

export function filterRoutesByMenu<T extends { path: string }>(routes: T[], menuItems?: IMenu[]) {
  if (!menuItems || menuItems.length === 0) {
    return routes;
  }

  const menuPaths = getAllPathsFromMenu(menuItems);

  return routes.filter((route) => {
    const targetPath = route.path.startsWith('/') ? route.path : `/${route.path}`;
    return menuPaths.some((menuPath) => {
      if (!menuPath) return false;
      const normalizedMenuPath = menuPath.startsWith('/') ? menuPath : `/${menuPath}`;

      return (
        normalizedMenuPath === targetPath
        || normalizedMenuPath.endsWith(targetPath)
        || normalizedMenuPath.endsWith(route.path)
      );
    });
  });
}
