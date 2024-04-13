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

export type ThemeValues = typeof SupportedThemes[keyof typeof SupportedThemes];

export const DEFAULT_THEME = SupportedThemes.light;
