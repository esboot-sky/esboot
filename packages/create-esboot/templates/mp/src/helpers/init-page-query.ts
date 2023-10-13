import { parseKeyValues } from '@websaber/string-utils';

export const initPageQuery: {
  /**
   * 语言
   */
  lang?: string;
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
  additionalSize?: number;
  /**
   * pc字体粗细参数
   */
  weight?: string;
  [key: string]: string | number | undefined;
} = parseKeyValues(window.location.href);
