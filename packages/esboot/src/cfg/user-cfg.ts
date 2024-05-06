import { Environment, USER_CONFIG_FILE } from '@dz-web/esboot-common';

export default new (class UserCfg {
  initUserConfig = (reload = false) => {
    if (reload) {
      delete require.cache[require.resolve(USER_CONFIG_FILE)];
    }

    const { default: cfg } = require(USER_CONFIG_FILE);

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

  init = () => {
    this.initUserConfig();
  };
})();
