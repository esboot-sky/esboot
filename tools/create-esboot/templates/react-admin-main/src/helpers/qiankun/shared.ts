interface MicroAppEntry {
  dev: string;
  prod: string;
}

export interface QiankunGlobalState {
  jumpLogin?: boolean;
  isInterceptRoute?: boolean;
  interceptRouteCallback?: null | (() => boolean | Promise<boolean>);
}

export interface MicroAppConfig {
  entryUrl: MicroAppEntry;
  routerBase: string;
  icon: string;
  activeIcon: string;
  isHidden?: boolean;
}

export type MicroAppDict = Record<string, MicroAppConfig>;

export interface RegisterMicroApp {
  name: string;
  entry: string;
  activeRule: (location: Pick<Location, 'pathname'>) => boolean;
  container: string;
  props: {
    routerBase: string;
    getCurrentGlobalState: () => Record<string, unknown>;
  };
}

export function resolveEntryUrl(devUrl: string, prodUrl: string, env = process.env.NODE_ENV) {
  if (env !== 'development') return prodUrl;
  const currentHost = typeof window !== 'undefined' ? window.location.hostname || 'localhost' : 'localhost';
  return devUrl.replace('localhost', currentHost);
}

export function buildMicroApps(
  dict: MicroAppDict,
  getCurrentGlobalState: () => Record<string, unknown>,
  env = process.env.NODE_ENV,
) {
  return Object.keys(dict)
    .map((key) => {
      const targetModule = dict[key];
      if (!targetModule || targetModule.isHidden) {
        return null;
      }

      const {
        routerBase,
        entryUrl: { dev, prod },
      } = targetModule;

      return {
        name: key,
        entry: resolveEntryUrl(dev, prod, env),
        activeRule: (location: Pick<Location, 'pathname'>) => location.pathname.startsWith(routerBase),
        container: '#subapp-viewport',
        props: {
          routerBase,
          getCurrentGlobalState,
        },
      } satisfies RegisterMicroApp;
    })
    .filter((item): item is RegisterMicroApp => Boolean(item));
}

export function getRouterBasename(propsRouterBase?: string, fallbackBase = '/'): string {
  if (propsRouterBase) return propsRouterBase;

  if (typeof window !== 'undefined' && (window as any).__POWERED_BY_QIANKUN__) {
    const pathMatch = window.location.pathname.match(/^(\/[^/]+)/);
    return pathMatch ? pathMatch[1] : fallbackBase;
  }

  return fallbackBase;
}

