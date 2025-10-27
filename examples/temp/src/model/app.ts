import { BIG_MARKET, US_INTRADAY_TYPE } from '@dz-web/quote-client';
import { produce } from 'immer';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import { CacheKey } from '@/constants/cache/cache-key';
import { defaultLan, quotesColorDict, QuotesColorType, type QuotesColor } from '@/constants/config';
import { setStorage } from '@/helpers/native/msg';

export interface TradeTickOfMarket {
  isLoading: boolean;
  data: string[];
  tradeDay: number;
}

export interface AppState {
  /**
   * init === true表示已初始化，可以判断出是游客还是登录用户，能判断出来后，才初始化自选store
   */
  init: boolean;
  theme: string;
  isLogin: boolean;
  language: string;
  token: string;
  quotesColorType: QuotesColorType | null;
  prevQuotesColorType: QuotesColorType | null;
  quotesColor: QuotesColor;
  setTheme: (data: string) => void;
  setQuotesColor: (data: QuotesColorType) => void;
  setTradeTickOfMarket: (bigMarket: string, data: TradeTickOfMarket) => void;
  tradeTickOfMarket: Record<string, TradeTickOfMarket>;
  setTradeDayChangeFlow: (data: number) => void;
  setIsLogin: (data: boolean) => void;
  setLanguage: (data: string) => void;
  setToken: (data: string) => void;
  setIsPageActive: (data: boolean) => void;
  isPageActive: boolean;
}

export const getDefaultTradeTickOfMarket: () => TradeTickOfMarket = () => {
  return {
    isLoading: false,
    data: [],
    tradeDay: 0,
  };
};

const getDefaultData = () => ({
  init: false,
  theme: 'white',
  isLogin: false,
  token: '',
  language: localStorage.getItem('language') || defaultLan,
  prevQuotesColorType: null,
  quotesColorType: null,
  quotesColor: quotesColorDict[QuotesColorType.greenUpRedDown],
  isPageActive: true,
  tradeDayChangeFlow: 0,
  tradeTickOfMarket: {
    [`${BIG_MARKET.US}-${US_INTRADAY_TYPE.ALL}`]: getDefaultTradeTickOfMarket(),
    [`${BIG_MARKET.US}-${US_INTRADAY_TYPE.IN}`]: getDefaultTradeTickOfMarket(),
    [`${BIG_MARKET.US}-${US_INTRADAY_TYPE.PREV}`]: getDefaultTradeTickOfMarket(),
    [`${BIG_MARKET.US}-${US_INTRADAY_TYPE.POST}`]: getDefaultTradeTickOfMarket(),
    [BIG_MARKET.HK]: getDefaultTradeTickOfMarket(),
    [BIG_MARKET.CN]: getDefaultTradeTickOfMarket(),
  },
});

export const useAppStore = create<AppState>()(
  subscribeWithSelector((set) => ({
    ...getDefaultData(),
    setTheme: (data: string) => {
      set(
        produce((state) => {
          state.theme = data;
        }),
      );
    },
    setQuotesColor: (data) => {
      set(
        produce((state) => {
          const _data = data || QuotesColorType.greenUpRedDown;
          state.prevQuotesColorType = state.quotesColorType;
          state.quotesColorType = _data;
          state.quotesColor = quotesColorDict[_data];
          setStorage({ key: CacheKey.quotesUpDownColor, value: _data });
        }),
      );
    },
    setTradeTickOfMarket: (bigMarket: string, data: { isLoading: boolean; data: string[] }) => {
      set(
        produce((state) => {
          state.tradeTickOfMarket[bigMarket] = data;
        }),
      );
    },
    setIsLogin: (data: boolean) => {
      set(
        produce((state: AppState) => {
          state.init = true;
          state.isLogin = data;
        }),
      );
    },
    setLanguage: (data: string) => {
      set(
        produce((state) => {
          localStorage.setItem('language', data);
          state.language = data;
        }),
      );
    },
    setToken: (data: string) => {
      set(
        produce((state) => {
          state.token = data;
        }),
      );
    },
    setIsPageActive: (data: boolean) => {
      set(
        produce((state) => {
          state.isPageActive = data;
        }),
      );
    },
    setTradeDayChangeFlow: (data: number) => {
      set(
        produce((state) => {
          state.tradeDayChangeFlow = data;
        }),
      );
    },
  })),
);

useAppStore.subscribe(
  (state) => {
    return {
      quotesColorType: state.quotesColorType,
      prevQuotesColorType: state.prevQuotesColorType,
    };
  },
  (state) => {
    const { quotesColorType, prevQuotesColorType } = state;
    if (quotesColorType) {
      document.documentElement.classList.add(quotesColorType);
    }

    if (prevQuotesColorType) {
      document.documentElement.classList.remove(prevQuotesColorType);
    }
  },
);
