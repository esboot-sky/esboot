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
  yellow: 'yellow',
} as const;

export type ThemeValues = typeof SupportedThemes[keyof typeof SupportedThemes];

export const DEFAULT_THEME = SupportedThemes.light;

/**
 * 字体设置相关
 */
export const FONT_SIZE = 14;
export const FONT_ADD_SIZE = 0;
export const FONT_WEIGHT = 'normal';

export const PC_FONT_SIZE_MAPPER = {
  '-11': -3,
  '-12': -2,
  '-13': -1,
  '-14': 0,
  '-15': 1,
  '-16': 2,
  '-19': 3,
  '-21': 4,
};
