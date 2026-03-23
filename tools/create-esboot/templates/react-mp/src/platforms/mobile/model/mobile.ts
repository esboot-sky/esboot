import type { QuotesUpDownColor, ThemeValues } from '@mobile/constants/config';
import type { OriginalUserConfig, OriginalUserInfo } from '@mobile/helpers/customize';
import type { Language } from '@/constants/config';
import { globalBlocker } from '@dz-web/axios-middlewares';

import { CacheStore } from '@dz-web/cache';
import { DEFAULT_QUOTES_UP_DOWN_COLOR, DEFAULT_THEME } from '@mobile/constants/config';
import { accessToken } from '@mobile/helpers/customize';
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { CACHE_KEY_PC_USER_CONFIG, CACHE_KEY_PC_USER_INFO } from '@/constants/caches';
import { DEFAULT_LANGUAGE, isDev } from '@/constants/config';
import {
  getDefaultTheme,
  initPageQuery,
  isSupportedLanguage,
  isSupportedQuotesUpDownColor,
  isSupportedTheme,
} from '@/helpers/config';

import { isBrowser } from '@/utils/platforms';

/**
 * 点证web app标准用户设置
 * 代码里统一从store中读取此用户配置，代码不应关心用户配置的来源，并且格式应该统一,
 * 需要读取原始配置，请读取raw字段
 */
export interface StandardUserConfig {
  theme: ThemeValues;
  language: Language;
  quotesUpDownColor: QuotesUpDownColor;
  /**
   * 跟随系统颜色模式
   */
  followSystemPrefersColorSchemeWhenInBrowser: boolean;
  deviceNo: string;
  raw: OriginalUserConfig;
}

interface IState {
  userInfo: OriginalUserInfo;
  userConfig: StandardUserConfig;
}

function createInitializedState(): IState {
  const { lang, quotesUpDownColor } = initPageQuery;

  function getValueButIgnoreInNative<T>(run: () => T | undefined | null, defaultValue: T) {
    if (isBrowser()) {
      const v = run();

      if (v)
        return v;

      return defaultValue;
    }

    return defaultValue;
  }

  const defaultState = {
    userInfo: getValueButIgnoreInNative(() => CacheStore.getItem(CACHE_KEY_PC_USER_INFO), {
      sessionCode: '',
    } as OriginalUserInfo),
    userConfig: getValueButIgnoreInNative(() => CacheStore.getItem(CACHE_KEY_PC_USER_CONFIG), {
      theme: DEFAULT_THEME,
      deviceNo: '',
      followSystemPrefersColorSchemeWhenInBrowser: isBrowser() && !(window as any).__disable_follow_system_theme,
      language: DEFAULT_LANGUAGE,
      quotesUpDownColor: DEFAULT_QUOTES_UP_DOWN_COLOR,
      raw: {} as OriginalUserConfig,
    }),
  } as IState;

  const theme = getDefaultTheme(defaultState.userConfig.followSystemPrefersColorSchemeWhenInBrowser, DEFAULT_THEME);

  if (isSupportedTheme(theme)) {
    defaultState.userConfig.theme = theme as ThemeValues;
  }

  if (isSupportedQuotesUpDownColor(quotesUpDownColor)) {
    defaultState.userConfig.quotesUpDownColor = quotesUpDownColor as QuotesUpDownColor;
  }

  // 每次都强制检测浏览器语言, 使用配置好的默认语言
  if (isBrowser() && !isSupportedLanguage(lang) && (window as any).__force_detect_language_on_startup) {
    defaultState.userConfig.language = DEFAULT_LANGUAGE;
  }
  else if (isSupportedLanguage(lang)) {
    defaultState.userConfig.language = lang as Language;
  }

  return defaultState;
}

export const useAppStore = create<IState>()(
  subscribeWithSelector(
    devtools(() => createInitializedState(), {
      name: 'mobile-store',
      enabled: isDev,
    }),
  ),
);

export function setUserConfig(config: StandardUserConfig) {
  return useAppStore.setState(() => ({
    userConfig: config,
  }));
}

export function setUserInfo(info: OriginalUserInfo) {
  const token = accessToken(info);
  if (token) {
    globalBlocker.done();
  }
  return useAppStore.setState(() => ({ userInfo: info }));
}

export function setLanguage(language: Language) {
  return useAppStore.setState(state => ({ userConfig: { ...state.userConfig, language } }));
}

export function setTheme(theme: ThemeValues) {
  return useAppStore.setState(state => ({ userConfig: { ...state.userConfig, theme } }));
}

export function setQuotesUpDownColor(quotesUpDownColor: QuotesUpDownColor) {
  return useAppStore.setState(state => ({ userConfig: { ...state.userConfig, quotesUpDownColor } }));
}

export function toggleFollowSystemPrefersColorSchemeWhenInBrowser() {
  return useAppStore.setState(state => ({
    userConfig: {
      ...state.userConfig,
      followSystemPrefersColorSchemeWhenInBrowser: !state.userConfig.followSystemPrefersColorSchemeWhenInBrowser,
    },
  }));
}
