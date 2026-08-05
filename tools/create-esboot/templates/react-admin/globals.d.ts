declare interface Window {
  __POWERED_BY_QIANKUN__?: boolean;
  __INJECTED_PUBLIC_PATH_BY_QIANKUN__?: string;
  GLOBAL_CONFIG?: {
    COMMON_SERVERS?: any;
    PUBLIC_PATH?: string;
  };
  APP_CONFIG?: {
    COMMON_SERVERS?: any;
    PUBLIC_PATH?: string;
  };
}

declare module 'crypto-js';
