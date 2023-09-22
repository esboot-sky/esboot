import { merge, isFunction, pick } from 'lodash';

import { Environment } from '@@webpack/config/environment';
import { USER_CONFIG_FILE } from '@@/constants';

import { defaultUserOpts } from './default-user-opts';
import compileTimeCfg from './compile-time-config';

export default new (class ESbootConfig {
  userOpts: any = {};
  compileTimeCfg: any = {
    entry: [],
  };

  initUserConfig = (reload = false) => {
    if (reload) {
      delete require.cache[require.resolve(USER_CONFIG_FILE)];
    }

    const { isSP } = this.compileTimeCfg;
    const { default: getCustomOpts, afterHooks } = require(USER_CONFIG_FILE);
    const customOpts = isFunction(getCustomOpts) ? getCustomOpts(this.compileTimeCfg) : getCustomOpts;

    const isDev = process.env.NODE_ENV === Environment.dev;
    const publicPath = isDev ? '/' : './';
    const _defaultUserOpts: any = defaultUserOpts;
    if (isSP) {
      _defaultUserOpts.alias = pick(_defaultUserOpts.alias, ['@']);
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
    compileTimeCfg.init();
    this.compileTimeCfg = compileTimeCfg;
  };

  init = () => {
    this.initCompileTimeCfg();
    this.initUserConfig();
  };
})();
