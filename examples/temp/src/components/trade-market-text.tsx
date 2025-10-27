import { getBigMarketId, BIG_MARKET } from '@dz-web/quote-client';
import { memo, useMemo } from 'react';

import { TradeMarketDict } from '@/constants/trade/markets';

export const TradeMarketText = ({ market, tradeMarket }: { market?: number; tradeMarket?: string }) => {
  const bigMarket = getBigMarketId(market);
  const text = useMemo(() => {
    if (bigMarket === BIG_MARKET.HK || tradeMarket === TradeMarketDict.HKEX) return '.HK';
    if (bigMarket === BIG_MARKET.US || tradeMarket === TradeMarketDict.USA) return '.US';
    // if (bigMarket === BIG_MARKET.CN) return '.CN';

    return '';
  }, [bigMarket]);

  return text;
};

export default memo(TradeMarketText);
