import { BIG_MARKET } from '@dz-web/quote-client';
import { memo, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { HKBlockTab } from '@/constants/market';
import { useSetI18nPageTitle } from '@/hooks/use-set-i18n-page-title';

import BlockRanking from './block-ranking';
import QuoteStatementServiceWrapper from './quote-statement-service-wrapper';

export interface IHKMarketRankingProps {
  active?: boolean;
}

function HKBlockRanking({ active = true }: IHKMarketRankingProps) {
  const { locale } = useIntl();
  const tabs = useMemo(() => {
    return [
      {
        label: <FormattedMessage id="quote_terms.industry_block" />,
        key: HKBlockTab.Industry,
        blockId: [41000],
        deep: 3,
      },
      {
        label: <FormattedMessage id="quote_terms.concept_block" />,
        key: HKBlockTab.Concept,
        blockId: [39000],
        deep: 1,
      },
    ];
  }, [locale]);

  const queryKeyPrefix = useMemo(() => {
    return ['market-ranking', 'hk'];
  }, []);

  useSetI18nPageTitle('quote_terms.hot_block');

  return (
    <QuoteStatementServiceWrapper bigMarket={BIG_MARKET.HK} visible>
      <BlockRanking bigMarket={BIG_MARKET.HK} tabs={tabs} queryKeyPrefix={queryKeyPrefix} active={active} />
    </QuoteStatementServiceWrapper>
  );
}
export default memo(HKBlockRanking);
