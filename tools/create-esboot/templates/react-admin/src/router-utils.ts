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
  const menuPaths = new Set(getAllPathsFromMenu(menuItems));

  return routes.filter(route => menuPaths.has(`/${route.path}`));
}
