import { find } from 'lodash-es';

import { supportedLanguage } from '@/constants/config';

export function isSupportedLanguage(lang?: string): boolean {
  return !!lang && !!find(supportedLanguage, (item) => item === lang);
}
