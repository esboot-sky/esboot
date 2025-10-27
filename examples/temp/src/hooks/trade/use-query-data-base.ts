import type { ITradeMarketType } from '@/constants/trade/markets';

export interface UseQueryDataBaseProps {
  queryKey?: string;
  enabled?: boolean;
  tradeMarket?: ITradeMarketType[];
}

// TODO: 待优化
// 抽取查询数据的方法
