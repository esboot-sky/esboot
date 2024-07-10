import { existsSync } from 'fs';
import { exit } from 'process';
import { isFunction } from '@dz-web/esboot-common/lodash';
import { USER_CONFIG_FILE } from '@dz-web/esboot-common/constants';
import { error } from '@dz-web/esboot-common/helpers';

import { CompileTimeConfig } from './compile-time-cfg';

import type { UserConfig } from './types';

export default class UserOptionsC {
  config: UserConfig = { bundler: null };

  constructor(private compileTimeConfig: CompileTimeConfig) {
    this.compileTimeConfig = compileTimeConfig;
  }

  getConfigFilePath = () => {
    return USER_CONFIG_FILE;
  };

  load = (reload = false) => {
    const filePath = this.getConfigFilePath();
    if (!existsSync(filePath)) {
      error(`User config file not found: ${filePath}`);
      exit(1);
    }

    if (reload) {
      delete require.cache[require.resolve(filePath)];
    }

    const { default: getCfg } = require(filePath);
    const cfg = isFunction(getCfg) ? getCfg(this.compileTimeConfig) : getCfg;

    console.log(cfg, '<-- userOptions');
    this.config = cfg;
    // const { isSP } = this.compileTimeConfig;

    // const isDev = process.env.NODE_ENV === Environment.dev;
    // const publicPath = isDev ? '/' : './';
    // const _defaultUserOpts: UserOpts = defaultUserOpts;
    // if (isSP) {
    //   _defaultUserOpts.alias = pick(_defaultUserOpts.alias, ['@']) as Record<
    //     string,
    //     string
    //   >;
    // }

    // const config = merge(
    //   _defaultUserOpts,
    //   { publicPath, afterHooks },
    //   customOpts
    // );
    // config.isRelativePublicPath = config.publicPath === './';

    // this.userOpts = config;
  };
}
