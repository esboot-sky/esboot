import { SHA256 } from 'crypto-js';
import staticConfig from '@/helpers/static-config';

export function passwordEncrypt(password: string) {
  return SHA256(password).toString().substring(0, 20);
}

export function processModuleMenuPaths(
  menuList: any[] = [],
  moduleCode: string,
  beCodeToRouterBaseMap: Record<string, string>,
): any[] {
  if (!menuList?.length) return [];
  return menuList.map((item) => {
    const targetRouteCode = item.routeModule || moduleCode;
    const routerBase = beCodeToRouterBaseMap[targetRouteCode] || `/${targetRouteCode}`;
    const rawPath = item.path || '';
    const internalPath = rawPath.startsWith(routerBase)
      ? rawPath
      : `${routerBase}${rawPath.startsWith('/') ? '' : '/'}${rawPath}`;
    return {
      ...item,
      path: internalPath,
      internalPath,
      children: processModuleMenuPaths(item.children || [], moduleCode, beCodeToRouterBaseMap),
    };
  });
}

export function processModuleList(moduleList: any[]): any[] {
  if (!moduleList?.length) return [];
  const subModuleDict = staticConfig.getConfig('subModuleList', {}) as Record<string, any>;

  const beCodeToRouterBaseMap: Record<string, string> = {};
  Object.values(subModuleDict).forEach((sub) => {
    if (sub?.beCode && sub?.routerBase) {
      beCodeToRouterBaseMap[sub.beCode] = sub.routerBase;
      if (sub?.code) {
        beCodeToRouterBaseMap[sub.code] = sub.routerBase;
      }
    }
  });

  return moduleList.map((moduleItem) => {
    const code = moduleItem.code || moduleItem.beCode || '';
    const processedMenu = processModuleMenuPaths(moduleItem.menu || [], code, beCodeToRouterBaseMap);
    return {
      ...moduleItem,
      menu: processedMenu,
    };
  });
}

export function getDefaultModulePath(module: any): string {
  if (!module?.menu?.length) return '';
  const firstMenu = module.menu[0];
  const getPath = (item: any): string => {
    if (item?.children?.length) {
      return getPath(item.children[0]);
    }
    return item?.internalPath || item?.path || '';
  };
  return getPath(firstMenu);
}
