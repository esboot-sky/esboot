import { Language } from './config';

export interface LANG_CONFIG {
  label: string;
  value: Language;
}

export const DEFAULT_DICT_LANG: [Language, string][] = [
  [Language.ZH_CN, '简体'],
  [Language.ZH_TW, '繁体'],
];

export const DEFAULT_LANG_LIST: LANG_CONFIG[] = DEFAULT_DICT_LANG.map(item => ({ label: item[1], value: item[0] }));

export const DEFAULT_LANG: LANG_CONFIG = DEFAULT_LANG_LIST[0];
