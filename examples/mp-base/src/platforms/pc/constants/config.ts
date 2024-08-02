/**
 * 多皮肤
 */
export const SupportedThemes = {
  light: 'light',
  dark: 'dark',
  // 安卓端中信app会返回black与theme，临时加上
  black: 'dark',
  white: 'light',
  yellow: 'yellow',
} as const;

export type ThemeValues = (typeof SupportedThemes)[keyof typeof SupportedThemes];

export const DEFAULT_THEME = SupportedThemes.light;

/**
 * 字体设置相关
 */
export const FONT_SIZE = 14;
export const FONT_ADD_SIZE = 0;
export const FONT_WEIGHT = 'normal';

export const PC_FONT_SIZE_MAPPER = {
  '-11': -5,
  '-12': -4,
  '-13': -3,
  '-14': -2,
  '-15': -1,
  '-16': 0,
  '-19': 1,
  '-21': 2,
};

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
  /**
   * 粉涨蓝跌
   */
  pink: 'pink',
} as const;

export type RaiseMode = keyof typeof validRaiseMode;

export const DEFAULT_RAISE_MODE = validRaiseMode.green;

export const TOKEN_KEY = 'sessionCode';
