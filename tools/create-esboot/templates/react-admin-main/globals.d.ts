import type { QiankunGlobalState } from './src/helpers/qiankun/shared';

declare interface Window {
  APP_CONFIG: {
    title: string;
    COMMON_SERVERS: {
      base: string;
      [key: string]: unknown;
    };
  };
  setQianKunGlobalState?: (state: QiankunGlobalState) => void;
}
