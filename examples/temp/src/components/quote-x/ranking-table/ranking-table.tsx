/**
 * 市场排行表格, UI + 滚动加载 + 排序 + 轮询
 */
import { cn } from '@dz-web/esboot-browser';
import { BIG_MARKET } from '@dz-web/quote-client';
import { SpinLoading } from 'antd-mobile';
import { memo, useEffect, useMemo, useRef } from 'react';
import { FormattedMessage } from 'react-intl';

import TableList, { ITableItemColumns } from '@/components/table/table';
import { openSymbolInfoPage } from '@/helpers/native/url';
import staticConfig from '@/helpers/static-config';
import { useQuotationPush } from '@/hooks/quote/use-quotation-push';
import { useQuotationTableLogic } from '@/hooks/quote/use-quotation-table-logic';
import { useRem2px } from '@/hooks/use-rem2px';
import { SortState, useSortState } from '@/hooks/use-sort-state';

export interface RankingTableProps {
  className?: string;
  disableLoadOnVisibleChange?: boolean;
  firstLoadDataCount?: number;
  columns: ITableItemColumns[];
  wrapperPadding: [number, number];
  queryKeyPrefix: any[];
  defaultSortState: SortState;
  factorParams?: any;
  pickQuoteFields: string[];
  subscribeFields: string[];
  requestAPI: (params: any, isRealtime?: boolean) => Promise<any>;
  bigMarket: BIG_MARKET;
  active?: boolean;
  showNoMore?: boolean;
}

function RankingTable({
  className,
  disableLoadOnVisibleChange = false,
  firstLoadDataCount = 50,
  columns,
  wrapperPadding,
  queryKeyPrefix,
  defaultSortState,
  factorParams = {},
  pickQuoteFields,
  subscribeFields,
  requestAPI,
  bigMarket,
  active = true,
  showNoMore = true,
}: RankingTableProps) {
  const { sortState, sortColumn } = useSortState({
    initialState: defaultSortState,
  });

  const params = useMemo(() => {
    return {
      ...factorParams,
      sort_field: [
        {
          desc: sortState.sortOrder !== 'asc',
          field: sortState.sortedColumn || defaultSortState.sortedColumn,
        },
      ],
    };
  }, [sortState, factorParams]);

  // 转换为table需要的排序数据格式
  const tableSortData = useMemo(() => {
    if (!sortState.sortedColumn) {
      return null;
    }

    if (sortState.sortOrder === 'desc') {
      return {
        sortKey: sortState.sortedColumn,
        asc: '0',
      };
    }
    if (sortState.sortOrder === 'asc') {
      return {
        sortKey: sortState.sortedColumn,
        asc: '1',
      };
    }

    return {
      sortKey: '',
      asc: '',
    };
  }, [sortState]);

  const tableRef = useRef<any>(null);

  useEffect(() => {
    if (disableLoadOnVisibleChange) {
      onVisibleDataChange(0, firstLoadDataCount);
    }
  }, []);

  const _requestAPI = (p: any) => requestAPI({ bigMarket }, p);

  const {
    data: tableData = [],
    isLoading,
    onVisibleDataChange,
    getVisibleSymbols,
  } = useQuotationTableLogic<any, Awaited<ReturnType<typeof requestAPI>>>({
    enabled: active,
    enablePolling: active,
    enableQuotationPush: active,
    pollingInterval: staticConfig.factorPollingInterval,
    requestAPI: _requestAPI,
    params,
    queryKeyPrefix: [...queryKeyPrefix],
    scrollTableToTop: () => {
      // TODO: 滚动到顶部
      // tableRef.current?.scrollTo({ scrollTop: 0 });
    },
    subscribeFields,
    pickQuoteFields,
    useQuotationPush,
    onRerender: () => {
      tableRef.current?.forceRerender();
    },
    addRangeToParams: (range, requestParams) => {
      if (disableLoadOnVisibleChange) {
        return { ...requestParams, begin: 0, count: firstLoadDataCount };
      }
      return { ...requestParams, ...range };
    },
    extractRequiredResData: (res: any) => ({
      data: res.body?.symbols,
      total: disableLoadOnVisibleChange ? Math.min(firstLoadDataCount, res.body.total_count) : res.body.total_count,
    }),
    fullReplaceAPIData: disableLoadOnVisibleChange,
  });

  const loadingNode = (
    <div style={{ height: '30vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <SpinLoading />
    </div>
  );

  const { ratio } = useRem2px();

  const titleHeight = useMemo(() => {
    // 必须与table设置的表头样式样式一致
    return ratio * 67;
  }, [ratio]);

  const rowHeight = useMemo(() => {
    return ratio * 108;
  }, [ratio]);

  return (
    <TableList
      isLoadingMore={!isLoading && showNoMore}
      loadingMoreNode={showNoMore ? <FormattedMessage id="global.nomore" /> : null}
      className={cn('with-scrollbar w-full bg-white', className)}
      ref={tableRef}
      onVisibleDataChange={(begin, count) => {
        if (disableLoadOnVisibleChange) {
          return;
        }

        onVisibleDataChange(begin, count);
      }}
      dataLen={tableData.length}
      isLoading={isLoading}
      loadingNode={loadingNode}
      data={tableData}
      columns={columns}
      controllSortData={tableSortData}
      titleHeight={titleHeight}
      columnHeight={rowHeight}
      wrapperPadding={wrapperPadding}
      bodyHeight="100%"
      onRowClick={(v) => {
        const { market, code } = v.rowData;

        const visibleSymbols = getVisibleSymbols();

        openSymbolInfoPage(market, code, visibleSymbols);
      }}
      sort={(v) => {
        sortColumn(v.key);
      }}
    />
  );
}

export default memo(RankingTable);
