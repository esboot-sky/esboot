import type { Language } from '@/constants/config';
import type { i18nMessageDict } from '@/types';

import { flattenLangObject } from '@dz-web/esboot-browser';
import { supportedLanguage } from '@/constants/config';

const defaultI18nCache: i18nMessageDict = {
  [supportedLanguage.ZH_CN]: null,
  [supportedLanguage.EN_US]: null,
  [supportedLanguage.ZH_TW]: null,
};

let pageI18nCache: i18nMessageDict = defaultI18nCache;

export async function getPageI18n(currentLanguage: Language): Promise<i18nMessageDict> {
  if (pageI18nCache[currentLanguage] || !currentLanguage) {
    return pageI18nCache;
  }

  let langData: any = { default: {} };

  switch (currentLanguage) {
    case supportedLanguage.ZH_TW:
      langData = await import(`@/lang/${supportedLanguage.ZH_TW}.json`);
      break;
    case supportedLanguage.EN_US:
      langData = await import(`@/lang/${supportedLanguage.EN_US}.json`);
      break;
    default:
      langData = await import(`@/lang/${supportedLanguage.ZH_CN}.json`);
      break;
  }
  pageI18nCache[currentLanguage] = flattenLangObject(langData.default);

  console.log('多语言配置:', pageI18nCache);

  return pageI18nCache;
}

export function clearI18nCache(): void {
  pageI18nCache = defaultI18nCache;
}
