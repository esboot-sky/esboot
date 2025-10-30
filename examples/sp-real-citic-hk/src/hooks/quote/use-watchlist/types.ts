import { Market } from '@dz-web/quote-client';

export interface StockWithIsInWatchlist {
  market: Market;
  code: string;
  isInWatchlist?: boolean;
}

export interface AddToWatchlistResult {
  /**
   * 如果是登录账户，promise关联添加股票到自选分组的api请求, 如果是游客，promise直接resolve, 如果分组id不存在或股票已在自选分组中，promise直接reject
   */
  promise: Promise<void>;
  /**
   * 添加到的分组id
   */
  groupId: number | string;
}
