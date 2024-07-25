import { resolve, join } from 'path';
import { ip } from 'address';

import { pick, merge } from '@dz-web/esboot-common/lodash';
import {
  Environment,
  PROJECT_TYPE,
  PAGE_TYPE,
  PLATFORMS,
} from '@dz-web/esboot-common/constants';

import { defaultCfg } from './default-cfg';
import type { Configuration, ConfigurationForMP } from './types';

const pkg = require('../../package.json');

export default new (class Cfg {
  #config: Configuration = defaultCfg;

  generateSPCfg = () => {
    const { configRootPath } = this.#config;

    const configJSPath = `${configRootPath}/config.js`;
    const staticPathList = [
      {
        from: configJSPath,
        to: './config.js',
      },
      {
        from: `${configRootPath}/static`,
        to: './static',
      },
    ] satisfies any[];

    const cfg = {
      configJSPath,
      staticPathList,
    } satisfies Partial<Configuration>;

    Object.assign(this.#config, cfg);
  };

  generateMPCfg = () => {
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
    ] satisfies any[];

    const MPConfiguration = {
      platform,
      pageType,
      isMobile: ESBOOT_PLATFORM === PLATFORMS.MOBILE,
      isBrowser: ESBOOT_PAGE_TYPE === PAGE_TYPE.browser,
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

  load = () => {
    const { NODE_ENV, ESBOOT_PROJECT_TYPE = PROJECT_TYPE.MP } = process.env;
    const { cwd } = this.#config;
    const rootPath = resolve(cwd, './src');
    const configRootPath = resolve(cwd, `./config`);
    const ipv4 = ip();
    const cfg = {
      cwd,
      ipv4,
      rootPath,
      configRootPath,
      projectType: ESBOOT_PROJECT_TYPE,
      isSP: ESBOOT_PROJECT_TYPE === PROJECT_TYPE.SP,
      isDev: NODE_ENV === Environment.dev,
      entry: {},
      ...pick(pkg, ['version']),
    } satisfies Partial<Configuration>;
    Object.assign(this.#config, cfg);

    if (cfg.isSP) {
      this.generateSPCfg();
      return;
    }

    this.generateMPCfg();
    console.log(this.#config, '<-- cfg');
  };
})();
