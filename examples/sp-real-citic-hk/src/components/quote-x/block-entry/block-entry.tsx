import { clsx } from '@dz-web/esboot-browser';
import { ensure, getSignByComparison, toFixed, toPercent, toPositiveSign } from '@dz-web/o-orange';
import { BIG_MARKET, CommodityQuote, MarketDataPushField } from '@dz-web/quote-client';
import { useSubscribeStockListQuote } from '@dz-web/quote-client-react';
import { useQuery } from '@tanstack/react-query';
import { memo, useMemo } from 'react';

import { fetchBlockRanking } from '@/api/factor/query';
import NavBlock, { NavBlockProps } from '@/components/nav-block/nav-block';
import { QueryKeyBlockEntry } from '@/constants/query-keys';
import { openSymbolInfoPage } from '@/helpers/native/url';
import staticConfig from '@/helpers/static-config';
import { useI18nStockName } from '@/hooks/use-i18n-field';

export interface BlockEntryProps extends NavBlockProps {
  blockIds: number[];
  bigMarket: BIG_MARKET;
  active: boolean;
  deep: number;
}

function BlockEntry({ blockIds, bigMarket, active = true, deep, ...rest }: BlockEntryProps) {
  const params = useMemo(() => {
    return {
      begin: 0,
      count: 3,
      deep,
      block_id: blockIds,
      fields: ['领涨股代码', '领涨股小市场'],
      sort_field: [
        {
          field: '涨幅',
          desc: true,
        },
      ],
    };
  }, [blockIds]);

  // 防止空数据时渲染死循环
  const emptyData = useMemo(() => [], []);

  const { data = emptyData } = useQuery({
    enabled: active,
    queryKey: [...QueryKeyBlockEntry, 'industry', params],
    refetchInterval: staticConfig.factorPollingInterval,
    queryFn: async () => {
      const res = await fetchBlockRanking(
        {
          bigMarket,
        },
        params,
      );

      return res.body.symbols;
    },
  });

  const nameKey = useI18nStockName();

  const blockSubFields = useMemo(() => [MarketDataPushField.price_rise_rate, nameKey], []);
  const blockSymbols = useMemo(() => data.map(({ market, code }) => [market, code] as [number, string]), [data]);
  // 防止引用改变，不停触发行情取消、重新订阅
  const blockSymbolsUniqKey = useMemo(() => data.map(({ market, code }) => `${market}|${code}`).join(','), [data]);

  const { data: blockQuotes = [] } = useSubscribeStockListQuote<CommodityQuote>(
    { symbols: blockSymbols, subFields: blockSubFields, fields: blockSubFields },
    [blockSymbolsUniqKey, blockSubFields],
    {
      enabled: active,
    },
  );

  const leadingStocks = useMemo(
    () => data.map((d) => [d.领涨股小市场, d.领涨股代码] as [number, string]).filter((d) => !!d[1]),
    [data],
  );

  const leadingStocksUniqKey = useMemo(() => leadingStocks.map((d) => `${d[0]}|${d[1]}`).join(','), [leadingStocks]);
  const leadingStocksSubFields = useMemo(
    () => [MarketDataPushField.price_rise_rate, MarketDataPushField.price_rise],
    [],
  );
  const leadingStocksFields = useMemo(
    () => leadingStocksSubFields.concat(['dec', nameKey]),
    [leadingStocksSubFields, nameKey],
  );

  const { data: leadingStocksQuotes = [] } = useSubscribeStockListQuote<CommodityQuote>(
    { symbols: leadingStocks, subFields: leadingStocksSubFields, fields: leadingStocksFields },
    [leadingStocksUniqKey, leadingStocksSubFields, leadingStocksFields],
    {
      enabled: active && !!leadingStocks.length,
    },
  );

  return (
    <NavBlock {...rest}>
      <div
        className="flex flex-wrap items-center justify-between overflow-hidden text-[var(--main-text-color)]
          [&_*]:overflow-hidden [&_*]:text-ellipsis [&_*]:whitespace-nowrap"
      >
        {data.map((item, i) => {
          const blockPriceRiseRate = blockQuotes[i]?.price_rise_rate;
          const leadingStockPriceRiseRate = leadingStocksQuotes[i]?.price_rise_rate;
          const leadingStockPriceRise = leadingStocksQuotes[i]?.price_rise;
          const blockName = (blockQuotes[i] as any)?.[nameKey];

          return (
            <div
              key={`${item.exchange_id}|${item.code}`}
              className="flex h-[188px] w-[211px] flex-col justify-between rounded-[16px] bg-white p-[20px]"
            >
              <div
                onClick={() => {
                  openSymbolInfoPage(item.market, item.code);
                }}
              >
                <div className="text-[24px] font-bold leading-[33px]">{blockName}</div>
                <div
                  className={clsx(
                    'mt-[4px] text-[28px] font-[600] leading-[28px] text-[var(--stock-default-color)]',
                    getSignByComparison(blockPriceRiseRate),
                  )}
                >
                  {toPositiveSign(
                    toPercent(blockPriceRiseRate, {
                      multiply: 100,
                    }),
                  )}
                </div>
              </div>
              <div
                className="text-[22px] leading-[30px]"
                onClick={() => {
                  openSymbolInfoPage(item['领涨股小市场'], item['领涨股代码']);
                }}
              >
                <div>{ensure(leadingStocksQuotes[i]?.[nameKey])}</div>
                <div className={clsx('mt-[4px] flex items-center', getSignByComparison(leadingStockPriceRise))}>
                  <div className="mr-[12px]">
                    {toFixed(leadingStockPriceRise, {
                      precision: leadingStocksQuotes?.[i]?.dec || 2,
                    })}
                  </div>
                  <div>
                    {toPositiveSign(
                      toPercent(leadingStockPriceRiseRate, {
                        multiply: 100,
                      }),
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </NavBlock>
  );
}
export default memo(BlockEntry);
