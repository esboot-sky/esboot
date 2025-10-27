const CacheKey = {
  session: 'session',
  phone: 'phone',
  tradeSession: 'tradeSession',
  searchHistory: 'searchHistory',
  pageOfQuoteListUrlParams: 'pageOfQuoteListUrlParams',
  pageOfQuoteWarrantUrlParams: 'pageOfQuoteWarrantUrlParams',
  warrantFilterInfo: 'warrantFilterInfo',
  kIndicators: 'kIndicators',
  tempKIndicators: 'tempKIndicators',
  stockInfoTabs: 'stockInfoTabs',
  quoteHomeTab: 'quoteHomeTab',
  newStockTab: 'newStockTab',
  hisEntrutCalendar: 'hisEntrutCalendar',
  hisAgreeCalendar: 'hisAgreeCalendar',
  deviceToken: 'deviceToken',
  quotesUpDownColor: 'quotes_up_down_color',

  homeTab: 'home-tab',
  optionalGroupTab: 'watchlist-group-tab',
  marketTypeTab: 'market-type-tab',
  blockTabKey: 'block-tab-key',
  mainboardTabKey: 'mainboard-tab-key',
  quoteSocketUrl: 'quoteSocketUrl',

  watchlistStore: 'watchlist-store',
  touristWatchlistStore: 'tourist-watchlist-store',

  timeMainSelectedIndicators: 'QUOTE_CHART_TIME_MAIN_SELECTED_INDICATORS',
  timeSubSelectedIndicators: 'QUOTE_CHART_TIME_SUB_SELECTED_INDICATORS',
  kMainSelectedIndicators: 'QUOTE_CHART_K_MAIN_SELECTED_INDICATORS',
  kSubSelectedIndicators: 'QUOTE_CHART_K_SUB_SELECTED_INDICATORS',

  quoteChartPeriodChain: 'quote_chart_period_chain',
  quoteChartPeriodMoreKLineChain: 'quote_chart_period_more_k_line_chain',
  quoteChartUSPeriodType: 'quote_chart_US_intraday_type',
  quoteChartSettingIndicatorsConfig: 'quote_chart_setting_indicators_config',
  quoteChartSettingShowNowPriceLine: 'quote_chart_setting_show_now_price_line',
  quoteChartSettingShowTradeDetail: 'quote_chart_setting_show_trade_detail',
  quoteChartSettingKLineAdjMode: 'quote_chart_setting_k_line_adj_mode',
  quoteChartSettingUsStockPrevAfterDisplay: 'quote_chart_setting_us_stock_prev_after_display',

  quoteSymbolInfoCandidateList: 'quote_symbol_info_candidate_list',

  globalTradePreCheck: 'global_trade_pre_check',
  globalUserQuotationPermission: 'global_user_quotation_permission',
  globalMarketQuotePermissions: 'global_market_quote_permissions',
  globalQuotePermissionDict: 'global_quote_permission_dict',
} as const;

export { CacheKey };
