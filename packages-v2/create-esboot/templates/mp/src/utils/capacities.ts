import { find } from 'lodash-es';
import { supportedLanguage } from '../constants/config';
import { SupportedThemes } from '../platforms/mobile/constants/config';

export function isSupportedLanguage(lang?: string): boolean {
  return !!lang && !!find(supportedLanguage, (item) => item === lang);
}

export function isSupportedTheme(theme?: string): boolean {
  return !!theme && !!find(SupportedThemes, (item) => item === theme);
}

export function isValidRaiseMode(raise?: string) {
  return !!raise && (raise === 'green' || raise === 'red');
}
