import { CommodityQuote, subscribeSymbolsQuote } from '@dz-web/quote-client';
import { useWSClientEffect } from '@dz-web/quote-client-react';
import { useMemo } from 'react';

import { HookUseQuotationPush, SymbolTuple } from './use-quotation-push-types';

export const useQuotationPush: HookUseQuotationPush = <T>(
  symbols: SymbolTuple[],
  subFields: string[],
  fields: string[],
  callback: (data: T[]) => void,
) => {
  const _symbols = useMemo(() => {
    return symbols.map((item) => [item.market, item.code] as [number, string]);
  }, [symbols]);

  useWSClientEffect(
    (ws) => {
      const unsubscribe = subscribeSymbolsQuote(
        ws,
        {
          symbols: _symbols,
          subFields,
          fields,
          threshold: 200, // 默认添加200ms节流
        },
        callback as (data: CommodityQuote[]) => void,
      );

      return () => {
        unsubscribe();
      };
    },
    [_symbols, subFields, fields],
  );
};
