import { initGlobalState, registerMicroApps, start, type MicroAppStateActions } from 'qiankun';

import { useLoginStore } from '../../model';
import staticConfig from '../static-config';

import { buildMicroApps, type MicroAppDict, type QiankunGlobalState } from './shared';

const microAppDict = staticConfig.getConfig('subModuleList', {}) as MicroAppDict;

export const getCurrentGlobalState = () => {
  const store = useLoginStore.getState();

  return {
    token: store.token,
    currentModule: store.currentModule,
    language: store.lang,
    languageList: [],
    simpleModulesList: [],
  };
};

const createJumpLoginHandler = (onJumpLogin?: () => void) => {
  return () => {
    useLoginStore.getState().reset();
    window.setQianKunGlobalState = undefined;

    if (window.location.pathname !== '/login') {
      window.location.replace('/login');
    }

    onJumpLogin?.();
  };
};

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

  start({
    prefetch: true,
    sandbox: {
      strictStyleIsolation: true,
      experimentalStyleIsolation: true,
    },
  });

  return actions;
}
