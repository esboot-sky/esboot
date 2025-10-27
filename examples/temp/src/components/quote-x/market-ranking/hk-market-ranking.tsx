import { BIG_MARKET } from '@dz-web/quote-client';
import { memo, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { HKMarketTab } from '@/constants/market';
import { openHKMarketRankingPage } from '@/helpers/native/url';
import { useSetI18nPageTitle } from '@/hooks/use-set-i18n-page-title';

import MarketRanking from './market-ranking';

export interface IHKMarketRankingProps {
  miniMode?: boolean;
  active?: boolean;
}

function HKMarketRanking({ miniMode = false, active = true }: IHKMarketRankingProps) {
  const { locale } = useIntl();
  const tabs = useMemo(() => {
    return [
      {
        label: <FormattedMessage id="quote_terms.hk_main_board" />,
        key: HKMarketTab.HK_MAIN_BOARD,
        markets: [2002],
      },
      {
        label: <FormattedMessage id="quote_terms.hk_gem" />,
        key: HKMarketTab.HK_GEM,
        markets: [2031],
      },
    ];
  }, [locale]);

  const queryKeyPrefix = useMemo(() => {
    return ['market-ranking', 'hk'];
  }, []);

  useSetI18nPageTitle('quote_terms.category_title', !miniMode);

  return (
    <MarketRanking
      bigMarket={BIG_MARKET.HK}
      miniMode={miniMode}
      tabs={tabs}
      queryKeyPrefix={queryKeyPrefix}
      onCheckoutMore={(tab) => {
        openHKMarketRankingPage(tab.key);
      }}
      active={active}
    />
  );
}
export default memo(HKMarketRanking);
