import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { OrderItem } from '@/api/trade/query/query';
import {
  getEntrustStatusCell,
  getSymbolNameCell,
  getOrderPriceAndAveragePriceCell,
  getOrderQtyAndFilledQtyCell,
  getOrderTimeCell,
} from '@/components/table/components/cell/cell';
import Table from '@/components/table/table';
import { openCancelOrChangeOrderPage, openOrderDetailPage, openSymbolInfoPage } from '@/helpers/native/url';
import { canCancelOrModify } from '@/helpers/trade';
import IconOrderCancel from '@/images/trade/icon_order-cancel.svg';
import IconOrderDetail from '@/images/trade/icon_order-detail.svg';
import IconOrderChange from '@/images/trade/icon_order-modify.svg';
import IconOrderQuote from '@/images/trade/icon_order-quote.svg';
import { useTradeStore } from '@/model/trade';

const addDOMCls = 'flex flex-1 items-center py-[16px] px-[25px] font-regular-26 min-w-[20%]';
const addDOMIconCls = 'w-[40px] h-[40px] mr-[10px]';

type OnChangeOrCancelOrder = (orderNo: string, rowData: OrderItem) => void;
interface OrderTableProps {
  onCancelOrder?: OnChangeOrCancelOrder;
  onChangeOrder?: OnChangeOrCancelOrder;
}

const OrderTable = (props: OrderTableProps) => {
  const { onCancelOrder, onChangeOrder } = props;
  const orderList = useTradeStore((state) => state.orderList);
  const isLoadingOrder = useTradeStore((state) => state.isLoadingOrder);

  const cancelOrder = useCallback(
    (orderNo: string, rowData: OrderItem) =>
      onCancelOrder ? onCancelOrder(orderNo, rowData) : openCancelOrChangeOrderPage(orderNo),
    [onCancelOrder],
  );

  const changeOrder = useCallback(
    (orderNo: string, rowData: OrderItem) =>
      onChangeOrder ? onChangeOrder(orderNo, rowData) : openCancelOrChangeOrderPage(orderNo),
    [onChangeOrder],
  );

  const addDOM = useCallback(({ rowData }: any) => {
    return (
      <div className="input-background flex w-full overflow-x-auto">
        {canCancelOrModify(rowData.isCancel) && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              cancelOrder(rowData.orderNo, rowData);
            }}
            className={addDOMCls}
          >
            <IconOrderChange className={addDOMIconCls} />
            <span>
              <FormattedMessage id="trade-page.cancel_order" />
            </span>
          </div>
        )}

        {canCancelOrModify(rowData.isModify) && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              changeOrder(rowData.orderNo, rowData);
            }}
            className={addDOMCls}
          >
            <IconOrderCancel className={addDOMIconCls} />
            <span>
              <FormattedMessage id="trade-page.change_order" />
            </span>
          </div>
        )}

        <div
          onClick={(e) => {
            e.stopPropagation();
            openOrderDetailPage(rowData.orderNo);
          }}
          className={addDOMCls}
        >
          <IconOrderDetail className={addDOMIconCls} />
          <span>
            <FormattedMessage id="global.detail" />
          </span>
        </div>

        <div className={addDOMCls} onClick={() => openSymbolInfoPage(rowData.smallMarket, rowData.stockCode)}>
          <IconOrderQuote className={addDOMIconCls} />
          <span>
            <FormattedMessage id="global.quote" />
          </span>
        </div>
      </div>
    );
  }, []);

  const columns = useMemo(
    () => [
      getSymbolNameCell(),
      getEntrustStatusCell(),
      getOrderPriceAndAveragePriceCell(),
      getOrderQtyAndFilledQtyCell(),
      getOrderTimeCell(),
    ],
    [],
  );

  return <Table columns={columns} data={orderList} addDom={addDOM} isLoading={isLoadingOrder} />;
};

export default OrderTable;
