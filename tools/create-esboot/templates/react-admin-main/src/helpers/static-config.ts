import { get } from 'lodash-es';

export enum CommonServer {}

export default new (class StaticConfig {
  config: Record<string, any>;

  constructor() {
    this.config = window?.APP_CONFIG ?? {};
  }

  getRawConfig() {
    return this.config;
  }

  getConfig(path: string, defaultValue = '') {
    return get(this.config, path, defaultValue);
  }

  getCommonServer(path = 'commonServer', defaultValue = '') {
    return this.getConfig(`COMMON_SERVERS.${path}`, defaultValue);
  }
})();
