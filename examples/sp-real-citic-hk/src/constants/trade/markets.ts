import { BIG_MARKET } from '@dz-web/quote-client';

/**
 * 交易市场名称
 */
export const TradeMarketDict = {
  HKEX: 'HKEX',
  SHMK: 'SHMK',
  SZMK: 'SZMK',
  USA: 'USA',
  FUND: 'FUND',
  OUTSIDE: 'OUTSIDE',
} as const;

export const allTradeMarket: ITradeMarketType[] = [TradeMarketDict.HKEX, TradeMarketDict.USA];

export type ITradeMarketType = keyof typeof TradeMarketDict;

export const BigMarketMapToTradeMarket = {
  [BIG_MARKET.HK]: TradeMarketDict.HKEX,
  [BIG_MARKET.US]: TradeMarketDict.USA,
};

/**
 * 交易市场 对应 货币
 */
export const MainMarket2Currency = {
  [TradeMarketDict.HKEX]: 'HKD',
  [TradeMarketDict.USA]: 'USD',
  [TradeMarketDict.SHMK]: 'CNY',
  [TradeMarketDict.SZMK]: 'CNY',
};
