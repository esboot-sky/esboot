import { BIG_MARKET } from '@dz-web/quote-client';
import { memo, useMemo } from 'react';

import RankingTable from '@/components/quote-x/ranking-table/ranking-table';
import { useSetI18nPageTitle } from '@/hooks/use-set-i18n-page-title';

import useUSETFRankingConfig from './hooks/use-us-etf-ranking-config';
import QuoteStatementServiceWrapper from './quote-statement-service-wrapper';

function USETFRanking() {
  const blocks = useMemo(() => {
    return [42000];
  }, []);

  const { columns, wrapperPadding, defaultSortState, pickQuoteFields, subscribeFields, factorParams, requestAPI } =
    useUSETFRankingConfig({
      blocks,
    });

  const queryKeyPrefix = useMemo(() => {
    return ['us-etf-ranking'];
  }, []);

  useSetI18nPageTitle('quote_terms.etf_title');

  return (
    <QuoteStatementServiceWrapper bigMarket={BIG_MARKET.US} visible>
      <RankingTable
        bigMarket={BIG_MARKET.US}
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
    </QuoteStatementServiceWrapper>
  );
}

export default memo(USETFRanking);
