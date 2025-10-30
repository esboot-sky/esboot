import { clsx } from '@dz-web/esboot-browser';
import { ensure, getSignByComparison, Lang, toFixed, toPercent, toPositiveSign, toUnit } from '@dz-web/o-orange';
import { MarketDataPushField, QUOTE_FIELD } from '@dz-web/quote-client';
import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { fetchStockRanking } from '@/api/factor/query';
import { lanEnum } from '@/constants/config';
import { useI18nFactorStockName } from '@/hooks/use-i18n-field';
import { useRem2px } from '@/hooks/use-rem2px';
import { SortState } from '@/hooks/use-sort-state';

import MarketIcon from '../../market-icon';
import { RankingTableProps } from '../../ranking-table/ranking-table';

interface RenderMethodParams {
  // eslint识别错误
  // eslint-disable-next-line react/no-unused-prop-types
  value: any;
  // eslint-disable-next-line react/no-unused-prop-types
  rowData: any;
}

export interface UseCommonColumnsOptions {
  miniMode: boolean;
  markets?: number[];
  blocks?: number | { eid: number; c: string }[];
  indexs?: { eid: number; c: string }[];
}

function useCommonRankingConfig({ miniMode, markets, blocks, indexs }: UseCommonColumnsOptions) {
  const { locale } = useIntl();

  const { ratio } = useRem2px();
  const wrapperPadding: [number, number] = useMemo(() => {
    const p = ratio * 30;
    return [p, p];
  }, [ratio]);

  const nameKey = useI18nFactorStockName();

  const columns = useMemo(() => {
    const basicColumnWidth = Math.floor(window.innerWidth * 0.27);
    const basicColumnWidthInPx = `${basicColumnWidth}px`;
    const firstColumnWidth = window.innerWidth - basicColumnWidth * 2 - wrapperPadding[0] - wrapperPadding[1];
    const lang = locale === lanEnum.ZH_TW ? Lang.ZH_TW : Lang.ZH_CN;

    const miniModeColumns = [
      {
        label: <FormattedMessage id="quote_fields.name_code" />,
        dataKey: 'code',
        width: `${firstColumnWidth}px`,
        fixed: true,
        render: ({ value, rowData }: RenderMethodParams) => (
          <>
            <div
              className="overflow-hidden text-ellipsis whitespace-nowrap text-[30px] font-bold leading-[42px]
                text-[var(--main-text-color)]"
            >
              {ensure((rowData as any)[nameKey])}
            </div>
            <div className="flex items-center">
              <MarketIcon market={rowData.market} />
              <span className="stock-code ml-[6px] text-[24px] text-[var(--secondary-text-color)]">{value}</span>
            </div>
          </>
        ),
      },
      {
        label: <FormattedMessage id="quote_fields.latest_price" />,
        dataKey: MarketDataPushField.now,
        sortable: true,
        sortKey: '最新',
        width: basicColumnWidthInPx,
        align: 'right',
        render: ({ value, rowData }: RenderMethodParams) => {
          return (
            <span className={clsx('text-[30px] font-[500]', getSignByComparison(rowData.price_rise))}>
              {toFixed(value, { precision: rowData.dec || 2 })}
            </span>
          );
        },
      },
      {
        label: <FormattedMessage id="quote_fields.change_rate" />,
        dataKey: MarketDataPushField.price_rise_rate,
        sortable: true,
        sortKey: '涨幅',
        width: basicColumnWidthInPx,
        align: 'right',
        render: ({ value, rowData }: RenderMethodParams) => {
          return (
            <span className={clsx('text-[30px]', getSignByComparison(rowData.price_rise_rate))}>
              {toPositiveSign(
                toPercent(value, {
                  multiply: 100,
                }),
              )}
            </span>
          );
        },
      },
    ];

    if (miniMode) {
      return miniModeColumns;
    }

    return miniModeColumns.concat([
      {
        label: <FormattedMessage id="quote_fields.change_price" />,
        dataKey: MarketDataPushField.price_rise,
        sortable: true,
        sortKey: '涨跌额',
        width: basicColumnWidthInPx,
        align: 'right',
        render: ({ value, rowData }: RenderMethodParams) => {
          return (
            <span className={clsx('text-[30px]', getSignByComparison(rowData.price_rise))}>
              {toFixed(value, { precision: rowData.dec || 2 })}
            </span>
          );
        },
      },
      {
        label: <FormattedMessage id="quote_fields.volume" />,
        dataKey: QUOTE_FIELD.volume,
        sortable: true,
        sortKey: '成交量',
        width: basicColumnWidthInPx,
        align: 'right',
        render: ({ value }: RenderMethodParams) => {
          return <span className="text-[30px]">{toUnit(value, { lanType: lang })}</span>;
        },
      },
      {
        label: <FormattedMessage id="quote_fields.amount" />,
        dataKey: QUOTE_FIELD.amount,
        sortable: true,
        sortKey: '成交额',
        width: basicColumnWidthInPx,
        align: 'right',
        render: ({ value }: RenderMethodParams) => {
          return <span className="text-[30px]">{toUnit(value, { lanType: lang })}</span>;
        },
      },
      {
        label: <FormattedMessage id="quote_fields.trade_rate" />,
        dataKey: 'trade_rate',
        sortable: true,
        sortKey: '换手率',
        width: basicColumnWidthInPx,
        align: 'right',
        render: ({ value }: RenderMethodParams) => {
          return <span className="text-[30px]">{toPercent(value)}</span>;
        },
      },
      {
        label: <FormattedMessage id="quote_fields.PEStatic" />,
        dataKey: QUOTE_FIELD.PEStatic,
        sortable: true,
        sortKey: '市盈率(静)',
        width: basicColumnWidthInPx,
        align: 'right',
        render: ({ value }: RenderMethodParams) => {
          return <span className="text-[30px]">{toFixed(value)}</span>;
        },
      },
      {
        label: <FormattedMessage id="quote_fields.price_amplitude" />,
        dataKey: 'price_amplitude',
        sortable: true,
        sortKey: '振幅',
        width: basicColumnWidthInPx,
        align: 'right',
        render: ({ value }: RenderMethodParams) => {
          return <span className="text-[30px]">{toPercent(value)}</span>;
        },
      },
      {
        label: <FormattedMessage id="quote_fields.market_value" />,
        dataKey: QUOTE_FIELD.marketValue,
        sortable: true,
        sortKey: '总市值',
        width: basicColumnWidthInPx,
        align: 'right',
        render: ({ value }: RenderMethodParams) => {
          return <span className="text-[30px]">{toUnit(value, { lanType: lang })}</span>;
        },
      },
      {
        label: <FormattedMessage id="quote_fields.volume_rate" />,
        dataKey: 'volume_rate',
        sortable: true,
        sortKey: '量比',
        width: basicColumnWidthInPx,
        align: 'right',
        render: ({ value }: RenderMethodParams) => {
          return <span className="text-[30px]">{toFixed(value)}</span>;
        },
      },
      {
        label: <FormattedMessage id="quote_fields.order_rate" />,
        dataKey: 'order_rate',
        sortable: true,
        sortKey: '委比',
        width: basicColumnWidthInPx,
        align: 'right',
        render: ({ value }: RenderMethodParams) => {
          return (
            <span className="text-[30px]">
              {toPercent(value, {
                multiply: 100,
              })}
            </span>
          );
        },
      },
    ]);
  }, [locale, miniMode, ratio, nameKey]);

  const defaultSortState: SortState = useMemo(
    () => ({
      sortedColumn: '涨幅',
      sortOrder: 'desc',
    }),
    [],
  );

  // 因子库需要的字段
  const fields = useMemo(() => {
    return [nameKey];
  }, [nameKey]);

  const subscribeFields = useMemo(() => {
    return [
      MarketDataPushField.now,
      MarketDataPushField.price_rise_rate,
      MarketDataPushField.price_rise,
      QUOTE_FIELD.volume,
      QUOTE_FIELD.amount,
      QUOTE_FIELD.PEStatic,
      'price_amplitude',
      'trade_rate',
      'market_value',
      'volume_rate',
      'order_rate',
    ];
  }, []);

  const pickQuoteFields = useMemo(() => {
    return subscribeFields.concat(['market_id', 'dec']);
  }, [subscribeFields]);

  const factorParams = useMemo(() => {
    if (blocks) {
      return {
        blocks,
        fields,
      };
    }

    if (indexs) {
      return {
        indexs,
        fields,
      };
    }

    return {
      markets,
      fields,
      filter_st: true,
      filter_new: true,
    };
  }, [markets, fields, blocks, markets, indexs]);

  const requestAPI: RankingTableProps['requestAPI'] = fetchStockRanking as any;

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
