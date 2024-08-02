import { parseKeyValues } from '@websaber/string-utils';

export const initPageQuery: {
  /**
   * 语言
   */
  lang?: string;
  /**
   * 语言
   */
  language?: string;
  /**
   * 主题色
   */
  theme?: string;
  /**
   * 涨跌模式
   */
  raise?: string;
  /**
   * pc字体大小参数
   */
  additionalSize?: string;
  /**
   * pc字体粗细参数
   */
  weight?: string;
  [key: string]: string | undefined;
} = parseKeyValues.stringOnly(window.location.href) as Record<string, string>;
