import { useQuery, type QueryFunctionContext } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { parseResult } from '@/api/helpers';
import { fetchMarketQuotePermissions, fetchUserQuotationPermission } from '@/api/quotation/query';
import { CacheKey, CacheStore } from '@/constants/cache';
import { EVENT_KEY } from '@/constants/event-key';
import { QueryKeyMarketPermissions } from '@/constants/query-keys';
import { onEvent } from '@/helpers/native/msg';
import staticConfig from '@/helpers/static-config';
import { isEntryPage } from '@/helpers/url';
import { useAppStore } from '@/model/app';
import { useQuotePermissionsStore } from '@/model/quote-permissions';

const { marketPermissionsPollingInterval } = staticConfig;
const cacheUserQuotationPermission = CacheStore.getItem(CacheKey.globalUserQuotationPermission, null);
const cacheMarketQuotePermissions = CacheStore.getItem(CacheKey.globalMarketQuotePermissions, null);
export function useUserQuotePermissions() {
  const token = useAppStore((state) => state.token);
  const isPageActive = useAppStore((state) => state.isPageActive);
  const setBigMarketQuotePermissions = useQuotePermissionsStore((state) => state.setBigMarketQuotePermissions);
  const setMarketQuotePermissions = useQuotePermissionsStore((state) => state.setMarketQuotePermissions);
  const setIsBigMarketPermissionsLoading = useQuotePermissionsStore((state) => state.setIsBigMarketPermissionsLoading);
  const [quoteSubscriptionFlow, setQuoteSubscriptionFlow] = useState(0);
  const [isSkipFirstFetch, setIsSkipFirstFetch] = useState(isEntryPage());

  const { data: bigMarketQuotePermissions, isLoading: isLoadingBigMarketQuotePermissions } = useQuery({
    queryKey: ['fetchUserQuotationPermission', token, quoteSubscriptionFlow],
    queryFn: () => {
      return fetchUserQuotationPermission()
        .then(parseResult)
        .then((res) => {
          CacheStore.setItem(CacheKey.globalUserQuotationPermission, res);
          return res;
        });
    },
    initialData: () => {
      if (!isEntryPage() && cacheUserQuotationPermission) {
        return cacheUserQuotationPermission;
      }

      return undefined;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchInterval: marketPermissionsPollingInterval,
    refetchIntervalInBackground: false,
    enabled: !!token && isPageActive && isSkipFirstFetch,
  });

  const { data: smallMarketPermissions } = useQuery({
    queryKey: [...QueryKeyMarketPermissions, quoteSubscriptionFlow],
    queryFn: (context: QueryFunctionContext) => {
      console.log(context, 'context');

      return fetchMarketQuotePermissions().then((res) => {
        CacheStore.setItem(CacheKey.globalMarketQuotePermissions, res);
        return res;
      });
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchIntervalInBackground: false,
    // 定时刷新小市场权限, 可能中途有权限到期
    refetchInterval: marketPermissionsPollingInterval,
    networkMode: 'always',
    initialData: () => {
      if (!isEntryPage() && cacheMarketQuotePermissions) {
        return cacheMarketQuotePermissions;
      }

      return undefined;
    },
    enabled: isPageActive && isSkipFirstFetch,
  });

  useEffect(() => {
    if (smallMarketPermissions) {
      setMarketQuotePermissions(smallMarketPermissions.result);
    }
  }, [smallMarketPermissions]);

  useEffect(() => {
    if (bigMarketQuotePermissions) {
      setBigMarketQuotePermissions(bigMarketQuotePermissions);
    }
  }, [bigMarketQuotePermissions]);

  useEffect(() => {
    setIsBigMarketPermissionsLoading(isLoadingBigMarketQuotePermissions);
  }, [isLoadingBigMarketQuotePermissions]);

  useEffect(() => {
    setTimeout(() => {
      setIsSkipFirstFetch(true);
    }, marketPermissionsPollingInterval);
  }, []);

  useEffect(() => {
    onEvent(
      { event: EVENT_KEY.SUBSCRIBE_QUOTES_PACKAGE_SUCCESS, key: EVENT_KEY.SUBSCRIBE_QUOTES_PACKAGE_SUCCESS },
      () => {
        setQuoteSubscriptionFlow(quoteSubscriptionFlow + 1);
      },
    );
  }, []);
}

/**
 * 用户权限缓存策略说明
 *
 * 1. 只有入口页面会重新请求，次级页面直接读缓存。
 * 2. 只有当前激活页面去轮询，查询到数据更新通过交互提醒不活跃页面，且更新缓存
 */
