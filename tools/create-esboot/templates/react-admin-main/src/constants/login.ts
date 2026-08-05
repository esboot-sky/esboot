export interface LANG_CONFIG {
  label: string;
  value: string;
}

export const DEFAULT_DICT_LANG: string[][] = [
  ['zh-CN', '简体'],
  ['zh-TW', '繁体'],
];

export const DEFAULT_LANG_LIST: LANG_CONFIG[] = DEFAULT_DICT_LANG.map(item => ({ label: item[1], value: item[0] }));

export const DEFAULT_LANG: LANG_CONFIG = DEFAULT_LANG_LIST[0];
