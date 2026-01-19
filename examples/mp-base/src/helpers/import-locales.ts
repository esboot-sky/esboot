import type { Language } from '@/constants/config';
import { flattenLangObject } from '@dz-web/esboot-browser';
import { supportedLanguage } from '@/constants/config';

export type i18nMessageDict = Record<Language, Record<string, string> | null>;

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

  let langData: Record<string, any> = { default: {} };

  switch (currentLanguage) {
    case supportedLanguage.ZH_TW:
      langData = await import('@/lang/zh-TW.json');
      break;
    case supportedLanguage.EN_US:
      langData = await import('@/lang/en-US.json');
      break;
    default:
      langData = await import('@/lang/zh-CN.json');
      break;
  }
  pageI18nCache[currentLanguage] = flattenLangObject(langData.default);

  return pageI18nCache;
}

export function clearI18nCache(): void {
  pageI18nCache = defaultI18nCache;
}
