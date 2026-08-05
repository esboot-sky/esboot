import { get } from 'lodash-es';

export enum CommonServer {}

export default new (class StaticConfig {
  config: Record<string, any>;

  constructor() {
    this.config = typeof window !== 'undefined' ? (window?.GLOBAL_CONFIG ?? window?.APP_CONFIG ?? {}) : {};
  }

  getRawConfig() {
    return this.config;
  }

  getConfig(path: string, defaultValue: any = '') {
    return get(this.config, path, defaultValue);
  }

  getCommonServer(path = 'base', defaultValue = '') {
    if (path === 'base' && typeof window !== 'undefined' && window?.BASE_URL) {
      return window.BASE_URL;
    }
    return this.getConfig(`COMMON_SERVERS.${path}`, defaultValue);
  }
})();
