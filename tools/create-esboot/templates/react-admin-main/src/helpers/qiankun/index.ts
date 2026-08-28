import type { MicroAppStateActions } from 'qiankun';

import type { MicroAppDict, QiankunGlobalState } from './shared';
import { initGlobalState, registerMicroApps, start } from 'qiankun';
import { useLoginStore } from '../../model';

import staticConfig from '../static-config';
import { buildMicroApps, getRouterBasename } from './shared';

export { getRouterBasename };

const microAppDict = staticConfig.getConfig('subModuleList', {}) as MicroAppDict;

export function getCurrentGlobalState() {
  const store = useLoginStore.getState();

  return {
    token: store.token,
    currentModule: store.currentModule,
    language: store.lang,
    languageList: [],
    simpleModulesList: [],
  };
}

function createJumpLoginHandler(onJumpLogin?: () => void) {
  return () => {
    useLoginStore.getState().reset();
    window.setQianKunGlobalState = undefined;

    if (window.location.pathname !== '/login') {
      window.location.replace('/login');
    }

    onJumpLogin?.();
  };
}

export function bootstrapQiankun(options?: { onJumpLogin?: () => void }) {
  const actions: MicroAppStateActions = initGlobalState<QiankunGlobalState>({
    jumpLogin: false,
    isInterceptRoute: false,
    interceptRouteCallback: null,
  });

  const handleJumpLogin = createJumpLoginHandler(options?.onJumpLogin);

  actions.onGlobalStateChange((state: QiankunGlobalState) => {
    const { jumpLogin, isInterceptRoute, interceptRouteCallback } = state;

    useLoginStore.getState().setSubRouteIntercept({
      isIntercept: Boolean(isInterceptRoute),
      callback: interceptRouteCallback ?? null,
    });

    if (jumpLogin) {
      handleJumpLogin();
      actions.setGlobalState({ jumpLogin: false });
    }
  });

  registerMicroApps(buildMicroApps(microAppDict, getCurrentGlobalState), {
    beforeLoad: (microApp) => {
      console.log('[LifeCycle-beforeLoad] before load app.name====>>>>>', microApp);
      return Promise.resolve();
    },
    beforeMount: [
      (microApp) => {
        console.log('[LifeCycle-beforeMount] before mount %c%s', 'color: green;', microApp.name);
        window.setQianKunGlobalState = actions.setGlobalState;
        return Promise.resolve();
      },
    ],
    afterMount: [
      (microApp) => {
        console.log('[LifeCycle-afterMount] after mount %c%s', 'color: green;', microApp.name);
        return Promise.resolve();
      },
    ],
    afterUnmount: [
      (microApp) => {
        console.log('[LifeCycle-afterUnmount] after unmount %c%s', 'color: green;', microApp.name);
        window.setQianKunGlobalState = undefined;
        return Promise.resolve();
      },
    ],
  });

  const customFetch = (url: RequestInfo | URL, init?: RequestInit) => {
    const defaultHeaders = {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    };
    return window.fetch(url, {
      ...init,
      headers: {
        ...defaultHeaders,
        ...init?.headers,
      },
    });
  };

  start({
    prefetch: true,
    fetch: customFetch as any,
    sandbox: {
      experimentalStyleIsolation: false,
    },
  });

  return actions;
}
