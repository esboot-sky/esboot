import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

import { parseResult } from '@/api/helpers';
import { queryTodayOrder, type OrderItem } from '@/api/trade/query/query';
import { allTradeMarket, type ITradeMarketType } from '@/constants/trade/markets';
import staticConfig from '@/helpers/static-config';
import { useTradeStore } from '@/model/trade';

interface UseQueryOrderListResult {
  refetch: () => void;
}

interface UseQueryOrderListProps {
  queryKey?: string;
  enabled?: boolean;
  tradeMarket?: ITradeMarketType[];
}

const { pollingInterval } = staticConfig.tradeConfig;

export const useQueryOrderList = (props?: UseQueryOrderListProps): UseQueryOrderListResult => {
  const { queryKey = 'today-order', tradeMarket = allTradeMarket, enabled = true } = props || {};

  const accountInfo = useTradeStore((state) => state.accountInfo);
  const setOrderList = useTradeStore((state) => state.setOrderList);
  const setIsLoadingOrder = useTradeStore((state) => state.setIsLoadingOrder);

  const enabledQuery = useMemo(() => {
    return !!accountInfo?.clientId && enabled;
  }, [accountInfo?.clientId, enabled]);

  const {
    data: orderList,
    isLoading: isLoadingOrder,
    refetch,
  } = useQuery({
    queryKey: [queryKey, tradeMarket, accountInfo?.clientId],
    queryFn: () => {
      return queryTodayOrder({ tradeMarket }).then<OrderItem[]>(parseResult);
    },
    enabled: !!accountInfo?.clientId && enabled,
    refetchInterval: pollingInterval,
  });

  useEffect(() => {
    if (!enabledQuery) return;

    setIsLoadingOrder(isLoadingOrder);
  }, [isLoadingOrder, enabledQuery]);

  useEffect(() => {
    if (orderList) {
      setOrderList(orderList || []);
    }
  }, [orderList]);

  return {
    refetch,
  };
};
