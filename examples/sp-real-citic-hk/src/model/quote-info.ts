import { getBigMarketId, BIG_MARKET, getMarketCategory, MARKET_CATEGORY } from '@dz-web/quote-client';
import { produce } from 'immer';
import { create } from 'zustand';

import { BigMarketMapToTradeMarket, type ITradeMarketType } from '@/constants/trade/markets';
import { QuoteLevelPermissionCode } from '@/model/quote-permissions';

import type { QuotePermissionsItem } from '@/model/quote-permissions';
import type { Code, CommodityQuote, Market, Stock } from '@dz-web/quote-client';

export const getStockHash = (market: Market, code: Code) => {
  return `${market}-${code}`;
};

interface QuoteInfoState {
  symbol: Stock & { hash: string; bigMarketId: BIG_MARKET; tradeMarket: ITradeMarketType };
  blockId?: number;
  setSymbol: (data: Stock) => void;
  reset: () => void;
  isUSMarket: boolean;
  isHKMarket: boolean;
  isCanTrade: boolean;
  packageInfo: QuotePermissionsItem;
  setPackageInfo: (data: QuotePermissionsItem) => void;
  symbolInfo: CommodityQuote;
  setSymbolInfo: (data: CommodityQuote) => void;
  clearSymbol: () => void;
  marketCategory: ReturnType<typeof getMarketCategory>;
}

const getDefaultData = () => ({
  packageInfo: {
    isLive: false,
    supplierName: '',
    level: QuoteLevelPermissionCode.LEVEL_0,
  },
  symbolInfo: {} as CommodityQuote,
  symbol: {} as QuoteInfoState['symbol'],
  isUSMarket: false,
  isHKMarket: false,
  isCanTrade: false,
  marketCategory: null,
});

export const useQuoteInfo = create<QuoteInfoState>((set) => ({
  ...getDefaultData(),
  setSymbol: (data: Stock) =>
    set(
      produce((state) => {
        const marketId = data.market;
        const code = data.code.toUpperCase();
        const hash = getStockHash(marketId, code);
        const bigMarketId = getBigMarketId(marketId);

        if (state.symbol.hash === hash) {
          return;
        }

        state.symbol = {
          ...data,
          code,
          bigMarketId,
          hash,
          tradeMarket: BigMarketMapToTradeMarket[bigMarketId as keyof typeof BigMarketMapToTradeMarket],
        };

        state.marketCategory = getMarketCategory(marketId);
        /**
         * @deprecated Please use marketCategory instead
         */
        state.isUSMarket = BIG_MARKET.US === getBigMarketId(marketId);
        /**
         * @deprecated Please use marketCategory instead
         */
        state.isHKMarket = BIG_MARKET.HK === getBigMarketId(marketId);
        state.isCanTrade = [MARKET_CATEGORY.hk, MARKET_CATEGORY.us].includes(state.marketCategory);
      }),
    ),
  clearSymbol: () =>
    set(
      produce((state) => {
        state.symbol = {
          ...state.symbol,
          code: '',
          hash: '',
          bigMarketId: null,
          tradeMarket: null,
        };
        state.symbolInfo = {} as CommodityQuote;
        state.marketCategory = null;
        state.isUSMarket = false;
        state.isHKMarket = false;
        state.isCanTrade = false;
      }),
    ),
  setPackageInfo: (data: QuotePermissionsItem) =>
    set(
      produce((state) => {
        state.packageInfo = data;
      }),
    ),
  setSymbolInfo: (data: CommodityQuote) =>
    set(
      produce((state) => {
        state.symbolInfo = data;
      }),
    ),
  reset: () => set(getDefaultData()),
}));
