import { CacheStore } from '@dz-web/cache';
import isDeepEqual from 'react-fast-compare';

import { CACHE_KEY_USER_CONFIG, CACHE_KEY_USER_INFO } from '@/constants/caches';
import { isBrowser } from '@/utils/platforms';
import { updateRootClass } from '@mobile/helpers/theme';

import { MinimalStoreType } from './minimal-store';

export function subscribeUserAndCache(store: MinimalStoreType) {
  let previousApp = store.getState().app;

  updateRootClass(previousApp.userConfig.theme, previousApp.userConfig.raise, previousApp.userConfig.language);

  // 浏览器环境初始化时，会从url参数获取初始参数，需要更新到storage
  if (isBrowser()) {
    CacheStore.setItem(CACHE_KEY_USER_CONFIG, previousApp.userConfig);
  }

  store.subscribe(() => {
    const currentAppState = store.getState();
    // check if userConfig changed
    const currentApp = currentAppState.app;
    // 引用相同，不需要任何判断
    if (currentApp === previousApp) return;

    updateRootClass(currentApp.userConfig.theme, currentApp.userConfig.raise, currentApp.userConfig.language);

    // 原生环境里运行，让原生端管理用户数据，不需要缓存
    if (isBrowser()) {
      if (!isDeepEqual(currentApp.userConfig, previousApp.userConfig)) {
        CacheStore.setItem(CACHE_KEY_USER_CONFIG, currentApp.userConfig);
      }

      if (!isDeepEqual(currentApp.userInfo, previousApp.userInfo)) {
        CacheStore.setItem(CACHE_KEY_USER_INFO, currentApp.userInfo);
      }
    }
    previousApp = currentApp;
  });
}
