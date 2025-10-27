import { cn } from '@dz-web/esboot-browser';

import IconDelayQuote from '@/images/quote/icon-delay-quote.svg';
import { useQuotePermissionsStore } from '@/model/quote-permissions';

import type { Market } from '@dz-web/quote-client';

interface IMarketIconProps {
  market: Market;
  className?: string;
}

const MarketIcon = ({ market, className }: IMarketIconProps) => {
  const marketPermissions = useQuotePermissionsStore((state) => state.marketPermissions);
  const isLive = marketPermissions[market]?.isLive;

  return isLive ? null : <IconDelayQuote className={cn('h-[26px] w-[26px]', className)} />;
};

export default MarketIcon;
