import { CacheStore } from '@dz-web/cache';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { Language } from '@/constants/config';
import { DEFAULT_LANG } from '@/constants/login';

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

interface AppStore {
  lang: Language;
  setLang: (v: Language) => void;
  token: string;
  setToken: (v: string) => void;
  moduleList: IModuleItem[];
  setModuleList: (v: IModuleItem[]) => void;
  currentModule: IModuleItem | null;
  setCurrentModule: (v: IModuleItem | null) => void;
  currentModulePath: string;
  setCurrentModulePath: (v: string) => void;
  currentPermissionList: string[];
  setCurrentPermissionList: (v: string[]) => void;
  reset: () => void;
}

const defaultState = {
  lang: DEFAULT_LANG.value as Language,
  token: (CacheStore.getItem('token') as string) || '',
  moduleList: [] as IModuleItem[],
  currentModule: null as IModuleItem | null,
  currentModulePath: '',
  currentPermissionList: [] as string[],
};

const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...defaultState,
      setLang: (value) => {
        set({ lang: value });
      },
      setToken: (value) => {
        CacheStore.setItem('token', value);
        set({ token: value });
      },
      setModuleList: (value) => {
        set({ moduleList: value });
      },
      setCurrentModule: (value) => {
        set({ currentModule: value });
      },
      setCurrentModulePath: (value) => {
        set({ currentModulePath: value });
      },
      setCurrentPermissionList: (value) => {
        set({ currentPermissionList: value });
      },
      reset: () => {
        CacheStore.removeItem('token');
        set({ ...defaultState, token: '' });
      },
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        lang: state.lang,
        moduleList: state.moduleList,
        currentModule: state.currentModule,
        currentModulePath: state.currentModulePath,
        currentPermissionList: state.currentPermissionList,
      }),
    },
  ),
);

export { useAppStore };
