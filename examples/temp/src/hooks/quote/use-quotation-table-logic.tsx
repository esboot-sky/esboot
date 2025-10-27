import { Stocks } from '@dz-web/quote-client';
import { useQuery } from '@tanstack/react-query';
import { useDeepCompareEffect } from 'ahooks';
import { debounce, isArray, isNil, pick } from 'lodash-es';
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';

import { useRerender } from '@/hooks/use-rerender';

import { HookUseQuotationPush } from './use-quotation-push-types';

function getDefaultMarketAndCode(item: any) {
  return { market: item.market_id || item.market, code: item.code };
}

export interface UseQuotationTableLogicOptions<T = any, R = any, P = any> {
  /**
   * 从列表数据获取market, code
   */
  getMarketAndCode?: (item: T) => { market: number; code: string };
  /**
   * 从行情推送数据获取market, code
   */
  getMarketAndCodeFromPushData?: (item: T) => { market: number; code: string };
  /**
   * react query key 前缀，用于区分不同的查询, 与params参数，begin, count共同组成全局唯一key
   */
  queryKeyPrefix: any;
  /**
   * 请求参数
   */
  params: P;
  /**
   * 发送请求前，自定义添加begin, count到请求参数哪个字段, 默认实现了把begin, count添加到params参数中
   * @param range
   * @param requestParams
   * @returns 返回新的参数
   */
  addRangeToParams?: (range: Range, requestParams: any) => any;
  /**
   * 从响应数据中提取data, total数据
   * @param res
   * @returns
   */
  extractRequiredResData?: (res: R) => { data: T[]; total: number };
  /**
   * enable控制是否发送请求，当前显示的数据数量为0是也不会发送请求
   */
  enabled?: boolean;
  /**
   * 请求API, 接收传入的请求参数, 返回响应数据的Promise
   * @param params 传入的请求参数
   * @returns 响应数据的Promise
   */
  requestAPI: (params: P) => Promise<R>;
  /**
   * 默认是api有begin, count参数，只部分替换本地数据，如果需要每次全量替换，则设置为true, 自选业务接口总是全量排序数据，需要全量替换
   */
  fullReplaceAPIData?: boolean;
  /**
   * 滚动到顶部, 切换查询条件时会调用, 控制表格, 如排序条件切换
   */
  scrollTableToTop?: () => void;
  /**
   * 从行情推送数据中提取需要订阅的字段，合并到data中，出于节约内存的需要，必须指定要合并的字段名
   */
  pickQuoteFields?: string[];
  /**
   * 开启只提取保存指定的字段，节约内存，默认开启，新版s6, s8的行情已支持只返回指定的字段，关闭这个功能提高性能, 默认不开启, 但是pickQuoteFields还得填，要传给行情sdk
   */
  enablePickQuoteFields?: boolean;
  /**
   * 订阅行情关注的字段，如不指定，行情推送订阅接收到不关注的字段时，不会触发当前界面数据更新
   */
  subscribeFields?: string[];
  /**
   * 是否开启轮询，默认不开启
   */
  enablePolling?: boolean;
  /**
   * 轮询间隔，单位毫秒，默认5000毫秒
   */
  pollingInterval?: number;
  /**
   * 指定行情推送hook，库中自带了S6版本useS6QuotationPush, S8尚未支持, 未指定时，不会订阅行情
   */
  useQuotationPush?: HookUseQuotationPush;
  /**
   * 是否开启行情推送，默认开启
   */
  enableQuotationPush?: boolean;
  /**
   * 忽略行情订阅顺序，默认忽略(一般会定时轮询接口排序顺序会变，所以订阅顺序会变化, 导致触发不必要的重新订阅),
   * 如果像自选股这种的业务，不排序的时候，取决于本地排序，不能忽略订阅顺序，否则会导致行情不触发重新订阅，不能马上拿到数据
   */
  ignoreQuotationSubscribeOrder?: boolean;
  /**
   * 为了性能，返回的data实际引用不会改变，如需要监听强制更新通知，可传入此回调
   */
  onRerender?: () => void;
}

export interface UseQuotationTableLogicReturn<T> {
  /**
   * 表格可视区域数据变化时，应调用此方法
   */
  onVisibleDataChange: (beginIndex: number, count: number) => void;
  /**
   * 表格数据, 返回的是proxy对象，目前只支持数组下标访问，用.slice也可以,[...data]未支持
   */
  data: T[];
  /**
   * 是否首次加载当前查询条件的数据
   */
  isLoading: boolean;
  /**
   * 获取表格可视区域数据
   */
  getVisibleData: () => T[];
  getVisibleSymbols(): Stocks;
}

export interface Range {
  begin: number;
  count: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() {}

export function useQuotationTableLogic<T, R = any, P = any>({
  queryKeyPrefix,
  enabled = true,
  params,
  addRangeToParams = (range, requestParams) => ({ ...requestParams, ...range }),
  extractRequiredResData = (res: any) => ({ data: res.body?.symbols, total: res.body.total_count }),
  requestAPI,
  scrollTableToTop,
  pickQuoteFields = [],
  enablePickQuoteFields = false,
  subscribeFields = [],
  getMarketAndCode = getDefaultMarketAndCode,
  getMarketAndCodeFromPushData = getDefaultMarketAndCode,
  useQuotationPush = noop,
  enablePolling = false,
  pollingInterval = 5000,
  enableQuotationPush = true,
  ignoreQuotationSubscribeOrder = true,
  fullReplaceAPIData = false,
  onRerender,
}: UseQuotationTableLogicOptions<T, R, P>): UseQuotationTableLogicReturn<T> {
  function getUniqKey(item: T) {
    const { market, code } = getMarketAndCode(item);

    return `${market}|${code}`;
  }

  /**
   * 从行情数据字段中获取商品唯一key，行情用的是market_id,不标准
   */
  function getQuoteUniqKey(item: T) {
    const { market, code } = getMarketAndCodeFromPushData(item);

    return `${market}|${code}`;
  }

  const getProxyedData = useCallback((length = 0) => {
    const rawSymbols: Partial<T>[] = Array.from({ length }, () => ({}));
    const cachedMap: Record<string, T> = {};

    const proxedSymbols = new Proxy(rawSymbols, {
      get: (target: any, prop: string) => {
        // 如果prop是数字, 则从缓存中获取
        if (Number.isInteger(Number(prop))) {
          const value = target[prop];

          if (value?.__uniqKey && cachedMap[value.__uniqKey]) {
            return cachedMap[value.__uniqKey];
          }

          // 如果value是undefined, 则返回空对象，否则接口异常导致的前面数据丢失，会导致界面崩溃, 如data[1]为undefined
          return value || {};
        }

        return target[prop];
      },
      set: (target, prop, value) => {
        if (Number.isInteger(Number(prop))) {
          const uniqKey = getUniqKey(value);

          cachedMap[uniqKey] = value;
          target[prop] = {
            __uniqKey: uniqKey,
          };
        } else {
          target[prop] = value;
        }

        return true;
      },
    });

    return {
      symbols: proxedSymbols as T[],
      getCache: (key: string) => cachedMap[key],
      setCache: (key: string, value: any) => {
        cachedMap[key] = value;
      },
    };
  }, []);

  const emptyCacheMap = useMemo(() => getProxyedData(), []);
  const _rerender = useRerender();
  const rerender = () => {
    _rerender();
    onRerender?.();
  };

  const cachedStore = useRef<typeof emptyCacheMap>(emptyCacheMap);

  const [symbolsUpdated, updateSymbols] = useReducer((s) => s + 1, 0);

  const [isLoading, setIsLoading] = useState(true);

  useDeepCompareEffect(() => {
    // 切换查询条件时，重置数据, 滚动到顶部
    console.log('行情表格数据查询参数变化: ', params);
    cachedStore.current = getProxyedData();
    scrollTableToTop?.();
    setIsLoading(true);
    rerender();
    updateSymbols();
  }, [params]);

  const rangeRef = useRef<Range>({
    begin: 0,
    count: 0,
  });

  const _enabled = enabled && rangeRef.current.count > 0;

  const keyPrefix = isArray(queryKeyPrefix) ? queryKeyPrefix : [queryKeyPrefix];
  const { data, isPending } = useQuery({
    queryKey: [...keyPrefix, params, rangeRef.current],
    refetchInterval: enablePolling ? pollingInterval : false,
    enabled: _enabled,
    gcTime: 0,
    networkMode: 'always',
    queryFn: async () => {
      const res = await requestAPI(addRangeToParams(rangeRef.current, params));

      const { data: _data, total } = extractRequiredResData(res);

      return {
        segmentData: _data,
        totalCount: total,
        range: rangeRef.current,
      };
    },
  });

  useEffect(() => {
    if (!isPending) {
      setIsLoading(false);
    }
  }, [isPending]);

  const onVisibleDataChange = useCallback(
    debounce(
      (beginIndex: number, count: number) => {
        if (rangeRef.current.begin === beginIndex && rangeRef.current.count === count) {
          return;
        }
        // TODO: 临时打印，排查问题
        console.log('onVisibleDataChange: ', beginIndex, count);

        rangeRef.current = {
          begin: beginIndex,
          count,
        };

        rerender();
      },
      100,
      {
        leading: true,
        trailing: true,
      },
    ),
    [],
  );

  useEffect(() => {
    // 空数据什么也不干, 只负责更新缓存中的数据
    if (!data) {
      return;
    }

    const cachedSymbolsLength = cachedStore.current.symbols.length;

    const {
      segmentData = [],
      range: { begin, count },
      totalCount,
    } = data;

    if (cachedSymbolsLength !== totalCount) {
      // 重新初始化数据
      cachedStore.current = getProxyedData(totalCount);
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `排序接口响应数据总量与缓存数据长度不一致，重置缓存数据, old: ${cachedSymbolsLength}, new: ${totalCount}`,
        );
      }
    }

    if (segmentData.length > totalCount) {
      console.group(
        '检测到接口数据异常，限定范围(begin: %s, count: %s)数据量大于数据总量, 后端接口有bug，请通知后端修复: ',
        begin,
        count,
      );
      console.error('限定范围数据: ', segmentData, totalCount);
      console.error('数据总量: ', totalCount);
      console.groupEnd();

      return;
    }

    // 更新数据
    segmentData.forEach((item, index) => {
      // 如果需要全量替换，则从0开始，否则从begin开始
      const startIndex = fullReplaceAPIData ? 0 : begin;
      const curIndex = startIndex + index;
      const uniqKey = getUniqKey(item);

      const old = cachedStore.current.getCache(uniqKey);
      cachedStore.current.symbols[curIndex] = {
        ...old,
        ...item,
      };
    });

    updateSymbols();
    rerender();
  }, [data, fullReplaceAPIData]);

  const [requestRangeSymbols, setRequestRangeSymbols] = useState(() => ({
    uniqKey: '',
    symbols: [] as ReturnType<typeof getMarketAndCode>[],
  }));

  useEffect(() => {
    function getUniqSymbolsKey(syms: ReturnType<typeof getMarketAndCode>[]) {
      return syms
        .map((item) => `${item.market}|${item.code}`)
        .sort()
        .join(',');
    }

    if (enableQuotationPush) {
      const newSymbols = cachedStore.current.symbols
        .slice(rangeRef.current.begin, rangeRef.current.begin + rangeRef.current.count)
        .map((item: T) => getMarketAndCode(item as T))
        // 过滤掉market, code为空的数据, 滚动时，接口加载没那么快，过滤掉未获取到market, code的数据, 否则给s8行情传空值会报错：您没有0市场的权限，请确认后重试
        .filter((item) => !isNil(item.market) && !isNil(item.code));

      const oldSymbolsKey = requestRangeSymbols.uniqKey;
      const newSymbolsKey = getUniqSymbolsKey(newSymbols);

      if (!ignoreQuotationSubscribeOrder) {
        setRequestRangeSymbols({
          uniqKey: newSymbolsKey,
          symbols: newSymbols,
        });

        return;
      }

      if (oldSymbolsKey !== newSymbolsKey) {
        // if (process.env.NODE_ENV === 'development') {
        //   console.info('订阅列表数据变化触发重新订阅: ', 'new: ', newSymbols, 'old: ', requestRangeSymbols);
        // }

        setRequestRangeSymbols({
          uniqKey: newSymbolsKey,
          symbols: newSymbols,
        });
      }
      // else if (process.env.NODE_ENV === 'development') {
      //   console.info('订阅列表数据无变化不触发重新订阅: ');
      // }
    } else {
      setRequestRangeSymbols({
        uniqKey: '',
        symbols: [],
      });
    }
  }, [rangeRef.current, symbolsUpdated, enableQuotationPush, ignoreQuotationSubscribeOrder]);

  useQuotationPush(requestRangeSymbols.symbols as any, subscribeFields, pickQuoteFields, (quotes) => {
    if (!enableQuotationPush) return;

    quotes.forEach((item) => {
      const uniqKey = getQuoteUniqKey(item as T);

      const old = cachedStore.current.getCache(uniqKey);

      if (old) {
        cachedStore.current.setCache(uniqKey, {
          ...old,
          // 如果pickQuoteFields有值，则只保留pickQuoteFields中的字段，否则保留所有字段, 节约内存
          ...(enablePickQuoteFields ? pick(item, [...pickQuoteFields]) : (item as any)),
        });
      } else {
        // console.warn('收到缓存中不存在的股票数据', item);
      }
    });

    rerender();
  });

  function getVisibleData() {
    const visibleData = cachedStore.current.symbols
      .slice(rangeRef.current.begin, rangeRef.current.begin + rangeRef.current.count)
      .filter((item) => {
        const { market, code } = getMarketAndCode(item);

        return !isNil(market) && !!code;
      });

    return visibleData;
  }

  function getVisibleSymbols(): Stocks {
    const visibleData = getVisibleData();

    return visibleData.map((item) => {
      const { market, code } = getMarketAndCode(item);

      return { market, code };
    });
  }

  return {
    onVisibleDataChange,
    data: cachedStore.current.symbols,
    isLoading,
    getVisibleData,
    getVisibleSymbols,
  };
}
