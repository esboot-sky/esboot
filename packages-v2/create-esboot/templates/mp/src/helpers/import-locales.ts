import globalCNLocales from '@/locales/zh-CN.json';
import globalTWLocales from '@/locales/zh-TW.json';
import globalENLocales from '@/locales/en-US.json';
import mobileCNLocales from '@mobile/locales/zh-CN.json';
import mobileTWLocales from '@mobile/locales/zh-TW.json';
import mobileENLocales from '@mobile/locales/en-US.json';
import pcCNLocales from '@pc/locales/zh-CN.json';
import pcTWLocales from '@pc/locales/zh-TW.json';
import pcENLocales from '@pc/locales/en-US.json';
import mobileNativeCNLocales from '@mobile-native/locales/zh-CN.json';
import mobileNativeTWLocales from '@mobile-native/locales/zh-TW.json';
import mobileNativeENLocales from '@mobile-native/locales/en-US.json';
import mobileBrowserCNLocales from '@mobile-browser/locales/zh-CN.json';
import mobileBrowserTWLocales from '@mobile-browser/locales/zh-TW.json';
import mobileBrowserENLocales from '@mobile-browser/locales/en-US.json';
import pcBrowserCNLocales from '@pc-browser/locales/zh-CN.json';
import pcBrowserTWLocales from '@pc-browser/locales/zh-TW.json';
import pcBrowserENLocales from '@pc-browser/locales/en-US.json';
import pcNativeCNLocales from '@pc-native/locales/zh-CN.json';
import pcNativeTWLocales from '@pc-native/locales/zh-TW.json';
import pcNativeENLocales from '@pc-native/locales/en-US.json';
import { I18nOption } from '@/types';
import { Language, supportedLanguage } from '@/constants/config';

export function importLocales(pageLocales: Record<string, string>, lang: Language) {
  // eslint-disable-next-line prefer-destructuring
  const isMobile = process.env.isMobile;
  // eslint-disable-next-line prefer-destructuring
  const isBrowser = process.env.isBrowser;

  if (lang === supportedLanguage.ZH_CN) {
    return {
      ...globalCNLocales,
      ...(isMobile ? {
        ...mobileCNLocales,
        ...(isBrowser ? mobileBrowserCNLocales : mobileNativeCNLocales),
      } : {
        ...pcCNLocales,
        ...(isBrowser ? pcBrowserCNLocales : pcNativeCNLocales),
      }),
      ...pageLocales,
    };
  }
  if (lang === supportedLanguage.ZH_TW) {
    return {
      ...globalTWLocales,
      ...(isMobile ? {
        ...mobileTWLocales,
        ...(isBrowser ? mobileBrowserTWLocales : mobileNativeTWLocales),
      } : {
        ...pcTWLocales,
        ...(isBrowser ? pcBrowserTWLocales : pcNativeTWLocales),
      }),
      ...pageLocales,
    };
  }
  if (lang === supportedLanguage.EN_US) {
    return {
      ...globalENLocales,
      ...(isMobile ? {
        ...mobileENLocales,
        ...(isBrowser ? mobileBrowserENLocales : mobileNativeENLocales),
      } : {
        ...pcENLocales,
        ...(isBrowser ? pcBrowserENLocales : pcNativeENLocales),
      }),
      ...pageLocales,
    };
  }

  return pageLocales;
}

export function getPageI18n(dict: I18nOption['messageDict']) {
  const locales = {
    [supportedLanguage.ZH_TW]: importLocales(dict['zh-TW'], supportedLanguage.ZH_TW),
    [supportedLanguage.ZH_CN]: importLocales(dict['zh-CN'], supportedLanguage.ZH_CN),
    [supportedLanguage.EN_US]: importLocales(dict['en-US'], supportedLanguage.EN_US),
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('多语言配置:', locales);
  }

  return {
    messageDict: locales,
  };
}
