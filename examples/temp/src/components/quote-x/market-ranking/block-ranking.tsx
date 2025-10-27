import { clsx } from '@dz-web/esboot-browser';
import { Tabs } from 'antd-mobile';
import queryString from 'query-string';
import { memo, useMemo, useState } from 'react';

import RankingTable, { RankingTableProps } from '@/components/quote-x/ranking-table/ranking-table';

import useBlockRankingConfig from './hooks/use-block-ranking-config';
import { IBlockTab } from './tabs';

export type IMarketRankingProps = {
  tabs: IBlockTab[];
  queryKeyPrefix: string[];
  active?: boolean;
} & Pick<RankingTableProps, 'bigMarket'>;

function BlockRanking({ tabs = [], queryKeyPrefix, bigMarket, active = true }: IMarketRankingProps) {
  const query = useMemo(() => {
    return queryString.parse(window.location.search);
  }, []);

  const [activeTabKey, setActiveTabKey] = useState(() => {
    return (query.tab as string) || tabs[0].key;
  });

  function handleTabChange(val: string) {
    setActiveTabKey(val);
  }

  const tab = useMemo(() => {
    return tabs.find((t) => t.key === activeTabKey) || tabs[0];
  }, [activeTabKey]);

  const { columns, wrapperPadding, defaultSortState, pickQuoteFields, subscribeFields, factorParams, requestAPI } =
    useBlockRankingConfig({ blockId: tab.blockId, deep: tab.deep });

  function renderTable() {
    return (
      <RankingTable
        active={active}
        bigMarket={bigMarket}
        requestAPI={requestAPI}
        queryKeyPrefix={queryKeyPrefix}
        className="px-[30px]"
        columns={columns}
        wrapperPadding={wrapperPadding}
        defaultSortState={defaultSortState}
        factorParams={factorParams}
        pickQuoteFields={pickQuoteFields}
        subscribeFields={subscribeFields}
      />
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className={clsx('override-antd-tabs override-antd-tabs-border-b pl-[4px]')}>
        <Tabs activeKey={activeTabKey} onChange={(key) => handleTabChange(key)} activeLineMode="fixed">
          {tabs.map((t) => (
            <Tabs.Tab title={t.label} key={t.key} />
          ))}
        </Tabs>
      </div>
      <div className="min-h-0 flex-1" key={activeTabKey}>
        {renderTable()}
      </div>
    </div>
  );
}

export default memo(BlockRanking);
