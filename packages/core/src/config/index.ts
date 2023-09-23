import { merge, isFunction, pick } from 'lodash';

import { Environment } from '@@webpack/config/environment';
import { USER_CONFIG_FILE } from '@@/constants';

import { defaultUserOpts } from './default-user-opts';
import { UserOpts } from './types';
import compileTimeConfig, { CompileTimeConfig } from './compile-time-config';

export default new (class ESbootConfig {
  userOpts: any = defaultUserOpts;
  compileTimeConfig: CompileTimeConfig = compileTimeConfig.config;

  initUserConfig = (reload = false) => {
    if (reload) {
      delete require.cache[require.resolve(USER_CONFIG_FILE)];
    }

    const { isSP } = this.compileTimeConfig;
    const { default: getCustomOpts, afterHooks } = require(USER_CONFIG_FILE);
    const customOpts = isFunction(getCustomOpts) ? getCustomOpts(this.compileTimeConfig) : getCustomOpts;

    const isDev = process.env.NODE_ENV === Environment.dev;
    const publicPath = isDev ? '/' : './';
    const _defaultUserOpts: UserOpts = defaultUserOpts;
    if (isSP) {
      _defaultUserOpts.alias = pick(_defaultUserOpts.alias, ['@']) as Record<string, string>;
    }

    const config = merge(
      _defaultUserOpts,
      { publicPath, afterHooks },
      customOpts
    );
    config.isRelativePublicPath = config.publicPath === './';

    this.userOpts = config;
  };

  initCompileTimeCfg = () => {
    compileTimeConfig.init();
    this.compileTimeConfig = compileTimeConfig.config;
  };

  init = () => {
    this.initCompileTimeCfg();
    this.initUserConfig();
  };
})();
