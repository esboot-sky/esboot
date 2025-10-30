var GLOBAL_CONFIG = {
  debug: false,
  enableEncrypt: false,
  COMMON_SERVERS: {
    gateway: 'http://10.10.11.93:6002',
    requestTimeout: 5,
  },
  TRADE_ORDER_TIME_OUT: 1000,
  DEFAULT_THEME: 'white',
  QUOTES_CONFIG: {
    searchMarketList: [
      2002, 2031, 2005, 2003, 2004, 2007, 2032, 2034, 30000, 30001, 30002, 30003, 47000, 48000, 49000, 50000, 51000,
      52000, 53000, 54000,
    ],
    blockIdList: [8400, 8500, 42000],
    marketPermissionsPollingInterval: 600000, // 10min, 小市场权限轮询时间
    factorPollingInterval: 5000, // 5s, 因子库轮询时间
  },
  TRADE_CONFIG: {
    pollingInterval: 5000,
  },
  EXTERNAL_LINKS: {
    DEPOSIT: 'http://10.10.11.79:6002/deposit/deposit',
  },
};
