import { supportedLanguage } from '@/constants/config';
import enUS from '@/lang/en-US';
import zhCN from '@/lang/zh-CN';
import zhTW from '@/lang/zh-TW';
import { i18nMessageDict } from '@/types';

type NestedObject = { [key: string]: any };
function flattenObject(obj: NestedObject): NestedObject {
  const result: NestedObject = {};

  function recurse(currentObj: NestedObject, currentPath: string) {
    Object.keys(currentObj).forEach((key) => {
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      if (typeof currentObj[key] === 'object' && currentObj[key] !== null && !Array.isArray(currentObj[key])) {
        recurse(currentObj[key], newPath);
      } else {
        result[newPath] = currentObj[key];
      }
    });
  }

  recurse(obj, '');
  return result;
}

export function getPageI18n(): i18nMessageDict {
  const locales = {
    [supportedLanguage.ZH_TW]: flattenObject(zhTW),
    [supportedLanguage.ZH_CN]: flattenObject(zhCN),
    [supportedLanguage.EN_US]: flattenObject(enUS),
  };

  if (process.env.NODE_ENV === 'development') {
    // console.log('多语言配置:', locales);
  }

  return locales;
}
