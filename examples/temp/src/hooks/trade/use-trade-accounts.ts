import { useEffect } from 'react';

import { parseResult } from '@/api/helpers';
import { fetchMyAccounts } from '@/api/trade/user/account';
import { useTradeStore } from '@/model/trade';

export const useTradeAccounts = ({ isActive = true }: { isActive?: boolean }) => {
  const setAccountInfo = useTradeStore((state) => state.setAccountInfo);
  const accountInfo = useTradeStore((state) => state.accountInfo);

  useEffect(() => {
    if (!isActive || accountInfo) return;

    fetchMyAccounts()
      .then(parseResult)
      .then((res) => {
        setAccountInfo(res);
      })
      .catch(() => {
        setAccountInfo(null);
      });
  }, [isActive, accountInfo]);
};
