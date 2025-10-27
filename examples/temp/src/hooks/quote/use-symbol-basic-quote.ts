import { MarketDataPushField, type CommodityQuote } from '@dz-web/quote-client';
import { useSubscribeSingleStockQuote } from '@dz-web/quote-client-react';
import { useMemo, useEffect } from 'react';

import { PLACEHOLDER } from '@/constants/config';
import { useI18nStockName } from '@/hooks/use-i18n-field';
import { useQuoteInfo } from '@/model/quote-info';

export const useSymbolBasicQuote = (subFields: string[] = []) => {
  const symbol = useQuoteInfo((state) => state.symbol);
  const setSymbolInfo = useQuoteInfo((state) => state.setSymbolInfo);
  const nameField = useI18nStockName();

  const { data: quoteInfo, updateFlow }: { data: CommodityQuote; updateFlow: number } = useSubscribeSingleStockQuote({
    market: symbol.market,
    code: symbol.code,
    subFields: [
      MarketDataPushField.now,
      MarketDataPushField.price_rise_rate,
      MarketDataPushField.price_rise,
      MarketDataPushField.quote_state,
      ...subFields,
    ],
  });

  const symbolName = useMemo(() => {
    return `${quoteInfo[nameField] || PLACEHOLDER}`;
  }, [quoteInfo[nameField], nameField, symbol.code]);

  useEffect(() => {
    setSymbolInfo({ ...quoteInfo });
  }, [updateFlow]);

  return {
    symbolName,
  };
};
