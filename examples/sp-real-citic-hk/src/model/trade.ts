import { produce } from 'immer';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import { AccountInfoResponse } from '@/api/trade/user/account';

export interface AppState {
  accountInfo: AccountInfoResponse | null;
  isMarginAccount: boolean;
  setAccountInfo: (data: AccountInfoResponse | null) => void;
  setPositionList: (data: any[]) => void;
  setOrderList: (data: any[]) => void;
  setTodayDealList: (data: any[]) => void;
  setIsLoadingPosition: (isLoading: boolean) => void;
  setIsLoadingOrder: (isLoading: boolean) => void;
  setIsLoadingTodayDeal: (isLoading: boolean) => void;
  positionList: any[];
  isLoadingPosition: boolean;
  orderList: any[];
  isLoadingOrder: boolean;
  todayDealList: any[];
  isLoadingTodayDeal: boolean;
  positionCount: number;
  orderCount: number;
  todayDealCount: number;
  setting: {
    orderToConfirmByDialog: boolean;
    orderToConfirmByPwd: boolean;
    idleAutoLockDuration: string;
    searchMarketPreference: string;
  };
}

const getDefaultData = () => ({
  accountInfo: null,
  isMarginAccount: false,
  positionList: [],
  orderList: [],
  todayDealList: [],
  positionCount: 0,
  orderCount: 0,
  todayDealCount: 0,
  setting: {
    orderToConfirmByDialog: true,
    orderToConfirmByPwd: false,
    idleAutoLockDuration: '15m',
    searchMarketPreference: '',
  },
  isLoadingPosition: true,
  isLoadingOrder: true,
  isLoadingTodayDeal: true,
});

export const useTradeStore = create<AppState>()(
  subscribeWithSelector((set) => ({
    ...getDefaultData(),
    setAccountInfo: (data: AccountInfoResponse | null) => {
      set(
        produce((state) => {
          state.accountInfo = data;
          state.isMarginAccount = data?.clientType === 'M';
        }),
      );
    },
    setPositionList: (data: any[]) => {
      set(
        produce((state) => {
          state.positionList = data;
          state.positionCount = data.length;
        }),
      );
    },
    setOrderList: (data: any[]) => {
      set(
        produce((state) => {
          state.orderList = data;
          state.orderCount = data.length;
        }),
      );
    },
    setTodayDealList: (data: any[]) => {
      set(
        produce((state) => {
          state.todayDealList = data;
          state.todayDealCount = data.length;
        }),
      );
    },
    setIsLoadingPosition: (isLoading: boolean) => {
      set(
        produce((state) => {
          state.isLoadingPosition = isLoading;
        }),
      );
    },
    setIsLoadingOrder: (isLoading: boolean) => {
      set(
        produce((state) => {
          state.isLoadingOrder = isLoading;
        }),
      );
    },
    setIsLoadingTodayDeal: (isLoading: boolean) => {
      set(
        produce((state) => {
          state.isLoadingTodayDeal = isLoading;
        }),
      );
    },
  })),
);
