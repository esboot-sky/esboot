import { useMemo } from 'react';

import {
  getSymbolNameCell,
  getPositionCountCell,
  getNowAndCostCell,
  getMarketValueCell,
  getProfitAndLossAndRatioCell,
  getTodayProfitAndLossCell,
  getStockCurrencyUnitCell,
  getTradeCell,
} from '@/components/table/components/cell/cell';
import Table, { type ITableItemColumns } from '@/components/table/table';
import { useTradeStore } from '@/model/trade';

import type { Market, Code } from '@dz-web/quote-client';

interface PositionTableProps {
  onRowClick?: (rowData: { smallMarket: Market; stockCode: Code }) => void;
  needTradeButton?: boolean;
}

const PositionTable = (props: PositionTableProps) => {
  const { onRowClick = () => {}, needTradeButton = false } = props;
  const positionList = useTradeStore((state) => state.positionList);
  const isLoadingPosition = useTradeStore((state) => state.isLoadingPosition);

  const clickRow = ({ rowData }: { rowData: { smallMarket: Market; stockCode: Code; darkTag: boolean } }) => {
    if (rowData.darkTag) return;

    onRowClick(rowData);
  };

  const columns = useMemo(
    () =>
      [
        getSymbolNameCell({ fixed: true }),
        getPositionCountCell(),
        getNowAndCostCell(),
        getMarketValueCell(),
        getProfitAndLossAndRatioCell(),
        getTodayProfitAndLossCell(),
        getStockCurrencyUnitCell(),
        needTradeButton && getTradeCell(),
      ].filter(Boolean) as ITableItemColumns[],
    [needTradeButton],
  );

  return <Table columns={columns} data={positionList} onRowClick={clickRow} isLoading={isLoadingPosition} />;
};

export default PositionTable;
