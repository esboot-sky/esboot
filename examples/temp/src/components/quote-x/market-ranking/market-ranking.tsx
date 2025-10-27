import { clsx } from '@dz-web/esboot-browser';
import { Tabs } from 'antd-mobile';
import queryString from 'query-string';
import { memo, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import RankingTable, { RankingTableProps } from '@/components/quote-x/ranking-table/ranking-table';
import { useRem2px } from '@/hooks/use-rem2px';

import useCommonRankingConfig from './hooks/use-common-ranking-config';
import QuoteStatementServiceWrapper from './quote-statement-service-wrapper';
import { ITab } from './tabs';

export type IMarketRankingProps = {
  miniMode?: boolean;
  tabs: ITab[];
  queryKeyPrefix: string[];
  onCheckoutMore?: (tab: ITab) => void;
  active?: boolean;
} & Pick<RankingTableProps, 'bigMarket'>;

function MarketRanking({
  miniMode = false,
  tabs = [],
  queryKeyPrefix,
  onCheckoutMore,
  bigMarket,
  active = true,
}: IMarketRankingProps) {
  const query = useMemo(() => {
    return queryString.parse(window.location.search);
  }, []);

  const [activeTabKey, setActiveTabKey] = useState(() => {
    return (query.tab as string) || tabs[0].key;
  });

  function handleTabChange(val: string) {
    setActiveTabKey(val);
  }
  const { ratio } = useRem2px();

  const tab = useMemo(() => {
    return tabs.find((t) => t.key === activeTabKey) || tabs[0];
  }, [activeTabKey]);

  const { columns, wrapperPadding, defaultSortState, pickQuoteFields, subscribeFields, factorParams, requestAPI } =
    useCommonRankingConfig({ miniMode, markets: tab.markets, blocks: tab.blocks });

  const _queryKeyPrefix = useMemo(() => {
    return [...queryKeyPrefix, activeTabKey];
  }, [activeTabKey]);

  function renderTable() {
    const tableNode = miniMode ? (
      <div className="bg-white">
        <div style={{ minHeight: 108 * 10 * ratio }}>
          <RankingTable
            active={active}
            bigMarket={bigMarket}
            requestAPI={requestAPI}
            queryKeyPrefix={_queryKeyPrefix}
            className="px-[30px]"
            firstLoadDataCount={10}
            disableLoadOnVisibleChange
            columns={columns}
            wrapperPadding={wrapperPadding}
            defaultSortState={defaultSortState}
            pickQuoteFields={pickQuoteFields}
            subscribeFields={subscribeFields}
            factorParams={factorParams}
            showNoMore={false}
          />
          <div
            onClick={() => {
              onCheckoutMore?.(tab);
            }}
            className="mt-[30px] pb-[18px] text-center text-[26px] text-[var(--link-text-color)]"
          >
            <FormattedMessage id="global.checkMore" />
          </div>
        </div>
      </div>
    ) : (
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
    return tableNode;
  }

  return (
    <QuoteStatementServiceWrapper bigMarket={bigMarket} visible={!miniMode}>
      <div className={clsx('flex flex-col', { 'h-full': !miniMode })}>
        <div
          className={clsx('override-antd-tabs override-antd-tabs-border-b pl-[4px]', {
            'override-antd-tabs-hide-active-line': miniMode,
          })}
        >
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
    </QuoteStatementServiceWrapper>
  );
}

export default memo(MarketRanking);
