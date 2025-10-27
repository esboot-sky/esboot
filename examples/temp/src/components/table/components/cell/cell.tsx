import { ensure, getSignByComparison, toFixed, toThousand } from '@dz-web/o-orange';
import { memo, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import AdaptiveText from '@/components/adaptive-text';
import TradeMarketText from '@/components/trade-market-text';
import { lanEnum, PLACEHOLDER } from '@/constants/config';
import { OrderDirection } from '@/constants/trade';
import { openOrderPage } from '@/helpers/native/url';
import IconOrderStatusOfBuyZhTW from '@/images/trade/icon-order-status-of-buy-zh-tw.svg';
import IconOrderStatusOfBuy from '@/images/trade/icon-order-status-of-buy.svg';
import IconOrderStatusOfSellZhTW from '@/images/trade/icon-order-status-of-sell-zh-tw.svg';
import IconOrderStatusOfSell from '@/images/trade/icon-order-status-of-sell.svg';
import IconTrade from '@/images/trade/icon_trade.svg';
import { OrderTypeDict } from '@/modules/trade/views/trade/helpers/order-types';

import './cell.scss';

import type { ITableItemColumns } from '../../table';

type GetCellProps = Pick<ITableItemColumns, 'width' | 'fixed' | 'align' | 'className' | 'sortable'>;

export const getSymbolNameCell = (options: GetCellProps = {}): ITableItemColumns => {
  const { width = '2rem', fixed = true, ...rest } = options;

  return {
    label: (
      <div styleName="label-column">
        <FormattedMessage id="global.name" />
        /
        <FormattedMessage id="global.code" />
      </div>
    ),
    dataKey: 'stockName',
    width,
    fixed,
    render: ({ rowData }: any) => {
      return (
        <div styleName="content-column double-row">
          <AdaptiveText text={rowData.stockName || PLACEHOLDER} className="font-bold" fontSize={30} minFontSize={20} />

          <div className="flex items-center gap-[6px] text-[var(--secondary-text-color)]">
            <span>
              {rowData.stockCode}
              <TradeMarketText market={rowData.smallMarket} tradeMarket={rowData.tradeMarket} />
            </span>
          </div>
        </div>
      );
    },
    ...rest,
  };
};

export const getPositionCountCell = (options: GetCellProps = {}): ITableItemColumns => {
  const { width = '1.6rem', ...rest } = options;

  return {
    label: (
      <div styleName="label-column">
        <FormattedMessage id="trade.position" />
        /
        <FormattedMessage id="trade.can_use" />
      </div>
    ),
    dataKey: 'position',
    width,
    align: 'right',
    render: ({ rowData }: any) => {
      return (
        <div styleName="content-column">
          <div className="font-regular-30 leading-[42px]">
            {ensure(toThousand(rowData.currentQty), PLACEHOLDER, toThousand(rowData.currentQty))}
          </div>
          <div className="font-regular-26">
            {ensure(toThousand(rowData.enableQty), PLACEHOLDER, toThousand(rowData.enableQty))}
          </div>
        </div>
      );
    },
    ...rest,
  };
};

export const getNowAndCostCell = (options: GetCellProps = {}): ITableItemColumns => {
  const { width = '1.6rem' } = options;

  return {
    label: (
      <div styleName="label-column">
        <FormattedMessage id="global.now" />
        /
        <FormattedMessage id="trade.cost" />
      </div>
    ),
    dataKey: 'cost_price',
    width,
    align: 'right',
    render: ({ rowData }: any) => (
      <div styleName="content-column">
        <div className="font-regular-30 leading-[42px]">
          {toFixed(rowData.lastPrice, {
            precision: 3,
          })}
        </div>
        <div className="font-regular-26">
          {toFixed(rowData.costPrice, {
            precision: 3,
          })}
        </div>
      </div>
    ),
  };
};

export const getMarketValueCell = (options: GetCellProps = {}): ITableItemColumns => {
  const { width = '2.2rem' } = options;

  return {
    label: (
      <div styleName="label-column">
        <FormattedMessage id="trade.market_value" />
      </div>
    ),
    dataKey: 'marketValue',
    className: 'stock_title_style',
    width,
    align: 'right',
    render: ({ value }: any) => (
      <div styleName="content-column">{ensure(value, PLACEHOLDER, toThousand(toFixed(value, { precision: 2 })))}</div>
    ),
  };
};

export const getProfitAndLossAndRatioCell = (options: GetCellProps = {}): ITableItemColumns => {
  const { width = '2.5rem' } = options;

  return {
    label: (
      <div styleName="label-column">
        <FormattedMessage id="trade.profit_and_loss" />
        /
        <FormattedMessage id="global.ratio" />
      </div>
    ),
    dataKey: 'totalPL',
    width,
    align: 'right',
    render: ({ rowData, value }: any) => {
      const _value = value || 0;
      return (
        <div styleName="content-column" className={getSignByComparison(_value)}>
          <AdaptiveText
            text={ensure(_value, PLACEHOLDER, toThousand(toFixed(_value, { precision: 2 })))}
            className="leading-[42px]"
            fontSize={30}
            minFontSize={20}
          />
          <div className="font-regular-26">{rowData.totalPLPercent}</div>
        </div>
      );
    },
  };
};

export const getTodayProfitAndLossCell = (options: GetCellProps = {}): ITableItemColumns => {
  const { width = '2rem' } = options;

  return {
    label: (
      <div styleName="label-column">
        <FormattedMessage id="global.today" />
        <FormattedMessage id="trade.profit_and_loss" />
      </div>
    ),
    dataKey: 'floatingPL',
    className: 'stock_title_style',
    width,
    align: 'right',
    render: ({ value }) => (
      <div styleName="content-column" className={getSignByComparison(value)}>
        {ensure(value, '0.00', toThousand(toFixed(value, { precision: 2 })))}
      </div>
    ),
  };
};

export const getStockCurrencyUnitCell = (options: GetCellProps = {}): ITableItemColumns => {
  const { width = '1.5rem' } = options;

  return {
    label: (
      <div styleName="label-column">
        <FormattedMessage id="global.currency_unit" />
      </div>
    ),
    dataKey: 'currency',
    width,
    align: 'right',
    render: ({ value }) => <div styleName="content-column">{value}</div>,
  };
};

export const getTradeCell = (options: GetCellProps = {}): ITableItemColumns => {
  const { width = '2rem' } = options;

  return {
    label: '',
    dataKey: 'trade',
    width,
    align: 'right',
    render: ({ rowData }: any) => {
      if (rowData.darkTag) return '';

      return (
        <div
          className="flex items-center justify-center gap-[10px]"
          onClick={(e) => {
            e.stopPropagation();
            openOrderPage(rowData.smallMarket, rowData.stockCode);
          }}
        >
          <IconTrade className="h-[40px] w-[40px]" />
          <FormattedMessage id="global.trade" />
        </div>
      );
    },
  };
};

export const getDealTimeCell = (options: GetCellProps = {}): ITableItemColumns => {
  const { width = '2rem' } = options;

  return {
    label: (
      <div styleName="label-column">
        <FormattedMessage id="trade.deal_time" />
      </div>
    ),
    dataKey: 'dealTime',
    width,
    align: 'left',
    render: ({ value }: any) => (
      <div styleName="content-column">
        <div className="font-regular-26 leading-[38px]">{value}</div>
      </div>
    ),
  };
};

export const getDealPriceCell = (options: GetCellProps = {}): ITableItemColumns => {
  const { width = '1.8rem' } = options;

  return {
    label: (
      <div styleName="label-column">
        <FormattedMessage id="trade.deal_price" />
      </div>
    ),
    dataKey: 'price',
    width,
    align: 'right',
    render: ({ value }: any) => (
      <div styleName="content-column">{ensure(value, '--', toFixed(value, { precision: 3 }))}</div>
    ),
  };
};

export const getDealQtyCell = (options: GetCellProps = {}): ITableItemColumns => {
  const { width = '1.6rem' } = options;

  return {
    label: (
      <div styleName="label-column">
        <FormattedMessage id="trade.deal_qty" />
      </div>
    ),
    dataKey: 'qty',
    width,
    align: 'right',
    render: ({ value }: any) => <div styleName="content-column">{ensure(value, PLACEHOLDER, toThousand(value))}</div>,
  };
};

export const getBsAmountCell = (options: GetCellProps = {}): ITableItemColumns => {
  const { width = '2rem' } = options;

  const getBsText = (bs: string) => {
    if (bs === 'B') return <FormattedMessage id="trade.buy" />;
    if (bs === 'S') return <FormattedMessage id="trade.sell" />;
    return PLACEHOLDER;
  };

  return {
    label: (
      <div styleName="label-column">
        <FormattedMessage id="global.type" />
        /
        <FormattedMessage id="trade.amount" />
      </div>
    ),
    dataKey: 'bs',
    width,
    align: 'right',
    render: ({ rowData }: any) => (
      <div styleName="content-column double-row">
        <div className={`${getSignByComparison(rowData.bs === OrderDirection.BUY ? 1 : -1)}`}>
          {getBsText(rowData.bs)}
        </div>
        <div>{ensure(rowData.amount, PLACEHOLDER, toThousand(toFixed(rowData.amount, { precision: 2 })))}</div>
      </div>
    ),
  };
};

export const getOrderPriceAndAveragePriceCell = (options: GetCellProps = {}): ITableItemColumns => {
  const { width = '1.8rem' } = options;

  return {
    label: (
      <div styleName="label-column">
        <FormattedMessage id="trade.entrust_price" />
        /
        <FormattedMessage id="trade.entrust_average_price" />
      </div>
    ),
    align: 'right',
    dataKey: 'orderPrice',
    width,
    render: ({ rowData }: any) => {
      const orderPriceText = () => {
        if (rowData.orderType === OrderTypeDict.AO) {
          return <FormattedMessage id="trade.AO_MKT" />;
        }
        return toFixed(rowData.orderPrice, {
          precision: 3,
        });
      };

      const getAveragePriceText = () => {
        return toFixed(rowData.averagePrice, {
          precision: 3,
        });
      };

      return (
        <div styleName="content-column double-row">
          <div>{orderPriceText()}</div>
          <div>{getAveragePriceText()}</div>
        </div>
      );
    },
  };
};

export const getOrderQtyAndFilledQtyCell = (options: GetCellProps = {}): ITableItemColumns => {
  const { width = '1.8rem' } = options;

  return {
    label: (
      <div styleName="label-column">
        <FormattedMessage id="trade.entrust_qty_filled" />
      </div>
    ),
    align: 'right',
    dataKey: 'filledQty',
    width,
    render: ({ rowData }: any) => (
      <div styleName="content-column double-row">
        <div>{ensure(rowData.qty, PLACEHOLDER, toThousand(rowData.qty))}</div>
        <div>{ensure(rowData.filledQty, PLACEHOLDER, toThousand(rowData.filledQty))}</div>
      </div>
    ),
  };
};

const IconOrderStatus = memo(({ status }: { status: OrderDirection }) => {
  const { locale } = useIntl();

  const BuyStatusIcon = useMemo(() => {
    return locale === lanEnum.ZH_TW ? IconOrderStatusOfBuyZhTW : IconOrderStatusOfBuy;
  }, [locale]);

  const SellStatusIcon = useMemo(() => {
    return locale === lanEnum.ZH_TW ? IconOrderStatusOfSellZhTW : IconOrderStatusOfSell;
  }, [locale]);

  if (status === OrderDirection.BUY) {
    return <BuyStatusIcon />;
  }

  return <SellStatusIcon />;
});

export const getEntrustStatusCell = (options: GetCellProps = {}): ITableItemColumns => {
  const { width = '1.2rem' } = options;

  return {
    label: (
      <div styleName="label-column">
        <FormattedMessage id="global.status" />
      </div>
    ),
    dataKey: 'statusDescription',
    width,
    align: 'center',
    render: ({ rowData }: any) => (
      <div styleName="content-column double-row" className="items-center">
        <div className="h-[28px] w-[44px]">
          <IconOrderStatus status={rowData.bs} />
        </div>

        <div className="text-secondary-color">
          <AdaptiveText text={rowData.statusDescription} fontSize={24} minFontSize={16} />
        </div>
      </div>
    ),
  };
};

export const getOrderTimeCell = (options: GetCellProps = {}): ITableItemColumns => {
  const { width = '1.8rem' } = options;

  return {
    label: (
      <div styleName="label-column">
        <FormattedMessage id="trade.order_date" />
      </div>
    ),
    dataKey: 'orderTime',
    width,
    align: 'right',
    render: ({ value }: any) => (
      <div styleName="content-column" className="leading-[42px]">
        <div>{value}</div>
      </div>
    ),
  };
};
