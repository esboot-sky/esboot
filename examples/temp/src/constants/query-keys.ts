// #region 基金

const QueryKeyFund = ['fund'];
export const QueryKeyFundRealtime = [...QueryKeyFund, 'realtime'];
export const QueryKeyFundPosition = [...QueryKeyFundRealtime, 'position'];
export const QueryKeyFundOrders = [...QueryKeyFundRealtime, 'orders'];
export const QueryKeyFundTotal = [...QueryKeyFund, 'fundTotal'];

// #endregion

// #region quote

const QueryKeyQuote = ['quote'];

/**
 * 成交统计querykey前缀
 */
export const QueryKeyQuoteTradeStatistic = [...QueryKeyQuote, 'tradeStatistic'];

/**
 * 市场涨跌分布
 */
export const QueryKeyAdvanceDeclineDistribution = [...QueryKeyQuote, 'advanceDeclineDistribution'];
/**
 * 小市场权限
 */
export const QueryKeyMarketPermissions = [...QueryKeyQuote, 'marketPermissions'];
/**
 * 因子库个股详情querykey前缀
 */
export const QueryKeySymbolInfoFromFactor = [...QueryKeyQuote, 'symbolInfoFromFactor'];
export const QueryKeyHKETFFilterParams = [...QueryKeyQuote, 'hkETFFilterParams'];

/**
 * 自选排序
 */
export const QueryKeySortWatchlistStocks = [...QueryKeyQuote, 'sortWatchlistStocks'];
export const QueryKeyBlockEntry = [...QueryKeyQuote, 'blockEntry'];
// #endregion

// #region trade

const QueryKeyTrade = ['trade'];

/**
 * 委托详情
 */
export const QueryKeyEntrustmentDetail = [...QueryKeyTrade, 'entrustmentDetail'];

/**
 * 成交详情
 */
export const QueryKeyCompletedOrderDetail = [...QueryKeyTrade, 'completedOrderDetail'];

// #endregion

// #region ipo

const QueryKeyIpo = ['ipo'];

export const QueryKeyIPOStatistics = [...QueryKeyIpo, 'statistics'];
export const QueryKeyIPOStocksList = [...QueryKeyIpo, 'stocksList'];

// #endregion
