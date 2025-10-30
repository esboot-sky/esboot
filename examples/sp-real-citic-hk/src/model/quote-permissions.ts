import { BIG_MARKET } from '@dz-web/quote-client';
import { produce } from 'immer';
import { keyBy } from 'lodash-es';
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

import { MarketQuotePermissionsResponse, UserQuotationPermissionResponse } from '@/api/quotation/query';

export enum QuoteLevelPermissionCode {
  LEVEL_0 = 'level0',
  LEVEL_1 = 'level1',
  LEVEL_2 = 'level2',
  // BMP = 'bmp',
  // CPC_LV2 = 'LV2',
  // CPC_LV1 = 'LV1', // 预留, app、java有预留，大概用不到了
}

export interface QuotePermissionsItem {
  isLive: boolean;
  supplierName: string;
  level: QuoteLevelPermissionCode;
}

export type MarketQuotePermissionItem = MarketQuotePermissionsResponse['markets'][number] & {
  isLive: boolean;
};

interface QuoteInfoState {
  bigMarketPermissions: Record<BIG_MARKET, QuotePermissionsItem>;
  /**
   * 小市场权限，key是小市场代码，如2002, 有值读取实际权限，无值是无权限，无权限需要报错，无权限不管看了实时还是延时数据，都算生产事故
   */
  marketPermissions: Record<string, MarketQuotePermissionItem>;
  isBigMarketPermissionsLoading: boolean;
  isBigMarketPermissionsLoaded: boolean;
  isMarketPermissionsLoaded: boolean;
  quoteNotice: string;
}

interface QuoteInfoAllState extends QuoteInfoState {
  setBigMarketQuotePermissions: (data: UserQuotationPermissionResponse) => void;
  setMarketQuotePermissions: (data: MarketQuotePermissionsResponse) => void;
  setIsBigMarketPermissionsLoading: (data: boolean) => void;
}

const quotePermissionBackendMarket: Record<string, BIG_MARKET> = {
  // 1:港股 ; 2:A股 ; 3:美股
  '1': BIG_MARKET.HK,
  '2': BIG_MARKET.CN,
  '3': BIG_MARKET.US,
};

const getDefaultData = () => ({
  bigMarketPermissions: {
    [BIG_MARKET.HK]: {
      isLive: false,
      supplierName: '',
      level: QuoteLevelPermissionCode.LEVEL_0,
    },
    [BIG_MARKET.US]: {
      isLive: false,
      supplierName: '',
      level: QuoteLevelPermissionCode.LEVEL_0,
    },
    [BIG_MARKET.CN]: {
      isLive: false,
      supplierName: '',
      level: QuoteLevelPermissionCode.LEVEL_0,
    },
  },
  marketPermissions: {},
  quoteNotice: '',
  isBigMarketPermissionsLoading: true,
  isBigMarketPermissionsLoaded: false,
  isMarketPermissionsLoaded: false,
});

export const useQuotePermissionsStore = create<QuoteInfoAllState>()(
  subscribeWithSelector(
    devtools(
      (set) => ({
        ...getDefaultData(),
        setBigMarketQuotePermissions: (data: UserQuotationPermissionResponse) => {
          const { products, tips } = data;

          set(
            produce((state) => {
              state.isBigMarketPermissionsLoaded = true;
              products.forEach((product) => {
                const market = quotePermissionBackendMarket[product.marketType];
                state.bigMarketPermissions[market] = {
                  isLive: product.code !== QuoteLevelPermissionCode.LEVEL_0,
                  supplierName: product.supplierName,
                  // 这里可修改全局行情权限, 方便测试
                  level: product.code as QuoteLevelPermissionCode,
                };
              });
              state.quoteNotice = tips;
            }),
          );
        },
        setMarketQuotePermissions: (data: MarketQuotePermissionsResponse) => {
          const { markets } = data;

          set(
            produce((state: QuoteInfoState) => {
              state.isMarketPermissionsLoaded = true;
              state.marketPermissions = keyBy(
                markets.map((m) => ({ ...m, isLive: m.level !== '0' })),
                'code',
              );
            }),
          );
        },
        setIsBigMarketPermissionsLoading: (data: boolean) => {
          set(
            produce((state) => {
              state.isBigMarketPermissionsLoading = data;
            }),
          );
        },
      }),
      {
        name: 'quote-permissions',
      },
    ),
  ),
);
