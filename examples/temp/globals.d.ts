interface IGlobalConfig {
  TRADE_ORDER_TIME_OUT: number;
  COMMON_SERVERS: any;
  MINE_MODULE: any;
  USE_DEAL_MODULE: any;
  enableEncrypt: boolean;
  DEFAULT_THEME: string;
  IPO_PATH: string;
  LOADING_TIME_OUT: number;
  outer_links_path: {
    trade_account_intro: string;
  };
  outer_modules: {
    fund: string;
    appBase: string;
    oldWeb: string;
    onlineBusinessMall: string;
    depositAndWithdrawals: string;
  };
  customerService: {
    simplifiedName: string;
    traditionalName: string;
    tel: string;
  }[];
  debug: boolean;
  MARKET_SUBSCRIPTION_MODULE: any;
  EXTERNAL_LINKS: {
    DEPOSIT: string;
  };
}

declare interface Window {
  reqQueue: any[];
  GLOBAL_CONFIG: IGlobalConfig;
  QUOTES_CONFIG: any;
  TRADE_CONFIG: any;
  __store: any;
  __security: any;
  COMMON_SERVERS: any;
}

declare module '*.svg' {
  import React from 'react';
  const SVG: React.FC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}

declare module '*.svg?url' {
  const content: string;
  export default content;
}
