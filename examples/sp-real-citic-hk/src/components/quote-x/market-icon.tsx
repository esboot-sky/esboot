import { cn } from '@dz-web/esboot-browser';
import { BIG_MARKET, getBigMarketId } from '@dz-web/quote-client';
import { useMemo } from 'react';

import IconHK from '@/images/quote/market-hk.svg';
import IconUS from '@/images/quote/market-us.svg';

import type { Market } from '@dz-web/quote-client';

interface IMarketIconProps {
  bigMarket?: BIG_MARKET;
  market?: Market;
  className?: string;
}

const MarketIcon = ({ bigMarket, market, className }: IMarketIconProps) => {
  const bigMarketID = useMemo(() => {
    if (bigMarket) return bigMarket;
    if (market) return getBigMarketId(market);
    return null;
  }, [market, bigMarket]);

  const Icon = useMemo(() => {
    switch (bigMarketID) {
      case BIG_MARKET.US:
        return IconUS;
      case BIG_MARKET.HK:
        return IconHK;
      default:
        return () => null;
    }
  }, [bigMarketID]);

  return <Icon className={cn('h-[26px] w-[32px]', className)} />;
};

export default MarketIcon;
