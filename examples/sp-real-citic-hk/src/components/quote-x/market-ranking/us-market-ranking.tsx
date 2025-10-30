import { BIG_MARKET } from '@dz-web/quote-client';
import { memo, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { USMarketTab } from '@/constants/market';
import { openUSMarketRankingPage } from '@/helpers/native/url';
import { useSetI18nPageTitle } from '@/hooks/use-set-i18n-page-title';

import MarketRanking from './market-ranking';

export interface IUSMarketRankingProps {
  miniMode?: boolean;
  active?: boolean;
}

function USMarketRanking({ miniMode = false, active = true }: IUSMarketRankingProps) {
  const { locale } = useIntl();
  const tabs = useMemo(() => {
    return [
      {
        label: <FormattedMessage id="quote_terms.us_all" />,
        key: USMarketTab.US,
        markets: [47000, 48000, 49000, 50000, 51000, 52000, 53000, 54000],
      },
      {
        label: <FormattedMessage id="quote_terms.us_china_concept" />,
        key: USMarketTab.ChinaConcept,
        blocks: [37000],
      },
      {
        label: <FormattedMessage id="quote_terms.us_nasdaq" />,
        key: USMarketTab.Nasdaq,
        markets: [47000, 48000, 49000],
      },
      {
        label: <FormattedMessage id="quote_terms.us_nyse" />,
        key: USMarketTab.NYSE,
        markets: [50000],
      },
      {
        label: <FormattedMessage id="quote_terms.us_amex" />,
        key: USMarketTab.AMEX,
        markets: [51000],
      },
    ];
  }, [locale]);

  const queryKeyPrefix = useMemo(() => {
    return ['market-ranking', 'us'];
  }, []);

  useSetI18nPageTitle('quote_terms.category_title', !miniMode);

  return (
    <MarketRanking
      bigMarket={BIG_MARKET.US}
      miniMode={miniMode}
      tabs={tabs}
      queryKeyPrefix={queryKeyPrefix}
      onCheckoutMore={(tab) => {
        openUSMarketRankingPage(tab.key);
      }}
      active={active}
    />
  );
}
export default memo(USMarketRanking);
