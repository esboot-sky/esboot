// import { isPAhkebankApp } from '@dz-web/bridge-pingan';
const isPAhkebankApp = false;

import staticConfig from '@/helpers/static-config';

export const PLACEHOLDER = '--';
export const GREEN = '#00c183';
export const RED = '#ff2c00';
export const GRAY = '#C9CDD4';

export enum QuotesColorType {
  redUpGreenDown = 'red-up-green-down',
  greenUpRedDown = 'green-up-red-down',
}

export interface QuotesColor {
  upColor: string;
  downColor: string;
  defaultColor: string;
}

export const quotesColorDict: Record<QuotesColorType, QuotesColor> = {
  [QuotesColorType.redUpGreenDown]: {
    upColor: RED,
    downColor: GREEN,
    defaultColor: '#86909C',
  },
  [QuotesColorType.greenUpRedDown]: {
    upColor: GREEN,
    downColor: RED,
    defaultColor: '#86909C',
  },
};

export const isDev = process.env.NODE_ENV === 'development' && !isPAhkebankApp;

/**
 * 移动端是否开启debug
 * 测试包可自己选择开启
 */
export const enableDebug = !!staticConfig.getConfig('debug');

/**
 * 默认开启react-query-devtools, 打包后不会开启，如发现logo挡住了界面可以在这里临时关闭
 */
export const enableReactQueryDevTool = false;

export const enableReactScan = isDev;

/**
 * 是否使用bridge mock, false强制使用原生交互，用于测试真机环境
 */
let defaultUseBridgeMock = true;
if (!isDev) defaultUseBridgeMock = false;
export const useBridgeMock = defaultUseBridgeMock;

// lan
export enum lanEnum {
  ZH_CN = 'zh-CN',
  ZH_TW = 'zh-TW',
  EN_US = 'en-US',
}

export const defaultLan = lanEnum.ZH_CN;

export const SupportedThemes = {
  light: 'white',
  dark: 'black',
  // 旧版app会返回black与white，临时加上
  black: 'black',
  white: 'white',
} as const;

export type ThemeValues = (typeof SupportedThemes)[keyof typeof SupportedThemes];

/**
 * 多语言
 */
export const SupportedLanguage = lanEnum;
