import { flattenLangObject } from '@dz-web/esboot-browser';

import { lanEnum } from '@/constants/config';

export type i18nMessageDict = Record<lanEnum, Record<string, string> | null>;

const defaultI18nCache: i18nMessageDict = {
  [lanEnum.ZH_CN]: null,
  [lanEnum.EN_US]: null,
  [lanEnum.ZH_TW]: null,
};

let pageI18nCache: i18nMessageDict = defaultI18nCache;

export async function getPageI18n(currentLanguage: lanEnum): Promise<i18nMessageDict> {
  if (pageI18nCache[currentLanguage] || !currentLanguage) {
    return pageI18nCache;
  }

  let langData: any = { default: {} };

  switch (currentLanguage) {
    case lanEnum.ZH_TW:
      langData = await import('@/lang/zh-TW.json');
      break;
    case lanEnum.EN_US:
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
