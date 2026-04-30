var APP_CONFIG = {
  title: '点证管理中台',
  COMMON_SERVERS: {
    base: 'http://10.10.11.134:6003',
    // base: 'http://10.10.13.55:6003',
  },
  subModuleList: {
    // 账户管理中心
    account: {
      beCode: 'uc',
      entryUrl: {
        dev: '//localhost:11101',
        prod: '/account/',
      },
      routerBase: '/child-account',
      icon: 'menu-account',
      activeIcon: 'menu-account-active',
    },
    // 出入金
    depositsAndWithdrawals: {
      beCode: 'cashio',
      entryUrl: {
        dev: '//localhost:11102',
        prod: '/deposits-and-withdrawals/',
      },
      routerBase: '/child-deposits-and-withdrawals',
      icon: 'menu-cashio',
      activeIcon: 'menu-cashio-active',
    },
    // 系统设置
    system: {
      beCode: 'sys',
      entryUrl: {
        dev: '//localhost:11103',
        prod: '/system/',
      },
      routerBase: '/child-system',
      icon: 'menu-system',
      activeIcon: 'menu-system-active',
    },
    // 开户
    openAccounts: {
      beCode: 'openaccount',
      entryUrl: {
        dev: '//localhost:11104',
        prod: '/open-accounts/',
      },
      routerBase: '/child-open-accounts',
      icon: 'menu-quotation',
      activeIcon: 'menu-quotation-active',
    },
    // 基金
    fund: {
      beCode: 'fund',
      entryUrl: {
        dev: '//localhost:11105',
        prod: '/fund/',
      },
      routerBase: '/child-fund',
      icon: 'menu-fund',
      activeIcon: 'menu-fund-active',
    },
    // 智能营销
    intelligentMarketing: {
      beCode: 'platform',
      entryUrl: {
        dev: '//localhost:11106',
        prod: '/intelligent-marketing/',
      },
      routerBase: '/child-intelligent-marketing',
      icon: 'menu-marketing',
      activeIcon: 'menu-marketing-active',
    },
    // 行情订阅
    quotation: {
      beCode: 'quotation',
      entryUrl: {
        dev: '//localhost:11107',
        prod: '/quotation-subscription/',
      },
      routerBase: '/child-quotation-subscription',
      icon: 'menu-quotation',
      activeIcon: 'menu-quotation-active',
    },
    // IPO
    IPO: {
      beCode: 'ipo',
      entryUrl: {
        dev: '//localhost:11108',
        prod: '/ipo/',
      },
      routerBase: '/child-ipo',
      icon: 'menu-ipo',
      activeIcon: 'menu-ipo-active',
    },
    // 直播管理
    live: {
      beCode: 'live',
      entryUrl: {
        dev: '//localhost:11109',
        prod: '/live/',
      },
      routerBase: '/child-live',
      icon: 'menu-marketing',
      activeIcon: 'menu-marketing-active',
    },
    // 网厅
    onlineBusinessHall: {
      beCode: 'hall',
      entryUrl: {
        dev: '//localhost:11110',
        prod: '/online-business-hall/',
      },
      routerBase: '/child-online-business-hall',
      icon: 'menu-marketing',
      activeIcon: 'menu-marketing-active',
    },
    // 短信平台
    sms: {
      beCode: 'sms',
      entryUrl: {
        dev: '//localhost:11111',
        prod: '/sms/',
      },
      routerBase: '/child-sms',
      icon: 'menu-marketing',
      activeIcon: 'menu-marketing-active',
    },
    // 交易
    trade: {
      beCode: 'trading',
      entryUrl: {
        dev: '//localhost:11112',
        prod: '/trade/',
      },
      routerBase: '/child-trade',
      icon: 'menu-marketing',
      activeIcon: 'menu-marketing-active',
    },
    // 组合
    combination: {
      beCode: 'combination',
      entryUrl: {
        dev: '//localhost:11113',
        prod: '/combination/',
      },
      routerBase: '/child-combination',
      icon: 'menu-marketing',
      activeIcon: 'menu-marketing-active',
    },
    // 社区
    community: {
      beCode: 'sns',
      entryUrl: {
        dev: '//localhost:11114',
        prod: '/community/',
      },
      routerBase: '/child-community',
      icon: 'menu-marketing',
      activeIcon: 'menu-marketing-active',
    },
  },
};
