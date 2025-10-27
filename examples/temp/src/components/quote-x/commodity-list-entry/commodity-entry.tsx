import { clsx } from '@dz-web/esboot-browser';
import { ensure, getSignByComparison, toFixed, toPercent, toPositiveSign } from '@dz-web/o-orange';
import { BIG_MARKET, CommodityQuote, MarketDataPushField } from '@dz-web/quote-client';
import { useSubscribeStockListQuote } from '@dz-web/quote-client-react';
import { useQuery } from '@tanstack/react-query';
import { memo, useMemo } from 'react';

import { fetchStockRanking } from '@/api/factor/query';
import NavBlock, { NavBlockProps } from '@/components/nav-block/nav-block';
import { QueryKeyBlockEntry } from '@/constants/query-keys';
import { openSymbolInfoPage } from '@/helpers/native/url';
import staticConfig from '@/helpers/static-config';
import { useI18nFactorStockName } from '@/hooks/use-i18n-field';

export interface CommodityListEntryProps extends NavBlockProps {
  blocks: number[];
  bigMarket: BIG_MARKET;
  active: boolean;
}

function CommodityListEntry({ blocks, bigMarket, active = true, ...rest }: CommodityListEntryProps) {
  const params = useMemo(() => {
    return {
      begin: 0,
      count: 3,
      blocks,
      fields: ['简体名称', '繁体名称'],
      sort_field: [
        {
          field: '涨幅',
          desc: true,
        },
      ],
    };
  }, [blocks]);

  const nameKey = useI18nFactorStockName();

  // 防止空数据时渲染死循环
  const emptyData = useMemo(() => [], []);

  const { data = emptyData } = useQuery({
    enabled: active,
    queryKey: [...QueryKeyBlockEntry, 'industry', params],
    refetchInterval: staticConfig.factorPollingInterval,
    queryFn: async () => {
      const res = await fetchStockRanking(
        {
          bigMarket,
        },
        params,
      );

      return res.body.symbols;
    },
  });

  const subFields = useMemo(
    () => [MarketDataPushField.price_rise_rate, MarketDataPushField.now, MarketDataPushField.price_rise],
    [],
  );
  const symbols = useMemo(() => data.map(({ market, code }) => [market, code] as [number, string]), [data]);
  // 防止引用改变，不停触发行情取消、重新订阅
  const symbolsUniqKey = useMemo(() => data.map(({ market, code }) => `${market}|${code}`).join(','), [data]);

  const { data: quotes = [] } = useSubscribeStockListQuote<CommodityQuote>(
    { symbols, subFields, fields: subFields },
    [symbolsUniqKey, subFields],
    {
      enabled: active,
    },
  );

  return (
    <NavBlock {...rest}>
      <div
        className="flex flex-wrap items-center justify-between overflow-hidden text-[var(--main-text-color)]
          [&_*]:overflow-hidden [&_*]:text-ellipsis [&_*]:whitespace-nowrap"
      >
        {data.map((item, i) => {
          const priceRiseRate = quotes[i]?.price_rise_rate;
          const now = quotes[i]?.now;
          const dec = quotes?.[i]?.dec || 2;
          const priceRise = quotes[i]?.price_rise;

          return (
            <div
              key={`${item.exchange_id}|${item.code}`}
              className="flex h-[154px] w-[211px] flex-col justify-between rounded-[16px] bg-white p-[20px]"
            >
              <div
                onClick={() => {
                  openSymbolInfoPage(item.market, item.code);
                }}
              >
                <div className="text-[24px] font-bold leading-[33px]">{ensure(item[nameKey])}</div>
                <div
                  className={clsx(
                    'mt-[4px] text-[28px] font-[600] leading-[28px] text-[var(--stock-default-color)]',
                    getSignByComparison(now),
                  )}
                >
                  {toFixed(now, {
                    precision: dec,
                  })}
                </div>
              </div>
              <div className="text-[22px] leading-[30px]">
                <div className={clsx('mt-[4px] flex items-center', getSignByComparison(priceRise))}>
                  <div className="mr-[12px]">
                    {toFixed(priceRise, {
                      precision: dec,
                    })}
                  </div>
                  <div>
                    {toPositiveSign(
                      toPercent(priceRiseRate, {
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
export default memo(CommodityListEntry);
