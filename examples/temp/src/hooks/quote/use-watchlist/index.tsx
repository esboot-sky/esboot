import { BIG_MARKET, getBigMarketId } from '@dz-web/quote-client';
import { Toast } from 'antd-mobile';
import { arrayMoveImmutable } from 'array-move';
import { nanoid } from 'nanoid';
import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { CommodityQuoteKey } from '@/api/types';
import {
  addStocksToWatchlistGroups,
  createWatchlistGroup,
  genGroupId,
  removeFromWatchlistGroups,
  removeWatchlistGroup,
  renameWatchlistGroup,
  sortGroupOrder,
  sortStocksInGroup,
} from '@/api/watchlist/query';
import { IWatchListGroupItem } from '@/api/watchlist/types';
import { WatchlistGroupEnum } from '@/constants/watchlist';
import useWatchListStore from '@/model/watchlist';

import { StockWithIsInWatchlist } from './types';

export default function useWatchlist() {
  const { formatMessage } = useIntl();
  const groups = useWatchListStore((state) => state.cache.Groups);
  const isTourist = useWatchListStore((state) => state.cache.isTourist);

  const watchListGroups = useMemo(() => {
    // 非游客直接返回
    if (!isTourist) {
      return groups;
    }

    // 游客市场分组应该计算出来
    const allGroup = groups.find((group) => group.type === WatchlistGroupEnum.All)!;
    const others = groups.filter((group) => !group.isDefault);

    const hkGroup: IWatchListGroupItem = {
      _genId: WatchlistGroupEnum.HKGroup.toString(),
      name: '港股',
      type: 10,
      isDefault: 1,
      editEnabled: 0,
      editDataEnabled: 0,
      isShow: true,
      stocks: allGroup?.stocks.filter((stock) => getBigMarketId(Number(stock.marketCode)) === BIG_MARKET.HK) || [],
    };

    const usGroup: IWatchListGroupItem = {
      _genId: WatchlistGroupEnum.USGroup.toString(),
      name: '美股',
      type: 12,
      isDefault: 1,
      editEnabled: 0,
      editDataEnabled: 0,
      isShow: true,
      stocks: allGroup?.stocks.filter((stock) => getBigMarketId(Number(stock.marketCode)) === BIG_MARKET.US) || [],
    };

    return [allGroup, hkGroup, usGroup, ...others];
  }, [groups, isTourist]);

  const noEditableGroups = useMemo(() => {
    return watchListGroups.filter((g) => !g.editEnabled);
  }, [watchListGroups]);
  const editableGroups = useMemo(() => {
    return watchListGroups.filter((g) => g.editEnabled);
  }, [watchListGroups]);

  /**
   * 添加多个股票到多个自选分组
   * @param stocks 股票列表
   * @param groupIds 分组id, 不填则添加到全部分组, 可以数组形式填多个id, 同时添加到多个分组
   * @param callApiInBackground true，先添加到本地store，再调用接口，红心状态可以快速切换。false, 先调用接口，再更新store，能保证接口调用成功才添加到本地store，适用于弹窗添加
   * @returns 返回promise，如果是登录账户，promise关联添加股票到自选分组的api请求, 如果是游客，promise直接resolve
   */
  async function batchAddToWatchlistGroups(
    stocks: CommodityQuoteKey[],
    groupIds: (number | string)[],
    callApiInBackground = true,
  ) {
    let actions = [
      async () => {
        useWatchListStore.getState().batchAddToGroup(stocks, groupIds);
      },
      async () => {
        if (!useWatchListStore.getState().cache.isTourist) {
          addStocksToWatchlistGroups({
            groupIds: groupIds as number[],
            stocks: stocks.map((s) => ({ marketCode: s.market.toString(), stockCode: s.code })),
          });
        }
      },
    ];

    if (!callApiInBackground) {
      actions = actions.reverse();
    }

    for (const action of actions) {
      // eslint-disable-next-line no-await-in-loop
      await action();
    }
  }

  /**
   * 添加单个股票到自选分组
   * @param market 小市场
   * @param code 股票代码
   * @param groupId 分组id, 不填则添加到全部分组
   * @returns 返回promise，如果是登录账户，promise关联添加股票到自选分组的api请求, 如果是游客，promise直接resolve, 如果分组id不存在或股票已在自选分组中，promise直接reject
   */
  function addToWatchlist(market: number, code: string, groupId?: number | string) {
    const allGroup = groups.find((g) => g.type === WatchlistGroupEnum.All);
    groupId = groupId || allGroup?.id;

    if (!groupId || !groups.find((g) => g.id === groupId)) {
      throw new Error('分组不存在');
    }

    if (allGroup?.stocks.some((s) => Number(s.marketCode) === market && s.stockCode === code)) {
      return {
        promise: Promise.resolve(),
        groudId: groupId,
      };
    }

    const targetGroudId = [groupId];

    const promise = batchAddToWatchlistGroups([{ market, code }], targetGroudId);

    return {
      promise,
      groupId,
    };
  }

  // 默认分组没有真实的id，用_genId代替，这里提供一个方法，根据_genId获取真实的id, 如果genId是默认分组，则返回undefined
  // function getGroupIdByGenId(genId: string) {
  //   if (!genId) return undefined;

  //   return watchListGroups.find((g) => g._genId === genId)?.id;
  // }

  /**
   * 删除自选, 如果指定了groupId，并且不是全部分组，则从指定分组中移除这个股票，否则从所有分组中移除这个股票
   * @param toRemove 要删除的股票列表
   * @param groupId 分组id, 不填则从全部分组中移除这个股票
   * @returns 返回promise, 如果是登录账户，promise关联移除股票到自选分组的api请求, 如果是游客，promise直接resolve
   */
  async function batchRemoveFromWatchlist(
    toRemove: CommodityQuoteKey[],
    groupId?: number | string,
    callApiInBackground = true,
    showErrorToast = true,
  ) {
    let actions = [
      async () => {
        useWatchListStore.getState().batchRemoveFromWatchlist(toRemove, groupId);
      },
      async () => {
        if (!useWatchListStore.getState().cache.isTourist) {
          await removeFromWatchlistGroups({
            groupId: groupId ? (groupId as number) : undefined,
            stocks: toRemove.map((r) => ({ market: r.market.toString(), code: r.code })),
          });
        }
      },
    ];
    if (!callApiInBackground) {
      actions = actions.reverse();
    }

    for (const action of actions) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await action();
      } catch (err: any) {
        if (showErrorToast) {
          Toast.show({
            content: err?.message || '移除自选错误',
          });
        }

        throw err;
      }
    }
  }
  /**
   * 删除自选, 如果指定了groupId，并且不是全部分组，则从指定分组中移除这个股票，否则从所有分组中移除这个股票
   * @param market 小市场
   * @param code 股票代码
   * @param groupId 分组id, 不填则从全部分组中移除这个股票
   * @returns 返回promise, 如果是登录账户，promise关联移除股票到自选分组的api请求, 如果是游客，promise直接resolve
   */
  async function removeFromWatchlist(market: number, code: string, groupId?: number | string) {
    batchRemoveFromWatchlist([{ market, code }], groupId);
  }

  /**
   * 删除自选分组
   * @param groupId 分组id
   * @returns 返回promise, 如果是登录账户，promise关联删除自选分组的api请求, 如果是游客，promise直接resolve
   */
  async function removeGroup(groupId: number | string) {
    useWatchListStore.getState().removeGroup(groupId);

    if (!useWatchListStore.getState().cache.isTourist) {
      try {
        await removeWatchlistGroup(groupId as number);
      } catch (error: any) {
        Toast.show({
          content: error?.message || '删除分组错误',
        });
      }
    }
  }

  async function createGroup(name: string) {
    if (watchListGroups.some((g) => g.name === name)) {
      const msg = formatMessage({ id: 'watchlist.name_conflict' });
      Toast.show({
        content: msg,
      });
      throw new Error(msg);
    }

    let newGroupData: IWatchListGroupItem;

    try {
      if (useWatchListStore.getState().cache.isTourist) {
        const id = nanoid();
        newGroupData = {
          id,
          name,
          type: WatchlistGroupEnum.Other,
          isDefault: 0,
          editEnabled: 1,
          editDataEnabled: 1,
          isShow: true,
          stocks: [],
        };

        newGroupData._genId = genGroupId(newGroupData);
      } else {
        const res = await createWatchlistGroup({ name });
        newGroupData = res.result;
      }
      // 本地更新
      useWatchListStore.getState().addGroup(newGroupData);

      Toast.show({
        content: formatMessage({ id: 'watchlist.create_success' }),
      });
    } catch (error: any) {
      Toast.show({
        content: error?.message || '创建分组错误',
      });
    }
  }

  async function renameGroup(groupId: number | string, name: string) {
    if (watchListGroups.some((g) => g.name === name)) {
      const msg = formatMessage({ id: 'watchlist.name_conflict' });
      Toast.show({
        content: msg,
      });
      throw new Error(msg);
    }

    try {
      if (!useWatchListStore.getState().cache.isTourist) {
        await renameWatchlistGroup(groupId as number, name);
      }
      // 本地更新
      useWatchListStore.getState().renameGroup(groupId, name);

      Toast.show({
        content: formatMessage({ id: 'watchlist.modify_success' }),
      });
    } catch (error: any) {
      Toast.show({
        content: error?.message || '修改分组名称错误',
      });
    }
  }

  async function moveEditableGroup(oldIndex: number, newIndex: number) {
    if (oldIndex === newIndex) return;

    const newEditableGroups = arrayMoveImmutable(editableGroups, oldIndex, newIndex);
    let newGroups = [...noEditableGroups, ...newEditableGroups];
    const allGroupIndex = newGroups.findIndex((g) => g.type === WatchlistGroupEnum.All);

    // 如果全部分组不在第一位，则移动到第一位
    // 不把全部分组排在第一位，接口返回时，全部分组会排到市场分组后面, 接口有bug
    if (allGroupIndex > 0) {
      newGroups = arrayMoveImmutable(newGroups, allGroupIndex, 0);
    }

    useWatchListStore.getState().replaceGroups(newGroups);
    if (!useWatchListStore.getState().cache.isTourist) {
      const groupIdsForSortApi = newGroups
        .filter((g) => !g.isDefault || g.type === WatchlistGroupEnum.All)
        .map((g) => g.id)
        .join(',');

      try {
        await sortGroupOrder(groupIdsForSortApi);
      } catch (error: any) {
        Toast.show({
          content: error?.message || '排序分组错误',
        });
      }
    }
  }

  const moveStockInGroup = useCallback(
    async (groupId: number | string, oldIndex: number, newIndex: number) => {
      const group = watchListGroups.find((g) => g.id === groupId);

      if (!group) return;

      const newStocks = arrayMoveImmutable(group.stocks, oldIndex, newIndex);

      useWatchListStore.getState().replaceStocksInGroup(groupId, newStocks);

      if (!useWatchListStore.getState().cache.isTourist) {
        try {
          await sortStocksInGroup(
            groupId as number,
            newStocks.map((s) => ({ market: s.marketCode, code: s.stockCode })),
          );
        } catch (error: any) {
          Toast.show({
            content: error?.message || '排序股票错误',
          });
        }
      }
    },
    [watchListGroups],
  );

  return {
    watchListGroups,
    addToWatchlist,
    removeFromWatchlist,
    batchRemoveFromWatchlist,
    // getGroupIdByGenId,
    createGroup,
    removeGroup,
    renameGroup,
    batchAddToWatchlistGroups,
    noEditableGroups,
    editableGroups,
    moveEditableGroup,
    moveStockInGroup,
  };
}

export function useWatchlistAllGroup() {
  const watchListGroups = useWatchListStore((state) => state.cache.Groups);
  const allGroup = useMemo(() => {
    return watchListGroups.find((group) => group.type === WatchlistGroupEnum.All);
  }, [watchListGroups]);

  return allGroup;
}

/**
 * 批量填充股票是否在自选分组中的字段: isInWatchlist
 */
export function useFillIsInWatchlist<T extends StockWithIsInWatchlist>(stocks: T[]): T[] {
  const watchListGroups = useWatchListStore((state) => state.cache.Groups);

  const filled = useMemo(() => {
    const allStocks = watchListGroups.find((group) => group.type === WatchlistGroupEnum.All)?.stocks;
    return allStocks
      ? stocks.map((stock) => {
          const isInWatchlist = allStocks.some(
            (s) => Number(s.marketCode) === stock.market && s.stockCode === stock.code,
          );

          return {
            ...stock,
            isInWatchlist,
          };
        })
      : stocks;
  }, [stocks, watchListGroups]);

  return filled;
}

/**
 * 判断股票是否在自选分组中
 * @param market 小市场
 * @param code 股票代码
 * @returns 是否在自选分组中
 */
export function useIsInWatchlist(market: number, code: string): boolean {
  const watchListGroups = useWatchListStore((state) => state.cache.Groups);

  const exist = useMemo(() => {
    return !!watchListGroups
      .find((group) => group.type === WatchlistGroupEnum.All)
      ?.stocks.some((s) => Number(s.marketCode) === market && s.stockCode === code);
  }, [watchListGroups]);

  return exist;
}
