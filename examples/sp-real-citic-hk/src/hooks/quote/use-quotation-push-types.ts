import type { CommodityQuoteKey } from '@/api/types';

export type SymbolTuple = CommodityQuoteKey;

export type HookUseQuotationPush = <T>(
  symbols: CommodityQuoteKey[],
  subFields: string[],
  fields: string[],
  callback: (data: T[]) => void,
) => void;
