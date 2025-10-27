/* eslint-disable prettier/prettier */
import { BIG_MARKET, getBigMarketId } from '@dz-web/quote-client';
import { Toast } from 'antd-mobile';
import { produce } from 'immer';
import { isObject, throttle } from 'lodash-es';
import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';

import { CommodityQuoteKey } from '@/api/types';
import { queryGroupList, uploadTouristWatchlistGroup } from '@/api/watchlist/query';
import { IUploadTouristWatchlistGroupParams, IWatchListGroupItem, IWatchListStockItem } from '@/api/watchlist/types';
import { CacheKey } from '@/constants/cache';
import { WatchlistGroupEnum } from '@/constants/watchlist';
import { getStorage, removeStorage, setStorage } from '@/helpers/native/msg';

import { useAppStore } from './app';

let unsubscribeChange: (() => void) | null = null;

type IWatchListCache = {
  isTourist: boolean;
  Groups: IWatchListGroupItem[];
};

type IWatchListState = {
  init: boolean;
  cache: IWatchListCache;
};

type IWatchListCacheStoreWithAction = IWatchListState & {
  batchAddToGroup: (stocks: CommodityQuoteKey[], groupIds: (number | string)[]) => void;
  batchRemoveFromWatchlist: (toRemove: CommodityQuoteKey[], groupId?: number | string) => void;
  removeGroup: (groupId: number | string) => void;
  addGroup: (group: IWatchListGroupItem) => void;
  renameGroup: (groupId: number | string, name: string) => void;
  replaceGroups: (groups: IWatchListGroupItem[]) => void;
  replaceStocksInGroup: (groupId: number | string, stocks: IWatchListStockItem[]) => void;
};

function getDefaultState(isTourist = true): IWatchListState {
  return {
    init: false,
    cache: {
      isTourist,
      Groups: [
        {
          _genId: WatchlistGroupEnum.All.toString(),
          // customerId: 87586,
          name: '全部',
          // orderNo: 2,
          // createTime: '2025-07-05 15:40:52',
          type: 2,
          isDefault: 1,
          editEnabled: 0,
          editDataEnabled: 1,
          isShow: true,
          stocks: [],
          // isSelect: 1,
          id: nanoid(),
        },
        // 游客市场分组应该计算出来
      ],
    },
  };
}

async function getCacheState(isTourist = true): Promise<IWatchListCache> {
  const cacheKey = isTourist ? CacheKey.touristWatchlistStore : CacheKey.watchlistStore;

  try {
    const cache = await getStorage({
      key: cacheKey,
    });
    if (!cache.data) {
      return getDefaultState(isTourist).cache;
    }

    if (!isObject(cache.data)) {
      console.error('storage cache data was invalid', isTourist, cache.data);
      throw new Error('storage cache data was invalid');
    }
    return cache.data as IWatchListCache;
  } catch (error) {
    return getDefaultState(isTourist).cache;
  }
}

function addToGroupIfNeed(group: IWatchListGroupItem, stock: IWatchListStockItem) {
  if (group.stocks.find((s) => s.marketCode === stock.marketCode && s.stockCode === stock.stockCode)) {
    return;
  }

  group.stocks.unshift(stock);
}

const useWatchListStore = create<IWatchListCacheStoreWithAction>()(
  subscribeWithSelector(
    devtools(
      (set) => ({
        ...getDefaultState(),
        batchAddToGroup: (stocks: CommodityQuoteKey[], groupIds: (number | string)[]) => {
          set(
            produce((state: IWatchListState) => {
              const { Groups } = state.cache;
              const allGroup = Groups.find((g) => g.type === WatchlistGroupEnum.All);

              stocks.forEach(({ market, code }) => {
                const stock: IWatchListStockItem = {
                  marketCode: market.toString(),
                  stockCode: code,
                };
                const relatedGroups: IWatchListGroupItem[] = [];
                if (allGroup) {
                  relatedGroups.push(allGroup);
                }
                const bigMarketId = getBigMarketId(market);
                if (bigMarketId === BIG_MARKET.HK) {
                  const t = Groups.find((g) => g.type === WatchlistGroupEnum.HKGroup);
                  if (t) {
                    relatedGroups.push(t);
                  }
                } else if (bigMarketId === BIG_MARKET.US) {
                  const t = Groups.find((g) => g.type === WatchlistGroupEnum.USGroup);
                  if (t) {
                    relatedGroups.push(t);
                  }
                }

                if (groupIds.length > 0) {
                  const targetGroups = Groups.filter((g) => !g.isDefault && groupIds.includes(g.id!));
                  relatedGroups.push(...targetGroups);
                }

                relatedGroups.forEach((group) => {
                  addToGroupIfNeed(group, stock);
                });
              });
            }),
            undefined,
            'batchAddToGroup',
          );
        },
        removeGroup: (groupId: number | string) => {
          set(
            produce((state: IWatchListState) => {
              const isDefaultGroup = state.cache.Groups.find((g) => g.id === groupId)?.isDefault;

              // 默认分组不能删除
              if (isDefaultGroup) {
                return;
              }

              state.cache.Groups = state.cache.Groups.filter((g) => g.id !== groupId);
            }),
            undefined,
            'removeGroup',
          );
        },
        addGroup: (group: IWatchListGroupItem) => {
          set(
            produce((state: IWatchListState) => {
              state.cache.Groups.push(group);
            }),
            undefined,
            'removeGroup',
          );
        },
        renameGroup: (groupId: number | string, name: string) => {
          set(
            produce((state: IWatchListState) => {
              const group = state.cache.Groups.find((g) => g.id === groupId);
              if (group) {
                group.name = name;
              }
            }),
            undefined,
            'renameGroup',
          );
        },
        replaceGroups: (groups: IWatchListGroupItem[]) => {
          set(
            produce((state: IWatchListState) => {
              state.cache.Groups = groups;
            }),
            undefined,
            'replaceGroups',
          );
        },
        replaceStocksInGroup: (groupId: number | string, stocks: IWatchListStockItem[]) => {
          set(
            produce((state: IWatchListState) => {
              const group = state.cache.Groups.find((g) => g.id === groupId);

              if (group) {
                group.stocks = stocks;
              }
            }),
            undefined,
            'replaceStocksInGroup',
          );
        },
        batchRemoveFromWatchlist: (toRemove: CommodityQuoteKey[], groupId?: number | string) => {
          set(
            produce((state: IWatchListState) => {
              let removeFromAllGroup = false;

              if (!groupId) {
                removeFromAllGroup = true;
              } else if (
                state.cache.Groups.find((g) => g.id === groupId)?.type === WatchlistGroupEnum.All
              ) {
                removeFromAllGroup = true;
              }

              if (removeFromAllGroup) {
                const { Groups } = state.cache;
                Groups.forEach((group) => {
                  group.stocks = group.stocks.filter(
                    (s) => !toRemove.some((r) => r.market === Number(s.marketCode) && r.code === s.stockCode),
                  );
                });
              } else {
                const group = state.cache.Groups.find((g) => g.id === groupId);
                if (group) {
                  group.stocks = group.stocks.filter(
                    (s) => !toRemove.some((r) => r.market === Number(s.marketCode) && r.code === s.stockCode),
                  );
                }
              }
            }),
            undefined,
            'batchRemoveFromWatchlist',
          );
        },
      }),
      {
        name: 'watchlist',
      },
    ),
  ),
);

export default useWatchListStore;

export const replaceWatchListCache = (cache: IWatchListCache) => {
  useWatchListStore.setState(
    produce((state) => {
      state.cache = cache;
    }),
    undefined,
    'replaceWatchListGroups',
  );
};

const _updateWatchlistFromServer = async () => {
  const res = await queryGroupList();

  replaceWatchListCache({
    isTourist: false,
    Groups: res.result,
  });
};

export const updateWatchlistFromServer = throttle(
  _updateWatchlistFromServer,
  3000,
  {
    trailing: false,
  },
);

function subscribeChange() {
  if (unsubscribeChange) {
    unsubscribeChange();
    unsubscribeChange = null;
  }

  unsubscribeChange = useWatchListStore.subscribe(
    (state) => state,
    (state) => {
      const { isTourist } = state.cache;
      const cacheKey = isTourist ? CacheKey.touristWatchlistStore : CacheKey.watchlistStore;

      setStorage({
        key: cacheKey,
        value: state.cache,
      });
    },
  );
}

async function resetWatchList(isTourist = true) {
  const cacheState = (await getCacheState(isTourist)) || getDefaultState(isTourist).cache;

  useWatchListStore.setState(
    produce((state) => {
      state.init = true;
      state.cache = cacheState;
    }),
    undefined,
    'initWatchListFromCache',
  );

  // 初始化后再监听变化与更新缓存
  subscribeChange();

  if (!isTourist) {
    try {
      // 先更新自选数据显示UI
      await updateWatchlistFromServer();

      const touristCache = await getCacheState(true);
      if (!touristCache?.Groups?.length) {
      // 没有游客自选数据，直接返回
        return;
      }

      // 如本地有游客自选数据，后台同步到登录账户，并删除本地游客自选数据
      const toUploadTouristCache: IUploadTouristWatchlistGroupParams['groups'] =
      (await getCacheState(true)).Groups.filter(
        (g) => (g.type === WatchlistGroupEnum.All || g.type === WatchlistGroupEnum.Other) && g.stocks?.length > 0,
      ).map((g) => ({
        name: g.name,
        stocks: g.stocks.map((s) => ({
          marketCode: s.marketCode,
          stockCode: s.stockCode,
        })),
        type: g.type,
      }));
      if (!toUploadTouristCache?.length) {
        // 没有游客自选数据，直接返回
        return;
      }

      console.log('开始上传游客自选数据到登录账户', toUploadTouristCache);

      // 上传
      await uploadTouristWatchlistGroup({
        groups: toUploadTouristCache,
      });

      console.log('上传游客自选数据到登录账户成功, 清理游客自选数据');
      // 删除本地游客自选数据
      removeStorage({
        key: CacheKey.touristWatchlistStore,
      });

      console.log('上传游客自选数据到登录账户成功, 更新自选数据');
      // 更新自选数据, 强制更新，不要使用节流的版本
      await _updateWatchlistFromServer();

    } catch (error: any) {
      console.error('upload tourist watchlist error', error);
      Toast.show({
        content: `同步游客自选股错误: ${error?.message || 'unknown error'}`,
      });
    }
  }
}

window.addEventListener('storage', async (event) => {
  // 注册用户自选分组数据更新
  if (event.key === CacheKey.watchlistStore) {
    const cache = await getCacheState(false);

    if (!useWatchListStore.getState().cache.isTourist) {
      useWatchListStore.getState().replaceGroups(cache.Groups);
    }
  }

  // 游客自选分组数据更新
  if (event.key === CacheKey.touristWatchlistStore) {
    const cache = await getCacheState(true);

    if (useWatchListStore.getState().cache.isTourist) {
      useWatchListStore.getState().replaceGroups(cache.Groups);
    }
  }
});

useAppStore.subscribe(
  (state) => ({
    isLogin: state.isLogin,
    init: state.init,
  }),
  (state) => {
    if (!state.init) return;

    if (state.isLogin) {
      console.log('自选已切换到注册用户模式');
      resetWatchList(false);
    } else {
      console.log('自选已切换到游客模式');
      resetWatchList(true);
    }
  },
  {
    fireImmediately: true,
    equalityFn: (a, b) => {
      return shallow(a, b);
    },
  },
);
