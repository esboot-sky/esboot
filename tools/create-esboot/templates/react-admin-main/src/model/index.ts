import { CacheStore } from '@dz-web/cache';
import { create } from 'zustand';

import { DEFAULT_LANG } from '../constants/login';

export type IMenu = {
  id: number;
  pid: number;
  code: string;
  icon: null;
  name: string;
  path: string;
  routeModule: string;
  children?: Array<IMenu>;
  title: string;
};
export interface IModuleItem {
  code: string;
  url: null;
  icon: string;
  name: string;
  remark: string;
  isExternal: boolean;
  hasPermission: boolean;
  menu: Array<IMenu>;
  permission: string[];
}

interface loginStore {
  lang: string;
  setLang: (v: string) => void;
  token: string;
  setToken: (v: string) => void;
  moduleList: any[];
  setModuleList: (v: any[]) => void;
  currentModule: IModuleItem | null;
  setCurrentModule: (v: IModuleItem) => void;
  currentModulePath: string;
  setCurrentModulePath: (v: string) => void;
  subRouteIntercept: {
    isIntercept: boolean;
    callback: null | (() => boolean | Promise<boolean>);
  };
  setSubRouteIntercept: (
    v: Partial<{
      isIntercept: boolean;
      callback: null | (() => boolean | Promise<boolean>);
    }>,
  ) => void;
  reset: () => void;
}

const getInitialState = () => ({
  lang: localStorage.getItem('currentLang') || DEFAULT_LANG.value,
  token: (CacheStore.getItem('token') as string) || '',
  moduleList: (() => {
    const list = localStorage.getItem('moduleList');
    return (list ? JSON.parse(list) : []) as any[];
  })(),
  currentModule: (() => {
    const list = localStorage.getItem('currentModule');
    return (list ? JSON.parse(list) : null) as IModuleItem;
  })(),
  currentModulePath: localStorage.getItem('currentModulePath') || '',
  subRouteIntercept: {
    isIntercept: false,
    callback: null,
  },
});

const useLoginStore = create<loginStore>()((set) => ({
  ...getInitialState(),
  setLang: (value) =>
    set(() => {
      localStorage.setItem('currentLang', value);
      return { lang: value };
    }),
  setToken: (value) =>
    set(() => {
      CacheStore.setItem('token', value);
      return { token: value };
    }),
  setModuleList: (value) =>
    set(() => {
      localStorage.setItem('moduleList', JSON.stringify(value));
      return { moduleList: value };
    }),
  setCurrentModule: (value: IModuleItem) =>
    set(() => {
      localStorage.setItem('currentModule', JSON.stringify(value));
      return { currentModule: value };
    }),
  setCurrentModulePath: (value) =>
    set(() => {
      localStorage.setItem('currentModulePath', value);
      return { currentModulePath: value };
    }),
  setSubRouteIntercept: (value) =>
    set((state) => ({
      subRouteIntercept: {
        ...state.subRouteIntercept,
        ...value,
      },
    })),
  reset: () =>
    set(() => {
      // 重置 localStorage
      localStorage.removeItem('currentLang');
      CacheStore.removeItem('token');
      localStorage.removeItem('moduleList');
      localStorage.removeItem('currentModule');
      localStorage.removeItem('currentModulePath');

      // 重置状态
      return getInitialState();
    }, true),
}));

export { useLoginStore };
