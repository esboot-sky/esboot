import { ActionType } from '@dz-web/antd-pro-components';
import { QueryKey, useQuery } from '@tanstack/react-query';
import { useMemo, useRef, useState } from 'react';

import { IJavaBaseResponse } from '@/api/instance';

type Order = {
  column: string;
  asc: boolean;
};

type TableResult<TData> = {
  records: TData[];
  total: number;
};

type TableFetch<TParams, TData> = (params: TParams) => Promise<IJavaBaseResponse<TableResult<TData>>>;

type TableConfigOptions<TParams, TData> = {
  defaultParams: TParams;
  fetch: TableFetch<TParams, TData>;
  queryKey: QueryKey;
};

type TableRequestParams = Record<string, unknown> & {
  current?: number;
};

type TableSort = Record<string, 'ascend' | 'descend' | null | undefined>;

type TableRequestReturn<TData> = {
  data: TData[] | undefined;
  total: number | undefined;
  success: boolean;
};

const useTableConfig = <TParams extends Record<string, unknown>, TData = Record<string, unknown>>({
  defaultParams,
  fetch,
  queryKey,
}: TableConfigOptions<TParams, TData>) => {
  const { refetch } = useQuery({
    queryKey,
    queryFn: async () => (await fetch(paramsRef.current))?.result,
    enabled: false,
  });

  const [tableRequestLoading, setTableRequestLoading] = useState(true);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const paramsRef = useRef<TParams>(defaultParams);

  const actionRef = useRef<ActionType>();

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = useMemo(
    () => ({
      selectedRowKeys,
      onChange: onSelectChange,
    }),
    [selectedRowKeys],
  );

  const transformOrders = (sort: TableSort): Order[] =>
    Object.entries(sort).map(([key, value]) => ({
      column: key,
      asc: value === 'ascend', // 如果值为 "ascend" 则 asc 为 true
    }));

  const tableRequest = async (params: TableRequestParams, sort: TableSort = {}): Promise<TableRequestReturn<TData>> => {
    setTableRequestLoading(true);
    const orders = transformOrders(sort);
    const { current, ...rest } = params;
    const _params = {
      pageNum: current,
      ...rest,
      orders,
    } as TParams;

    paramsRef.current = _params;

    const msg = await refetch();
    setTableRequestLoading(false);

    return {
      data: msg?.data?.records,
      total: msg?.data?.total,
      success: msg?.status === 'success',
    };
  };

  return {
    paramsRef,
    actionRef,

    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,

    refetch,

    tableRequestLoading,
    tableRequest,
  };
};

export default useTableConfig;
