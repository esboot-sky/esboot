import { queryTradeTime, BIG_MARKET, US_INTRADAY_TYPE, type CommodityQuote } from '@dz-web/quote-client';
import { useWSClientEffect, useSubscribeSingleStockQuote } from '@dz-web/quote-client-react';
import { useMemo } from 'react';

import { useAppStore, type TradeTickOfMarket } from '@/model/app';

// FIXME: 行情不支持通过市场来获取交易时间段，只能写死相对靠谱的股票
const marketMap: Record<BIG_MARKET, { market: number; code: string }> = {
  [BIG_MARKET.HK]: {
    market: 2005,
    code: 'HSI',
  },
  [BIG_MARKET.US]: {
    market: 47000,
    code: 'AAPL',
  },
  [BIG_MARKET.CN]: {
    market: 1001,
    code: 'CN',
  },
};

export const useMarketTradeTicks = (
  bigMarket: BIG_MARKET = BIG_MARKET.HK,
  USIntradayType: US_INTRADAY_TYPE = US_INTRADAY_TYPE.IN,
) => {
  const setTradeTickOfMarket = useAppStore((state) => state.setTradeTickOfMarket);
  const { isUSSymbol, market, code } = useMemo(() => {
    return {
      isUSSymbol: bigMarket === BIG_MARKET.US,
      market: marketMap[bigMarket].market,
      code: marketMap[bigMarket].code,
    };
  }, [bigMarket]);

  const { cacheKey, tradeDayField } = useMemo<{ cacheKey: string; tradeDayField: string }>(() => {
    if (!isUSSymbol) {
      return {
        cacheKey: bigMarket.toString(),
        tradeDayField: 'trade_day',
      };
    }

    let _tradeDayField = 'prev_trade_day';

    switch (USIntradayType) {
      case US_INTRADAY_TYPE.PREV:
        _tradeDayField = 'prev_trade_day';
        break;
      case US_INTRADAY_TYPE.POST:
        _tradeDayField = 'post_trade_day';
        break;
      case US_INTRADAY_TYPE.IN:
        _tradeDayField = 'trade_day';
        break;
      default:
        break;
    }

    return {
      cacheKey: `${bigMarket}-${USIntradayType}`,
      tradeDayField: _tradeDayField,
    };
  }, [bigMarket, isUSSymbol, USIntradayType]);

  const tradeTickOfMarket = useAppStore((state) => state.tradeTickOfMarket[cacheKey]) as TradeTickOfMarket;

  const { data: quoteInfo }: { data: CommodityQuote } = useSubscribeSingleStockQuote({
    market,
    code,
    useDefaultFields: false,
    fields: ['trade_day', 'prev_trade_day', 'post_trade_day'],
    subFields: ['trade_day', 'prev_trade_day', 'post_trade_day'],
  });

  useWSClientEffect(
    (client) => {
      const _tradeDay = quoteInfo[tradeDayField];
      const { data, isLoading, tradeDay } = tradeTickOfMarket;
      if (tradeDay === _tradeDay && (data.length || isLoading)) return;

      queryTradeTime(client, {
        by_config: {
          market_id: market,
        },
        market_id: market,
        tickType: 'yyyy-MM-dd HH:mm:ss',
        isUSSymbol,
        USIntradayType,
      }).then((res) => {
        if (res.length) {
          setTradeTickOfMarket(cacheKey, { isLoading: false, data: res, tradeDay: _tradeDay });
        }
      });
    },
    [cacheKey, tradeTickOfMarket, quoteInfo[tradeDayField]],
  );

  return tradeTickOfMarket || { isLoading: false, data: [] };
};
