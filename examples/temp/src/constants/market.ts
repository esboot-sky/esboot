/**
 * 港股市场tab key，跳转是拼到url上的tab=hk
 */
export enum HKMarketTab {
  HK_MAIN_BOARD = 'hk_main_board',
  HK_GEM = 'hk_gem',
}

/**
 * 美股市场tab key，跳转是拼到url上的tab=us
 */
export enum USMarketTab {
  /**
   * 全部美股
   */
  US = 'us',
  /**
   * 中概股
   */
  ChinaConcept = 'china_concept',
  /**
   * 纳斯达克
   */
  Nasdaq = 'nasdaq',
  /**
   * 纽交所
   */
  NYSE = 'nyse',
  /**
   * 美交所
   */
  AMEX = 'amex',
}

/**
 * 港股市场tab key，跳转是拼到url上的tab=hk
 */
export enum HKBlockTab {
  Industry = 'industry',
  Concept = 'concept',
}
