type MicroAppEntry = {
  dev: string;
  prod: string;
};

export type QiankunGlobalState = {
  jumpLogin?: boolean;
  isInterceptRoute?: boolean;
  interceptRouteCallback?: null | (() => boolean | Promise<boolean>);
};

export type MicroAppConfig = {
  entryUrl: MicroAppEntry;
  routerBase: string;
  icon: string;
  activeIcon: string;
  isHidden?: boolean;
};

export type MicroAppDict = Record<string, MicroAppConfig>;

export type RegisterMicroApp = {
  name: string;
  entry: string;
  activeRule: (location: Pick<Location, 'pathname'>) => boolean;
  container: string;
  props: {
    routerBase: string;
    getCurrentGlobalState: () => Record<string, unknown>;
  };
};

export const resolveEntryUrl = (devUrl: string, prodUrl: string, env = process.env.NODE_ENV) => {
  return env === 'development' ? devUrl : prodUrl;
};

export const buildMicroApps = (
  dict: MicroAppDict,
  getCurrentGlobalState: () => Record<string, unknown>,
  env = process.env.NODE_ENV,
) => {
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
};
