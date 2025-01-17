import { resolve, join } from 'node:path';
import { existsSync } from 'node:fs';
import { exit } from 'node:process';
import { ip } from 'address';

import { isFunction, pick, merge } from '@dz-web/esboot-common/lodash';
import {
  Environment,
  PAGE_TYPE,
  PLATFORMS,
  getUserConfigFile,
} from '@dz-web/esboot-common/constants';
import { error } from '@dz-web/esboot-common/helpers';

import { defaultCfg } from './default-cfg';
import type { Configuration, ConfigurationForMP } from './types';

const pkg = require('../../package.json');

export default new (class Cfg {
  #config: Configuration = defaultCfg;

  get config() {
    return this.#config;
  }

  #generateSPCfg = () => {
    const { configRootPath } = this.#config;

    const configJSPath = join(configRootPath, 'config.js');
    const staticPathList = [
      {
        from: configJSPath,
        to: './config.js',
      },
      {
        from: join(configRootPath, 'static'),
        to: './static',
      },
    ] satisfies Configuration['staticPathList'];
    this.#config.alias = {
      '@': 'src',
      ...this.#config.alias,
    } satisfies Configuration['alias'];

    const cfg = {
      configJSPath,
      staticPathList,
    } satisfies Partial<Configuration>;

    Object.assign(this.#config, cfg);
  };

  #generateMPCfg = () => {
    const {
      NODE_ENV,
      ESBOOT_PLATFORM = PLATFORMS.PC,
      ESBOOT_PAGE_TYPE = PAGE_TYPE.browser,
    } = process.env;
    const platform = ESBOOT_PLATFORM;
    const pageType = ESBOOT_PAGE_TYPE;

    const { configRootPath, rootPath } = this.#config;

    if (NODE_ENV === Environment.prod) {
      process.env.BROWSERSLIST_ENV = `${platform}-${pageType}-${Environment.prod}`;
    }

    const configRootPathOfPlatfrom = join(configRootPath, platform);
    const configRootPathOfPageType = join(
      configRootPathOfPlatfrom,
      `_${pageType}`
    );

    const configJSPath = `${configRootPathOfPageType}/config.js`;
    const staticPathList = [
      {
        from: configJSPath,
        to: './config.js',
      },
      {
        from: `${configRootPathOfPageType}/static`,
        to: './static',
      },
      {
        from: `${configRootPathOfPlatfrom}/static`,
        to: './static',
      },
      {
        from: `${configRootPath}/static`,
        to: './static',
      },
    ] satisfies Configuration['staticPathList'];
    this.#config.alias = {
      '@mobile-native': 'src/platforms/mobile/_native',
      '@mobile-browser': 'src/platforms/mobile/_browser',
      '@pc-native': 'src/platforms/pc/_native',
      '@pc-browser': 'src/platforms/pc/_browser',
      '@mobile': 'src/platforms/mobile',
      '@pc': 'src/platforms/pc',
      '@': 'src',
      ...this.#config.alias,
    } satisfies Configuration['alias'];

    const MPConfiguration = {
      platform,
      pageType,
      configRootPathOfPlatfrom,
      configRootPathOfPageType,
      contentRootPath: join(rootPath, `./platforms/${platform}/_${pageType}`),
    } satisfies ConfigurationForMP;

    const cfg = {
      configJSPath,
      staticPathList,
      MPConfiguration,
    } satisfies Partial<Configuration>;

    Object.assign(this.#config, cfg);
  };

  loadEnv = (options: { cwd?: string } = {}) => {
    const {
      NODE_ENV,
      ESBOOT_PLATFORM = PLATFORMS.PC,
      ESBOOT_PAGE_TYPE = PAGE_TYPE.browser,
      ESBOOT_IS_CI_BUILD = '0',
    } = process.env;

    if (options.cwd) {
      this.#config.cwd = options.cwd;
    }

    const { cwd } = this.#config;
    const isCIBuild = ESBOOT_IS_CI_BUILD === '1';
    const rootPath = resolve(cwd, './src');
    const configRootPath = resolve(cwd, './config');
    const ipv4 = ip();
    const cfg = {
      cwd,
      ipv4,
      isCIBuild,
      rootPath,
      configRootPath,
      isDev: NODE_ENV === Environment.dev,
      isMobile: ESBOOT_PLATFORM === PLATFORMS.MOBILE,
      isBrowser: ESBOOT_PAGE_TYPE === PAGE_TYPE.browser,
      entry: {},
      ...pick(pkg, ['version']),
    } satisfies Partial<Configuration>;
    Object.assign(this.#config, cfg);
  };

  loadConfigFile = (reload = false) => {
    const filePath = getUserConfigFile(this.#config.cwd);

    if (!existsSync(filePath)) {
      console.log('filePath', filePath);

      error(`User config file not found: ${filePath}`);
      exit(1);
    }

    if (reload) {
      delete require.cache[require.resolve(filePath)];
    }

    const { default: getCfg } = require(filePath);
    const userCfg = isFunction(getCfg) ? getCfg(this.#config) : getCfg;
    const { isDev } = this.#config;

    this.#config = merge(
      this.#config,
      { publicPath: isDev ? '/' : './' },
      userCfg
    );
    this.#config.isSP ? this.#generateSPCfg() : this.#generateMPCfg();
  };

  load = (options: { cwd?: string } = {}) => {
    this.loadEnv(options);
    this.loadConfigFile();
  };

  patch = (cfg: Partial<Configuration>) => {
    this.#config = merge(this.#config, cfg);
  };
})();
