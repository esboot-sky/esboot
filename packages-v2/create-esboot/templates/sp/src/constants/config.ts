/**
 * bridge mock
 */
let defaultUseBridgeMock = true;
// let defaultUseBridgeMock = false;

if (process.env.NODE_ENV === 'production') defaultUseBridgeMock = false;
export const useBridgeMock = defaultUseBridgeMock;

/**
 * 多语言
 *
 */
export enum Language {
  ZH_CN = 'zh-CN',
  ZH_TW = 'zh-TW',
  EN_US = 'en-US',
}

export const DEFAULT_LAN = Language.ZH_CN;

// Quote Color
const GREEN_COLOR = '#2d9e00';
const RED_COLOR = '#f23030';

export interface QuoteColorDirection {
  up: string;
  down: string;
}

export enum QuoteColorType {
  green = 'green',
  red = 'red',
}

export const QUOTE_COLOR_DICT: Record<Partial<QuoteColorType>, QuoteColorDirection> = {
  green: {
    up: GREEN_COLOR,
    down: RED_COLOR,
  },
  red: {
    up: RED_COLOR,
    down: GREEN_COLOR,
  },
};

export const DEFAULT_RISE_FALL_COLOR = QUOTE_COLOR_DICT.red;
