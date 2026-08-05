import type { QiankunGlobalState } from './src/helpers/qiankun/shared';

declare interface Window {
  GLOBAL_CONFIG?: {
    title?: string;
    COMMON_SERVERS?: {
      base: string;
      [key: string]: unknown;
    };
    subModuleList?: Record<string, any>;
    [key: string]: unknown;
  };
  setQianKunGlobalState?: (state: QiankunGlobalState) => void;
}
