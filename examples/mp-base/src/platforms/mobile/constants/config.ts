/**
 * 多皮肤
 *
 */
export const SupportedThemes = {
  light: 'light',
  dark: 'dark',
  // 安卓端中信app会返回black与theme，临时加上
  black: 'dark',
  white: 'light',
} as const;

/**
 * 涨跌颜色配置, pc端支持多种涨跌颜色配置, 手机端一般只支持红涨绿跌、绿涨红跌
 */
export const RaiseModeColorScheme = {
  // 红涨绿跌
  red: {
    up: '#2d9e00',
    same: '#999999',
    down: '#f23030',
  },
  // 绿涨红跌
  green: {
    up: '#f23030',
    same: '#999999',
    down: '#2d9e00',
  },
  // 粉涨蓝跌
  pink: {
    up: '#ffc0cb',
    same: '#999999',
    down: '#0000ff',
  },
} as const;

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
} as const;

export type RaiseMode = keyof typeof validRaiseMode;

export const DEFAULT_RAISE_MODE = validRaiseMode.green;

export type ThemeValues = (typeof SupportedThemes)[keyof typeof SupportedThemes];

export const DEFAULT_THEME = SupportedThemes.light;

export const TOKEN_KEY = 'sessionCode';
