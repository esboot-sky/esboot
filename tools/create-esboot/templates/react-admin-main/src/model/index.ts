import { CacheStore } from '@dz-web/cache';
import { create } from 'zustand';

import { DEFAULT_LANG } from '../constants/login';
import { processModuleList } from '../utils/common';

export interface IMenu {
  id: number;
  pid: number;
  code: string;
  icon: null;
  name: string;
  path: string;
  internalPath?: string;
  routeModule: string;
  children?: Array<IMenu>;
  title: string;
}

export interface IModuleItem {
  code: string;
  url: null;
  icon: string;
  name: string;
  remark: string;
  isExternal: boolean;
  hasPermission: boolean;
  routerBase?: string;
  menu: Array<IMenu>;
  permission: string[];
}

export interface UserInfo {
  id?: number;
  username?: string;
  nickname?: string;
  roleName?: string;
  [key: string]: any;
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
  accountInfo: UserInfo;
  setAccountInfo: (v: UserInfo) => void;
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

function getInitialState() {
  return {
    lang: localStorage.getItem('currentLang') || DEFAULT_LANG.value,
    token: (CacheStore.getItem('token') as string) || '',
    moduleList: (() => {
      const list = localStorage.getItem('moduleList');
      const parsed = (list ? JSON.parse(list) : []) as any[];
      return processModuleList(parsed);
    })(),
    currentModule: (() => {
      const info = localStorage.getItem('currentModule');
      if (!info) return null;
      const parsed = JSON.parse(info);
      const processed = processModuleList([parsed]);
      return (processed[0] as IModuleItem) || null;
    })(),
    currentModulePath: localStorage.getItem('currentModulePath') || '',
    accountInfo: (() => {
      const info = localStorage.getItem('accountInfo');
      return (info ? JSON.parse(info) : {}) as UserInfo;
    })(),
    subRouteIntercept: {
      isIntercept: false,
      callback: null,
    },
  };
}

const useLoginStore = create<loginStore>()(set => ({
  ...getInitialState(),
  setLang: value =>
    set(() => {
      localStorage.setItem('currentLang', value);
      return { lang: value };
    }),
  setToken: value =>
    set(() => {
      CacheStore.setItem('token', value);
      return { token: value };
    }),
  setModuleList: value =>
    set(() => {
      const processed = processModuleList(value || []);
      localStorage.setItem('moduleList', JSON.stringify(processed));
      return { moduleList: processed };
    }),
  setCurrentModule: (value: IModuleItem) =>
    set(() => {
      const processed = value ? processModuleList([value])[0] : null;
      localStorage.setItem('currentModule', JSON.stringify(processed));
      return { currentModule: processed };
    }),
  setCurrentModulePath: value =>
    set(() => {
      localStorage.setItem('currentModulePath', value);
      return { currentModulePath: value };
    }),
  setAccountInfo: value =>
    set(() => {
      localStorage.setItem('accountInfo', JSON.stringify(value));
      return { accountInfo: value };
    }),
  setSubRouteIntercept: value =>
    set(state => ({
      subRouteIntercept: {
        ...state.subRouteIntercept,
        ...value,
      },
    })),
  reset: () =>
    set(() => {
      localStorage.removeItem('currentLang');
      CacheStore.removeItem('token');
      localStorage.removeItem('moduleList');
      localStorage.removeItem('currentModule');
      localStorage.removeItem('currentModulePath');
      localStorage.removeItem('accountInfo');
      return getInitialState();
    }, true),
}));

export { useLoginStore };
