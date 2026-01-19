import type { ThemeValues } from '@/helpers/multi-platforms';

import { parseKeyValues } from '@websaber/string-utils';

import { find } from 'lodash-es';
import { supportedLanguage } from '@/constants/config';

import { supportedQuotesUpDownColors, supportedThemes } from './multi-platforms';

export const initPageQuery: {
  /**
   * 语言
   */
  lang?: string;
  /**
   * 语言
   */
  language?: string;
  /**
   * 主题色
   */
  theme?: string;
  /**
   * 涨跌模式
   */
  quotesUpDownColor?: string;
  /**
   * pc字体大小参数
   */
  additionalSize?: string;
  /**
   * pc字体粗细参数
   */
  weight?: string;
  [key: string]: string | undefined;
} = parseKeyValues.stringOnly(window.location.href) as Record<string, string>;

export function isSupportedLanguage(lang?: string): boolean {
  return !!lang && !!find(supportedLanguage, item => item === lang);
}

export function isSupportedTheme(theme?: string): boolean {
  return !!theme && theme in supportedThemes;
}

export function getDefaultTheme(followSystem: boolean, defaultTheme: ThemeValues) {
  const { theme } = initPageQuery;
  // 优先使用url指定的主题初始化
  if (isSupportedTheme(theme))
    return theme as ThemeValues;

  // 浏览器模式下，设置了跟随系统设置, 则根据系统设置初始化
  if (followSystem) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? supportedThemes.dark : supportedThemes.light;
  }

  return defaultTheme;
}

export function isSupportedQuotesUpDownColor(quotesUpDownColor?: string) {
  return !!quotesUpDownColor && !!find(supportedQuotesUpDownColors, item => item === quotesUpDownColor);
}

export function updateBaseRootClass(prefix: string, prev: string, next: string) {
  const { classList } = document.documentElement;
  if (prev) {
    classList.remove(`${prefix}${prev}`);
  }
  classList.add(`${prefix}${next}`);
}

export function updateThemeRootClass(prevTheme: ThemeValues, nextTheme: ThemeValues) {
  updateBaseRootClass('dz-theme-', prevTheme, nextTheme);
}

export function updateQuotesUpDownColorRootClass(prevQuotesUpDownColor: string, nextQuotesUpDownColor: string) {
  updateBaseRootClass('dz-quotes-up-down-color-', prevQuotesUpDownColor, nextQuotesUpDownColor);
}
