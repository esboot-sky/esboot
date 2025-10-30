import { cn } from '@dz-web/esboot-browser';
import { ensure, getSignByComparison, Lang, toPercent, toPositiveSign, toUnit } from '@dz-web/o-orange';
import { MarketDataPushField } from '@dz-web/quote-client';
import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { fetchBlockRanking } from '@/api/factor/query';
import { lanEnum } from '@/constants/config';
import { useI18nStockName } from '@/hooks/use-i18n-field';
import { useRem2px } from '@/hooks/use-rem2px';
import { SortState } from '@/hooks/use-sort-state';

import { RankingTableProps } from '../../ranking-table/ranking-table';

interface RenderMethodParams {
  // eslint识别错误
  // eslint-disable-next-line react/no-unused-prop-types
  value: any;
  // eslint-disable-next-line react/no-unused-prop-types
  rowData: any;
}

export interface UseCommonColumnsOptions {
  blockId: number[];
  deep: number;
}

function useCommonRankingConfig({ blockId, deep }: UseCommonColumnsOptions) {
  const { locale } = useIntl();

  const { ratio } = useRem2px();
  const wrapperPadding: [number, number] = useMemo(() => {
    const p = ratio * 30;
    return [p, p];
  }, [ratio]);

  const nameKey = useI18nStockName();

  const columns = useMemo(() => {
    const basicColumnWidth = Math.floor(window.innerWidth * 0.23);
    const firstColumnWidth = window.innerWidth - basicColumnWidth * 3 - wrapperPadding[0] - wrapperPadding[1];
    const lang = locale === lanEnum.ZH_TW ? Lang.ZH_TW : Lang.ZH_CN;

    return [
      {
        label: <FormattedMessage id="quote_terms.block_name" />,
        dataKey: nameKey,
        width: `${firstColumnWidth}px`,
        fixed: true,
        render: ({ value }: RenderMethodParams) => (
          <div
            className="overflow-hidden text-ellipsis whitespace-nowrap text-[30px] font-bold leading-[42px]
              text-[var(--main-text-color)]"
          >
            {ensure(value)}
          </div>
        ),
      },
      {
        label: <FormattedMessage id="quote_fields.change_rate" />,
        dataKey: MarketDataPushField.price_rise_rate,
        sortable: true,
        sortKey: '涨幅',
        width: basicColumnWidth,
        align: 'right',
        render: ({ value, rowData }: RenderMethodParams) => {
          return (
            <span
              className={cn(
                'text-[30px] text-[var(--stock-default-color)]',
                getSignByComparison(rowData.price_rise_rate),
              )}
            >
              {toPositiveSign(
                toPercent(value, {
                  multiply: 100,
                }),
              )}
            </span>
          );
        },
      },
      {
        label: <FormattedMessage id="quote_terms.riseAndDecline" />,
        dataKey: '上涨家数',
        sortable: true,
        sortKey: '上涨家数',
        width: basicColumnWidth,
        align: 'right',
        render: ({ rowData }: RenderMethodParams) => {
          const delta = (rowData['上涨家数'] || 0) - (rowData['下跌家数'] || 0);

          return (
            <span className={cn('text-[30px] font-[500]', getSignByComparison(delta))}>
              {ensure(rowData['上涨家数'])}/{ensure(rowData['下跌家数'])}
            </span>
          );
        },
      },

      {
        label: (
          <div className="pl-[30px]">
            <FormattedMessage id="quote_terms.leading_stock" />
          </div>
        ),
        dataKey: '领涨股名称',
        sortable: true,
        sortKey: '领涨股名称',
        width: 180 * ratio,
        align: 'left',
        render: ({ value }: RenderMethodParams) => {
          return (
            <div
              className="overflow-hidden text-ellipsis whitespace-nowrap pl-[30px] text-[30px]
                text-[var(--main-text-color)]"
            >
              {ensure(value)}
            </div>
          );
        },
      },
      {
        label: <FormattedMessage id="quote_fields.change_rate" />,
        dataKey: '领涨股涨幅',
        sortable: true,
        sortKey: '领涨股涨幅',
        width: basicColumnWidth,
        align: 'right',
        render: ({ value, rowData }: RenderMethodParams) => {
          return (
            <span
              className={cn(
                'text-[30px] text-[var(--stock-default-color)]',
                getSignByComparison(rowData.price_rise_rate),
              )}
            >
              {toPositiveSign(
                toPercent(value, {
                  multiply: 100,
                }),
              )}
            </span>
          );
        },
      },
      {
        label: <FormattedMessage id="quote_terms.fund_flow" />,
        dataKey: '资金流向',
        sortable: true,
        sortKey: '资金流向',
        width: basicColumnWidth,
        align: 'right',
        render: ({ value }: RenderMethodParams) => {
          return <span className="text-[30px]">{toUnit(value, { lanType: lang })}</span>;
        },
      },
      {
        label: <FormattedMessage id="quote_terms.week_rise" />,
        dataKey: '本周涨幅',
        sortable: true,
        sortKey: '本周涨幅',
        width: basicColumnWidth,
        align: 'right',
        render: ({ value }: RenderMethodParams) => {
          return (
            <span className={cn('text-[30px] text-[var(--stock-default-color)]', getSignByComparison(value))}>
              {toPercent(value, {
                multiply: 100,
              })}
            </span>
          );
        },
      },
      {
        label: <FormattedMessage id="quote_terms.month_rise" />,
        dataKey: '本月涨幅',
        sortable: true,
        sortKey: '本月涨幅',
        width: basicColumnWidth,
        align: 'right',
        render: ({ value }: RenderMethodParams) => {
          return (
            <span className={cn('text-[30px] text-[var(--stock-default-color)]', getSignByComparison(value))}>
              {toPercent(value, {
                multiply: 100,
              })}
            </span>
          );
        },
      },
      {
        label: <FormattedMessage id="quote_terms.year_rise" />,
        dataKey: '本年涨幅',
        sortable: true,
        sortKey: '本年涨幅',
        width: basicColumnWidth,
        align: 'right',
        render: ({ value }: RenderMethodParams) => {
          return (
            <span className={cn('text-[30px] text-[var(--stock-default-color)]', getSignByComparison(value))}>
              {toPercent(value, {
                multiply: 100,
              })}
            </span>
          );
        },
      },
    ];
  }, [locale, ratio, nameKey]);

  const defaultSortState: SortState = useMemo(
    () => ({
      sortedColumn: '涨幅',
      sortOrder: 'desc',
    }),
    [],
  );

  // 因子库需要的字段
  const fields = useMemo(() => {
    return [
      '领涨股代码',
      '领涨股小市场',
      '领涨股名称',
      '领涨股涨幅',
      '上涨家数',
      '下跌家数',
      '资金流向',
      '本周涨幅',
      '本月涨幅',
      '本年涨幅',
    ];
  }, []);

  const subscribeFields = useMemo(() => {
    return [MarketDataPushField.price_rise_rate];
  }, []);

  const pickQuoteFields = useMemo(() => {
    return subscribeFields.concat(['market_id', 'dec', nameKey]);
  }, [subscribeFields, nameKey]);

  const factorParams = useMemo(() => {
    return {
      block_id: blockId,
      deep,
      fields,
    };
  }, [fields, blockId, deep]);

  const requestAPI: RankingTableProps['requestAPI'] = fetchBlockRanking as any;

  return {
    requestAPI,
    columns,
    wrapperPadding,
    defaultSortState,
    fields,
    subscribeFields,
    pickQuoteFields,
    factorParams,
  };
}

export default useCommonRankingConfig;
