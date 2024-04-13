import { resolve, join } from 'path';
import address from 'address';
import { pick, merge } from 'lodash';

import type { ObjectPattern } from 'copy-webpack-plugin';

const pkg = require('../../package.json');

export enum PROJECT_TYPE {
  SP = 'SP',
  MP = 'MP',
}

export enum PLATFORMS {
  MOBILE = 'mobile',
  PC = 'pc',
}

export enum PAGE_TYPE {
  native = 'native',
  browser = 'browser',
}

export interface CompileTimeConfig {
  projectType: PROJECT_TYPE;
  pageType: PAGE_TYPE;
  platform: PLATFORMS;
  isMobile: boolean;
  isSP: boolean;
  isBrowser: boolean;
  rootPath: string;
  contentRootPath: string;
  configRootPath: string;
  configRootPathOfPlatfrom: string;
  configRootPathOfPageType: string;
  configJSPath: string;
  ipv4: string;
  version: string;
  entry: Record<string, string>[];
  staticPathList: ObjectPattern[];
}

export default new (class CCompileTimeConfig {
  // for better type
  config: CompileTimeConfig = {
    projectType: PROJECT_TYPE.MP,
    pageType: PAGE_TYPE.browser,
    platform: PLATFORMS.PC,
    isMobile: false,
    isSP: false,
    isBrowser: true,
    rootPath: '',
    configRootPath: '',
    contentRootPath: '',
    configRootPathOfPlatfrom: '',
    configRootPathOfPageType: '',
    configJSPath: '',
    ipv4: 'localhost',
    version: '',
    entry: [],
    staticPathList: [],
  };

  init = () => {
    const {
      NODE_ENV,
      ESBOOT_PROJECT_TYPE = PROJECT_TYPE.MP,
      ESBOOT_PLATFORM = PLATFORMS.PC,
      ESBOOT_PAGE_TYPE = PAGE_TYPE.browser,
    } = process.env;
    const ipv4 = address.ip();

    const rootPath = resolve(process.cwd(), './src');
    const configRootPath = resolve(process.cwd(), `./config`);

    const common = {
      ipv4,
      rootPath,
      configRootPath,
      projectType: ESBOOT_PROJECT_TYPE as PROJECT_TYPE,
      pageType: ESBOOT_PAGE_TYPE as PAGE_TYPE,
      platform: ESBOOT_PLATFORM as PLATFORMS,
      isMobile: ESBOOT_PLATFORM === PLATFORMS.MOBILE,
      isBrowser: ESBOOT_PAGE_TYPE === PAGE_TYPE.browser,
      entry: [],
      ...pick(pkg, ['version']),
    } satisfies Partial<CompileTimeConfig>;

    // Single Platform Config
    if (ESBOOT_PROJECT_TYPE === PROJECT_TYPE.SP) {
      const configJSPath = `${configRootPath}/config.js`;
      const staticPathList = [
        {
          from: configJSPath as string,
          to: './config.js',
        },
        {
          from: `${configRootPath}/static`,
          to: './static',
        },
      ] satisfies ObjectPattern[];

      const spConfig = {
        contentRootPath: rootPath,
        isSP: true,
        configRootPathOfPlatfrom: configRootPath,
        configRootPathOfPageType: configRootPath,
        configJSPath,
        staticPathList,
        ...common,
      } satisfies CompileTimeConfig;

      Object.assign(this.config, spConfig);
      return;
    }

    if (NODE_ENV === 'production') {
      process.env.BROWSERSLIST_ENV = `${ESBOOT_PLATFORM}-${ESBOOT_PAGE_TYPE}-production`;
    }

    // Multi Platform Config
    const configRootPathOfPlatfrom = join(configRootPath, ESBOOT_PLATFORM);
    const configRootPathOfPageType = join(
      configRootPathOfPlatfrom,
      `_${ESBOOT_PAGE_TYPE}`
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
    ] satisfies ObjectPattern[];

    const mpConfig = {
      isSP: false,
      contentRootPath: join(
        rootPath,
        `./platforms/${ESBOOT_PLATFORM}/_${ESBOOT_PAGE_TYPE}`
      ),
      configRootPathOfPlatfrom,
      configRootPathOfPageType,
      configJSPath,
      staticPathList,
      ...common,
    } satisfies CompileTimeConfig;

    Object.assign(this.config, mpConfig);
  };
})();
