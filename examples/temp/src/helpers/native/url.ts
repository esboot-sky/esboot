import { isTrue } from '@dz-web/o-orange';
import { throttle } from 'lodash-es';

import { CommodityQuoteKey } from '@/api/types';
import { CacheKey } from '@/constants/cache/cache-key';
import { isDev } from '@/constants/config';
import { IPOHomeTabKey } from '@/constants/ipo';
import { HKBlockTab, HKMarketTab, USMarketTab } from '@/constants/market';
import { marketType } from '@/constants/quotation';

import { openPage as openPageNative, PageType, OpenPageParams } from './msg';

import type { Stocks, Market, Code } from '@dz-web/quote-client';

const getUrlWithSubpath = (url: string) => {
  const { origin, pathname } = window.location;
  const newPathname = pathname.split('/');
  const { length } = newPathname;
  newPathname[length - 1] = url;
  return origin + newPathname.filter(Boolean).join('/');
};

export const openPage = throttle(
  (location: string, params: Partial<Omit<OpenPageParams, 'path'>> = {}) => {
    if (!isDev) {
      let url = location;
      if (url.startsWith('/')) {
        url = getUrlWithSubpath(url);
      }
      openPageNative({
        ...params,
        path: url,
        pageType: params.pageType || PageType.HTML,
      });
    } else {
      window.location.href = location;
    }
  },
  2000,
  {
    trailing: false,
  },
);

export const openLoginPage = () => {
  console.log('openLoginPage');
};

export const openTradeAssetHelpPage = () => {
  openPage(`/trade-asset-help.html`);
};

export const openSymbolInfoPage = (marketId: Market, code: Code, candidateList?: Stocks) => {
  if (isTrue(marketId) && isTrue(code)) {
    const path = `/symbol-info.html?market=${marketId}&code=${encodeURIComponent(code)}`;

    if (candidateList) {
      localStorage.setItem(CacheKey.quoteSymbolInfoCandidateList, JSON.stringify(candidateList));
    }

    openPage(path, { fullScreen: true });
  }
};

export const openHKConstitueRankingPage = ({ blockId, market, code }: CommodityQuoteKey) => {
  let path = `/hk-constitute-ranking.html?market=${market}&code=${code}`;

  if (isTrue(blockId!)) {
    path += `&block_id=${blockId}`;
  }

  openPage(path);
};

export const openHKMarketRankingPage = (tab: HKMarketTab | string) => {
  if (isTrue(tab)) {
    openPage(`/hk-market-ranking.html?tab=${tab}`);
  }
};

export const openUSETFRankingPage = () => {
  openPage(`/us-etf-ranking.html`);
};

export const openHKETFPage = () => {
  openPage(`/hk-etf.html`);
};

export const openWarrantsAndCbbcPage = () => {
  openPage(`/warrants-and-cbbc.html`);
};

export const openHKBlockRankingPage = (tab: HKBlockTab | string) => {
  if (isTrue(tab)) {
    openPage(`/hk-block-ranking.html?tab=${tab}`);
  }
};

export const openIPOHome = (tab?: IPOHomeTabKey) => {
  if (tab) {
    openPage(`/ipo-home.html?active=${tab}`, { fullScreen: true });
  } else {
    openPage(`/ipo-home.html`, { fullScreen: true });
  }
};

export const openUSMarketRankingPage = (tab: USMarketTab | string) => {
  if (isTrue(tab)) {
    openPage(`/us-market-ranking.html?tab=${tab}`);
  }
};

export const openManageWatchlistStockPage = (groupGenId: string | undefined) => {
  if (isTrue(groupGenId!)) {
    openPage(`/manage-watchlist-stock.html?groupId=${groupGenId}`);
  }
};

export const openQuotesPackagesPage = () => {
  openPage(`/quotes-packages.html?active=${marketType.US}`, { fullScreen: true });
};
