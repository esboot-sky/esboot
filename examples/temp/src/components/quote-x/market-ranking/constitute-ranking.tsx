import { BIG_MARKET, getExchangeId, getMarketCategory, MARKET_CATEGORY, querySnapshot } from '@dz-web/quote-client';
import { useWSClientEffect } from '@dz-web/quote-client-react';
import queryString from 'query-string';
import { memo, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { CommodityQuoteKey } from '@/api/types';
import RankingTable, { RankingTableProps } from '@/components/quote-x/ranking-table/ranking-table';
import { settingNavigationTitle } from '@/helpers/native/msg';
import { openHKConstitueRankingPage } from '@/helpers/native/url';
import { useI18nStockName } from '@/hooks/use-i18n-field';
import { useRem2px } from '@/hooks/use-rem2px';

import useCommonRankingConfig from './hooks/use-common-ranking-config';
import QuoteStatementServiceWrapper from './quote-statement-service-wrapper';

export type IIndexRankingProps = {
  miniMode?: boolean;
  symbol?: CommodityQuoteKey;
  active?: boolean;
  autoSetPageTitle?: boolean;
} & Pick<RankingTableProps, 'bigMarket'>;

function ConstituteRanking({
  miniMode = false,
  symbol,
  bigMarket,
  active = true,
  autoSetPageTitle,
}: IIndexRankingProps) {
  const { formatMessage } = useIntl();
  const query = useMemo(() => {
    return queryString.parse(window.location.search);
  }, []);

  const nameKey = useI18nStockName();

  useWSClientEffect(
    (client) => {
      if (!autoSetPageTitle) return;
      const { code, market } = query;

      if (!market || !code) {
        return;
      }

      querySnapshot(client, {
        symbols: [[Number(market), code as string]],
        fields: [nameKey],
      }).then((data) => {
        const name = (data?.[0] as any)?.[nameKey];
        settingNavigationTitle({
          title: name + formatMessage({ id: 'quote_terms.constitute_stock' }),
        });
      });
    },
    [nameKey],
  );

  const { indexs, blocks } = useMemo(() => {
    let _symbol = symbol;
    const { market: marketFromQuery, code: codeFromQuery } = query;

    if (codeFromQuery) {
      _symbol = {
        market: Number(marketFromQuery),
        code: codeFromQuery as string,
      };
    }

    if (!_symbol) return {};
    const marketCategory = getMarketCategory(_symbol.market);
    const isBlock = marketCategory === MARKET_CATEGORY.block;

    const s = [
      {
        eid: getExchangeId(_symbol.market),
        c: _symbol.code,
      },
    ];

    if (isBlock) {
      return {
        blocks: s,
      };
    }

    return {
      indexs: s,
    };
  }, [symbol]);

  const { ratio } = useRem2px();

  const { columns, wrapperPadding, defaultSortState, pickQuoteFields, subscribeFields, factorParams, requestAPI } =
    useCommonRankingConfig({ miniMode, indexs, blocks });

  const _queryKeyPrefix = useMemo(() => {
    return ['constitue-ranking'];
  }, []);

  if (miniMode) {
    return (
      <div className="bg-white">
        <div style={{ minHeight: 108 * 6 * ratio }}>
          <RankingTable
            active={active}
            bigMarket={bigMarket}
            requestAPI={requestAPI}
            queryKeyPrefix={_queryKeyPrefix}
            className="px-[30px]"
            firstLoadDataCount={6}
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
              let openListPage: typeof openHKConstitueRankingPage = () => {};

              if (bigMarket === BIG_MARKET.HK) {
                //  目前只有港股有成分股
                openListPage = openHKConstitueRankingPage;
              }

              openListPage(symbol!);
            }}
            className="mt-[30px] pb-[18px] text-center text-[26px] text-[var(--link-text-color)]"
          >
            <FormattedMessage id="global.checkMore" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <QuoteStatementServiceWrapper bigMarket={bigMarket} visible>
        <RankingTable
          active={active}
          bigMarket={bigMarket}
          requestAPI={requestAPI}
          queryKeyPrefix={_queryKeyPrefix}
          className="px-[30px]"
          columns={columns}
          wrapperPadding={wrapperPadding}
          defaultSortState={defaultSortState}
          factorParams={factorParams}
          pickQuoteFields={pickQuoteFields}
          subscribeFields={subscribeFields}
        />
      </QuoteStatementServiceWrapper>
    </div>
  );
}

export default memo(ConstituteRanking);
