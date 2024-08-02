import { find } from 'lodash-es';

import { SupportedThemes, validRaiseMode } from '@mobile/constants/config';

export function isSupportedTheme(theme?: string): boolean {
  return !!theme && theme in SupportedThemes;
}

export function isValidRaiseMode(raise?: string) {
  return !!raise && !!find(validRaiseMode, (item) => item === raise);
}
