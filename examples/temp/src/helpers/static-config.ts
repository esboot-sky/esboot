import { get } from 'lodash-es';

export enum CommonServer {
  police = 'police',
}

export default new (class StaticConfig {
  config: Window['GLOBAL_CONFIG'];

  assetServerUrl: string = '';

  cmsServerUrl: string = '';

  cache: Record<string, any> = {};

  constructor() {
    this.config = window?.GLOBAL_CONFIG ?? {};
  }

  getRawConfig() {
    return this.config;
  }

  getConfig<T extends string, U = string>(path: T, defaultValue: U = '' as U): U {
    if (this.cache[path]) {
      return this.cache[path];
    }

    this.cache[path] = get(this.config, path, defaultValue);
    return this.cache[path];
  }

  get enableEncrypt() {
    return this.getConfig<string, boolean>('enableEncrypt', false);
  }

  get quoteSocketUrl() {
    return this.getConfig<string, string>('COMMON_SERVERS.quoteSocket');
  }

  get gatewayServerUrl() {
    return this.getConfig<string, string>('COMMON_SERVERS.gateway');
  }

  get quoteConfig() {
    return this.getConfig<string, any>('QUOTES_CONFIG');
  }

  get marketPermissionsPollingInterval() {
    return this.getConfig<string, number>('QUOTES_CONFIG.marketPermissionsPollingInterval', 600000);
  }

  get tradeConfig() {
    return this.getConfig<string, any>('TRADE_CONFIG');
  }
})();
