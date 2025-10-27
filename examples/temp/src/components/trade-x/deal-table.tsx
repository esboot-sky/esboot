import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { QueryOrderDetailDateType } from '@/api/trade/query/query';
import {
  getSymbolNameCell,
  getDealPriceCell,
  getDealQtyCell,
  getBsAmountCell,
  getDealTimeCell,
} from '@/components/table/components/cell/cell';
import Table from '@/components/table/table';
import { openPage, openSymbolInfoPage } from '@/helpers/native/url';
import IconOrderDetail from '@/images/trade/icon_order-detail.svg';
import IconOrderQuote from '@/images/trade/icon_order-quote.svg';
import { useTradeStore } from '@/model/trade';

const addDOMCls = 'flex flex-1 items-center py-[16px] px-[25px] font-regular-26 min-w-[20%]';
const addDOMIconCls = 'w-[40px] h-[40px] mr-[10px]';

const OrderTable = () => {
  const todayDealList = useTradeStore((state) => state.todayDealList);
  const isLoadingTodayDeal = useTradeStore((state) => state.isLoadingTodayDeal);

  const toDeailPage = (orderNo: string) => {
    openPage(`/trade.html#/deal-detail?orderNo=${orderNo}&selectBy=${QueryOrderDetailDateType.Today}`);
  };

  const addDOM = useCallback(({ rowData }: any) => {
    return (
      <div className="input-background flex w-full overflow-x-auto">
        <div
          onClick={(e) => {
            e.stopPropagation();
            toDeailPage(rowData.orderNo);
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
    () => [getSymbolNameCell(), getDealTimeCell(), getDealPriceCell(), getDealQtyCell(), getBsAmountCell()],
    [],
  );

  return <Table columns={columns} data={todayDealList} addDom={addDOM} isLoading={isLoadingTodayDeal} />;
};

export default OrderTable;
