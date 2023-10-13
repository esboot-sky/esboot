/**
 * bridge mock
 */
let defaultUseBridgeMock = true;
// let defaultUseBridgeMock = false;

if (process.env.NODE_ENV === 'production') defaultUseBridgeMock = false;
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

export type Language = typeof supportedLanguage[keyof typeof supportedLanguage];

/**
 * 涨跌颜色模式, pc端支持多种颜色配置
 */
export const validRaiseMode = {
  /**
   * 红跌绿涨
   */
  red: 'red',
  /**
   * 绿跌红涨
   */
  green: 'green',
  /**
   * 粉涨蓝跌
   */
  pink: 'pink',
} as const;

export type RaiseMode = keyof typeof validRaiseMode;

/**
 * 涨跌颜色配置, pc端支持多种涨跌颜色配置, 手机端一般只支持红涨绿跌、绿涨红跌
 */
export const RaiseModeColorScheme = {
  // 红涨绿跌
  red: {
    up: '#2d9e00',
    down: '#f23030',
  },
  // 绿涨红跌
  green: {
    up: '#f23030',
    down: '#2d9e00',
  },
  // 粉涨蓝跌
  pink: {
    up: '#ffc0cb',
    down: '#0000ff',
  },
} as const;

export const DEFAULT_RAISE_MODE = validRaiseMode.green;

export const DEFAULT_LANGUAGE = supportedLanguage.ZH_CN;
