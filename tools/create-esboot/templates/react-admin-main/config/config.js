window.GLOBAL_CONFIG = {
  title: '点证管理中台',
  COMMON_SERVERS: {
    base: 'http://10.10.11.134:6003',
  },
  subModuleList: {
    account: {
      beCode: 'uc',
      entryUrl: {
        dev: '//localhost:11102/index.html',
        prod: '/account/',
      },
      routerBase: '/child-account',
      icon: 'menu-account',
      activeIcon: 'menu-account-active',
    },
    depositsAndWithdrawals: {
      beCode: 'cashio',
      entryUrl: {
        dev: '//localhost:11102/index.html',
        prod: '/deposits-and-withdrawals/',
      },
      routerBase: '/child-deposits-and-withdrawals',
      icon: 'menu-cashio',
      activeIcon: 'menu-cashio-active',
    },
    system: {
      beCode: 'sys',
      entryUrl: {
        dev: '//localhost:11102/index.html',
        prod: '/system/',
      },
      routerBase: '/child-system',
      icon: 'menu-system',
      activeIcon: 'menu-system-active',
    },
    openAccounts: {
      beCode: 'openaccount',
      entryUrl: {
        dev: '//localhost:11104/index.html',
        prod: '/open-accounts/',
      },
      routerBase: '/child-open-accounts',
      icon: 'menu-quotation',
      activeIcon: 'menu-quotation-active',
    },
    fund: {
      beCode: 'fund',
      entryUrl: {
        dev: '//localhost:11105/index.html',
        prod: '/fund/',
      },
      routerBase: '/child-fund',
      icon: 'menu-fund',
      activeIcon: 'menu-fund-active',
    },
    intelligentMarketing: {
      beCode: 'platform',
      entryUrl: {
        dev: '//localhost:11106/index.html',
        prod: '/intelligent-marketing/',
      },
      routerBase: '/child-intelligent-marketing',
      icon: 'menu-marketing',
      activeIcon: 'menu-marketing-active',
    },
    quotation: {
      beCode: 'quotation',
      entryUrl: {
        dev: '//localhost:11107/index.html',
        prod: '/quotation-subscription/',
      },
      routerBase: '/child-quotation-subscription',
      icon: 'menu-quotation',
      activeIcon: 'menu-quotation-active',
    },
    IPO: {
      beCode: 'ipo',
      entryUrl: {
        dev: '//localhost:11108/index.html',
        prod: '/ipo/',
      },
      routerBase: '/child-ipo',
      icon: 'menu-ipo',
      activeIcon: 'menu-ipo-active',
    },
    live: {
      beCode: 'live',
      entryUrl: {
        dev: '//localhost:11109/index.html',
        prod: '/live/',
      },
      routerBase: '/child-live',
      icon: 'menu-marketing',
      activeIcon: 'menu-marketing-active',
    },
    onlineBusinessHall: {
      beCode: 'hall',
      entryUrl: {
        dev: '//localhost:11110/index.html',
        prod: '/online-business-hall/',
      },
      routerBase: '/child-online-business-hall',
      icon: 'menu-marketing',
      activeIcon: 'menu-marketing-active',
    },
    sms: {
      beCode: 'sms',
      entryUrl: {
        dev: '//localhost:11111/index.html',
        prod: '/sms/',
      },
      routerBase: '/child-sms',
      icon: 'menu-marketing',
      activeIcon: 'menu-marketing-active',
    },
    trade: {
      beCode: 'trading',
      entryUrl: {
        dev: '//localhost:11112/index.html',
        prod: '/trade/',
      },
      routerBase: '/child-trade',
      icon: 'menu-marketing',
      activeIcon: 'menu-marketing-active',
    },
    combination: {
      beCode: 'combination',
      entryUrl: {
        dev: '//localhost:11113/index.html',
        prod: '/combination/',
      },
      routerBase: '/child-combination',
      icon: 'menu-marketing',
      activeIcon: 'menu-marketing-active',
    },
    community: {
      beCode: 'sns',
      entryUrl: {
        dev: '//localhost:11114/index.html',
        prod: '/community/',
      },
      routerBase: '/child-community',
      icon: 'menu-marketing',
      activeIcon: 'menu-marketing-active',
    },
  },
};
