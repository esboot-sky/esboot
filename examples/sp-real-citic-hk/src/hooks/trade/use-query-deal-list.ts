import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

import { parseResult } from '@/api/helpers';
import { fetchTodayCompletedOrders, type ICompletedOrderItem } from '@/api/trade/query/query';
import { allTradeMarket } from '@/constants/trade/markets';
import staticConfig from '@/helpers/static-config';
import { useTradeStore } from '@/model/trade';

import { type UseQueryDataBaseProps } from './use-query-data-base';

interface UseQueryDealListResult {
  refetch: () => void;
}

const { pollingInterval } = staticConfig.tradeConfig;

export const useQueryDealList = (props?: UseQueryDataBaseProps): UseQueryDealListResult => {
  const { queryKey = 'today-deal', tradeMarket = allTradeMarket, enabled = true } = props || {};

  const accountInfo = useTradeStore((state) => state.accountInfo);
  const setTodayDealList = useTradeStore((state) => state.setTodayDealList);
  const setIsLoadingTodayDeal = useTradeStore((state) => state.setIsLoadingTodayDeal);

  const enabledQuery = useMemo(() => {
    return !!accountInfo?.clientId && enabled;
  }, [accountInfo?.clientId, enabled]);

  const {
    data: todayDealList,
    isLoading: isLoadingTodayDeal,
    refetch,
  } = useQuery({
    queryKey: [queryKey, tradeMarket, accountInfo?.clientId],
    queryFn: () => {
      return fetchTodayCompletedOrders({ tradeMarket }).then<ICompletedOrderItem[]>(parseResult);
    },
    enabled: !!accountInfo?.clientId && enabled,
    refetchInterval: pollingInterval,
  });

  useEffect(() => {
    setTodayDealList(todayDealList || []);
  }, [todayDealList]);

  useEffect(() => {
    if (!enabledQuery) return;

    setIsLoadingTodayDeal(isLoadingTodayDeal);
  }, [isLoadingTodayDeal, enabledQuery]);

  return {
    refetch,
  };
};
