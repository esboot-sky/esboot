import { WatchlistGroupEnum } from '@/constants/watchlist';

export function getWatchlistI18nKeyByGroupType(type: number) {
  switch (type) {
    case WatchlistGroupEnum.All:
      return 'watchlist.all';
    case WatchlistGroupEnum.HKGroup:
      return 'watchlist.hkMarket';
    case WatchlistGroupEnum.USGroup:
      return 'watchlist.usMarket';
    default:
      return '';
  }
}
