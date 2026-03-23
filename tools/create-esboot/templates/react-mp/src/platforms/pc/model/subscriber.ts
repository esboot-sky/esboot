import { CacheStore } from '@dz-web/cache';
import { CACHE_KEY_PC_USER_CONFIG, CACHE_KEY_PC_USER_INFO } from '@/constants/caches';

import { updateQuotesUpDownColorRootClass, updateThemeRootClass } from '@/helpers/config';
import { isBrowser } from '@/utils/platforms';
import { usePCStore } from './pc';

export function subscribeUserAndCache() {
  usePCStore.subscribe(
    state => state.userConfig.theme,
    (prevTheme, nextTheme) => {
      updateThemeRootClass(prevTheme, nextTheme);
    },
    {
      fireImmediately: true,
    },
  );

  usePCStore.subscribe(
    state => state.userConfig.quotesUpDownColor,
    (prevQuotesUpDownColor, nextQuotesUpDownColor) => {
      console.log('prevQuotesUpDownColor: ', prevQuotesUpDownColor);
      console.log('nextQuotesUpDownColor: ', nextQuotesUpDownColor);
      updateQuotesUpDownColorRootClass(prevQuotesUpDownColor, nextQuotesUpDownColor);
    },
    {
      fireImmediately: true,
    },
  );

  usePCStore.subscribe(
    state => state.userConfig.appFontSize,
    (_, nextAppFontSize) => {
      document.documentElement.style.fontSize = `${nextAppFontSize}px`;
    },
    {
      fireImmediately: true,
    },
  );

  usePCStore.subscribe(
    state => state.userConfig.appFontWeight,
    (_, nextAppFontWeight) => {
      document.documentElement.style.fontWeight = nextAppFontWeight;
    },
    {
      fireImmediately: true,
    },
  );

  if (isBrowser()) {
    usePCStore.subscribe(
      state => state.userConfig,
      (_, nextUserConfig) => {
        CacheStore.setItem(CACHE_KEY_PC_USER_CONFIG, nextUserConfig);
      },
      {
        fireImmediately: true,
      },
    );

    usePCStore.subscribe(
      state => state.userInfo,
      (_, nextUserInfo) => {
        CacheStore.setItem(CACHE_KEY_PC_USER_INFO, nextUserInfo);
      },
      {
        fireImmediately: true,
      },
    );
  }
}
