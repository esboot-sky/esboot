import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { parseResult } from '@/api/helpers';
import { queryTradePreCheck, type TradePreCheckResponse } from '@/api/uc/pa/query';
import { CacheStore, CacheKey } from '@/constants/cache';
// import { useAppStore } from '@/model/app';
import { isEntryPage } from '@/helpers/url';
import { useTradePreCheckStore } from '@/model/trade-pre-check';

const cacheTradePreCheck = CacheStore.getItem(CacheKey.globalTradePreCheck, null);
export const useTradePreCheck = () => {
  // const setIsLogin = useAppStore((state) => state.setIsLogin);
  // const setToken = useAppStore((state) => state.setToken);
  const { setIsSignedHKID, setIsOpenTrade, setIsW8Finish, setIsLoading } = useTradePreCheckStore(
    useShallow((state) => ({
      setIsSignedHKID: state.setIsSignedHKID,
      setIsOpenTrade: state.setIsOpenTrade,
      setIsW8Finish: state.setIsW8Finish,
      setIsLoading: state.setIsLoading,
    })),
  );

  const _parseResult = (res: TradePreCheckResponse) => {
    setIsSignedHKID(!!res.hkidr);
    setIsOpenTrade(res.identity === 'transaction');
    setIsW8Finish(!!res.isW8Finish);
  };

  useEffect(() => {
    setIsLoading(true);
    if (!isEntryPage() && cacheTradePreCheck) {
      _parseResult(cacheTradePreCheck);
      Promise.resolve().then(() => {
        setIsLoading(false);
      });
      return;
    }

    queryTradePreCheck()
      .then(parseResult)
      .then((res = { hkidr: false, identity: 'visitor', token: '', isW8Finish: false }) => {
        CacheStore.setItem(CacheKey.globalTradePreCheck, res);
        _parseResult(res);
        // setToken(res.token);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
};
