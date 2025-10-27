import { globalBlocker } from '@dz-web/axios-middlewares';
import { orange, type Lang } from '@dz-web/o-orange';
import { useQueryClient } from '@tanstack/react-query';
import { Toast } from 'antd-mobile';
import { useLayoutEffect, useEffect } from 'react';

import { CacheKey } from '@/constants/cache/cache-key';
import { getUserConfig, getUserInfo, getStorage } from '@/helpers/native/msg';
import { updateUserConfig, updateUserInfo } from '@/helpers/native/register';
import { useAppStore } from '@/model/app';
import { getSearchParams } from '@/utils/url';

import { defaultLan, type QuotesColorType } from '../constants/config';

export interface IUserInfo {
  userId: number;
  mobile: string;
  customerName: string;
  customerNickname: string;
  orgCode: string;
  tradeToken: string;
  sessionCode: string;
  isLogin: boolean;
  bindTrade: boolean;
}

export const themeList = {
  light: 'white',
  dark: 'black',
  black: 'black',
  white: 'white',
};

const lanWhiteList = ['zh-CN', 'zh-TW'];

export default function useInitNative() {
  const queryClient = useQueryClient();
  const { setTheme, setQuotesColor, setIsLogin, setLanguage, setToken } = useAppStore();

  Toast.config({ duration: 3500 });

  function updateUserConfigProxy(res: any): void {
    console.log(res, 'updateUserConfigProxy res');
    let language;
    const { theme, language: nativeLan } = res;
    const convertTheme = themeList[theme as keyof typeof themeList] || 'white';

    if (lanWhiteList.findIndex((k) => k === nativeLan) !== -1) {
      language = nativeLan;
    } else {
      language = defaultLan;
    }

    orange.lang = language as Lang;
    setTheme(convertTheme);
    setLanguage(language);

    document.documentElement.classList.add(convertTheme);
    Object.values(themeList).forEach((themeItem: string) => {
      if (themeItem !== convertTheme) document.documentElement.classList.remove(themeItem);
    });
  }

  function updateUserInfoProxy(res: any, isInit?: boolean): void {
    const result = Object.prototype.hasOwnProperty.call(res, 'result') ? res.result : res;

    setToken(result?.sessionCode);
    setIsLogin(result?.isLogin);

    if (isInit) {
      globalBlocker.done();
    }
  }

  function initQuotesColor() {
    getStorage({ key: CacheKey.quotesUpDownColor }).then((res) => {
      const quotesColor = res.data;

      setQuotesColor(quotesColor as QuotesColorType);
    });
  }

  function init() {
    getUserConfig().then((res) => updateUserConfigProxy(res));

    // 获取用户信息
    getUserInfo()
      .then((res) => {
        updateUserInfoProxy(res, true);
      })
      .catch((err) => console.log('err:', err));
    initQuotesColor();
  }

  useLayoutEffect(() => {
    const { theme } = getSearchParams();
    if (theme) {
      document.documentElement.className = themeList[theme as keyof typeof themeList] || 'white';
    }
  }, []);

  useEffect(() => {
    init();

    updateUserConfig((res: any) => {
      updateUserConfigProxy(res);
    });

    updateUserInfo((res: any) => {
      queryClient.clear();
      updateUserInfoProxy(res);
    });
  }, []);
}
