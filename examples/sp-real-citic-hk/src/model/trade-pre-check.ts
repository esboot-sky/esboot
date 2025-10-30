import { produce } from 'immer';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface AppState {
  isLoading: boolean;
  isSignedHKID: boolean;
  isOpenTrade: boolean;
  isW8Finish: boolean;
  isShowHKIDRDialog: boolean;
  isShowW8Dialog: boolean;
  setIsSignedHKID: (isSignedHKID: boolean) => void;
  setIsOpenTrade: (isOpenTrade: boolean) => void;
  setIsW8Finish: (isW8Finish: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsShowHKIDRDialog: (isShowHKIDRDialog: boolean) => void;
  setIsShowW8Dialog: (isShowW8Dialog: boolean) => void;
}

const getDefaultData = () => ({
  isSignedHKID: true,
  isOpenTrade: false,
  isW8Finish: true,
  isLoading: false,
  isShowHKIDRDialog: false,
  isShowW8Dialog: false,
});

export const useTradePreCheckStore = create<AppState>()(
  subscribeWithSelector((set) => ({
    ...getDefaultData(),
    setIsLoading: (isLoading: boolean) => {
      set(
        produce((state) => {
          state.isLoading = isLoading;
        }),
      );
    },
    setIsSignedHKID: (isSignedHKID: boolean) => {
      set(
        produce((state) => {
          state.isSignedHKID = isSignedHKID;
        }),
      );
    },
    setIsOpenTrade: (isOpenTrade: boolean) => {
      set(
        produce((state) => {
          state.isOpenTrade = isOpenTrade;
        }),
      );
    },
    setIsW8Finish: (isW8Finish: boolean) => {
      set(
        produce((state) => {
          state.isW8Finish = isW8Finish;
        }),
      );
    },
    setIsShowHKIDRDialog: (isShowHKIDRDialog: boolean) => {
      set(
        produce((state) => {
          state.isShowHKIDRDialog = isShowHKIDRDialog;
        }),
      );
    },
    setIsShowW8Dialog: (isShowW8Dialog: boolean) => {
      set(
        produce((state) => {
          state.isShowW8Dialog = isShowW8Dialog;
        }),
      );
    },
  })),
);
