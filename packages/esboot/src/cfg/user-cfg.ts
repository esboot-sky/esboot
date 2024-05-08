import { existsSync } from 'fs';
import { exit } from 'process';
import { USER_CONFIG_FILE, error } from '@dz-web/esboot-common';

export default class UserCfg {
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

    const { default: cfg } = require(filePath);

    console.log(cfg, '<-- userCfg');
    // const { isSP } = this.compileTimeConfig;
    // const customOpts = isFunction(getCustomOpts)
    //   ? getCustomOpts(this.compileTimeConfig)
    //   : getCustomOpts;

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
