import staticConfig from '@/helpers/static-config';
import { isBrowser } from '@/utils/platforms';

export const isDev = process.env.NODE_ENV === 'development'; // eslint-disable-line node/prefer-global/process

/**
 * 移动端是否开启debug
 * 测试包可自己选择开启
 */
export const enableDebug = !!staticConfig.getConfig('debug');

/**
 * 默认开启react-query-devtools, 打包后不会开启，如发现logo挡住了界面可以在这里临时关闭
 */
export const enableReactQueryDevTool = true;

/**
 * 是否使用bridge mock, false强制使用原生交互，用于测试真机环境
 */
let defaultUseBridgeMock = true;
if (!isDev)
  defaultUseBridgeMock = false;
export const useBridgeMock = defaultUseBridgeMock;

/**
 * 多语言
 *
 */
export const supportedLanguage = {
  ZH_CN: 'zh-CN',
  ZH_TW: 'zh-TW',
  EN_US: 'en-US',
} as const;

export type Language = (typeof supportedLanguage)[keyof typeof supportedLanguage];

const useHKLang = isBrowser() && /zh-hk|zh-tw/i.test(navigator.language);

export const DEFAULT_LANGUAGE = useHKLang ? supportedLanguage.ZH_TW : supportedLanguage.ZH_CN;
