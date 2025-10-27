/**
 * PAGE_TYPE_KEY Note
 *
 * 全市场统一使用 SELF_ALL，如自选、交易
 *
 * 有细分市场使用 PRODUCT_DETAIL，且必传大市场id。如市场页
 */
export enum PAGE_TYPE_KEY {
  PRODUCT_DETAIL = 'product_detail',
  SELF_ALL = 'self_all',
}
