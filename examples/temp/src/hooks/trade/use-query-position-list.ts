import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

import { parseResult } from '@/api/helpers';
import { fetchMyPosition, type IMyPositionItem } from '@/api/trade/query/query';
import { allTradeMarket, type ITradeMarketType } from '@/constants/trade/markets';
import staticConfig from '@/helpers/static-config';
import { useTradeStore } from '@/model/trade';

interface UseQueryPositionListResult {
  refetch: () => void;
}

interface UseQueryPositionListProps {
  queryKey?: string;
  tradeMarket?: ITradeMarketType[];
  enabled?: boolean;
}

const { pollingInterval } = staticConfig.tradeConfig;

export const useQueryPositionList = (props?: UseQueryPositionListProps): UseQueryPositionListResult => {
  const { queryKey = 'position', tradeMarket = allTradeMarket, enabled = true } = props || {};

  const accountInfo = useTradeStore((state) => state.accountInfo);
  const setPositionList = useTradeStore((state) => state.setPositionList);
  const setIsLoadingPosition = useTradeStore((state) => state.setIsLoadingPosition);

  const enabledQuery = useMemo(() => {
    return !!accountInfo?.clientId && enabled;
  }, [accountInfo?.clientId, enabled]);

  const {
    data: positionList,
    isLoading: isLoadingPosition,
    refetch,
  } = useQuery({
    queryKey: [queryKey, tradeMarket, accountInfo?.clientId],
    queryFn: () => {
      return fetchMyPosition({ tradeMarket }).then<IMyPositionItem[]>(parseResult);
    },
    enabled: enabledQuery,
    refetchInterval: pollingInterval,
  });

  useEffect(() => {
    if (!enabledQuery) return;

    setIsLoadingPosition(isLoadingPosition);
  }, [isLoadingPosition, enabledQuery]);

  useEffect(() => {
    if (positionList) {
      setPositionList(positionList);
    }
  }, [positionList]);

  return {
    refetch,
  };
};
